import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
};

export function getAllPosts(): PostMeta[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(POSTS_DIR, file), "utf8"));
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title,
        date: String(data.date),
        excerpt: data.excerpt,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string) {
  const { data, content } = matter(
    fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8")
  );
  return {
    slug,
    title: data.title as string,
    date: String(data.date),
    html: marked.parse(content) as string,
  };
}
