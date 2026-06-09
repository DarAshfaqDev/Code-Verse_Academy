"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

interface SQLSandboxProps {
  initialQuery?: string;
  onSave?: (query: string) => void;
  isSaving?: boolean;
}

export default function SQLSandbox({
  initialQuery = "SELECT name, role, department FROM employees WHERE department = 'Data Science';",
  onSave,
  isSaving = false,
}: SQLSandboxProps) {
  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<{ columns: string[]; values: any[][] }[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dbRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/sql-wasm.js";
    script.async = true;
    script.onload = async () => {
      try {
        const initSqlJs = (window as any).initSqlJs;
        const SQL = await initSqlJs({
          locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/${file}`,
        });
        
        const db = new SQL.Database();
        
        // Seed database with mock operational data matching learner profiles
        db.run(`
          CREATE TABLE employees (id INT, name TEXT, role TEXT, department TEXT);
          INSERT INTO employees VALUES (1, 'Aarav Mehta', 'Senior Software Engineer', 'Engineering');
          INSERT INTO employees VALUES (2, 'Naina Kapoor', 'Data and AI Mentor', 'Data Science');
          INSERT INTO employees VALUES (3, 'Ishfaq Dar', 'Junior Data Analyst', 'Data Science');
        `);
        
        dbRef.current = db;
        setIsLoading(false);
      } catch (err) {
        setErrorMsg("Failed to initialize database layer.");
        console.error(err);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const runQuery = () => {
    if (!dbRef.current) return;
    setErrorMsg(null);
    setResults(null);

    try {
      const res = dbRef.current.exec(query);
      if (res.length === 0) {
        setErrorMsg("Query executed successfully, but returned 0 rows.");
      } else {
        setResults(res);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-lg border border-neutral-800 bg-neutral-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900">
        <span className="text-sm font-medium text-neutral-200">SQLite In-Memory Engine</span>
        <div className="flex items-center gap-2">
          {onSave && (
            <button
              onClick={() => onSave(query)}
              disabled={isSaving || isLoading}
              className="px-3 py-1 text-xs font-medium rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            >
              {isSaving ? "Saving..." : "Save Query"}
            </button>
          )}
          <button
            onClick={runQuery}
            disabled={isLoading}
            className="px-4 py-1 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-500 disabled:bg-neutral-800"
          >
            {isLoading ? "Booting DB..." : "Execute SQL"}
          </button>
        </div>
      </div>

      <div className="flex flex-col h-[550px]">
        {/* Editor Block */}
        <div className="h-1/2 border-b border-neutral-800">
          <Editor
            height="100%"
            defaultLanguage="sql"
            theme="vs-dark"
            value={query}
            onChange={(val) => setQuery(val || "")}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>

        {/* Dynamic Data Result Tables Panel */}
        <div className="h-1/2 bg-neutral-950 p-4 overflow-auto">
          <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Query Results</div>
          
          {errorMsg && <div className="text-sm text-red-400 font-mono">{errorMsg}</div>}
          
          {results && results.map((target, idx) => (
            <div key={idx} className="overflow-x-auto border border-neutral-800 rounded">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-900 border-b border-neutral-800 text-neutral-300">
                    {target.columns.map((col, cIdx) => (
                      <th key={cIdx} className="p-2 border-r border-neutral-800 font-bold">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {target.values.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-neutral-900 text-neutral-400 hover:bg-neutral-900/50">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="p-2 border-r border-neutral-900">{String(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {!results && !errorMsg && (
            <div className="text-sm text-neutral-600 italic">No query output available. Run a SELECT string above.</div>
          )}
        </div>
      </div>
    </div>
  );
}