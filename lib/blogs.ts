import blogData from "@/data/blogs.json";

export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; text: string }
  | { type: "pre"; text: string }
  | { type: "heading"; level: 2 | 3; text: string };

export type BlogArticle = {
  order: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  wordCount: number;
  readingTime: number;
  sectionCount: number;
  format: string;
  blocks: BlogBlock[];
};

type BlogPayload = {
  source: string;
  articles: BlogArticle[];
};

const data = blogData as BlogPayload;

export function getBlogArticles() {
  return data.articles;
}

export function getBlogArticle(slug: string) {
  return data.articles.find((article) => article.slug === slug) ?? null;
}

export function getBlogArticleSlugs() {
  return data.articles.map((article) => ({ slug: article.slug }));
}

export function getBlogReadingStats(article: BlogArticle) {
  const headingCount = article.blocks.filter((block) => block.type === "heading").length;
  const listCount = article.blocks.filter((block) => block.type === "list").length;
  return { headingCount, listCount };
}

export function getBlogJumpLinks(article: BlogArticle) {
  return article.blocks
    .map((block, index) => ({ ...block, index }))
    .filter((block): block is BlogBlock & { index: number; type: "heading" } => block.type === "heading")
    .map((block) => ({
      id: `section-${block.index}`,
      title: block.text,
      level: block.level
    }));
}
