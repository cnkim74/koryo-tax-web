"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { about, hero, services, site } from "@/content/site";

/** 한 장이 머무는 시간(ms). 진행바 애니메이션이 끝나면 다음 장으로 넘어갑니다. */
const DURATION = 7000;
/** 이만큼(px) 이상 끌어야 넘어갑니다. */
const SWIPE = 56;

type Slide = {
  key: string;
  tab: string;
  eyebrow: string;
  titleLines: readonly string[];
  body: readonly string[];
  image: { src: string; alt: string };
  cta: { href: string; label: string };
};

const SERVICE_KEYS = ["tax", "inherit", "asset"] as const;

const SLIDES: Slide[] = [
  {
    key: "intro",
    tab: hero.introTab,
    eyebrow: `${site.name} ${site.branch}`,
    titleLines: hero.titleLines,
    body: hero.body,
    image: hero.images.intro,
    cta: hero.primaryCta,
  },
  ...SERVICE_KEYS.map((k) => ({
    key: k,
    tab: services[k].eyebrow,
    eyebrow: services[k].eyebrow,
    titleLines: services[k].titleLines,
    body: [services[k].summary],
    image: hero.images[k],
    cta: { href: `#${k}`, label: `${services[k].eyebrow} 자세히 보기` },
  })),
];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * 메인 히어로 — 전체 화면 슬라이드.
 * 자동 넘김 · 하단 번호 탭 · 드래그/스와이프 · 방향키 · 스크롤 패럴랙스.
 * 첫 장은 소개, 이어서 대표 사업(세무기장 · 상속·증여 · 자산설계)을 한 장씩 보여줍니다.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);

  const count = SLIDES.length;
  const paused = hovered || focused || dragging || !inView;

  const go = useCallback(
    (next: number) => {
      const n = (next + count) % count;
      if (n === index) return;
      setPrev(index);
      setIndex(n);
    },
    [count, index],
  );
  const step = useCallback((d: number) => go(index + d), [go, index]);

  // 움직임 줄이기 설정이면 자동 넘김·패럴랙스를 끕니다.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // 화면 밖으로 나가면 멈춥니다.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 스크롤 패럴랙스 — --p(0~1) 하나만 갱신하고 나머지는 CSS가 처리합니다.
  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = el.offsetHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / h));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.style.removeProperty("--p");
    };
  }, [reduced]);

  // 히어로가 보이고 다른 곳에 포커스가 없을 때는 방향키로도 넘깁니다.
  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && active !== document.body && !root.current?.contains(active)) return;
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, step]);

  // ── 드래그 / 스와이프 ──────────────────────────────
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    dx: number;
    axis: "x" | "y" | null;
  } | null>(null);
  const suppressClick = useRef(false);

  const setDragOffset = (px: number) => root.current?.style.setProperty("--drag", `${px}px`);

  const endDrag = (commit: boolean) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.axis !== "x") return;
    setDragging(false);
    setDragOffset(0);
    if (!commit) return;
    suppressClick.current = Math.abs(d.dx) > 6;
    if (d.dx <= -SWIPE) step(1);
    else if (d.dx >= SWIPE) step(-1);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, axis: null };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (d.axis === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      d.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (d.axis === "y") {
        drag.current = null; // 세로 이동은 페이지 스크롤에 맡깁니다.
        return;
      }
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setDragging(true);
    }
    d.dx = dx;
    // 끝으로 갈수록 덜 따라오게 해서 '끌리는' 느낌을 줍니다.
    setDragOffset(Math.sign(dx) * Math.min(Math.abs(dx), 240) * 0.55);
  };

  return (
    <header
      id="top"
      ref={root}
      aria-roledescription="carousel"
      aria-label={`${site.name} 대표 서비스`}
      className={`hero relative isolate flex h-svh max-h-[1080px] min-h-[640px] select-none flex-col overflow-hidden bg-night text-white ${
        dragging ? "is-dragging cursor-grabbing" : "md:cursor-grab"
      }`}
      style={{ touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => endDrag(true)}
      onPointerCancel={() => endDrag(false)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onClickCapture={(e) => {
        if (suppressClick.current) {
          e.preventDefault();
          e.stopPropagation();
          suppressClick.current = false;
        }
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* ── 배경 사진 (스크롤 시 천천히 내려가며 확대) ── */}
      <div aria-hidden className="hero-bg absolute inset-0 -z-10">
        {SLIDES.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.key}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
                active ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={s.image.src}
                alt=""
                draggable={false}
                decoding="async"
                fetchPriority={i === 0 ? "high" : "low"}
                className={`h-full w-full object-cover ${
                  active || i === prev ? "hero-kenburns" : ""
                }`}
              />
            </div>
          );
        })}
        {/* 글자가 잘 읽히도록 위·아래·왼쪽을 어둡게 */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,18,28,.62)_0%,rgba(14,18,28,.18)_26%,rgba(14,18,28,.42)_62%,rgba(14,18,28,.94)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,18,28,.6)_0%,rgba(14,18,28,0)_62%)]" />
        <div className="hero-dim absolute inset-0 bg-night" />
      </div>

      {/* ── 본문 ── */}
      <div className="hero-content relative mx-auto flex w-full max-w-[1140px] flex-1 items-end px-6 pb-[clamp(2.5rem,7vh,4.5rem)] pt-24">
        <div className="hero-drag grid w-full">
          {SLIDES.map((s, i) => {
            const active = i === index;
            const Heading = i === 0 ? "h1" : "h2";
            return (
              <div
                key={s.key}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${count}: ${s.tab}`}
                aria-hidden={!active}
                inert={!active}
                className={`hero-slide col-start-1 row-start-1 max-w-[46rem] ${active ? "is-active" : ""}`}
              >
                <div className="hero-line flex items-center gap-3 text-[13px] font-bold text-brand-on-dark sm:text-sm">
                  <span className="tabular-nums tracking-[0.08em]">{pad(i + 1)}</span>
                  <span className="h-px w-10 bg-current opacity-60" />
                  <span>{s.eyebrow}</span>
                </div>

                <Heading className="hero-line m-0 mt-5 text-[clamp(1.6875rem,6.2vw,3.75rem)] font-extrabold leading-[1.24] tracking-[-0.035em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,.25)]">
                  {s.titleLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </Heading>

                <p className="hero-line m-0 mt-6 max-w-[34rem] text-[clamp(1rem,2.3vw,1.1875rem)] font-medium leading-[1.75] text-white/80">
                  {s.body.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>

                <div className="hero-line mt-9 flex flex-wrap gap-3">
                  <Link
                    href={s.cta.href}
                    className="group inline-flex items-center gap-2 rounded-2xl bg-brand px-7 py-4 text-base font-bold text-white transition-colors hover:bg-brand-dark sm:text-[17px]"
                  >
                    {s.cta.label}
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                  {i === 0 ? (
                    <Link
                      href={hero.secondaryCta.href}
                      className="inline-flex items-center rounded-2xl border border-white/30 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:text-[17px]"
                    >
                      {hero.secondaryCta.label}
                    </Link>
                  ) : (
                    <Link
                      href="#contact"
                      className="hidden items-center rounded-2xl border border-white/30 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:inline-flex sm:text-[17px]"
                    >
                      상담 문의하기
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 첫 장: 대표세무사 사진 카드 (넓은 화면) */}
        {about.principal.photo ? (
          <Link
            href="#about"
            aria-hidden={index !== 0}
            tabIndex={index === 0 ? 0 : -1}
            className={`hero-portrait absolute bottom-[clamp(2.5rem,7vh,4.5rem)] right-6 hidden w-[clamp(13rem,19vw,17.5rem)] overflow-hidden rounded-[24px] bg-night-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/15 transition-[opacity,translate] duration-700 lg:block ${
              index === 0 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
            }`}
          >
            <picture>
              <source srcSet={about.principal.photo} type="image/webp" />
              <img
                src={about.principal.photoFallback}
                alt={about.principal.photoAlt}
                width={about.principal.photoWidth}
                height={about.principal.photoHeight}
                draggable={false}
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </picture>
            <div className="px-5 py-4">
              <div className="text-xs font-bold text-brand-on-dark">대표세무사</div>
              <div className="mt-1 text-lg font-extrabold text-white">{about.principal.name}</div>
            </div>
          </Link>
        ) : null}
      </div>

      {/* ── 하단 번호 탭 + 진행바 ── */}
      <div className="hero-tabs relative border-t border-white/15 bg-night/30 backdrop-blur-[2px]">
        <div className="mx-auto flex max-w-[1140px] items-stretch px-6">
          <div className="grid flex-1 grid-cols-4">
            {SLIDES.map((s, i) => {
              const active = i === index;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${i + 1}번째: ${s.tab}`}
                  aria-current={active ? "true" : undefined}
                  className={`group relative flex items-baseline gap-2.5 py-4 text-left transition-colors sm:py-5 ${
                    active ? "text-white" : "text-white/45 hover:text-white/80"
                  }`}
                >
                  <span className="absolute inset-x-0 top-[-1px] h-0.5 overflow-hidden bg-white/0">
                    {active ? (
                      reduced ? (
                        <span className="block h-full w-full bg-brand-on-dark" />
                      ) : (
                        <span
                          key={`${index}`}
                          className="hero-progress block h-full w-full origin-left bg-brand-on-dark"
                          style={{
                            animationDuration: `${DURATION}ms`,
                            animationPlayState: paused ? "paused" : "running",
                          }}
                          onAnimationEnd={() => step(1)}
                        />
                      )
                    ) : null}
                  </span>
                  <span className="text-[13px] font-bold tabular-nums tracking-[0.06em]">
                    {pad(i + 1)}
                  </span>
                  <span className="hidden truncate text-sm font-semibold sm:inline">{s.tab}</span>
                </button>
              );
            })}
          </div>

          {/* 이전/다음 (넓은 화면) */}
          <div className="ml-4 hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="이전 슬라이드"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="다음 슬라이드"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>
      </div>

    </header>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
