import { services } from "@/content/site";
import {
  CONTAINER_SERVICE,
  Eyebrow,
  MEASURE,
  Prose,
  ProseHtml,
  SECTION_PADDING,
  SectionTitle,
} from "./Section";
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

        <div className={`mt-10 ${MEASURE}`}>
          <Prose paragraphs={s.paragraphs} />
        </div>
      </div>
    </section>
  );
}
