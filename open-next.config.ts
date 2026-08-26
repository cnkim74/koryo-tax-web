import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Cloudflare Workers 배포 설정.
 *
 * 이 사이트는 ISR(주기적 재생성)을 쓰지 않고 빌드 시점에 만들어진 페이지만 제공합니다.
 * 그래서 R2 버킷 없이 Workers 정적 에셋에서 미리 생성된 페이지를 읽어오는 캐시를 씁니다.
 * (이 설정이 없으면 /blog/[slug] 같은 미리 생성 페이지가 런타임에 다시 렌더링되면서
 *  마크다운 파일을 못 읽어 404 가 됩니다.)
 *
 * 나중에 revalidate 를 쓰게 되면 R2 캐시로 바꿔야 합니다.
 * https://opennext.js.org/cloudflare/caching
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
