"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Mail, Sparkles, Code2, Zap, Flame } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (res: { credential: string }) => void }) => void;
          renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

type Props = {
  nextPath: string;
};

function doLogin(token: string, user: { name: string; email: string; role: string }, router: ReturnType<typeof useRouter>, nextPath: string) {
  window.localStorage.setItem("codeverse-token", token);
  window.localStorage.setItem("codeverse-user", JSON.stringify(user));
  window.dispatchEvent(new Event("codeverse-auth"));
  fetch("/api/auth/streak", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }).catch(() => {});
  router.push(nextPath);
  router.refresh();
}

function MatrixRain({ className = "" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>/{}[]|&^%$#@!";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array.from({ length: columns }, () => Math.random() * -100);

    function draw() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "rgba(5, 5, 20, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#22d3ee";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillStyle = Math.random() > 0.97 ? "#67e8f9" : "#22d3ee";
        ctx.globalAlpha = Math.max(0.1, 1 - (y / canvas.height) * 0.8);
        ctx.fillText(char, x, y);
        ctx.globalAlpha = 1;
        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.5;
      }
      requestAnimationFrame(draw);
    }

    const anim = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(anim);
  }, []);

  return <canvas ref={canvasRef} className={`absolute inset-0 ${className}`} />;
}

function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px]" />
    </div>
  );
}

function CodeSnippet() {
  const lines = [
    { text: "import { learn } from 'codeverse'", color: "text-cyan-300" },
    { text: "", color: "" },
    { text: "const user = await auth.signIn({", color: "text-slate-300" },
    { text: "  email: 'student@codeverse.dev',", color: "text-emerald-300" },
    { text: "  password: '••••••••'", color: "text-emerald-300" },
    { text: "})", color: "text-slate-300" },
    { text: "", color: "" },
    { text: "// Welcome back! Streak: 12 days 🔥", color: "text-slate-500" },
    { text: "const dashboard = await user.resume()", color: "text-cyan-300" },
  ];

  return (
    <div className="font-mono text-xs leading-6 space-y-0.5">
      {lines.map((line, i) => (
        <div key={i} className={`${line.color} ${line.text.startsWith("//") ? "italic" : ""}`}>
          <span className="text-slate-600 mr-3 select-none">{String(i + 1).padStart(2, "0")}</span>
          {line.text || <span className="text-slate-600">{" ".repeat(42)}</span>}
        </div>
      ))}
    </div>
  );
}

function LoginFormInner({ nextPath }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [streakData, setStreakData] = useState<{ currentStreak: number; longestStreak: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const token = window.localStorage.getItem("codeverse-token");
    if (token) {
      fetch("/api/auth/streak", { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((d) => {
          if (d && typeof d.currentStreak === "number") setStreakData(d);
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !googleBtnRef.current || !mounted) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredential,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current!, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text: "continue_with",
          width: googleBtnRef.current?.clientWidth || 300,
        });
      }
    };
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, [mounted]);

  const handleGoogleCredential = useCallback(async (response: { credential: string }) => {
    if (!response.credential) return;
    setGoogleLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Google sign-in failed.");
      }

      doLogin(data.token, data.user, router, nextPath);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  }, [router, nextPath]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Please try again.");
      }

      doLogin(data.token, data.user, router, nextPath);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return <div className="min-h-screen bg-[#050514]" />;
  }

  return (
    <div className="relative min-h-screen bg-[#050514] overflow-hidden">
      <MatrixRain className="opacity-40" />
      <AnimatedGrid />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Left Brand Panel */}
        <div className="relative flex flex-col justify-between lg:w-1/2 p-8 lg:p-12 xl:p-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/25">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">CodeVerse<span className="text-cyan-400">.</span></span>
          </div>

          <div className="hidden lg:block max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-cyan-300 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Learning Platform
            </div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Build skills<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">ship real projects</span>
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-400 max-w-md">
              Interactive lessons, AI labs, coding playgrounds, and structured practice paths — all in one focused workspace.
            </p>
            <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-sm">
              <CodeSnippet />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm text-slate-500">
            <span>© 2026 CodeVerse</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              128K learners
            </span>
          </div>
        </div>

        {/* Right Auth Panel */}
        <div className="relative flex items-center justify-center lg:w-1/2 p-6 lg:p-12">
          {/* Streak card - floating above form */}
          <div className={`absolute top-8 right-8 lg:top-12 lg:right-12 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl px-5 py-4 shadow-2xl shadow-black/30">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-rose-500/20 border border-orange-500/20">
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{streakData ? `${streakData.currentStreak}` : "—"}</p>
                  <p className="text-xs text-slate-500">day streak</p>
                </div>
                <div className="ml-3 pl-3 border-l border-white/10">
                  <p className="text-sm font-bold text-slate-300">Best</p>
                  <p className="text-lg font-black text-cyan-300">{streakData ? `${streakData.longestStreak}` : "—"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`w-full max-w-md transition-all duration-700 delay-150 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-2xl shadow-black/40 p-8 lg:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-white">Welcome back</h2>
                <p className="mt-2 text-sm text-slate-400">Sign in to continue your learning journey.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1.5">Email</label>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 focus-within:border-cyan-400/50 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.08)] transition-all duration-300">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      className="w-full bg-transparent text-white outline-none text-sm placeholder:text-slate-600"
                      placeholder="student@codeverse.dev"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1.5">Password</label>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 focus-within:border-cyan-400/50 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.08)] transition-all duration-300">
                    <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      className="w-full bg-transparent text-white outline-none text-sm placeholder:text-slate-600"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="rounded-lg p-1 text-slate-500 hover:text-slate-300 transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error ? (
                  <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                    {error}
                  </p>
                ) : null}

                <button
                  className="relative w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-black text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                  <div className="relative flex justify-center"><span className="bg-[#050514] px-3 text-xs text-slate-500 uppercase">or continue with</span></div>
                </div>

                <div className="flex justify-center min-h-[44px]">
                  {googleLoading ? (
                    <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin" /> Connecting...
                    </div>
                  ) : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                    <div ref={googleBtnRef} className="w-full flex justify-center"></div>
                  ) : (
                    <p className="text-xs text-slate-600">Google sign-in not configured</p>
                  )}
                </div>
              </form>

              <p className="mt-8 text-center text-sm text-slate-500">
                New to CodeVerse?{" "}
                <Link className="font-bold text-cyan-400 hover:text-cyan-300 transition" href="/register">
                  Create account
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile footer */}
          <div className="absolute bottom-6 left-6 right-6 flex lg:hidden items-center justify-between text-xs text-slate-600">
            <span>© 2026 CodeVerse</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              128K learners
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginForm({ nextPath }: Props) {
  return <LoginFormInner nextPath={nextPath} />;
}
