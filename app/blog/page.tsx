import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { CONTAINER_WIDE } from "@/components/Section";

export const metadata: Metadata = {
  title: "세무칼럼",
  description:
    "세무기장, 상속·증여, 자산설계에 대해 고려세무법인이 정리한 글입니다. 신고 전에 알아두면 결과가 달라지는 이야기를 담았습니다.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="px-6 pb-[clamp(5rem,11vw,9.375rem)] pt-[clamp(7rem,14vw,10rem)]">
      <div className={CONTAINER_WIDE}>
        <p className="m-0 mb-4 text-base font-bold text-brand">세무칼럼</p>
        <h1 className="m-0 text-[clamp(2rem,6vw,3rem)] font-extrabold leading-[1.3] tracking-[-0.03em] text-pretty">
          알아두면 달라지는 이야기
        </h1>
        <p className="mt-6 mb-0 max-w-[46ch] text-[clamp(1rem,2.3vw,1.1875rem)] leading-[1.75] text-body">
          신고 시즌이 아니라 그 전에 알아두면 결과가 달라지는 내용을 정리합니다.
        </p>

        {posts.length === 0 ? (
          <p className="mt-16 rounded-[24px] bg-surface p-10 text-center text-body">
            아직 등록된 글이 없습니다.
          </p>
        ) : (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
