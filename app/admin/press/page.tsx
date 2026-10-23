import { adminConfigured, isLoggedIn } from "@/lib/admin-auth";
import { listPress, thumbnailFor } from "@/lib/press";
import { createPress, deletePress, togglePressVisible } from "@/lib/press-actions";
import { AdminNav } from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminPressPage() {
  if (!adminConfigured() || !(await isLoggedIn())) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface px-5">
        <p className="text-[15px] text-body">
          로그인이 필요합니다. <a href="/admin" className="font-bold text-brand">로그인 화면으로</a>
        </p>
      </div>
    );
  }

  const rows = await listPress(false);

  return (
    <div className="min-h-dvh bg-surface px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-[1100px]">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="m-0 text-[clamp(1.5rem,4vw,2rem)] font-extrabold tracking-[-0.02em] text-ink">
              보도자료 관리
            </h1>
            <p className="m-0 mt-1.5 text-[14.5px] text-body">
              등록한 글은 메인 화면에 바로 반영됩니다. 재배포가 필요 없습니다.
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

        <AdminNav current="press" />

        {/* 등록 */}
        <form
          action={createPress}
          className="mb-8 rounded-[20px] border border-line bg-white p-5 sm:p-6"
        >
          <h2 className="m-0 mb-4 text-[17px] font-extrabold text-ink">새 보도자료 등록</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-[13.5px] font-bold text-ink-2">제목 *</span>
              <input
                name="title"
                required
                placeholder="예: 고려세무법인 박소영 세무사, 상속세 절세 전략 인터뷰"
                className="w-full rounded-xl border border-line px-4 py-3 text-[15.5px] text-ink outline-none focus:border-brand"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-[13.5px] font-bold text-ink-2">
                링크 * <span className="font-medium text-muted">— 유튜브 주소를 넣으면 영상으로 등록됩니다</span>
              </span>
              <input
                name="url"
                type="url"
                required
                placeholder="https://..."
                className="w-full rounded-xl border border-line px-4 py-3 text-[15.5px] text-ink outline-none focus:border-brand"
              />
            </label>

            <label>
              <span className="mb-1.5 block text-[13.5px] font-bold text-ink-2">매체명</span>
              <input
                name="outlet"
                placeholder="예: 공공경제타임즈"
                className="w-full rounded-xl border border-line px-4 py-3 text-[15.5px] text-ink outline-none focus:border-brand"
              />
            </label>

            <label>
              <span className="mb-1.5 block text-[13.5px] font-bold text-ink-2">보도일</span>
              <input
                name="published_at"
                type="date"
                className="w-full rounded-xl border border-line px-4 py-3 text-[15.5px] text-ink outline-none focus:border-brand"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 rounded-xl bg-brand px-6 py-3 text-[15px] font-bold text-white transition-colors hover:bg-brand-dark"
          >
            등록
          </button>
        </form>

        {/* 목록 */}
        {rows.length === 0 ? (
          <p className="rounded-[20px] border border-line bg-white px-6 py-14 text-center text-[15px] text-body">
            아직 등록된 보도자료가 없습니다.
          </p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {rows.map((p) => {
              const thumb = thumbnailFor(p);
              const hidden = p.visible !== 1;
              return (
                <li
                  key={p.id}
                  className={`flex flex-wrap items-start gap-4 rounded-[20px] border border-line bg-white p-4 sm:p-5 ${
                    hidden ? "opacity-60" : ""
                  }`}
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt=""
                      width={160}
                      height={90}
                      className="h-[72px] w-[128px] shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-[72px] w-[128px] shrink-0 items-center justify-center rounded-xl bg-surface-2 text-[12.5px] font-bold text-muted">
                      기사
                    </div>
                  )}

                  <div className="min-w-[14rem] flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[12px] font-bold ${
                          p.kind === "video"
                            ? "bg-brand-soft text-brand-ink"
                            : "bg-surface-2 text-ink-2"
                        }`}
                      >
                        {p.kind === "video" ? "영상" : "기사"}
                      </span>
                      {hidden ? (
                        <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[12px] font-bold text-muted">
                          숨김
                        </span>
                      ) : null}
                      {p.outlet ? (
                        <span className="text-[13px] text-muted">{p.outlet}</span>
                      ) : null}
                      {p.published_at ? (
                        <span className="text-[13px] text-muted">{p.published_at}</span>
                      ) : null}
                    </div>
                    <p className="m-0 mb-1 text-[15.5px] font-bold text-ink">{p.title}</p>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] break-all text-brand-ink underline"
                    >
                      {p.url}
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <form action={togglePressVisible}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="visible" value={hidden ? "1" : "0"} />
                      <button
                        type="submit"
                        className="rounded-xl bg-surface-2 px-3.5 py-2.5 text-[13.5px] font-bold text-ink-2 transition-colors hover:bg-line"
                      >
                        {hidden ? "보이기" : "숨기기"}
                      </button>
                    </form>
                    <form action={deletePress}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded-xl bg-surface-2 px-3.5 py-2.5 text-[13.5px] font-bold text-[#d13c33] transition-colors hover:bg-[#fff2f0]"
                      >
                        삭제
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
