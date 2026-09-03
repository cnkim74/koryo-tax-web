import { about } from "@/content/site";
import {
  CONTAINER,
  CONTAINER_WIDE,
  Eyebrow,
  Prose,
  SECTION_PADDING,
  SectionTitle,
} from "./Section";
import { Reveal } from "./Reveal";

export function About() {
  const p = about.principal;
  const hasPhoto = Boolean(p.photo);

  return (
    <section
      id={about.id}
      className={`scroll-mt-16 bg-night text-white ${SECTION_PADDING}`}
    >
      <div className={CONTAINER}>
        <Eyebrow onDark>{about.eyebrow}</Eyebrow>
        <SectionTitle lines={about.titleLines} onDark />
        <Prose paragraphs={about.paragraphs} onDark />
      </div>

      {/* 대표세무사 카드 — 본문보다 넓게 빼서 사진을 크게 보여줍니다 */}
      <div className={`${CONTAINER_WIDE} mt-[clamp(3rem,9vw,5.625rem)]`}>
        <Reveal className="overflow-hidden rounded-[28px] bg-night-2">
          <div
            className={
              hasPhoto
                ? "grid md:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)]"
                : "grid"
            }
          >
            {hasPhoto ? <PrincipalPhoto /> : null}

            <div className="flex flex-col justify-center px-[clamp(1.5rem,5vw,3.25rem)] py-[clamp(2.5rem,6vw,3.5rem)]">
              <div className="mb-3.5 text-sm font-bold text-brand-on-dark">{p.eyebrow}</div>
              <h3 className="m-0 mb-2.5 text-[clamp(1.875rem,5.2vw,2.5rem)] font-extrabold leading-[1.25] tracking-[-0.02em] text-white">
                {p.name}
                <span className="ml-2.5 align-middle text-[clamp(0.9375rem,2.2vw,1.0625rem)] font-bold text-night-text">
                  세무사
                </span>
              </h3>
              <p className="mt-0 mb-10 text-[15.5px] font-semibold text-brand-on-dark">
                고려세무법인 용인점 대표
              </p>

              <div className="grid gap-8 border-t border-white/8 pt-9 sm:grid-cols-2">
                {p.groups.map((group) => (
                  <div key={group.heading}>
                    <h4 className="m-0 mb-3.5 text-sm font-bold tracking-[0.02em] text-muted">
                      {group.heading}
                    </h4>
                    <ul className="m-0 flex list-none flex-col gap-[9px] p-0 text-[15.5px] leading-[1.65] text-night-text-2">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PrincipalPhoto() {
  const p = about.principal;

  return (
    <div className="relative aspect-3/4 w-full md:aspect-auto md:h-full md:min-h-[34rem]">
      <picture>
        <source srcSet={p.photo ?? ""} type="image/webp" />
        <img
          src={p.photoFallback}
          alt={p.photoAlt}
          width={p.photoWidth}
          height={p.photoHeight}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </picture>
    </div>
  );
}
