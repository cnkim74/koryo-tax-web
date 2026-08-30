import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/content/site";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { OrganizationJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} ${site.branch} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "고려세무법인",
    "용인 세무사",
    "서초 세무사",
    "세무기장",
    "상속세",
    "증여세",
    "자산설계",
    "절세컨설팅",
    "박소영 세무사",
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: site.url,
    siteName: site.name,
    title: `${site.name} ${site.branch} | ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} ${site.branch}`,
    description: site.description,
  },
  robots: site.noindex
    ? { index: false, follow: false, nocache: true }
    : {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
      },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#8A6D3B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        {/* Pretendard 동적 서브셋 — 실제 사용된 글자만 내려받습니다 (전체 폰트 대비 수십분의 1). */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-200 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          본문으로 건너뛰기
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
