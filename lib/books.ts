import fs from "node:fs";
import path from "node:path";

export type LibraryBookSummary = {
  slug: string;
  title: string;
  category: string;
  level: string;
  description: string;
  source: string;
  chapters: number;
};

export type LibraryBookBlock = {
  type: "heading" | "subheading" | "paragraph" | "list" | "callout";
  text: string;
};

export type LibraryBookChapter = {
  number: number;
  slug: string;
  title: string;
  blocks: LibraryBookBlock[];
};

export type LibraryBook = Omit<LibraryBookSummary, "chapters"> & {
  chapters: LibraryBookChapter[];
};

const booksDir = path.join(process.cwd(), "data", "books");

export function getLibraryBooks(): LibraryBookSummary[] {
  return JSON.parse(fs.readFileSync(path.join(booksDir, "registry.json"), "utf8")) as LibraryBookSummary[];
}

export function getLibraryBook(slug: string): LibraryBook | null {
  const filePath = path.join(booksDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as LibraryBook;
}

export function getLibraryChapter(bookSlug: string, chapterSlug: string) {
  const book = getLibraryBook(bookSlug);
  if (!book) {
    return null;
  }
  const chapter = book.chapters.find((item) => item.slug === chapterSlug);
  if (!chapter) {
    return null;
  }
  const index = book.chapters.findIndex((item) => item.slug === chapterSlug);
  return {
    book,
    chapter,
    previous: index > 0 ? book.chapters[index - 1] : null,
    next: index < book.chapters.length - 1 ? book.chapters[index + 1] : null
  };
}
