import Link from "next/link";

export function AdminNav({ current }: { current: "inquiries" | "press" }) {
  const tabs = [
    { key: "inquiries", href: "/admin", label: "상담 접수" },
    { key: "press", href: "/admin/press", label: "보도자료" },
  ] as const;

  return (
    <nav className="mb-6 flex gap-2">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`rounded-xl px-4 py-2.5 text-[14.5px] font-bold transition-colors ${
            current === t.key ? "bg-ink text-white" : "bg-white text-ink-2 hover:bg-surface-2"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
