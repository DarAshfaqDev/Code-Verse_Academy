import { BrainCircuit, Cpu, Network, PlayCircle } from "lucide-react";
import { Section } from "@/components/section";
import { roadmap } from "@/lib/data";

export default function AIMLPage() {
  return (
    <Section eyebrow="AI and machine learning" title="Learn AI by watching models think" copy="Roadmaps, model demos, neural network animations and project showcases for practical ML confidence.">
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <BrainCircuit className="mb-5 size-9 text-brand-600" />
          <h3 className="text-2xl font-black">AI roadmap</h3>
          <div className="mt-6 space-y-3">
            {roadmap.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <span className="grid size-8 place-items-center rounded-full bg-ink text-sm font-black text-white dark:bg-white dark:text-ink">{index + 1}</span>
                <span className="font-bold">{step}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Model training simulator</p>
              <h3 className="mt-2 text-3xl font-black">Classification accuracy</h3>
            </div>
            <PlayCircle className="size-10 text-leaf" />
          </div>
          <div className="mt-10 grid gap-3">
            {[92, 78, 64, 47, 31].map((width, index) => (
              <div key={width} className="rounded-full bg-white/10 p-1">
                <div className="rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-3 py-2 text-xs font-black" style={{ width: `${width}%` }}>
                  Layer {index + 1}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-4">
              <Cpu className="mb-4 size-6 text-cyan-200" />
              <p className="text-3xl font-black">0.94</p>
              <p className="text-sm text-slate-300">validation accuracy</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <Network className="mb-4 size-6 text-cyan-200" />
              <p className="text-3xl font-black">12</p>
              <p className="text-sm text-slate-300">training epochs</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
