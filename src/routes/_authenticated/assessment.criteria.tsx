import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Sparkles, Check } from "lucide-react";
import { StepIndicator } from "./assessment.goal";
import { mockCriteria } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/assessment/criteria")({
  head: () => ({ meta: [{ title: "Kriteria AI — Kapable.ai" }, { name: "description", content: "Pratinjau kriteria asesmen yang dihasilkan AI." }] }),
  component: CriteriaPage,
});

function CriteriaPage() {
  const nav = useNavigate();
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" aria-hidden />
      <div className="relative max-w-4xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex items-center justify-between">
          <Link to="/assessment/profile" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Kembali</Link>
          <StepIndicator step={3} total={4} />
        </div>
        <div className="mt-10 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow"><Sparkles className="size-5 text-primary-foreground" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Kriteria yang akan diukur</h1>
            <p className="text-sm text-muted-foreground">Disusun AI berdasarkan tujuan & profilmu. Total {mockCriteria.length} kriteria · {mockCriteria.length * 2}+ pertanyaan.</p>
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {mockCriteria.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-border bg-card p-5 hover:shadow-elegant transition">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display font-semibold">{c.name}</h3>
                <span className="text-xs rounded-full bg-secondary px-2 py-1 text-muted-foreground">{2 + (i % 2)} pertanyaan</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        {!done && (
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2 rounded-full bg-primary animate-pulse" /> AI sedang menyusun pertanyaan...
          </div>
        )}
        {done && (
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-success"><Check className="size-4" /> Pertanyaan siap.</div>
        )}

        <div className="mt-8 flex justify-between items-center">
          <Link to="/assessment/profile" className="text-sm text-muted-foreground hover:text-foreground">Edit profil</Link>
          <button disabled={!done} onClick={() => nav({ to: "/assessment/questions" })}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-medium px-6 py-3 shadow-glow disabled:opacity-50">
            Mulai menjawab <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}