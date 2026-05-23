import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { getLibraryBook, getLibraryBooks } from "@/lib/books";

export function generateStaticParams() {
  return getLibraryBooks().map((book) => ({ book: book.slug }));
}

export default async function TutorialBookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book: bookSlug } = await params;
  const book = getLibraryBook(bookSlug);
  if (!book) notFound();

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Link href="/tutorials" className="mb-6 inline-flex items-center gap-2 text-sm font-black text-slate-500 hover:text-brand-700">
          <ArrowLeft className="size-4" /> Back to tutorials
        </Link>
        <section className="rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-200">{book.category}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{book.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{book.description}</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-cyan-100">
            <span className="rounded-full bg-white/10 px-4 py-2">{book.chapters.length} chapters</span>
            <span className="rounded-full bg-white/10 px-4 py-2">Tutorial reader</span>
          </div>
        </section>

        <section className="mt-8 grid gap-4">
          {book.chapters.map((chapter) => (
            <Link
              key={chapter.slug}
              href={`/tutorials/${book.slug}/${chapter.slug}`}
              className="group grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-brand-500 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[72px_1fr_auto] md:items-center"
            >
              <span className="grid size-14 place-items-center rounded-2xl bg-slate-100 text-xl font-black text-brand-700 dark:bg-slate-950 dark:text-cyan-300">
                {chapter.number}
              </span>
              <span>
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  <FileText className="size-4" />
                  Lesson
                </span>
                <span className="mt-2 block text-xl font-black">{chapter.title}</span>
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-black text-brand-700 dark:text-cyan-300">
                Read <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
