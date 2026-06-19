import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { assessmentGoals } from "@/lib/mock-data";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_authenticated/assessment/goal")({
  head: () => ({ meta: [{ title: "Pilih Tujuan Asesmen — Kapable.ai" }, { name: "description", content: "Pilih tujuan asesmen agar AI menyusun kriteria yang relevan." }] }),
  component: GoalPage,
});

function GoalPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" aria-hidden />
      <div className="relative max-w-5xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Kembali</Link>
          <StepIndicator step={1} total={4} />
        </div>

        <div className="mt-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"><Sparkles className="size-3 text-primary" /> Langkah 1 dari 4</div>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">Apa tujuan asesmenmu?</h1>
          <p className="mt-3 text-muted-foreground">Pilihanmu menentukan kriteria & pertanyaan yang akan dibuat AI.</p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assessmentGoals.map((g) => {
            const active = selected === g.id;
            return (
              <motion.button key={g.id} onClick={() => setSelected(g.id)} whileTap={{ scale: 0.98 }}
                className={`text-left rounded-2xl border p-5 transition relative overflow-hidden ${active ? "border-primary bg-gradient-soft shadow-glow" : "border-border bg-card hover:border-primary/40"}`}>
                <div className={`size-10 rounded-xl bg-gradient-to-br ${g.color} grid place-items-center text-white font-bold`}>{g.title.charAt(0)}</div>
                <h3 className="mt-4 font-display font-semibold">{g.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{g.desc}</p>
                {active && <div className="absolute top-3 right-3 size-2 rounded-full bg-primary" />}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/60 p-5">
          <label htmlFor="custom" className="text-sm font-medium">Tujuan khusus (opsional)</label>
          <p className="text-xs text-muted-foreground mt-1">Ceritakan tujuanmu jika tidak ada pilihan yang cocok.</p>
          <input id="custom" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="cth: ingin pindah dari engineering ke product role"
            className="mt-3 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div className="mt-8 flex justify-between items-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Batal</Link>
          <button
            disabled={!selected && !custom.trim()}
            onClick={() => nav({ to: "/assessment/profile" })}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-medium px-6 py-3 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed">
            Lanjutkan <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all ${i < step ? "bg-gradient-primary w-8" : "bg-border w-4"}`} />
      ))}
      <span className="ml-2 text-xs text-muted-foreground">{step}/{total}</span>
    </div>
  );
}