import { BadgeCheck, CalendarDays, Mail, MapPin } from "lucide-react";
import { Section } from "@/components/section";
import { badges } from "@/lib/data";

export default function ProfilePage() {
  return (
    <Section eyebrow="Profile" title="Student identity and achievements" copy="A clean profile surface for public proof, certificates, saved tracks and preferences.">
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid size-24 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-leaf text-3xl font-black text-white">KA</div>
          <h2 className="mt-5 text-2xl font-black">Kamraan Ali</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-500">
            <p className="flex items-center gap-2"><Mail className="size-4" /> kamraan@codeverse.dev</p>
            <p className="flex items-center gap-2"><MapPin className="size-4" /> Remote learner</p>
            <p className="flex items-center gap-2"><CalendarDays className="size-4" /> Joined May 2026</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-black">Achievements</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                  <Icon className="size-5 text-leaf" />
                  <span className="font-bold">{badge.label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950/30">
            <BadgeCheck className="mb-3 size-5 text-brand-600" />
            <p className="font-black">React Product Engineering certificate in progress</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">7 lessons left before final assessment.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
