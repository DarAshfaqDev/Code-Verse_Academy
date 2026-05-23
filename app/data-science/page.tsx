import { BarChart3, Database, FileSpreadsheet, LineChart, PieChart } from "lucide-react";
import { LearningChart } from "@/components/charts";
import { Section } from "@/components/section";

export default function DataSciencePage() {
  const topics = ["Python tutorials", "Pandas", "NumPy", "Matplotlib", "Power BI", "SQL practice"];
  const datasets = ["Retail orders", "Student outcomes", "SaaS churn", "Marketing spend"];
  return (
    <Section eyebrow="Data science" title="Analyze real datasets from notebook to dashboard" copy="Practice Python, SQL, visualization and dashboard thinking with guided datasets and interpretation prompts.">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <BarChart3 className="mb-5 size-8 text-brand-600" />
          <h3 className="text-2xl font-black">Data visualization dashboard</h3>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Explore trends, clean missing values, chart metrics and explain findings.</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {topics.map((topic) => (
              <div key={topic} className="rounded-xl bg-slate-50 p-3 text-sm font-bold dark:bg-slate-950">{topic}</div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-xl font-black">Notebook activity</h3>
          <LearningChart />
        </div>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-4">
        {datasets.map((dataset, index) => {
          const Icon = [Database, FileSpreadsheet, LineChart, PieChart][index];
          return (
            <div key={dataset} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <Icon className="mb-8 size-7 text-leaf" />
              <p className="font-black">{dataset}</p>
              <p className="mt-1 text-sm text-slate-500">Sample CSV + guided questions</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
