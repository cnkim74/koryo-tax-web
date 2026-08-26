import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-32 text-center">
      <p className="m-0 mb-4 text-base font-bold text-brand">404</p>
      <h1 className="m-0 text-[clamp(1.75rem,5.4vw,2.5rem)] font-extrabold tracking-[-0.03em]">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-5 mb-9 text-[17px] leading-[1.7] text-body">
        주소가 변경되었거나 삭제된 페이지입니다.
      </p>
      <Link
        href="/"
        className="rounded-[14px] bg-brand px-7 py-3.5 text-[16px] font-bold text-white transition-colors hover:bg-brand-dark"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
