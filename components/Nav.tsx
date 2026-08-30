"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, offices, site } from "@/content/site";

const main = offices[0];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-100 border-b border-black/5 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1140px] items-center justify-between gap-6 px-6">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <picture>
            <source srcSet="/logo.webp" type="image/webp" />
            <img
              src="/logo.png"
              alt={`${site.name} ${site.branch}`}
              width={861}
              height={162}
              className="h-8 w-auto sm:h-9"
            />
          </picture>
        </Link>

        {/* 데스크톱 메뉴 */}
        <div className="hidden items-center gap-1 text-[15px] font-semibold text-body lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 transition-colors hover:bg-surface-2 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={main.telHref}
            className="rounded-[10px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          >
            전화 상담
          </a>

          {/* 모바일 토글 */}
          <button
            type="button"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-surface-2 lg:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-200 ${
                  open ? "top-[7px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 rounded bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-200 ${
                  open ? "top-[7px] -rotate-45" : "top-[14px]"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-line bg-white lg:hidden"
      >
        <div className="flex flex-col px-6 py-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-surface-2 py-4 text-[17px] font-semibold text-ink last:border-0"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
