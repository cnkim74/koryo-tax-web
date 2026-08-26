import { about } from "@/content/site";
import { CONTAINER, Eyebrow, Prose, SECTION_PADDING, SectionTitle } from "./Section";
import { Reveal } from "./Reveal";

export function About() {
  const p = about.principal;

  return (
    <section
      id={about.id}
      className={`scroll-mt-16 bg-night text-white ${SECTION_PADDING}`}
    >
      <div className={CONTAINER}>
        <Eyebrow onDark>{about.eyebrow}</Eyebrow>
        <SectionTitle lines={about.titleLines} onDark />
        <Prose paragraphs={about.paragraphs} onDark />

        <Reveal
          as="p"
          className="mt-3 mb-0 text-[clamp(1.25rem,3.8vw,1.625rem)] font-extrabold text-white"
        >
          {about.closing.before}
          <span className="text-brand-on-dark">{about.closing.highlight}</span>
        </Reveal>

        <Reveal className="mt-[clamp(3rem,9vw,5.625rem)] rounded-[28px] bg-night-2 px-[clamp(1.5rem,5vw,3rem)] py-[clamp(2.5rem,7vw,3.5rem)]">
          <div className="mb-3.5 text-sm font-bold text-brand-on-dark">{p.eyebrow}</div>
          <h3 className="m-0 mb-3.5 text-[clamp(1.375rem,4vw,1.75rem)] font-extrabold text-white">
            {p.title}
          </h3>
          <p className="mt-0 mb-11 text-[17px] leading-[1.7] text-night-text">{p.intro}</p>

          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">
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
        </Reveal>
      </div>
    </section>
  );
}
