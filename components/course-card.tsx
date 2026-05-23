"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

type Course = {
  title: string;
  slug: string;
  category: string;
  level: string;
  lessons: number;
  progress: number;
  color: string;
  description: string;
  chapters: string[];
  certificate: boolean;
  bookSlug?: string;
};

export function CourseCard({ course }: { course: Course }) {
  const href = course.bookSlug ? `/tutorials/${course.bookSlug}` : `/tutorial/${course.slug}`;

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl hover:shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20"
    >
      <div className={`h-2 bg-gradient-to-r ${course.color}`} />
      <div className="p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-600">{course.category}</p>
            <h3 className="mt-2 text-xl font-black tracking-tight">{course.title}</h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {course.level}
          </span>
        </div>
        <p className="min-h-[72px] text-sm leading-6 text-slate-600 dark:text-slate-300">{course.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {course.chapters.map((chapter) => (
            <span
              key={chapter}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400"
            >
              {chapter}
            </span>
          ))}
        </div>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
            <span>{course.lessons} lessons</span>
            <span>{course.progress}% complete</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
            <div className={`h-2 rounded-full bg-gradient-to-r ${course.color}`} style={{ width: `${course.progress}%` }} />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
            {course.certificate ? <CheckCircle2 className="size-4 text-leaf" /> : <BookOpen className="size-4" />}
            Certificate
          </span>
          <Link href={href} className="inline-flex items-center gap-2 text-sm font-black text-brand-700 dark:text-cyan-300">
            Open <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
