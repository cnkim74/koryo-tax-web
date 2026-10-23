import { NextResponse } from "next/server";
import { listPress, thumbnailFor } from "@/lib/press";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 메인 화면의 보도자료 목록.
 *
 * 메인 페이지는 미리 생성(정적)해 두어야 빠르기 때문에, 보도자료만 이 주소에서
 * 따로 받아옵니다. 덕분에 글을 등록하면 재배포 없이 바로 반영됩니다.
 */
export async function GET() {
  const rows = await listPress(true);
  return NextResponse.json(
    {
      items: rows.map((p) => ({
        id: p.id,
        title: p.title,
        outlet: p.outlet,
        url: p.url,
        publishedAt: p.published_at,
        kind: p.kind,
        videoId: p.video_id,
        thumbnail: thumbnailFor(p),
      })),
    },
    { headers: { "cache-control": "public, max-age=60" } },
  );
}
