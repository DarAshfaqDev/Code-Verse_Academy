import { BadgeCheck, BookPlus, Download, FileCheck2, PieChart, QrCode, ShieldCheck, Users } from "lucide-react";
import { LearningChart } from "@/components/charts";
import { Section } from "@/components/section";
import { adminMetrics, courses } from "@/lib/data";
import { certificateTemplates } from "@/lib/certificates";

export default function AdminPage() {
  return (
    <Section eyebrow="Admin panel" title="Manage courses, sheets, quizzes and certificates" copy="Upload lessons, organize sections, manage users, check analytics, publish mock tests and issue certificates.">
      <div className="grid gap-5 md:grid-cols-4">
        {[
          ...adminMetrics,
          { label: "Certificates issued", value: "1,284", change: "+14%" },
          { label: "Certificate downloads", value: "3,916", change: "+31%" },
          { label: "Verification scans", value: "842", change: "+19%" },
          { label: "Active templates", value: String(certificateTemplates.length), change: "Live" }
        ].slice(0, 8).map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-bold text-slate-500">{metric.label}</p>
            <p className="mt-2 text-3xl font-black">{metric.value}</p>
            <p className="mt-1 text-sm font-black text-leaf">{metric.change}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-black">Enrollment analytics</h3>
            <PieChart className="size-5 text-brand-600" />
          </div>
          <LearningChart />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-black">Operations</h3>
          <div className="mt-5 grid gap-3">
            {[
              ["Upload lesson", BookPlus],
              ["Manage users", Users],
              ["Practice sheet management", FileCheck2],
              ["Certificate management", BadgeCheck],
              ["Template management", ShieldCheck],
              ["Verification records", QrCode],
              ["Download logs", Download]
            ].map(([label, Icon]) => (
              <button key={label as string} className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-left font-black transition hover:bg-cyan-50 dark:bg-slate-950 dark:hover:bg-slate-800">
                <Icon className="size-5 text-brand-600" /> {label as string}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-xl font-black">Course inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-3">Course</th>
                <th>Category</th>
                <th>Lessons</th>
                <th>Progress Avg.</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {courses.slice(0, 6).map((course) => (
                <tr key={course.slug}>
                  <td className="py-3 font-black">{course.title}</td>
                  <td>{course.category}</td>
                  <td>{course.lessons}</td>
                  <td>{course.progress}%</td>
                  <td><span className="rounded-full bg-leaf/10 px-3 py-1 text-xs font-black text-leaf">Published</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
