import { CourseCard } from "@/components/course-card";
import { Section } from "@/components/section";
import { courses, learningSheets, mockTests, tutorialTracks } from "@/lib/data";

export default function CoursesPage() {
  return (
    <>
      <Section
        eyebrow="Course catalog"
        title="Choose a course and follow the path"
        copy="Courses are split into small sections with lessons, practice questions, quizzes, notes, doubt help, progress tracking and certificates."
      >
        <div className="mb-6 flex flex-wrap gap-2">
          {["All", "DSA", "Web", "Programming", "Interview", "Data", "AI/ML", "Backend"].map((filter) => (
            <button
              key={filter}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-brand-500 hover:text-brand-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Tutorial topics"
        title="Quick topic groups"
        copy="Use these groups when you want short notes instead of a full course."
        className="pt-0"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tutorialTracks.map((track) => {
            const Icon = track.icon;
            return (
              <div key={track.title} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <Icon className="mb-6 size-7 text-brand-600" />
                <h3 className="text-xl font-black">{track.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{track.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {track.topics.slice(0, 4).map((topic) => (
                    <span key={topic} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section
        eyebrow="Practice and revision"
        title="Sheets and mock tests"
        copy="Revise core subjects and check your understanding with small tests."
        className="pt-0"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xl font-black">Learning sheets</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {learningSheets.map((sheet) => (
                <div key={sheet} className="rounded-xl bg-slate-50 p-4 text-sm font-black dark:bg-slate-950">
                  {sheet}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xl font-black">Mock tests</h3>
            <div className="mt-5 space-y-3">
              {mockTests.map((test) => (
                <div key={test.title} className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                  <div>
                    <p className="font-black">{test.title}</p>
                    <p className="text-sm text-slate-500">{test.text}</p>
                  </div>
                  <span className="shrink-0 text-sm font-black text-brand-700 dark:text-cyan-300">{test.questions} Qs</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
