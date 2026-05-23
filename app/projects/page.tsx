import { ArrowRight, FolderKanban } from "lucide-react";
import { Section } from "@/components/section";
import { projects } from "@/lib/data";

export default function ProjectsPage() {
  return (
    <Section eyebrow="Projects showcase" title="Build projects after learning the topic" copy="Use projects to turn DSA, web development, data science and AI concepts into portfolio-ready work.">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <article key={project} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <FolderKanban className="mb-10 size-8 text-brand-600" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Project {index + 1}</p>
            <h3 className="mt-3 text-xl font-black">{project}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Includes tasks, starter files, checklist, rubric and certificate evidence.</p>
            <button className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-700 dark:text-cyan-300">
              View brief <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </button>
          </article>
        ))}
      </div>
    </Section>
  );
}
