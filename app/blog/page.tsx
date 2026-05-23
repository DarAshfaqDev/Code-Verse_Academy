import { CalendarDays } from "lucide-react";
import { Section } from "@/components/section";

const posts = [
  "How to learn JavaScript without tutorial fatigue",
  "SQL interview patterns every analyst should know",
  "A practical roadmap for machine learning projects",
  "Accessibility checks before you ship a frontend"
];

export default function BlogPage() {
  return (
    <Section eyebrow="Blog" title="Guides for practical learning" copy="Editorial articles for roadmap planning, interview prep, technical depth and project strategy.">
      <div className="grid gap-5 md:grid-cols-2">
        {posts.map((post, index) => (
          <article key={post} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="flex items-center gap-2 text-sm font-bold text-slate-500"><CalendarDays className="size-4" /> May {12 + index}, 2026</p>
            <h2 className="mt-5 text-2xl font-black">{post}</h2>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">Actionable notes, examples, quizzes and a short practice prompt to reinforce the concept.</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
