import { NextResponse } from "next/server";
import { adminConfigured, checkPassword, createSessionCookie } from "@/lib/admin-auth";

export const runtime = "nodejs";

/** 무차별 대입 완화. 인스턴스 메모리 기준이라 완벽하지는 않지만 1차 방어는 됩니다. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_TRIES = 8;
const tries = new Map<string, number[]>();

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "관리자 비밀번호가 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const now = Date.now();
  const recent = (tries.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  tries.set(ip, recent);
  if (tries.size > 2000) tries.clear();
  if (recent.length > MAX_TRIES) {
    return NextResponse.json(
      { ok: false, error: "시도가 너무 많습니다. 10분 후 다시 시도해 주세요." },
      { status: 429 },
    );
  }

  const form = await request.formData().catch(() => null);
  const password = String(form?.get("password") ?? "");

  if (!(await checkPassword(password))) {
    const url = new URL("/admin?error=1", request.url);
    return NextResponse.redirect(url, { status: 303 });
  }

  const res = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
  res.cookies.set(await createSessionCookie());
  return res;
}
