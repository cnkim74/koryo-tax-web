import Link from "next/link";
import { nav, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-night px-6 py-13">
      <div className="mx-auto flex max-w-[1140px] flex-col gap-6">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-night-text-2">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand-on-dark">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-3 text-sm text-muted">
          <span>
            {site.name} · {site.domainLabel}
          </span>
          <span>© {site.name}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
