import Link from "next/link";
import { Lock, Mail, User } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="grid min-h-[calc(100svh-4rem)] place-items-center px-4 py-12 sm:px-6">
      <form className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-600">Create account</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Start your learning profile.</h1>
        {[
          ["Full name", "Kamraan Ali", User, "text"],
          ["Email", "student@codeverse.dev", Mail, "email"],
          ["Password", "Minimum 8 characters", Lock, "password"]
        ].map(([label, placeholder, Icon, type]) => (
          <label key={label as string} className="mt-5 block text-sm font-bold">
            {label as string}
            <span className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 dark:border-slate-800">
              <Icon className="size-4 text-slate-400" />
              <input className="w-full bg-transparent outline-none" placeholder={placeholder as string} type={type as string} />
            </span>
          </label>
        ))}
        <button className="mt-6 w-full rounded-xl bg-ink px-5 py-3 font-black text-white dark:bg-white dark:text-ink">Create account</button>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link className="font-black text-brand-700 dark:text-cyan-300" href="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
