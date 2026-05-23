import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle2, ClipboardCheck, FileText, HelpCircle, Lightbulb, PlayCircle } from "lucide-react";
import { Playground } from "@/components/playground";
import { courses, getTutorialContent } from "@/lib/data";
import { RevisionAssistant } from "@/components/revision/revision-assistant";

export default async function TutorialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = courses.find((item) => item.slug === slug);
  if (!course) notFound();
  const content = getTutorialContent(slug);
  const revisionContent = [
    content.overview,
    ...content.sections.map((section) => `${section.heading}: ${section.body}`),
    content.example,
    ...content.practice,
    ...content.quiz.map((item) => `${item.question} ${item.answer}`)
  ].join("\n");

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Link href="/courses" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-700">
          <ArrowLeft className="size-4" /> Back to courses
        </Link>
        <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
          <aside className="h-max rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 xl:sticky xl:top-24">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-600">{course.category}</p>
            <h1 className="mt-2 text-2xl font-black">{course.title}</h1>
            <div className="mt-5 space-y-2">
              {course.chapters.map((chapter, index) => (
                <button
                  key={chapter}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold ${
                    index === 0 ? "bg-ink text-white dark:bg-white dark:text-ink" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <CheckCircle2 className="size-4" /> {chapter}
                </button>
              ))}
            </div>
          </aside>
          <article className="space-y-6">
            <div className="rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-8 text-white">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">Interactive lesson</p>
                  <h2 className="mt-3 text-4xl font-black tracking-tight">{course.chapters[0]}</h2>
                </div>
                <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-ink">
                  <Bookmark className="size-4" /> Bookmark
                </button>
              </div>
              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                {content.overview}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["Lessons", `${course.lessons}`, FileText],
                ["Practice exercises", "18", PlayCircle],
                ["Quiz score", "86%", CheckCircle2]
              ].map(([label, value, Icon]) => (
                <div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <Icon className="mb-4 size-6 text-brand-600" />
                  <p className="text-3xl font-black">{value as string}</p>
                  <p className="text-sm font-bold text-slate-500">{label as string}</p>
                </div>
              ))}
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <FileText className="size-6 text-brand-600" />
                <h3 className="text-2xl font-black">Read the lesson</h3>
              </div>
              <div className="mt-6 grid gap-4">
                {content.sections.map((section, index) => (
                  <article key={section.heading} className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-full bg-ink text-sm font-black text-white dark:bg-white dark:text-ink">
                        {index + 1}
                      </span>
                      <h4 className="text-lg font-black">{section.heading}</h4>
                    </div>
                    <p className="leading-7 text-slate-600 dark:text-slate-300">{section.body}</p>
                  </article>
                ))}
              </div>
            </section>

            {content.outline ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <BookOpenIcon />
                  <h3 className="text-2xl font-black">Book chapter outline</h3>
                </div>
                <div className="mt-5 rounded-2xl bg-cyan-50 p-5 dark:bg-cyan-950/30">
                  <p className="font-black text-cyan-950 dark:text-cyan-100">Read the full book as HTML pages</p>
                  <p className="mt-2 text-sm leading-6 text-cyan-900/80 dark:text-cyan-200/80">
                    Each chapter has its own page with the full extracted content from your DOCX book.
                  </p>
                  <Link
                    href="/tutorials/python-backend-development"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-black text-white dark:bg-white dark:text-ink"
                  >
                    Open full book reader <ArrowRight className="size-4" />
                  </Link>
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {content.outline.map((part) => (
                    <article key={part.part} className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
                      <h4 className="font-black text-brand-700 dark:text-cyan-300">{part.part}</h4>
                      <ul className="mt-4 space-y-2">
                        {part.chapters.map((chapter) => (
                          <li key={chapter} className="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="mt-1 size-4 shrink-0 text-leaf" />
                            <span>{chapter}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <Lightbulb className="size-6 text-amber-500" />
                  <h3 className="text-2xl font-black">Simple example</h3>
                </div>
                <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-cyan-100">
                  <code>{content.example}</code>
                </pre>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="size-6 text-leaf" />
                  <h3 className="text-2xl font-black">Practice tasks</h3>
                </div>
                <div className="mt-5 space-y-3">
                  {content.practice.map((task) => (
                    <div key={task} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-leaf" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">{task}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <HelpCircle className="size-6 text-brand-600" />
                <h3 className="text-2xl font-black">Quick quiz</h3>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {content.quiz.map((item) => (
                  <details key={item.question} className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950">
                    <summary className="cursor-pointer font-black">{item.question}</summary>
                    <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-2xl font-black">My notes</h3>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                Write a short note after reading. Keep it simple: what the topic means, where it is used and one example
                you can remember.
              </p>
              <div className="mt-6 rounded-xl bg-slate-100 p-4 font-mono text-sm dark:bg-slate-950">
                # My note: {content.sections[0]?.heading} - {content.sections[0]?.body}
              </div>
            </section>

            <RevisionAssistant
              topic={course.title}
              chapterTitle={course.chapters[0]}
              learningPath={course.category}
              content={revisionContent}
            />

            <Playground />
          </article>
        </div>
      </div>
    </div>
  );
}

function BookOpenIcon() {
  return <FileText className="size-6 text-brand-600" />;
}
