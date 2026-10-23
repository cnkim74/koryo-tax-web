import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { QuickConsult } from "@/components/QuickConsult";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { Analytics } from "@/components/Analytics";

/**
 * 일반 방문자용 화면의 공통 뼈대.
 * 관리자 화면(/admin)은 이 그룹 밖에 있어 상단 메뉴·푸터·상담 버튼이 붙지 않습니다.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-200 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        본문으로 건너뛰기
      </a>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
      <QuickConsult />
      <OrganizationJsonLd />
      <Analytics />
    </>
  );
}
