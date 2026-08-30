"use client";

import { useEffect, useId, useRef, useState } from "react";
import { inquiryTopics, kakaoChannel, offices } from "@/content/site";
import { contactSchema } from "@/lib/contact-schema";
import { KakaoIcon } from "./KakaoIcon";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border border-line bg-white px-3.5 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-muted focus:border-brand";

/**
 * 우하단 플로팅 상담창.
 *
 * 카카오톡 채팅 자체는 페이지 안에 넣을 수 없습니다. pf.kakao.com 은 iframe 안에서
 * 아무것도 렌더링하지 않습니다(응답 헤더로 막지는 않지만 화면이 비어 있음).
 * 그래서 페이지를 떠나지 않고 바로 문의를 남길 수 있는 창을 직접 만들었습니다.
 * 카카오톡을 선호하는 분을 위해 채널 링크도 함께 둡니다.
 */
export function QuickConsult() {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // 열린 직후의 클릭이 바로 닫지 않도록 다음 틱에 등록
    const t = setTimeout(() => document.addEventListener("mousedown", onClick), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: "",
      topic: String(data.get("topic") ?? inquiryTopics[5]),
      message: String(data.get("message") ?? ""),
      consent: data.get("consent") === "on",
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요.");
      return;
    }

    setError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error ?? "접수에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setError("네트워크 오류입니다. 전화로 문의해 주세요.");
      setStatus("error");
    }
  }

  return (
    <>
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="빠른 상담"
          className="fixed right-4 bottom-24 z-95 flex max-h-[calc(100dvh-8rem)] w-[calc(100vw-2rem)] max-w-[22.5rem] flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_12px_44px_rgba(0,0,0,0.18)] sm:right-7 sm:bottom-28"
        >
          <div className="flex items-start justify-between gap-3 bg-night px-5 py-4">
            <div>
              <p className="m-0 text-[15px] font-extrabold text-white">빠른 상담</p>
              <p className="m-0 mt-0.5 text-[12.5px] text-night-text">
                남겨주시면 담당 세무사가 연락드립니다
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="상담창 닫기"
              className="-mr-1.5 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[18px] text-night-text transition-colors hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto px-5 py-5">
            {status === "sent" ? (
              <div className="py-6 text-center">
                <div
                  aria-hidden
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-xl text-brand-ink"
                >
                  ✓
                </div>
                <p className="m-0 mb-1.5 text-[16px] font-extrabold text-ink">접수되었습니다</p>
                <p className="m-0 text-[14px] leading-[1.65] text-body">
                  영업일 기준 1일 이내에 연락드리겠습니다.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-5 rounded-lg bg-surface-2 px-4 py-2 text-[14px] font-bold text-ink-2 transition-colors hover:bg-line"
                >
                  다시 작성
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
                <input
                  ref={firstFieldRef}
                  id={`${uid}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="성함"
                  aria-label="성함"
                  className={field}
                />
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="연락처 (010-1234-5678)"
                  aria-label="연락처"
                  className={field}
                />
                <select name="topic" defaultValue={inquiryTopics[0]} aria-label="문의 유형" className={field}>
                  {inquiryTopics.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="문의 내용을 적어주세요 (10자 이상)"
                  aria-label="문의 내용"
                  className={`${field} resize-y leading-[1.6]`}
                />

                <label className="flex cursor-pointer items-start gap-2.5 text-[12.5px] leading-[1.55] text-body">
                  <input
                    name="consent"
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#8A6D3B]"
                  />
                  <span>
                    상담 회신을 위한 개인정보 수집·이용에 동의합니다.
                  </span>
                </label>

                {error ? (
                  <p role="alert" className="m-0 rounded-lg bg-[#fff2f0] px-3 py-2 text-[13px] text-[#d13c33]">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-1 rounded-xl bg-brand px-5 py-3.5 text-[15.5px] font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
                >
                  {status === "sending" ? "접수 중…" : "상담 신청"}
                </button>
              </form>
            )}

            <div className="mt-5 border-t border-line pt-4">
              <p className="m-0 mb-2.5 text-[12.5px] font-semibold text-muted">
                바로 대화를 원하시면
              </p>
              <div className="flex gap-2">
                <a
                  href={kakaoChannel.chat}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: kakaoChannel.brandBg, color: kakaoChannel.brandFg }}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[13.5px] font-bold transition-opacity hover:opacity-90"
                >
                  <KakaoIcon className="h-4 w-4" />
                  카카오톡
                </a>
                <a
                  href={offices[0].telHref}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-surface-2 px-3 py-2.5 text-[13.5px] font-bold text-ink-2 transition-colors hover:bg-line"
                >
                  전화
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "상담창 닫기" : "빠른 상담 열기"}
        style={{ background: kakaoChannel.brandBg, color: kakaoChannel.brandFg }}
        className="fixed right-5 bottom-5 z-90 flex items-center gap-2 rounded-full px-4 py-3.5 text-[15px] font-bold shadow-[0_6px_20px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-0.5 sm:right-7 sm:bottom-7 sm:px-5"
      >
        {open ? (
          <span className="flex h-[22px] w-[22px] items-center justify-center text-[18px]">✕</span>
        ) : (
          <KakaoIcon className="h-[22px] w-[22px] shrink-0" />
        )}
        <span className="hidden sm:inline">{open ? "닫기" : "상담하기"}</span>
      </button>
    </>
  );
}
