import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { mockQuestions } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/_authenticated/_authenticated/assessment/questions")({
  head: () => ({ meta: [{ title: "Pertanyaan Asesmen — Kapable.ai" }, { name: "description", content: "Jawab pertanyaan asesmen satu per satu." }] }),
  component: QuestionsPage,
});

function QuestionsPage() {
  const nav = useNavigate();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const q = mockQuestions[idx];
  const total = mockQuestions.length;
  const progress = useMemo(() => ((idx + 1) / total) * 100, [idx, total]);
  const answered = answers[q.id] !== undefined && answers[q.id] !== "";
  const canNext = !q.required || answered;

  function setAnswer(v: string | number) {
    setAnswers({ ...answers, [q.id]: v });
  }

  function next() {
    if (idx < total - 1) setIdx(idx + 1);
    else nav({ to: "/assessment/analyzing" });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" aria-hidden />
      <div className="relative max-w-3xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex items-center justify-between gap-4">
          <Link to="/assessment/criteria" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Kembali</Link>
          <div className="text-xs text-muted-foreground">Pertanyaan {idx + 1} dari {total}</div>
        </div>

        <div className="mt-6 h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div animate={{ width: `${progress}%` }} className="h-full bg-gradient-primary" />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{q.criteria}</span>
          <span>{Math.round(progress)}%</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-soft">
            <div className="text-xs uppercase tracking-widest text-primary">{q.criteria}</div>
            <h2 className="mt-2 text-xl sm:text-2xl font-display font-semibold">{q.question}{q.required && <span className="text-destructive ml-1">*</span>}</h2>

            <div className="mt-8">
              {q.type === "scale" && <ScaleInput value={answers[q.id] as number} onChange={setAnswer} />}
              {q.type === "choice" && <ChoiceInput options={q.options!} value={answers[q.id] as string} onChange={setAnswer} />}
              {q.type === "yesno" && <ChoiceInput options={["Ya", "Tidak"]} value={answers[q.id] as string} onChange={setAnswer} />}
              {q.type === "text" && (
                <textarea rows={4} value={(answers[q.id] as string) || ""} onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Tulis jawabanmu..." className="w-full rounded-xl border border-input bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary disabled:opacity-40">
            <ArrowLeft className="size-4" /> Sebelumnya
          </button>
          <button onClick={next} disabled={!canNext}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-medium px-6 py-2.5 shadow-glow disabled:opacity-40">
            {idx === total - 1 ? <>Selesai <Check className="size-4" /></> : <>Lanjut <ArrowRight className="size-4" /></>}
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">Jawabanmu disimpan otomatis.</div>
      </div>
    </div>
  );
}

function ScaleInput({ value, onChange }: { value?: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => onChange(n)}
            className={`aspect-square rounded-2xl border text-2xl font-bold transition ${value === n ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow scale-105" : "border-border bg-card hover:border-primary/40"}`}>
            {n}
          </button>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
        <span>Sangat tidak setuju</span><span>Sangat setuju</span>
      </div>
    </div>
  );
}

function ChoiceInput({ options, value, onChange }: { options: string[]; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="grid gap-2">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)}
          className={`text-left rounded-xl border p-4 text-sm transition flex items-center justify-between ${value === o ? "border-primary bg-gradient-soft" : "border-border bg-card hover:border-primary/40"}`}>
          <span>{o}</span>
          {value === o && <Check className="size-4 text-primary" />}
        </button>
      ))}
    </div>
  );
}