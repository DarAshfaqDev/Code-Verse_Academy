import Link from "next/link";
import { ArrowLeft, CalendarDays, ExternalLink, Hash, Layers3, LibraryBig, Quote, Sparkles } from "lucide-react";
import { BlogArticle, BlogBlock, getBlogJumpLinks, getBlogReadingStats } from "@/lib/blogs";

type Props = {
  article: BlogArticle;
  previous?: BlogArticle | null;
  next?: BlogArticle | null;
};

export function BlogReader({ article, previous, next }: Props) {
  const jumpLinks = getBlogJumpLinks(article);
  const stats = getBlogReadingStats(article);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white">
            <ArrowLeft className="size-4" />
            Blog
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/blog/${article.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-ink px-3 py-2 text-sm font-bold text-white dark:bg-white dark:text-ink"
            >
              <ExternalLink className="size-4" />
              Open in new tab
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 lg:py-10">
        <article className="min-w-0">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-brand-700 dark:text-cyan-200">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 dark:bg-cyan-950/30">
                <Sparkles className="size-3.5" />
                {article.category}
              </span>
              <span className="rounded-full bg-slate-200/70 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Article {article.order} of 4
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {article.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                <CalendarDays className="size-4" />
                Word file article
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                <LibraryBig className="size-4" />
                {article.wordCount.toLocaleString()} words
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                <Layers3 className="size-4" />
                {article.sectionCount} sections
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                <Hash className="size-4" />
                {article.readingTime} min read
              </span>
            </div>
          </div>

          <div className="mt-8 max-w-3xl rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            {article.blocks.map((block, index) => (
              <BlogBlockView key={`${block.type}-${index}`} block={block} id={`section-${index}`} />
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {previous ? (
              <Link
                href={`/blog/${previous.slug}`}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Previous</p>
                <h2 className="mt-2 text-xl font-black">{previous.title}</h2>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Next</p>
                <h2 className="mt-2 text-xl font-black">{next.title}</h2>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200">On this page</p>
            <h2 className="mt-2 text-lg font-black">Jump to section</h2>
            <nav className="mt-4 space-y-2">
              {jumpLinks.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white ${
                    item.level === 3 ? "pl-5 text-[13px]" : ""
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Reading tips</p>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <li className="flex gap-2">
                <Quote className="mt-0.5 size-4 shrink-0 text-brand-600 dark:text-cyan-200" />
                Scan the section headings first if you want the quick version.
              </li>
              <li className="flex gap-2">
                <Quote className="mt-0.5 size-4 shrink-0 text-brand-600 dark:text-cyan-200" />
                Use the open-in-new-tab option if you want to keep the blog index nearby.
              </li>
              <li className="flex gap-2">
                <Quote className="mt-0.5 size-4 shrink-0 text-brand-600 dark:text-cyan-200" />
                The article copy comes directly from your Blogs.docx file.
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}

function BlogBlockView({ block, id }: { block: BlogBlock; id: string }) {
  if (block.type === "heading") {
    if (block.level === 3) {
      return (
        <h3 id={id} className="scroll-mt-24 pt-8 text-2xl font-black tracking-tight text-ink dark:text-white">
          {block.text}
        </h3>
      );
    }

    return (
      <h2 id={id} className="scroll-mt-24 border-t border-slate-200 pt-8 text-3xl font-black tracking-tight text-ink dark:border-slate-800 dark:text-white">
        {block.text}
      </h2>
    );
  }

  if (block.type === "list") {
    return (
      <p className="my-3 flex gap-3 rounded-2xl bg-slate-50 p-4 leading-7 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-500" />
        <span>{block.text}</span>
      </p>
    );
  }

  if (block.type === "pre") {
    return (
      <pre className="my-5 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-cyan-100">
        <code>{block.text}</code>
      </pre>
    );
  }

  return <p className="my-4 text-[17px] leading-8 text-slate-700 dark:text-slate-300">{block.text}</p>;
}
