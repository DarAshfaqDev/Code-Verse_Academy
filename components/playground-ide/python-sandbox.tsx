"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react"; // Matches your Monaco tech stack

interface PythonSandboxProps {
  initialCode?: string;
  onSave?: (code: string) => void;
  isSaving?: boolean;
}

export default function PythonSandbox({ 
  initialCode = 'import pandas as pd\n\ndata = {"Name": ["Aarav", "Naina"], "Role": ["Data Analyst", "AI Mentor"]}\ndf = pd.DataFrame(data)\nprint("Welcome to CodeVerse Academy!")\nprint(df)', 
  onSave,
  isSaving = false 
}: PythonSandboxProps) {
  const [code, setCode] = useState<string>(initialCode);
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    // Load Pyodide script dynamically into DOM
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
    script.async = true;
    script.onload = async () => {
      try {
        // Initialize Pyodide engine
        const pyodide = await (window as any).loadPyodide();
        // Pre-load common data libraries (Pandas/Numpy)
        await pyodide.loadPackage(["pandas", "numpy"]);
        pyodideRef.current = pyodide;
        setIsLoading(false);
        setOutput("🐍 Python runtime ready. Write your code and click Run!");
      } catch (err) {
        setOutput("Failed to load Python environment.");
        console.error(err);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const runPythonCode = async () => {
    if (!pyodideRef.current) return;
    setOutput("Executing...");

    try {
      // Redirect python stdout printing to a JS interceptor function
      pyodideRef.current.runPython(`
        import sys
        import io
        sys.stdout = io.StringIO()
      `);

      // Run user code
      await pyodideRef.current.runPythonAsync(code);

      // Extract stdout results
      const stdout = pyodideRef.current.runPython("sys.stdout.getvalue()");
      setOutput(stdout || "Code ran successfully with no visual output.");
    } catch (error: any) {
      setOutput(`Syntax/Runtime Error:\n${error.message}`);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-lg border border-neutral-800 bg-neutral-950 overflow-hidden">
      {/* Workspace Header toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900">
        <span className="text-sm font-medium text-neutral-200">Python 3.x (WebAssembly Sandbox)</span>
        <div className="flex items-center gap-2">
          {onSave && (
            <button
              onClick={() => onSave(code)}
              disabled={isSaving || isLoading}
              className="px-3 py-1 text-xs font-medium rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Code"}
            </button>
          )}
          <button
            onClick={runPythonCode}
            disabled={isLoading}
            className="px-4 py-1 text-xs font-semibold text-white bg-teal-600 rounded hover:bg-teal-500 disabled:bg-neutral-800 disabled:text-neutral-500"
          >
            {isLoading ? "Loading Engine..." : "Run Code"}
          </button>
        </div>
      </div>

      {/* Editor & Console Terminal Display */}
      <div className="flex flex-col md:flex-row flex-1 h-[500px]">
        <div className="w-full md:w-2/3 border-b md:border-b-0 md:border-r border-neutral-800">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              automaticLayout: true,
            }}
          />
        </div>
        <div className="w-full md:w-1/3 bg-black p-4 font-mono text-sm text-green-400 overflow-y-auto whitespace-pre-wrap">
          <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Terminal Output</div>
          {output}
        </div>
      </div>
    </div>
  );
}