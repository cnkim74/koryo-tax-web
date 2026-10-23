import "server-only";
import { getDb } from "./db";

export type DayRow = { day: string; views: number; visits: number };
export type PathRow = { path: string; views: number; visits: number };

/** 한국시간 기준 날짜 문자열. 집계 단위를 KST 로 맞춥니다. */
export function kstDay(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function daysAgo(n: number) {
  return kstDay(new Date(Date.now() - n * 86_400_000));
}

export async function dailyTotals(sinceDay: string): Promise<DayRow[]> {
  const db = await getDb();
  if (!db) return [];
  const { results } = await db
    .prepare(
      `SELECT day, SUM(views) AS views, SUM(visits) AS visits
       FROM page_views WHERE day >= ? GROUP BY day ORDER BY day`,
    )
    .bind(sinceDay)
    .all<DayRow>();
  return results ?? [];
}

export async function topPaths(sinceDay: string, limit = 12): Promise<PathRow[]> {
  const db = await getDb();
  if (!db) return [];
  const { results } = await db
    .prepare(
      `SELECT path, SUM(views) AS views, SUM(visits) AS visits
       FROM page_views WHERE day >= ? GROUP BY path ORDER BY views DESC LIMIT ?`,
    )
    .bind(sinceDay, limit)
    .all<PathRow>();
  return results ?? [];
}

export async function rangeTotals(sinceDay: string) {
  const db = await getDb();
  if (!db) return { views: 0, visits: 0 };
  const row = await db
    .prepare(
      `SELECT COALESCE(SUM(views),0) AS views, COALESCE(SUM(visits),0) AS visits
       FROM page_views WHERE day >= ?`,
    )
    .bind(sinceDay)
    .first<{ views: number; visits: number }>();
  return { views: row?.views ?? 0, visits: row?.visits ?? 0 };
}
