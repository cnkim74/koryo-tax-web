import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

/** 접수 건의 처리 상태를 바꿉니다. 로그인한 관리자만 가능합니다. */
export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const id = Number(form?.get("id"));
  const next = String(form?.get("status") ?? "");

  if (!Number.isInteger(id) || !["new", "done"].includes(next)) {
    return NextResponse.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 });
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json({ ok: false, error: "데이터베이스가 없습니다." }, { status: 503 });
  }

  await db
    .prepare(`UPDATE inquiries SET status = ?, handled_at = ? WHERE id = ?`)
    .bind(next, next === "done" ? new Date().toISOString() : null, id)
    .run();

  return NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
}
