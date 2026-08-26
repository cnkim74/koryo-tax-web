import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getAllPostSlugs, getAllPosts, getPost } from "@/lib/posts";
import { ArticleJsonLd } from "@/components/JsonLd";
import { PostCard } from "@/components/PostCard";
import { offices } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

/**
 * 글 목록은 빌드 시점에 마크다운 파일에서 확정됩니다.
 * 없는 slug 는 런타임 렌더링을 시도하지 않고 바로 404 로 보냅니다.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "글을 찾을 수 없습니다" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      url: `/blog/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <article className="px-6 pb-[clamp(5rem,11vw,9.375rem)] pt-[clamp(7rem,14vw,10rem)]">
      <div className="mx-auto w-full max-w-[720px]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[14.5px] font-bold text-muted hover:text-brand"
        >
          <span aria-hidden>←</span> 세무칼럼
        </Link>

        <div className="mt-6 mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-brand-soft px-3 py-1 text-[13px] font-bold text-brand">
            {post.category}
          </span>
          <span className="text-[13.5px] text-muted">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {" · "}
            {post.readingMinutes}분 분량
          </span>
        </div>

        <h1 className="m-0 text-[clamp(1.75rem,5.4vw,2.625rem)] font-extrabold leading-[1.34] tracking-[-0.03em] text-pretty">
          {post.title}
        </h1>
        <p className="mt-5 mb-0 text-[clamp(1rem,2.3vw,1.125rem)] leading-[1.75] text-body">
          {post.description}
        </p>

        <hr className="my-12 border-0 border-t border-line" />

        <div className="prose-ko" dangerouslySetInnerHTML={{ __html: post.html }} />

        <div className="mt-16 rounded-[24px] bg-brand-tint px-[clamp(1.5rem,5vw,2.5rem)] py-[clamp(2rem,6vw,2.75rem)]">
          <h2 className="m-0 mb-3 text-[22px] font-extrabold text-ink text-pretty">
            내 상황에서는 어떨까요?
          </h2>
          <p className="mt-0 mb-7 text-[16.5px] leading-[1.7] text-body">
            글로는 담기 어려운 개별 사정이 있습니다. 편하게 문의 주세요.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#contact"
              className="rounded-[14px] bg-brand px-7 py-3.5 text-center text-[16px] font-bold text-white transition-colors hover:bg-brand-dark"
            >
              상담 신청하기
            </Link>
            <a
              href={offices[0].telHref}
              className="rounded-[14px] bg-white px-7 py-3.5 text-center text-[16px] font-bold text-ink-2 transition-colors hover:bg-surface-2"
            >
              {offices[0].tel}
            </a>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-20">
            <h2 className="m-0 mb-6 text-[20px] font-extrabold text-ink">함께 읽어보세요</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <ArticleJsonLd
        title={post.title}
        description={post.description}
        date={post.date}
        slug={post.slug}
      />
    </article>
  );
}
