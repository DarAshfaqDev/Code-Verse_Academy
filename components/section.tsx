"use client";

import { motion } from "framer-motion";

export function Section({
  eyebrow,
  title,
  copy,
  children,
  className = ""
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`px-4 py-14 sm:px-6 lg:py-20 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.5 }}
          className="mb-8 max-w-3xl"
        >
          {eyebrow ? (
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-brand-600">{eyebrow}</p>
          ) : null}
          <h2 className="text-3xl font-black tracking-tight text-ink dark:text-white sm:text-4xl">{title}</h2>
          {copy ? <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{copy}</p> : null}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
