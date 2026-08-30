import { services } from "@/content/site";
import {
  CONTAINER_SERVICE,
  Eyebrow,
  Lines,
  MEASURE,
  Prose,
  ProseHtml,
  SECTION_PADDING,
  SectionTitle,
} from "./Section";
import { Reveal } from "./Reveal";
import { ServiceHeader } from "./ServiceHeader";

export function TaxSection() {
  const s = services.tax;
  return (
    <section id={s.id} className={`scroll-mt-16 ${SECTION_PADDING}`}>
      <div className={CONTAINER_SERVICE}>
        <ServiceHeader icon={s.icon}>
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <SectionTitle lines={s.titleLines} className="mb-0" />
        </ServiceHeader>

        <div className={`mt-10 ${MEASURE}`}>
          <Prose paragraphs={s.paragraphs} />

          <Reveal className="mt-12 rounded-[24px] bg-brand-tint px-[clamp(1.5rem,5vw,2.5rem)] py-[clamp(2rem,6vw,2.75rem)]">
            <p className="m-0 text-[clamp(1.1875rem,3.4vw,1.5rem)] font-bold leading-[1.6] text-ink text-pretty">
              <Lines lines={s.callout.lines} />
            </p>
            <p className="mt-[18px] mb-0 text-[17px] font-bold text-brand-ink">
              {s.callout.footnote}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function InheritSection() {
  const s = services.inherit;
  return (
    <section id={s.id} className={`scroll-mt-16 bg-surface ${SECTION_PADDING}`}>
      <div className={CONTAINER_SERVICE}>
        <ServiceHeader icon={s.icon}>
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <SectionTitle lines={s.titleLines} className="mb-0" />
        </ServiceHeader>

        <div className={`mt-10 ${MEASURE}`}>
          <ProseHtml paragraphs={s.paragraphsHtml} />

          <Reveal className="mt-12 rounded-[24px] bg-white px-[clamp(1.5rem,5vw,2.5rem)] py-[clamp(2rem,6vw,2.75rem)] shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
            <p className="m-0 text-[clamp(1.125rem,3.2vw,1.375rem)] font-bold leading-[1.65] text-ink text-pretty">
              {s.callout}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function AssetSection() {
  const s = services.asset;
  return (
    <section id={s.id} className={`scroll-mt-16 ${SECTION_PADDING}`}>
      <div className={CONTAINER_SERVICE}>
        <ServiceHeader icon={s.icon}>
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <SectionTitle lines={s.titleLines} className="mb-0" />
        </ServiceHeader>

        <div className="mt-10">
          <div className={MEASURE}>
            <Prose paragraphs={s.paragraphs} />
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {s.cards.map((card, i) => (
              <Reveal
                key={card.title}
                delay={i * 90}
                className="rounded-[24px] bg-surface px-[clamp(1.5rem,4.5vw,2.25rem)] py-[clamp(2rem,5vw,2.5rem)]"
              >
                <div
                  aria-hidden
                  className="mb-[22px] flex h-11 w-11 items-center justify-center rounded-[14px] bg-brand-soft text-xl font-extrabold text-brand-ink"
                >
                  {card.badge}
                </div>
                <h3 className="m-0 mb-3 text-[21px] font-extrabold text-ink">{card.title}</h3>
                <p className="m-0 text-[16.5px] leading-[1.7] text-body">{card.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal
            as="p"
            className="mt-12 mb-0 text-center text-[clamp(1.1875rem,3.4vw,1.5rem)] font-extrabold text-ink text-pretty"
          >
            {s.closing.before}
            <span className="text-brand">{s.closing.highlight}</span>
            {s.closing.after}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
