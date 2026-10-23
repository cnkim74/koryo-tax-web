"use client";

import { useEffect, useState } from "react";
import { CONTAINER_WIDE, SECTION_PADDING } from "./Section";

type Item = {
  id: number;
  title: string;
  outlet: string | null;
  url: string;
  publishedAt: string | null;
  kind: "article" | "video";
  videoId: string | null;
  thumbnail: string | null;
};

/**
 * 보도자료 섹션.
 *
 * 메인 페이지는 미리 생성해 두어야 빨라서, 이 목록만 접속 시점에 받아옵니다.
 * 관리자 페이지에서 글을 등록하면 재배포 없이 바로 반영됩니다.
 * 등록된 글이 없으면 섹션 자체를 그리지 않습니다.
 */
export function PressSection() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [playing, setPlaying] = useState<Item | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/press")
      .then((r) => (r.ok ? (r.json() as Promise<{ items?: Item[] }>) : { items: [] }))
      .then((d) => alive && setItems(d.items ?? []))
      .catch(() => alive && setItems([]));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPlaying(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [playing]);

  // 불러오기 전이거나 등록된 글이 없으면 아무것도 그리지 않습니다.
  if (!items || items.length === 0) return null;

  return (
    <section id="press" className={`scroll-mt-16 bg-surface ${SECTION_PADDING}`}>
      <div className={CONTAINER_WIDE}>
        <p className="m-0 mb-4 text-[15px] font-bold text-brand sm:text-base">언론보도</p>
        <h2 className="m-0 mb-12 text-[clamp(1.75rem,5.4vw,2.75rem)] font-extrabold leading-[1.35] tracking-[-0.03em] text-pretty">
          언론에 소개된 고려세무법인
        </h2>

        <ul className="m-0 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <li key={it.id}>
              <PressCard item={it} onPlay={() => setPlaying(it)} />
            </li>
          ))}
        </ul>
      </div>

      {playing?.videoId ? (
        <VideoModal item={playing} onClose={() => setPlaying(null)} />
      ) : null}
    </section>
  );
}

function PressCard({ item, onPlay }: { item: Item; onPlay: () => void }) {
  const meta = [item.outlet, item.publishedAt].filter(Boolean).join(" · ");

  const inner = (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-t-[20px] bg-surface-2">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-tint to-brand-soft">
            <span className="text-[13px] font-bold tracking-[0.08em] text-brand-ink">
              NEWS
            </span>
          </div>
        )}

        {item.kind === "video" ? (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 pl-1 text-[20px] text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
              ▶
            </span>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {meta ? <p className="m-0 mb-2 text-[13px] text-muted">{meta}</p> : null}
        <p className="m-0 text-[16px] leading-[1.55] font-bold text-ink group-hover:text-brand">
          {item.title}
        </p>
      </div>
    </>
  );

  const shell =
    "group flex h-full flex-col overflow-hidden rounded-[20px] bg-white text-left shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-transform duration-200 hover:-translate-y-1";

  if (item.kind === "video" && item.videoId) {
    return (
      <button type="button" onClick={onPlay} className={`${shell} w-full`} aria-label={`영상 재생: ${item.title}`}>
        {inner}
      </button>
    );
  }

  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className={shell}>
      {inner}
    </a>
  );
}

function VideoModal({ item, onClose }: { item: Item; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/80 p-4"
    >
      <div className="w-full max-w-[56rem]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between gap-4">
          <p className="m-0 text-[15.5px] font-bold text-white">{item.title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="영상 닫기"
            className="shrink-0 rounded-lg px-2 py-1 text-[20px] leading-none text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${item.videoId}?autoplay=1&rel=0`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-[14px] font-semibold text-white/70 underline hover:text-white"
        >
          유튜브에서 보기 ↗
        </a>
      </div>
    </div>
  );
}
