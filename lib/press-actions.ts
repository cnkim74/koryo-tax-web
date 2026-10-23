"use server";

import { revalidatePath } from "next/cache";
import { isLoggedIn } from "./admin-auth";
import { getDb } from "./db";
import { isSafeUrl, youtubeId } from "./press";

/**
 * Server Action 은 UI 를 거치지 않고 POST 로도 직접 호출될 수 있습니다.
 * 그래서 함수마다 로그인 여부를 다시 확인합니다.
 */
async function requireAdmin() {
  if (!(await isLoggedIn())) throw new Error("권한이 없습니다.");
  const db = await getDb();
  if (!db) throw new Error("데이터베이스에 연결할 수 없습니다.");
  return db;
}

export async function createPress(formData: FormData) {
  const db = await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const outlet = String(formData.get("outlet") ?? "").trim();
  const publishedAt = String(formData.get("published_at") ?? "").trim();

  if (title.length < 2) throw new Error("제목을 입력해 주세요.");
  if (!isSafeUrl(url)) throw new Error("http 또는 https 로 시작하는 주소를 입력해 주세요.");

  const vid = youtubeId(url);

  await db
    .prepare(
      `INSERT INTO press (created_at, title, outlet, url, published_at, kind, video_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      new Date().toISOString(),
      title,
      outlet || null,
      url,
      publishedAt || null,
      vid ? "video" : "article",
      vid,
    )
    .run();

  revalidatePath("/admin/press");
}

export async function togglePressVisible(formData: FormData) {
  const db = await requireAdmin();
  const id = Number(formData.get("id"));
  const next = formData.get("visible") === "1" ? 1 : 0;
  if (!Number.isInteger(id)) throw new Error("잘못된 요청입니다.");

  await db.prepare(`UPDATE press SET visible = ? WHERE id = ?`).bind(next, id).run();
  revalidatePath("/admin/press");
}

export async function deletePress(formData: FormData) {
  const db = await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("잘못된 요청입니다.");

  await db.prepare(`DELETE FROM press WHERE id = ?`).bind(id).run();
  revalidatePath("/admin/press");
}
