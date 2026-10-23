import Link from "next/link";
import { nav, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-night px-6 py-13 text-night-text-2">
      <div className="mx-auto flex max-w-[1140px] flex-col gap-6">
        {/* 어두운 배경이라 로고 전체(검은 워드마크) 대신 엠블럼 + 흰 글자를 씁니다 */}
        <div className="flex items-center gap-2.5">
          <img
            src="/emblem.png"
            alt=""
            aria-hidden
            width={162}
            height={162}
            className="h-8 w-8"
          />
          <div className="leading-tight">
            <div className="text-[15px] font-extrabold tracking-[-0.02em] text-white">
              {site.name}
            </div>
            <div className="text-[11px] font-bold tracking-[0.12em] text-brand-on-dark">
              TAX ACCOUNTING CORP.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-night-text-2">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand-on-dark">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-3 text-sm text-muted">
          <span>
            {site.name} · {site.domainLabel}
          </span>
          <span>
            {/*
              관리자 로그인 입구. 저작권 표시의 © 기호 자체를 링크로 씁니다.
              일반 방문자 눈에는 평범한 글자로 보이지만, 색을 흐리게 하지 않아
              화면낭독기나 키보드 사용자에게는 정상적으로 안내됩니다.
              /admin 은 robots 와 메타 양쪽에서 색인 제외 상태입니다.
            */}
            <Link
              href="/admin"
              aria-label="관리자 로그인"
              title="관리자"
              rel="nofollow"
              className="cursor-default transition-colors hover:text-brand-on-dark"
            >
              ©
            </Link>{" "}
            {site.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
