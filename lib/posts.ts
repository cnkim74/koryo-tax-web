import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readingMinutes: number;
};

export type Post = PostMeta & { html: string };

function readFileSafe(slug: string) {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  // 경로 이탈 방지
  if (!file.startsWith(POSTS_DIR + path.sep)) return null;
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}

function toMeta(slug: string, data: Record<string, unknown>, content: string): PostMeta {
  const words = content.replace(/\s+/g, "").length;
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    category: String(data.category ?? "세무칼럼"),
    // 한글 기준 분당 약 500자
    readingMinutes: Math.max(1, Math.round(words / 500)),
  };
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllPosts(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => {
      const raw = readFileSafe(slug);
      if (!raw) return null;
      const { data, content } = matter(raw);
      return toMeta(slug, data, content);
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | null {
  const raw = readFileSafe(slug);
  if (!raw) return null;
  const { data, content } = matter(raw);
  return {
    ...toMeta(slug, data, content),
    html: marked.parse(content, { async: false }) as string,
  };
}

export function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(d);
}
