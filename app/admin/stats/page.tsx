import { adminConfigured, isLoggedIn } from "@/lib/admin-auth";
import { dailyTotals, daysAgo, kstDay, rangeTotals, topPaths } from "@/lib/analytics";
import { AdminNav } from "@/components/AdminNav";

export const dynamic = "force-dynamic";

const RANGES = [
  { key: "7", label: "최근 7일", days: 6 },
  { key: "30", label: "최근 30일", days: 29 },
  { key: "90", label: "최근 90일", days: 89 },
] as const;

const LABELS: Record<string, string> = {
  "/": "메인",
  "/blog": "세무칼럼 목록",
};

export default async function AdminStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  if (!adminConfigured() || !(await isLoggedIn())) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface px-5">
        <p className="text-[15px] text-body">
          로그인이 필요합니다.{" "}
          <a href="/admin" className="font-bold text-brand">로그인 화면으로</a>
        </p>
      </div>
    );
  }

  const { range } = await searchParams;
  const active = RANGES.find((r) => r.key === range) ?? RANGES[0];
  const since = daysAgo(active.days);
  const today = kstDay();

  const [totals, days, paths, todayTotals] = await Promise.all([
    rangeTotals(since),
    dailyTotals(since),
    topPaths(since),
    rangeTotals(today),
  ]);

  // 빈 날짜도 0 으로 채워 추이가 끊기지 않게 합니다.
  const byDay = new Map(days.map((d) => [d.day, d]));
  const series = Array.from({ length: active.days + 1 }, (_, i) => {
    const day = daysAgo(active.days - i);
    return byDay.get(day) ?? { day, views: 0, visits: 0 };
  });
  const peak = Math.max(1, ...series.map((s) => s.views));
  const maxPathViews = Math.max(1, ...paths.map((p) => p.views));

  return (
    <div className="min-h-dvh bg-surface px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-[1100px]">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="m-0 text-[clamp(1.5rem,4vw,2rem)] font-extrabold tracking-[-0.02em] text-ink">
              방문 실적
            </h1>
            <p className="m-0 mt-1.5 text-[14.5px] text-body">
              한국시간 기준입니다. 쿠키나 IP 를 쓰지 않습니다.
            </p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="rounded-xl bg-surface-2 px-4 py-2.5 text-[14px] font-bold text-ink-2 transition-colors hover:bg-line"
            >
              로그아웃
            </button>
          </form>
        </header>

        <AdminNav current="stats" />

        <div className="mb-6 flex flex-wrap gap-2">
          {RANGES.map((r) => (
            <a
              key={r.key}
              href={`/admin/stats?range=${r.key}`}
              className={`rounded-xl px-4 py-2 text-[14px] font-bold transition-colors ${
                r.key === active.key
                  ? "bg-brand text-white"
                  : "bg-white text-ink-2 hover:bg-surface-2"
              }`}
            >
              {r.label}
            </a>
          ))}
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <Stat
            label="오늘 방문"
            value={todayTotals.visits}
            sub={`조회 ${todayTotals.views.toLocaleString()}회`}
          />
          <Stat
            label={`${active.label} 방문`}
            value={totals.visits}
            sub={`조회 ${totals.views.toLocaleString()}회`}
          />
          <Stat
            label="하루 평균 방문"
            value={Math.round(totals.visits / (active.days + 1))}
            sub={`${active.days + 1}일 기준`}
          />
        </div>

        <section className="mb-6 rounded-[20px] border border-line bg-white p-5 sm:p-6">
          <h2 className="m-0 mb-5 text-[16px] font-extrabold text-ink">일별 추이</h2>
          {totals.views === 0 ? (
            <Empty />
          ) : (
            <>
              <div className="flex h-[160px] items-end gap-[3px]">
                {series.map((s) => (
                  <div
                    key={s.day}
                    title={`${s.day} · 방문 ${s.visits} / 조회 ${s.views}`}
                    className="group relative flex-1 rounded-t-[3px] bg-brand-soft transition-colors hover:bg-brand"
                    style={{ height: `${Math.max(3, (s.views / peak) * 100)}%` }}
                  >
                    <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-md bg-ink px-2 py-1 text-[11px] whitespace-nowrap text-white group-hover:block">
                      {s.day.slice(5)} · {s.views}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[12px] text-muted">
                <span>{series[0]?.day}</span>
                <span>{series[series.length - 1]?.day}</span>
              </div>
            </>
          )}
        </section>

        <section className="rounded-[20px] border border-line bg-white p-5 sm:p-6">
          <h2 className="m-0 mb-5 text-[16px] font-extrabold text-ink">페이지별 조회</h2>
          {paths.length === 0 ? (
            <Empty />
          ) : (
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {paths.map((p) => (
                <li key={p.path}>
                  <div className="mb-1 flex items-baseline justify-between gap-3 text-[14px]">
                    <span className="truncate font-semibold text-ink">
                      {LABELS[p.path] ?? p.path}
                      {LABELS[p.path] ? (
                        <span className="ml-2 text-[12.5px] font-normal text-muted">{p.path}</span>
                      ) : null}
                    </span>
                    <span className="shrink-0 font-bold tabular-nums text-ink-2">
                      {p.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${(p.views / maxPathViews) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-6 text-[13px] leading-[1.7] text-muted">
          방문은 브라우저 세션 기준입니다. 같은 분이 탭을 닫았다 다시 들어오면 한 번 더 셉니다.
          검색엔진 수집기는 제외합니다.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="rounded-[20px] border border-line bg-white p-5">
      <p className="m-0 text-[13.5px] font-semibold text-muted">{label}</p>
      <p className="m-0 mt-1 text-[clamp(1.75rem,5vw,2.25rem)] font-extrabold tabular-nums text-ink">
        {value.toLocaleString()}
      </p>
      <p className="m-0 mt-0.5 text-[13px] text-body">{sub}</p>
    </div>
  );
}

function Empty() {
  return (
    <p className="m-0 py-10 text-center text-[14.5px] text-muted">
      아직 집계된 기록이 없습니다. 배포 후 방문이 생기면 표시됩니다.
    </p>
  );
}
