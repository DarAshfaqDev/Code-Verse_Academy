import { notFound } from "next/navigation";
import { TutorialReader } from "@/components/tutorials/tutorial-reader";
import { getLibraryBook, getLibraryBooks, getLibraryChapter } from "@/lib/books";

export function generateStaticParams() {
  return getLibraryBooks().flatMap((book) => {
    const bookData = getLibraryBook(book.slug);
    return (bookData?.chapters ?? []).map((chapter) => ({
      book: book.slug,
      chapter: chapter.slug
    }));
  });
}

export default async function TutorialBookChapterPage({ params }: { params: Promise<{ book: string; chapter: string }> }) {
  const { book: bookSlug, chapter: chapterSlug } = await params;
  const result = getLibraryChapter(bookSlug, chapterSlug);
  if (!result) notFound();

  const { book, chapter, previous, next } = result;
  const headings = chapter.blocks
    .map((block, index) => ({ ...block, index }))
    .filter((block) => block.type === "heading" || block.type === "subheading")
    .slice(0, 18);
  const revisionContent = chapter.blocks.map((block) => block.text).join("\n").slice(0, 24000);
  const previousChapterOptions = book.chapters
    .filter((item) => item.number < chapter.number)
    .map((item) => ({
      number: item.number,
      slug: item.slug,
      title: item.title,
      content: item.blocks.map((block) => block.text).join("\n").slice(0, 6000)
    }));

  return (
    <TutorialReader
      book={book}
      chapter={chapter}
      previous={previous}
      next={next}
      headings={headings}
      revisionContent={revisionContent}
      previousChapterOptions={previousChapterOptions}
    />
  );
}
