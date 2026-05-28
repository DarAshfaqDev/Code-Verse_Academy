"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Expand,
  ListChecks,
  Menu,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Search
} from "lucide-react";
import { useMemo, useState } from "react";
import { RevisionAssistant } from "@/components/revision/revision-assistant";
import type { LibraryBookBlock, LibraryBookChapter } from "@/lib/books";

type ReaderBook = {
  slug: string;
  title: string;
  category: string;
  chapters: LibraryBookChapter[];
};

type Heading = LibraryBookBlock & { index: number };

type Props = {
  book: ReaderBook;
  chapter: LibraryBookChapter;
  previous: LibraryBookChapter | null;
  next: LibraryBookChapter | null;
  headings: Heading[];
  revisionContent: string;
  previousChapterOptions: Array<{
    number: number;
    slug: string;
    title: string;
    content: string;
  }>;
};

export function TutorialReader({ book, chapter, previous, next, headings, revisionContent, previousChapterOptions }: Props) {
  const [chaptersOpen, setChaptersOpen] = useState(false);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [wideRead, setWideRead] = useState(true);

  const readerGrid = wideRead
    ? "xl:grid-cols-[minmax(0,1fr)]"
    : chaptersOpen
      ? "xl:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)_280px]"
      : "xl:grid-cols-[minmax(0,1fr)_280px]";

  function rememberChapterBeforeNavigation() {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("codeverse-learning-memory");
      const parsed = raw ? JSON.parse(raw) : {};
      const completedTopics = [
        ...new Set([...(Array.isArray(parsed.completedTopics) ? parsed.completedTopics : []), `${book.title}: ${chapter.title}`])
      ].slice(-30);
      window.localStorage.setItem(
        "codeverse-learning-memory",
        JSON.stringify({ ...parsed, completedTopics, lastReadChapter: chapter.slug, lastStudiedAt: new Date().toISOString() })
      );
    } catch {
      // Reading progress should never block navigation.
    }
  }

  const activeChapterLabel = useMemo(() => `Lesson ${chapter.number}: ${chapter.title}`, [chapter.number, chapter.title]);

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950">
      <div className="border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 sm:px-6">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
          <Link href={`/tutorials/${book.slug}`} className="inline-flex items-center gap-2 text-sm font-black text-brand-700 dark:text-cyan-300">
            <ArrowLeft className="size-4" /> {book.title}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setChaptersOpen((value) => !value)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:border-brand-300 hover:text-brand-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {chaptersOpen ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
              Chapters
            </button>
            <button
              type="button"
              onClick={() => {
                setWideRead((value) => !value);
                setChaptersOpen(false);
                setOutlineOpen(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-ink px-3 py-2 text-sm font-black text-white transition dark:bg-white dark:text-ink"
            >
              {wideRead ? <Minimize2 className="size-4" /> : <Expand className="size-4" />}
              {wideRead ? "Normal view" : "Full read"}
            </button>
            <div className="hidden min-w-[260px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 md:flex">
              <Search className="size-4" />
              Search within this tutorial
            </div>
          </div>
        </div>
      </div>

      <div className={`mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 ${readerGrid}`}>
        {chaptersOpen ? (
          <aside className="h-max rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 xl:sticky xl:top-24">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Menu className="size-5 text-brand-600" />
                <h2 className="font-black">Chapters</h2>
              </div>
              <button type="button" onClick={() => setChaptersOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close chapters">
                <PanelLeftClose className="size-4" />
              </button>
            </div>
            <nav className="max-h-[72vh] space-y-1 overflow-y-auto pr-1 scrollbar-thin">
              {book.chapters.map((item) => (
                <Link
                  key={item.slug}
                  href={`/tutorials/${book.slug}/${item.slug}`}
                  onClick={rememberChapterBeforeNavigation}
                  className={`block rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                    item.slug === chapter.slug
                      ? "bg-ink text-white dark:bg-white dark:text-ink"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="block text-xs uppercase tracking-[0.18em] opacity-70">Lesson {item.number}</span>
                  <span className="line-clamp-2">{item.title}</span>
                </Link>
              ))}
            </nav>
          </aside>
        ) : null}

        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <header className="border-b border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center gap-3 text-sm font-bold">
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200">
                <BookOpen className="size-4" /> {book.category}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                {chapter.blocks.length} blocks
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                {activeChapterLabel}
              </span>
            </div>
            <p className="text-sm font-black uppercase tracking-[0.26em] text-brand-600">Tutorial lesson</p>
            <h1 className="mt-3 max-w-5xl text-4xl font-black tracking-tight text-ink dark:text-white sm:text-5xl">
              {chapter.title}
            </h1>
          </header>

          <div className="mx-auto max-w-5xl px-6 py-8 sm:px-9">
            <RevisionAssistant
              topic={book.title}
              chapterTitle={chapter.title}
              learningPath={book.category}
              content={revisionContent}
              previousChapters={previousChapterOptions}
            />

            <div className="mt-8">
              {chapter.blocks.length === 0 ? (
                <p className="rounded-2xl bg-amber-50 p-5 font-semibold text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                  This chapter title exists in the document, but no body text was available in the extracted DOCX stream.
                </p>
              ) : (
                chapter.blocks.map((block, index) => <TutorialBlock key={`${block.type}-${index}`} block={block} id={`section-${index}`} />)
              )}
            </div>
          </div>

          <footer className="grid gap-3 border-t border-slate-200 p-5 dark:border-slate-800 md:grid-cols-2">
            {previous ? (
              <Link
                href={`/tutorials/${book.slug}/${previous.slug}`}
                onClick={rememberChapterBeforeNavigation}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-black dark:border-slate-800"
              >
                <ChevronLeft className="size-5" /> Previous: {previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/tutorials/${book.slug}/${next.slug}`}
                onClick={rememberChapterBeforeNavigation}
                className="inline-flex items-center justify-end gap-2 rounded-xl bg-ink px-4 py-3 text-right font-black text-white dark:bg-white dark:text-ink"
              >
                Next: {next.title} <ChevronRight className="size-5" />
              </Link>
            ) : null}
          </footer>
        </article>

        {!wideRead ? (
          <aside className="hidden h-max rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 xl:sticky xl:top-24 xl:block">
            <div className="mb-4 flex items-center gap-2">
              <ListChecks className="size-5 text-brand-600" />
              <h2 className="font-black">On this page</h2>
            </div>
            <Outline headings={headings} />
          </aside>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setOutlineOpen((value) => !value)}
        className="fixed bottom-20 right-5 z-40 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 xl:hidden"
      >
        <ListChecks className="size-5" /> Sections
      </button>

      {outlineOpen ? (
        <div className="fixed inset-x-4 bottom-36 z-50 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 xl:hidden">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-black">On this page</h2>
            <button type="button" onClick={() => setOutlineOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Minimize2 className="size-4" />
            </button>
          </div>
          <Outline headings={headings} />
        </div>
      ) : null}
    </div>
  );
}

function Outline({ headings }: { headings: Heading[] }) {
  return (
    <nav className="max-h-[45vh] space-y-2 overflow-y-auto">
      {headings.length ? (
        headings.map((heading) => (
          <a
            key={`${heading.text}-${heading.index}`}
            href={`#section-${heading.index}`}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-ink dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {heading.text}
          </a>
        ))
      ) : (
        <p className="text-sm leading-6 text-slate-500">This chapter is mostly paragraph content.</p>
      )}
    </nav>
  );
}

function TutorialBlock({ block, id }: { block: LibraryBookBlock; id: string }) {
  if (block.type === "heading") {
    return (
      <h2 id={id} className="scroll-mt-24 border-t border-slate-200 pt-10 text-3xl font-black tracking-tight text-ink first:border-0 first:pt-0 dark:border-slate-800 dark:text-white">
        {stripNumbering(block.text)}
      </h2>
    );
  }

  if (block.type === "subheading") {
    return (
      <h3 id={id} className="scroll-mt-24 pt-7 text-xl font-extrabold text-slate-800 dark:text-slate-100">
        {stripNumbering(block.text)}
      </h3>
    );
  }

  if (block.type === "list") {
    return (
      <p className="my-3 flex gap-3 rounded-xl bg-slate-50 p-3 leading-7 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
        <CheckCircle2 className="mt-1 size-5 shrink-0 text-leaf" />
        <span>{block.text}</span>
      </p>
    );
  }

  if (block.type === "callout") {
    return (
      <p className="my-5 rounded-2xl border-l-4 border-brand-500 bg-cyan-50 p-5 font-semibold leading-7 text-cyan-950 dark:bg-cyan-950/30 dark:text-cyan-100">
        {block.text}
      </p>
    );
  }

  if (looksLikeCode(block.text)) {
    return (
      <pre className="my-5 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-cyan-100">
        <code>{block.text}</code>
      </pre>
    );
  }

  return <p className="my-4 text-[18px] leading-9 text-slate-700 dark:text-slate-300">{block.text}</p>;
}

function looksLikeCode(text: string) {
  return /^(from |import |def |class |const |let |var |function |SELECT |CREATE |INSERT |UPDATE |DELETE |docker |uvicorn |pip )/.test(text);
}

function stripNumbering(text: string) {
  return text.replace(/^\d+(?:\.\d+)*\.?\s+/, "");
}
