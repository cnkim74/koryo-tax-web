import type { NextConfig } from "next";

/**
 * 정식 도메인. www 를 대표 주소로 쓰고, 루트(apex)로 들어오면 www 로 넘깁니다.
 * (검색엔진에 같은 페이지가 두 주소로 잡히는 것을 막습니다.)
 */
const CANONICAL_HOST = "www.thetaxplus.com";
const APEX_HOST = "thetaxplus.com";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        // thetaxplus.com/... → www.thetaxplus.com/...
        // localhost 나 workers.dev 미리보기 주소에는 적용되지 않습니다.
        source: "/:path*",
        // 정규식 앵커(^…$)가 필수입니다. 앵커 없이 "thetaxplus.com" 만 쓰면
        // www.thetaxplus.com 에도 부분 일치해서 무한 리다이렉트가 됩니다.
        has: [{ type: "host", value: `^${APEX_HOST.replace(/\./g, "\\.")}$` }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // HTTPS 로만 접속하도록 고정 (Cloudflare 가 인증서를 자동 발급합니다)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
