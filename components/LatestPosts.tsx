import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { CONTAINER_WIDE, SECTION_PADDING } from "./Section";
import { Reveal } from "./Reveal";
import { PostCard } from "./PostCard";

export function LatestPosts() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section id="blog" className={`scroll-mt-16 ${SECTION_PADDING}`}>
      <div className={CONTAINER_WIDE}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal className="mb-4 text-[15px] font-bold text-brand sm:text-base">
              세무칼럼
            </Reveal>
            <Reveal
              as="h2"
              className="m-0 text-[clamp(1.75rem,5.4vw,2.75rem)] font-extrabold leading-[1.35] tracking-[-0.03em] text-pretty"
            >
              알아두면 달라지는 이야기
            </Reveal>
          </div>
          <Reveal>
            <Link
              href="/blog"
              className="rounded-xl bg-surface-2 px-5 py-3 text-[15px] font-bold text-ink-2 transition-colors hover:bg-line"
            >
              전체 보기
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 90} className="h-full">
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
