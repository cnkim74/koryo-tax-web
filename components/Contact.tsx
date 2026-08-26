import { contact, offices } from "@/content/site";
import { CONTAINER_WIDE, SECTION_PADDING } from "./Section";
import { Reveal } from "./Reveal";
import { ContactForm } from "./ContactForm";
import { OfficeMap } from "./OfficeMap";

export function Contact() {
  return (
    <section
      id={contact.id}
      className={`scroll-mt-16 bg-surface ${SECTION_PADDING}`}
    >
      <div className={CONTAINER_WIDE}>
        <div className="mx-auto max-w-[720px] text-center">
          <Reveal className="mb-4 text-[15px] font-bold text-brand sm:text-base">
            {contact.eyebrow}
          </Reveal>
          <Reveal
            as="h2"
            className="m-0 mb-7 text-[clamp(1.75rem,5.4vw,2.75rem)] font-extrabold leading-[1.35] tracking-[-0.03em] text-pretty"
          >
            {contact.title}
          </Reveal>
          <Reveal
            as="p"
            className="m-0 text-[clamp(1rem,2.3vw,1.1875rem)] leading-[1.75] text-body"
          >
            {contact.body}
          </Reveal>
        </div>

        <div className="mt-16 grid items-start gap-6 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <div className="flex flex-col gap-6">
            {offices.map((office, i) => (
              <Reveal
                key={office.key}
                delay={i * 90}
                className="overflow-hidden rounded-[24px] bg-white shadow-[0_6px_24px_rgba(0,0,0,0.05)]"
              >
                <div className="px-[clamp(1.5rem,5vw,2.25rem)] pt-[clamp(1.75rem,5vw,2.5rem)] pb-[clamp(1.25rem,4vw,1.875rem)]">
                  <h3 className="m-0 mb-2 text-[23px] font-extrabold text-ink">{office.name}</h3>
                  <a
                    href={office.telHref}
                    className="text-[clamp(1.375rem,4.5vw,1.625rem)] font-extrabold text-brand hover:text-brand-dark"
                  >
                    {office.tel}
                  </a>

                  <dl className="mt-[22px] mb-0 flex flex-col gap-2.5 text-[15.5px] leading-[1.65] text-body">
                    <InfoRow term="주소">{office.address}</InfoRow>
                    <InfoRow term="대중교통">{office.transit}</InfoRow>
                    <InfoRow term="주차">{office.parking}</InfoRow>
                  </dl>
                </div>
                <OfficeMap office={office} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="w-16 shrink-0 font-semibold text-muted">{term}</dt>
      <dd className="m-0">{children}</dd>
    </div>
  );
}
