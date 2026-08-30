"use client";

import { useId, useState } from "react";
import { inquiryTopics, offices } from "@/content/site";
import { contactSchema } from "@/lib/contact-schema";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3.5 text-[16px] text-ink outline-none transition-colors placeholder:text-muted focus:border-brand";

export function ContactForm() {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const fieldId = (name: string) => `${uid}-${name}`;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      topic: String(data.get("topic") ?? ""),
      message: String(data.get("message") ?? ""),
      consent: data.get("consent") === "on",
      company: String(data.get("company") ?? ""),
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setFormError(null);
      return;
    }

    setErrors({});
    setFormError(null);
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (json?.fieldErrors) setErrors(json.fieldErrors);
        setFormError(json?.error ?? "접수에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setFormError("네트워크 오류가 발생했습니다. 전화로 문의해 주세요.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[24px] bg-white px-[clamp(1.5rem,5vw,2.5rem)] py-14 text-center shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
        <div
          aria-hidden
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-2xl text-brand-ink"
        >
          ✓
        </div>
        <h3 className="m-0 mb-3 text-[22px] font-extrabold text-ink">
          상담 문의가 접수되었습니다.
        </h3>
        <p className="m-0 text-[16px] leading-[1.7] text-body">
          영업일 기준 1일 이내에 담당 세무사가 연락드리겠습니다.
          <br />
          급한 문의는 {offices[0].tel} 로 전화 주세요.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 rounded-xl bg-surface-2 px-6 py-3 text-[15px] font-bold text-ink-2 transition-colors hover:bg-line"
        >
          다시 작성하기
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[24px] bg-white px-[clamp(1.5rem,5vw,2.5rem)] py-[clamp(2rem,6vw,2.75rem)] shadow-[0_6px_24px_rgba(0,0,0,0.05)]"
    >
      <h3 className="m-0 mb-2 text-[23px] font-extrabold text-ink">상담 신청</h3>
      <p className="mt-0 mb-8 text-[15.5px] leading-[1.65] text-body">
        남겨주시면 담당 세무사가 직접 확인 후 연락드립니다.
      </p>

      <div className="flex flex-col gap-5">
        <Field
          id={fieldId("name")}
          label="성함"
          required
          error={errors.name}
        >
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="홍길동"
            className={inputClass}
            aria-invalid={Boolean(errors.name)}
          />
        </Field>

        <Field id={fieldId("phone")} label="연락처" required error={errors.phone}>
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="010-1234-5678"
            className={inputClass}
            aria-invalid={Boolean(errors.phone)}
          />
        </Field>

        <Field id={fieldId("email")} label="이메일 (선택)" error={errors.email}>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            className={inputClass}
            aria-invalid={Boolean(errors.email)}
          />
        </Field>

        <Field id={fieldId("topic")} label="문의 유형" required error={errors.topic}>
          <select
            id={fieldId("topic")}
            name="topic"
            defaultValue=""
            className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="%238b95a1" stroke-width="2"><path d="M5 8l5 5 5-5"/></svg>')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat pr-11`}
            aria-invalid={Boolean(errors.topic)}
          >
            <option value="" disabled>
              선택해 주세요
            </option>
            {inquiryTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </Field>

        <Field id={fieldId("message")} label="문의 내용" required error={errors.message}>
          <textarea
            id={fieldId("message")}
            name="message"
            rows={5}
            placeholder="업종, 매출 규모, 현재 상황 등을 함께 적어주시면 더 정확한 안내가 가능합니다."
            className={`${inputClass} resize-y leading-[1.7]`}
            aria-invalid={Boolean(errors.message)}
          />
        </Field>

        {/* 허니팟 — 봇 차단용, 사용자에게는 보이지 않습니다. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={fieldId("company")}>회사명</label>
          <input id={fieldId("company")} name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-[14.5px] leading-[1.6] text-body">
            <input
              name="consent"
              type="checkbox"
              className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#8A6D3B]"
              aria-invalid={Boolean(errors.consent)}
            />
            <span>
              상담 회신을 위한 <strong className="font-bold text-ink">개인정보 수집·이용</strong>에
              동의합니다. (수집항목: 성함·연락처·이메일·문의내용 / 보유기간: 상담 종료 후 1년)
            </span>
          </label>
          {errors.consent ? <ErrorText>{errors.consent}</ErrorText> : null}
        </div>

        {formError ? (
          <p role="alert" className="m-0 rounded-xl bg-[#fff2f0] px-4 py-3 text-[14.5px] text-[#d13c33]">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-1 rounded-[14px] bg-brand px-8 py-4 text-[17px] font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "접수 중…" : "상담 신청하기"}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[14.5px] font-bold text-ink-2">
        {label}
        {required ? <span className="ml-1 text-brand">*</span> : null}
      </label>
      {children}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-2 mb-0 text-[13.5px] font-medium text-[#d13c33]">
      {children}
    </p>
  );
}
