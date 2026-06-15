"use client";

import { useState } from "react";
import { BadgeCheck, Flame, NotebookText, Trophy, X, Zap } from "lucide-react";
import { LearningChart, SkillChart } from "@/components/charts";
import { Section } from "@/components/section";
import { badges, courses } from "@/lib/data";
import { RevisionCenter } from "@/components/revision/revision-center";
import { getDashboardStats } from "@/lib/stats";
import StreakBoard from "@/components/streak-board/StreakBoard";

function StatCards() {
  const stats = getDashboardStats();
  const streakText = `${stats.streak} ${stats.streak === 1 ? "day" : "days"}`;

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {[
        ["Learning streak", streakText, Flame],
        ["XP points", String(stats.xp), Zap],
        ["Completed lessons", String(stats.completed), BadgeCheck],
        ["Leaderboard", "#42", Trophy]
      ].map(([label, value, Icon]) => (
        <div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <Icon className="mb-5 size-7 text-brand-600" />
          <p className="text-3xl font-black">{value as string}</p>
          <p className="mt-1 text-sm font-bold text-slate-500">{label as string}</p>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [streakOpen, setStreakOpen] = useState(false);

  return (
    <>
      <Section
        eyebrow="Student dashboard"
        title="Your learning dashboard"
        copy="Track lessons, streaks, XP, saved notes, practice sheets, certificates and recently viewed classes in one place."
      >
        <div className="relative">
          <div className="absolute right-0 top-0 z-10">
            <button
              onClick={() => setStreakOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40"
            >
              <Flame className="size-4" />
              Streak
            </button>
          </div>
          <StatCards />
        </div>
        <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 text-xl font-black">Weekly activity</h3>
            <LearningChart />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 text-xl font-black">Skill profile</h3>
            <SkillChart />
          </div>
        </div>
        <div className="mt-6 grid gap-5 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
            <h3 className="mb-4 text-xl font-black">Recently viewed</h3>
            <div className="space-y-3">
              {courses.slice(0, 4).map((course) => (
                <div key={course.slug} className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                  <div>
                    <p className="font-black">{course.title}</p>
                    <p className="text-sm text-slate-500">{course.chapters[0]} lesson</p>
                  </div>
                  <span className="text-sm font-black text-brand-700 dark:text-cyan-300">{course.progress}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 text-xl font-black">Badges</h3>
            <div className="space-y-3">
              {badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.label} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                    <Icon className="size-5 text-leaf" />
                    <span className="font-bold">{badge.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
              <NotebookText className="mb-3 size-5 text-brand-600" />
              <p className="font-black">Saved note</p>
              <p className="mt-1 text-sm text-slate-500">Normalize SQL tables before adding analytics joins.</p>
            </div>
          </div>
        </div>
        <RevisionCenter />
      </Section>

      {streakOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm pt-12 pb-12">
          <div className="relative w-full max-w-3xl animate-in fade-in zoom-in-95 duration-200">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Flame className="size-5 text-orange-500" />
                  <h2 className="text-lg font-black">Streak & Leaderboard</h2>
                </div>
                <button
                  onClick={() => setStreakOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="p-6">
                <StreakBoard />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
