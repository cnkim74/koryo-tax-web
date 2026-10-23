import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export type Inquiry = {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  topic: string;
  message: string;
  source: string;
  status: "new" | "done";
  handled_at: string | null;
};

/**
 * D1 핸들. 바인딩이 없으면(로컬에서 wrangler 설정 전) null 을 돌려주고,
 * 호출하는 쪽에서 안내 문구를 띄웁니다. 빌드가 깨지지 않도록 던지지 않습니다.
 */
export async function getDb(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env.DB ?? null;
  } catch {
    return null;
  }
}

export async function listInquiries(limit = 200): Promise<Inquiry[]> {
  const db = await getDb();
  if (!db) return [];
  const { results } = await db
    .prepare(
      `SELECT id, created_at, name, phone, email, topic, message, source, status, handled_at
       FROM inquiries ORDER BY created_at DESC LIMIT ?`,
    )
    .bind(limit)
    .all<Inquiry>();
  return results ?? [];
}

export async function countByStatus(): Promise<{ total: number; newCount: number }> {
  const db = await getDb();
  if (!db) return { total: 0, newCount: 0 };
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS newCount
       FROM inquiries`,
    )
    .first<{ total: number; newCount: number | null }>();
  return { total: row?.total ?? 0, newCount: row?.newCount ?? 0 };
}
