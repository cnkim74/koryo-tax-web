import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { kstDay } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOT = /bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|headless|lighthouse|pingdom|monitor/i;

/** 저장할 경로만 추립니다. 질의문자열은 버리고 길이도 제한합니다. */
function normalize(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const path = raw.split(/[?#]/)[0];
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  if (path.startsWith("/admin") || path.startsWith("/api")) return null;
  return path.length > 120 ? path.slice(0, 120) : path;
}

export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") ?? "";
  if (BOT.test(ua)) return new NextResponse(null, { status: 204 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const { path: rawPath, first } = (body ?? {}) as { path?: unknown; first?: unknown };
  const path = normalize(rawPath);
  if (!path) return new NextResponse(null, { status: 204 });

  const db = await getDb();
  if (!db) return new NextResponse(null, { status: 204 });

  const visit = first === true ? 1 : 0;

  try {
    await db
      .prepare(
        `INSERT INTO page_views (day, path, views, visits) VALUES (?, ?, 1, ?)
         ON CONFLICT(day, path) DO UPDATE SET
           views  = views  + 1,
           visits = visits + excluded.visits`,
      )
      .bind(kstDay(), path, visit)
      .run();
  } catch (err) {
    console.error("[track] 기록 실패", err);
  }

  return new NextResponse(null, { status: 204 });
}
