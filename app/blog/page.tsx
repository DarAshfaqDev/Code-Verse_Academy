import Link from "next/link";
import { ArrowUpRight, BookOpenText, CalendarDays, Clock3, FileText, LayoutGrid } from "lucide-react";
import { getBlogArticles } from "@/lib/blogs";

export default function BlogPage() {
  const articles = getBlogArticles();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-brand-700 dark:text-cyan-200">Blog</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Practical reading for learners who want depth, not noise
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Explore long-form articles on JavaScript, SQL, machine learning, and frontend accessibility, all laid out for comfortable reading with section jumps and a clean new-tab option.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                <FileText className="size-4" />
                {articles.length} articles
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                <BookOpenText className="size-4" />
                Word sourced content
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                <LayoutGrid className="size-4" />
                Current-page reading
              </span>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">How to read</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <p>Click an article card to read it in the current page.</p>
              <p>Use the arrow button to open the same article in a new tab.</p>
              <p>Each reader page has jump links for fast scanning and deeper reading.</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="grid gap-5 md:grid-cols-2">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-xl hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30"
            >
              <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    <CalendarDays className="size-3.5" />
                    Article {article.order}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200">
                    <Clock3 className="size-3.5" />
                    {article.readingTime} min
                  </span>
                </div>
              </div>

              <div className="grid gap-5 p-5">
              <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200">{article.category}</p>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-[1.7rem]">
                    <Link href={`/blog/${article.slug}`} className="transition hover:text-brand-700 dark:hover:text-cyan-200">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">{article.excerpt}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-black text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-ink"
                  >
                    Read article
                    <ArrowUpRight className="size-4" />
                  </Link>
                  <Link
                    href={`/blog/${article.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-brand-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:text-white"
                  >
                    New tab
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
