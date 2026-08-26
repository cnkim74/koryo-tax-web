import Link from "next/link";
import { hero } from "@/content/site";
import { Lines } from "./Section";

export function Hero() {
  return (
    <header
      id="top"
      className="bg-linear-to-b from-white to-surface px-6 pb-[clamp(5rem,12vw,9.375rem)] pt-[clamp(7.5rem,16vw,12.5rem)] text-center"
    >
      <div className="mx-auto max-w-[820px] animate-[fadeUp_0.9s_ease_both]">
        <h1 className="m-0 text-[clamp(2.125rem,7vw,4rem)] font-extrabold leading-[1.28] tracking-[-0.03em] text-pretty">
          <Lines lines={hero.titleLines} />
        </h1>

        <p className="mx-auto mt-8 mb-0 max-w-[36ch] text-[clamp(1.0625rem,2.6vw,1.25rem)] font-medium leading-[1.7] text-body sm:max-w-none">
          <Lines lines={hero.body} />
        </p>

        <div className="mt-11 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={hero.primaryCta.href}
            className="rounded-2xl bg-brand px-8 py-4 text-[17px] font-bold text-white transition-colors hover:bg-brand-dark"
          >
            {hero.primaryCta.label}
          </Link>
          <Link
            href={hero.secondaryCta.href}
            className="rounded-2xl bg-surface-2 px-8 py-4 text-[17px] font-bold text-ink-2 transition-colors hover:bg-line"
          >
            {hero.secondaryCta.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
