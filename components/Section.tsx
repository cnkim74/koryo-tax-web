import { Fragment, type ReactNode } from "react";
import { Reveal } from "./Reveal";

export const SECTION_PADDING = "py-[clamp(5rem,11vw,9.375rem)] px-6";
export const CONTAINER = "mx-auto w-full max-w-[820px]";
export const CONTAINER_WIDE = "mx-auto w-full max-w-[1040px]";
/** 서비스 섹션 — 본문 가독폭은 유지하면서 옆에 아이콘을 놓을 자리를 만듭니다. */
export const CONTAINER_SERVICE = "mx-auto w-full max-w-[960px]";
export const MEASURE = "max-w-[760px]";

/**
 * 원본 디자인의 <br> 줄바꿈을 유지하되, 좁은 화면에서는 자동 줄바꿈에 맡깁니다.
 * (모바일에서 강제 줄바꿈이 겹쳐 어색해지는 것을 막습니다.)
 */
export function Lines({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={line}>
          {line}
          {i < lines.length - 1 ? (
            <>
              <br className="hidden sm:inline" />{" "}
            </>
          ) : null}
        </Fragment>
      ))}
    </>
  );
}

export function Eyebrow({
  children,
  onDark = false,
}: {
  children: ReactNode;
  onDark?: boolean;
}) {
  return (
    <Reveal
      className={`mb-4 text-[15px] font-bold sm:text-base ${
        onDark ? "text-brand-on-dark" : "text-brand"
      }`}
    >
      {children}
    </Reveal>
  );
}

export function SectionTitle({
  lines,
  onDark = false,
  className = "",
}: {
  lines: readonly string[];
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      as="h2"
      className={`m-0 mb-10 text-[clamp(1.75rem,5.4vw,2.75rem)] font-extrabold leading-[1.35] tracking-[-0.03em] text-pretty ${
        onDark ? "text-white" : "text-ink"
      } ${className}`}
    >
      <Lines lines={lines} />
    </Reveal>
  );
}

export function Prose({
  paragraphs,
  onDark = false,
}: {
  paragraphs: readonly string[];
  onDark?: boolean;
}) {
  return (
    <Reveal
      className={`flex flex-col gap-[22px] text-[clamp(1rem,2.3vw,1.1875rem)] leading-[1.75] ${
        onDark ? "text-night-text" : "text-body"
      }`}
    >
      {paragraphs.map((p) => (
        <p key={p} className="m-0">
          {p}
        </p>
      ))}
    </Reveal>
  );
}

/** <strong> 등 인라인 태그를 포함한 문단. 값은 코드에서 관리하므로 안전합니다. */
export function ProseHtml({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <Reveal className="flex flex-col gap-[22px] text-[clamp(1rem,2.3vw,1.1875rem)] leading-[1.75] text-body [&_strong]:font-bold [&_strong]:text-ink">
      {paragraphs.map((p) => (
        <p key={p} className="m-0" dangerouslySetInnerHTML={{ __html: p }} />
      ))}
    </Reveal>
  );
}
