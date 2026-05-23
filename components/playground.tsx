"use client";

import dynamic from "next/dynamic";
import { RotateCcw, Play, Terminal, Palette } from "lucide-react";
import { useMemo, useState } from "react";
import { useTheme } from "@/components/theme-provider";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm text-slate-500">Loading editor...</div>
});

const starter = `<!doctype html>
<html>
  <head>
    <style>
      body { font-family: Inter, sans-serif; background: #ecfeff; padding: 32px; }
      .badge { color: #0e7490; font-weight: 800; }
      button { border: 0; border-radius: 12px; padding: 12px 18px; background: #101828; color: white; }
    </style>
  </head>
  <body>
    <p class="badge">CodeVerse Playground</p>
    <h1>Build, run, learn.</h1>
    <button onclick="console.log('Great work!')">Run idea</button>
  </body>
</html>`;

export function Playground() {
  const [code, setCode] = useState(starter);
  const [output, setOutput] = useState(starter);
  const [consoleLines, setConsoleLines] = useState(["Ready. Click Run to render your code."]);
  const [language, setLanguage] = useState("html");
  const { theme, toggleTheme } = useTheme();

  const preview = useMemo(() => {
    if (language === "python") {
      return `<pre style="font: 15px/1.6 ui-monospace; padding: 24px">Simulated Python output\n\n${code
        .split("\n")
        .slice(0, 6)
        .join("\n")}\n\nResult: analysis pipeline completed.</pre>`;
    }
    if (language === "sql") {
      return `<table style="font-family: Inter, sans-serif; border-collapse: collapse; margin: 24px; width: calc(100% - 48px)"><tr><th style="text-align:left;border-bottom:1px solid #ddd;padding:10px">course</th><th style="text-align:left;border-bottom:1px solid #ddd;padding:10px">learners</th></tr><tr><td style="padding:10px">SQL Practice Lab</td><td style="padding:10px">24,820</td></tr><tr><td style="padding:10px">Python Data Analysis</td><td style="padding:10px">31,440</td></tr></table>`;
    }
    return output;
  }, [code, language, output]);

  function runCode() {
    setOutput(code);
    setConsoleLines([
      `Running ${language.toUpperCase()} workspace...`,
      language === "html" ? "Rendered preview successfully." : "Simulated runtime completed.",
      "No errors found."
    ]);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex flex-wrap gap-2">
          {["html", "python", "sql"].map((item) => (
            <button
              key={item}
              onClick={() => setLanguage(item)}
              className={`rounded-lg px-3 py-2 text-sm font-black uppercase transition ${
                language === item ? "bg-ink text-white dark:bg-white dark:text-ink" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold dark:border-slate-700"
          >
            <Palette className="size-4" /> {theme}
          </button>
          <button
            onClick={() => {
              setCode(starter);
              setOutput(starter);
              setConsoleLines(["Editor reset."]);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold dark:border-slate-700"
          >
            <RotateCcw className="size-4" /> Reset
          </button>
          <button onClick={runCode} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-black text-white">
            <Play className="size-4" /> Run
          </button>
        </div>
      </div>
      <div className="grid min-h-[620px] lg:grid-cols-2">
        <div className="min-h-[420px] border-b border-slate-200 dark:border-slate-800 lg:border-b-0 lg:border-r">
          <MonacoEditor
            height="100%"
            language={language === "html" ? "html" : language}
            theme={theme === "dark" ? "vs-dark" : "light"}
            value={code}
            onChange={(value) => setCode(value ?? "")}
            options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: "on", padding: { top: 16 } }}
          />
        </div>
        <div className="grid grid-rows-[1fr_180px]">
          <iframe title="Live output" className="h-full w-full bg-white" srcDoc={preview} sandbox="allow-scripts" />
          <div className="border-t border-slate-200 bg-slate-950 p-4 font-mono text-sm text-slate-200 dark:border-slate-800">
            <div className="mb-2 flex items-center gap-2 text-cyan-200">
              <Terminal className="size-4" /> Console
            </div>
            {consoleLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
