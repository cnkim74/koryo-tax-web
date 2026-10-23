import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "상담 접수 관리",
  // 관리자 화면은 어떤 경우에도 검색에 노출되면 안 됩니다.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
