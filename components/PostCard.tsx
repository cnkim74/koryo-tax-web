import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/posts";

export function PostCard({ post, onDark = false }: { post: PostMeta; onDark?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex h-full flex-col rounded-[24px] p-[clamp(1.5rem,4vw,2rem)] transition-transform duration-200 hover:-translate-y-1 ${
        onDark ? "bg-night-2" : "bg-surface"
      }`}
    >
      <span
        className={`mb-4 inline-flex w-fit rounded-full px-3 py-1 text-[13px] font-bold ${
          onDark ? "bg-white/10 text-brand-on-dark" : "bg-brand-soft text-brand-ink"
        }`}
      >
        {post.category}
      </span>
      <h3
        className={`m-0 mb-3 text-[19px] font-extrabold leading-[1.45] text-pretty ${
          onDark ? "text-white" : "text-ink group-hover:text-brand"
        }`}
      >
        {post.title}
      </h3>
      <p
        className={`m-0 line-clamp-3 text-[15.5px] leading-[1.7] ${
          onDark ? "text-night-text" : "text-body"
        }`}
      >
        {post.description}
      </p>
      <div
        className={`mt-6 flex items-center gap-2 text-[13.5px] font-medium ${
          onDark ? "text-muted" : "text-muted"
        }`}
      >
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden>·</span>
        <span>{post.readingMinutes}분 분량</span>
      </div>
    </Link>
  );
}
