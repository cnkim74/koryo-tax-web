import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

/** 아주 단순한 인스턴스 단위 레이트리밋 (동일 IP 10분에 5건). */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

async function notify(subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!key || !to) {
    // 메일 설정 전에는 서버 로그로만 남깁니다. 배포 전 .env 설정 필요.
    console.info("[contact] 신규 상담 문의\n" + text);
    return { delivered: false as const };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
      to: to.split(",").map((s) => s.trim()),
      subject,
      text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
  return { delivered: true as const };
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "잠시 후 다시 시도해 주세요. 문의가 너무 잦습니다." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ ok: false, fieldErrors }, { status: 422 });
  }

  const { name, phone, email, topic, message, source, company } = parsed.data;

  // 허니팟이 채워졌으면 조용히 성공 처리 (봇에게 실패를 알리지 않음)
  if (company) return NextResponse.json({ ok: true });

  const body = [
    `이름: ${name}`,
    `연락처: ${phone}`,
    `이메일: ${email || "-"}`,
    `문의유형: ${topic}`,
    "",
    "내용:",
    message,
    "",
    `접수시각: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`,
  ].join("\n");

  // 1) 먼저 저장합니다. 저장이 곧 접수 기록이라 실패하면 접수 실패로 처리합니다.
  const db = await getDb();
  if (db) {
    try {
      await db
        .prepare(
          `INSERT INTO inquiries (created_at, name, phone, email, topic, message, source)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          new Date().toISOString(),
          name,
          phone,
          email || null,
          topic,
          message,
          source ?? "form",
        )
        .run();
    } catch (err) {
      console.error("[contact] 저장 실패", err);
      return NextResponse.json(
        { ok: false, error: "접수 처리 중 문제가 발생했습니다. 전화로 문의해 주세요." },
        { status: 500 },
      );
    }
  } else {
    // D1 바인딩 전이라면 최소한 로그에는 남깁니다.
    console.warn("[contact] DB 바인딩이 없어 저장하지 못했습니다.");
  }

  // 2) 알림 메일은 부가 기능입니다. 실패해도 이미 저장됐으므로 접수는 성공으로 둡니다.
  try {
    await notify(`[상담문의] ${name} · ${topic}`, body);
  } catch (err) {
    console.error("[contact] 알림 전송 실패", err);
  }

  return NextResponse.json({ ok: true });
}
