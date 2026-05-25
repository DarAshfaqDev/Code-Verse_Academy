import { BadgeCheck, Calendar, Fingerprint, ShieldCheck } from "lucide-react";

type VerifyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { id } = await params;
  const isCodeVerseId = /^CV-\d{4}-[A-Z0-9]{4,}$/i.test(id);

  return (
    <main className="grid min-h-[calc(100svh-4rem)] place-items-center bg-slate-950 px-4 py-12 text-white">
      <section className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 shadow-2xl shadow-black/30">
        <div className="flex items-center gap-4">
          <div className={`grid size-16 place-items-center rounded-2xl ${isCodeVerseId ? "bg-emerald-300 text-emerald-950" : "bg-rose-300 text-rose-950"}`}>
            {isCodeVerseId ? <BadgeCheck className="size-9" /> : <ShieldCheck className="size-9" />}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Certificate Verification</p>
            <h1 className="mt-2 text-3xl font-black">{isCodeVerseId ? "Certificate is authentic" : "Certificate not recognized"}</h1>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
            <Fingerprint className="mb-4 size-6 text-cyan-200" />
            <p className="text-sm font-bold text-slate-400">Certificate ID</p>
            <p className="mt-1 break-all font-black">{id}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
            <Calendar className="mb-4 size-6 text-cyan-200" />
            <p className="text-sm font-bold text-slate-400">Verified On</p>
            <p className="mt-1 font-black">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
            <ShieldCheck className="mb-4 size-6 text-cyan-200" />
            <p className="text-sm font-bold text-slate-400">Issuer</p>
            <p className="mt-1 font-black">CodeVerse Academy</p>
          </div>
        </div>

        <p className="mt-8 text-sm leading-6 text-slate-400">
          This demo verification page validates CodeVerse certificate identifiers and can be connected to PostgreSQL, MongoDB, or another certificate registry for production authenticity checks.
        </p>
      </section>
    </main>
  );
}
