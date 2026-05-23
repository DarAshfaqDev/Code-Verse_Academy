import { BadgeCheck, Download, ShieldCheck } from "lucide-react";
import { Section } from "@/components/section";
import { courses } from "@/lib/data";

export default function CertificationsPage() {
  return (
    <Section eyebrow="Certifications" title="Get proof when you finish a course" copy="Certificates show your completed lessons, quiz score, practice work and project submissions in a simple shareable format.">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {courses.slice(0, 6).map((course) => (
          <article key={course.slug} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <ShieldCheck className="mb-8 size-8 text-brand-600" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Certificate</p>
            <h3 className="mt-3 text-xl font-black">{course.title}</h3>
            <p className="mt-3 text-sm text-slate-500">Credential ID CV-{course.slug.slice(0, 4).toUpperCase()}-2026</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-bold text-leaf"><BadgeCheck className="size-4" /> Eligible</span>
              <button className="rounded-xl border border-slate-200 p-2 dark:border-slate-800" aria-label={`Download ${course.title} certificate`}>
                <Download className="size-5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
