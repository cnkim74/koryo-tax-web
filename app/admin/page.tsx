import { adminConfigured, isLoggedIn } from "@/lib/admin-auth";
import { countByStatus, listInquiries, type Inquiry } from "@/lib/db";
import { kakaoChannel } from "@/content/site";

// 쿠키와 DB 를 읽으므로 매 요청마다 새로 그립니다.
export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; filter?: string }>;
}) {
  const { error, filter } = await searchParams;

  if (!adminConfigured()) return <Setup />;
  if (!(await isLoggedIn())) return <Login failed={error === "1"} />;

  const [all, counts] = await Promise.all([listInquiries(), countByStatus()]);
  const showOnlyNew = filter === "new";
  const rows = showOnlyNew ? all.filter((r) => r.status === "new") : all;

  return (
    <div className="min-h-dvh bg-surface px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-[1100px]">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="m-0 text-[clamp(1.5rem,4vw,2rem)] font-extrabold tracking-[-0.02em] text-ink">
              상담 접수 관리
            </h1>
            <p className="m-0 mt-1.5 text-[14.5px] text-body">
              전체 <strong className="font-bold text-ink">{counts.total}</strong>건 · 미처리{" "}
              <strong className="font-bold text-brand">{counts.newCount}</strong>건
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

        <nav className="mb-5 flex gap-2">
          <FilterLink href="/admin" active={!showOnlyNew} label={`전체 ${counts.total}`} />
          <FilterLink
            href="/admin?filter=new"
            active={showOnlyNew}
            label={`미처리 ${counts.newCount}`}
          />
        </nav>

        {rows.length === 0 ? (
          <p className="rounded-[20px] border border-line bg-white px-6 py-14 text-center text-[15px] text-body">
            {showOnlyNew ? "미처리 문의가 없습니다." : "아직 접수된 문의가 없습니다."}
          </p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {rows.map((row) => (
              <InquiryCard key={row.id} row={row} />
            ))}
          </ul>
        )}

        <p className="mt-8 text-[13px] text-muted">
          최근 200건까지 표시합니다. 개인정보가 포함된 화면이니 공용 PC 에서는 반드시
          로그아웃해 주세요.
        </p>
      </div>
    </div>
  );
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <a
      href={href}
      className={`rounded-xl px-4 py-2 text-[14px] font-bold transition-colors ${
        active ? "bg-brand text-white" : "bg-white text-ink-2 hover:bg-surface-2"
      }`}
    >
      {label}
    </a>
  );
}

function InquiryCard({ row }: { row: Inquiry }) {
  const done = row.status === "done";
  const when = new Date(row.created_at);
  const stamp = Number.isNaN(when.getTime())
    ? row.created_at
    : new Intl.DateTimeFormat("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Seoul",
      }).format(when);

  return (
    <li
      className={`rounded-[20px] border bg-white p-5 sm:p-6 ${
        done ? "border-line opacity-70" : "border-brand/30"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[12.5px] font-bold ${
            done ? "bg-surface-2 text-muted" : "bg-brand-soft text-brand-ink"
          }`}
        >
          {done ? "처리완료" : "미처리"}
        </span>
        <strong className="text-[17px] font-extrabold text-ink">{row.name}</strong>
        <a href={`tel:${row.phone}`} className="text-[16px] font-bold text-brand">
          {row.phone}
        </a>
        <span className="text-[13px] text-muted">{stamp}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-body">
        <span>
          <span className="text-muted">유형</span> {row.topic}
        </span>
        {row.email ? (
          <span>
            <span className="text-muted">이메일</span> {row.email}
          </span>
        ) : null}
        <span>
          <span className="text-muted">경로</span>{" "}
          {row.source === "quick" ? "플로팅 상담창" : "상담 신청 양식"}
        </span>
      </div>

      <p className="mt-3.5 mb-0 rounded-xl bg-surface px-4 py-3.5 text-[15px] leading-[1.7] whitespace-pre-wrap text-ink-2">
        {row.message}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <form action="/api/admin/status" method="post">
          <input type="hidden" name="id" value={row.id} />
          <input type="hidden" name="status" value={done ? "new" : "done"} />
          <button
            type="submit"
            className={`rounded-xl px-4 py-2.5 text-[14px] font-bold transition-colors ${
              done
                ? "bg-surface-2 text-ink-2 hover:bg-line"
                : "bg-brand text-white hover:bg-brand-dark"
            }`}
          >
            {done ? "미처리로 되돌리기" : "처리완료로 표시"}
          </button>
        </form>
        <a
          href={`tel:${row.phone}`}
          className="rounded-xl bg-surface-2 px-4 py-2.5 text-[14px] font-bold text-ink-2 transition-colors hover:bg-line"
        >
          전화 걸기
        </a>
        <a
          href={kakaoChannel.chat}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-surface-2 px-4 py-2.5 text-[14px] font-bold text-ink-2 transition-colors hover:bg-line"
        >
          카톡 채널 열기
        </a>
      </div>
    </li>
  );
}

function Login({ failed }: { failed: boolean }) {
  return (
    <Shell>
      <h1 className="m-0 mb-2 text-[22px] font-extrabold text-ink">상담 접수 관리</h1>
      <p className="m-0 mb-6 text-[14.5px] text-body">관리자 비밀번호를 입력해 주세요.</p>

      <form action="/api/admin/login" method="post" className="flex flex-col gap-3">
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="비밀번호"
          aria-label="관리자 비밀번호"
          className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-[16px] text-ink outline-none focus:border-brand"
        />
        {failed ? (
          <p role="alert" className="m-0 rounded-lg bg-[#fff2f0] px-3.5 py-2.5 text-[13.5px] text-[#d13c33]">
            비밀번호가 올바르지 않습니다.
          </p>
        ) : null}
        <button
          type="submit"
          className="rounded-xl bg-brand px-5 py-3.5 text-[15.5px] font-bold text-white transition-colors hover:bg-brand-dark"
        >
          로그인
        </button>
      </form>
    </Shell>
  );
}

function Setup() {
  return (
    <Shell>
      <h1 className="m-0 mb-2 text-[22px] font-extrabold text-ink">설정이 필요합니다</h1>
      <p className="m-0 mb-5 text-[14.5px] leading-[1.7] text-body">
        관리자 비밀번호가 등록되지 않아 접속할 수 없습니다. 아래 두 값을 등록한 뒤 다시
        배포해 주세요.
      </p>
      <pre className="m-0 overflow-x-auto rounded-xl bg-night px-4 py-3.5 text-[13px] leading-[1.8] text-night-text-2">
{`npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET`}
      </pre>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface px-5 py-16">
      <div className="w-full max-w-[26rem] rounded-[20px] border border-line bg-white p-7 shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
        {children}
      </div>
    </div>
  );
}
