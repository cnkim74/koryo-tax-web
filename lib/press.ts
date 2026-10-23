import "server-only";
import { getDb } from "./db";

export type Press = {
  id: number;
  created_at: string;
  title: string;
  outlet: string | null;
  url: string;
  published_at: string | null;
  kind: "article" | "video";
  video_id: string | null;
  visible: number;
};

/**
 * 유튜브 주소에서 영상 ID 를 뽑습니다.
 * watch?v= / youtu.be / shorts / embed 형식을 모두 받습니다.
 * 유튜브가 아니면 null 이고, 일반 기사 링크로 저장됩니다.
 */
export function youtubeId(raw: string): string | null {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }

  const host = u.hostname.replace(/^www\./, "");
  const valid = (id: string | undefined | null) =>
    id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;

  if (host === "youtu.be") return valid(u.pathname.slice(1).split("/")[0]);
  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    if (u.pathname === "/watch") return valid(u.searchParams.get("v"));
    const m = u.pathname.match(/^\/(shorts|embed|live|v)\/([^/?#]+)/);
    if (m) return valid(m[2]);
  }
  return null;
}

/** 공개 화면에 그대로 링크로 나가므로 http(s) 외의 스킴은 막습니다. */
export function isSafeUrl(raw: string) {
  try {
    const u = new URL(raw);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function thumbnailFor(p: Pick<Press, "kind" | "video_id">) {
  return p.kind === "video" && p.video_id
    ? `https://i.ytimg.com/vi/${p.video_id}/hqdefault.jpg`
    : null;
}

export async function listPress(onlyVisible: boolean): Promise<Press[]> {
  const db = await getDb();
  if (!db) return [];
  const sql = `SELECT id, created_at, title, outlet, url, published_at, kind, video_id, visible
               FROM press
               ${onlyVisible ? "WHERE visible = 1" : ""}
               ORDER BY COALESCE(published_at, created_at) DESC, id DESC
               LIMIT 60`;
  const { results } = await db.prepare(sql).all<Press>();
  return results ?? [];
}
