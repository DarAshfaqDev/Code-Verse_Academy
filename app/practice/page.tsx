import { Code2, Database, FileQuestion, Flame } from "lucide-react";
import { Section } from "@/components/section";
import { challenges } from "@/lib/data";

export default function PracticePage() {
  return (
    <Section eyebrow="Practice platform" title="Practice sheets, mock tests and daily problems" copy="Solve DSA questions, CS core MCQs, SQL tasks, aptitude sets and small coding challenges before interviews.">
      <div className="grid gap-5 md:grid-cols-4">
        {[
          ["MCQs", "320", FileQuestion],
          ["DSA problems", "260", Code2],
          ["SQL labs", "96", Database],
          ["Daily streak", "21", Flame]
        ].map(([label, value, Icon]) => (
          <div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <Icon className="mb-6 size-7 text-brand-600" />
            <p className="text-3xl font-black">{value as string}</p>
            <p className="text-sm font-bold text-slate-500">{label as string}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-xl font-black">Challenge queue</h3>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {challenges.map((challenge) => (
            <div key={challenge.title} className="grid gap-3 py-4 md:grid-cols-[1fr_120px_120px_100px] md:items-center">
              <p className="font-black">{challenge.title}</p>
              <span className="text-sm font-bold text-slate-500">{challenge.type}</span>
              <span className="text-sm font-bold text-slate-500">{challenge.difficulty}</span>
              <span className="font-black text-brand-700 dark:text-cyan-300">{challenge.points} XP</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
