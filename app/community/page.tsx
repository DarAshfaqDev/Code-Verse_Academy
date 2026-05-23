import { MessageSquare, Users } from "lucide-react";
import { Section } from "@/components/section";

export default function CommunityPage() {
  return (
    <Section eyebrow="Community" title="Ask doubts and learn with other students" copy="Discussion rooms help learners share notes, ask course questions, find project partners and prepare for interviews together.">
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <Users className="mb-5 size-8 text-brand-600" />
          <p className="text-4xl font-black">48,210</p>
          <p className="text-sm font-bold text-slate-500">community members</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-black">Active discussions</h3>
          {["How should I start DSA from zero?", "Best way to revise DBMS before interviews?", "How do I structure a full-stack portfolio?", "ML project ideas with small datasets"].map((topic) => (
            <div key={topic} className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
              <MessageSquare className="size-5 text-leaf" />
              <span className="font-bold">{topic}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
