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
          <span>© {site.name}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
