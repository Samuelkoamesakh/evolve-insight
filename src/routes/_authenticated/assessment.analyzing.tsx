import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Brain, LineChart, Wand2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { mockResult } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/assessment/analyzing")({
  head: () => ({ meta: [{ title: "Menganalisis... — Kapable.ai" }, { name: "description", content: "AI sedang menganalisis jawabanmu." }] }),
  component: Analyzing,
});

const steps = [
  { icon: Brain, label: "Membaca konteks jawabanmu" },
  { icon: Wand2, label: "Mengidentifikasi pola kemampuan" },
  { icon: LineChart, label: "Menyusun rekomendasi & roadmap" },
];

function Analyzing() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 900);
    const t2 = setTimeout(() => setStep(2), 1800);
    const t3 = setTimeout(() => setStep(3), 2700);

    let cancelled = false;
    const saveAndGo = async () => {
      try {
        const { data: u } = await supabase.auth.getUser();
        if (!u.user) {
          nav({ to: "/auth" });
          return;
        }
        const goalId = (typeof window !== "undefined" && sessionStorage.getItem("kapable:lastGoalId")) || "career";
        const goal = (typeof window !== "undefined" && sessionStorage.getItem("kapable:lastGoal")) || "Rekomendasi Karier";
        const { data, error } = await supabase
          .from("assessments")
          .insert({
            user_id: u.user.id,
            goal,
            goal_id: goalId,
            score: mockResult.overallScore,
            level: mockResult.level,
            summary: mockResult.summary,
            result: mockResult as any,
          })
          .select("id")
          .single();
        if (error) throw error;
        if (cancelled) return;
        nav({ to: "/report/$id", params: { id: data.id } });
      } catch (err: any) {
        if (cancelled) return;
        toast.error(err?.message ?? "Gagal menyimpan hasil");
        nav({ to: "/dashboard" });
      }
    };
    const t4 = setTimeout(saveAndGo, 3400);
    return () => {
      cancelled = true;
      [t1, t2, t3, t4].forEach(clearTimeout);
    };
  }, [nav]);

  return (
    <div className="min-h-screen bg-background grid place-items-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" aria-hidden />
      <div className="relative text-center max-w-md">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="mx-auto size-24 rounded-full bg-gradient-primary grid place-items-center shadow-glow">
          <Sparkles className="size-10 text-primary-foreground" />
        </motion.div>
        <h1 className="mt-8 text-3xl font-bold tracking-tight">Menganalisis kemampuanmu</h1>
        <p className="mt-2 text-muted-foreground text-sm">AI sedang membaca jawabanmu secara kontekstual. Ini hanya sebentar.</p>

        <div className="mt-10 space-y-3 text-left">
          {steps.map((s, i) => {
            const active = step === i;
            const done = step > i;
            return (
              <div key={i} className={`flex items-center gap-3 rounded-xl border p-3 transition ${done ? "border-success/30 bg-success/5" : active ? "border-primary bg-gradient-soft" : "border-border bg-card opacity-60"}`}>
                <div className={`size-9 rounded-lg grid place-items-center ${done ? "bg-success/15 text-success" : "bg-gradient-primary text-primary-foreground"}`}>
                  {done ? <Check className="size-4" /> : <s.icon className="size-4" />}
                </div>
                <span className="text-sm">{s.label}</span>
                {active && <span className="ml-auto text-xs text-muted-foreground">...</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}