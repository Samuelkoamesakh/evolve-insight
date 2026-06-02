import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { mockResult } from "@/lib/mock-data";
import { Award, Download, Share2, TrendingUp, AlertCircle, Target, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from "recharts";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Hasil Asesmen — Kapable.ai" }, { name: "description", content: "Skor kemampuan, kekuatan, area pengembangan, peran yang direkomendasikan, dan roadmap 30 hari." }] }),
  component: Dashboard,
});

function Dashboard() {
  const r = mockResult;
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-soft px-3 py-1 text-xs"><Sparkles className="size-3 text-primary" /> Hasil terbaru · 2 Juni 2026</div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Profil Kemampuan Kreatif-Analitis</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">{r.summary}</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm hover:bg-secondary"><Share2 className="size-4" /> Bagikan</button>
            <button className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground px-4 py-2 text-sm shadow-glow"><Download className="size-4" /> Unduh PDF</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-border bg-gradient-primary text-primary-foreground p-6 shadow-lift relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)] opacity-20" aria-hidden />
            <div className="relative">
              <div className="text-xs uppercase tracking-widest opacity-80">Overall Capability Score</div>
              <div className="mt-3 flex items-end gap-2">
                <div className="text-7xl font-bold leading-none">{r.overallScore}</div>
                <div className="pb-2 opacity-80">/ 100</div>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 text-sm bg-background/15 rounded-full px-3 py-1"><Award className="size-3.5" /> Level: {r.level}</div>
              <div className="mt-6 h-1.5 rounded-full bg-background/20 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${r.overallScore}%` }} transition={{ duration: 1 }} className="h-full bg-background/80" />
              </div>
              <p className="mt-4 text-sm opacity-90">Lebih tinggi dari 78% pengguna dengan tujuan serupa.</p>
            </div>
          </motion.div>

          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-semibold text-lg">Peta Kemampuan</h2>
                <p className="text-sm text-muted-foreground">Distribusi skor per kriteria.</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={r.radar}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <Card icon={TrendingUp} title="Top Strengths" tone="success">
            <div className="space-y-3 mt-4">
              {r.strengths.map((s) => <ScoreRow key={s.title} title={s.title} score={s.score} note={s.note} tone="success" />)}
            </div>
          </Card>
          <Card icon={AlertCircle} title="Area Pengembangan" tone="warning">
            <div className="space-y-3 mt-4">
              {r.growth.map((s) => <ScoreRow key={s.title} title={s.title} score={s.score} note={s.note} tone="warning" />)}
            </div>
          </Card>
        </div>

        <Card icon={Target} title="Peran yang Direkomendasikan">
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {r.roles.map((role) => (
              <div key={role.name} className="rounded-2xl border border-border bg-secondary/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-display font-semibold">{role.name}</div>
                  <div className="text-sm font-bold text-primary">{role.match}% match</div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{role.why}</p>
                <div className="mt-3 h-1.5 rounded-full bg-background overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: `${role.match}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card icon={Sparkles} title="Skill yang Direkomendasikan untuk Dipelajari">
          <div className="mt-4 flex flex-wrap gap-2">
            {r.skills.map((s) => <span key={s} className="rounded-full bg-gradient-soft border border-border px-3 py-1.5 text-sm">{s}</span>)}
          </div>
        </Card>

        <Card icon={MapPin} title="Action Plan — Roadmap 30 Hari">
          <div className="mt-6 relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-border" aria-hidden />
            <div className="space-y-6">
              {r.roadmap.map((w, i) => (
                <motion.div key={w.week} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="relative pl-12">
                  <div className="absolute left-0 top-1 size-8 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-xs font-bold shadow-glow">{i + 1}</div>
                  <div className="text-xs uppercase tracking-widest text-primary">{w.week}</div>
                  <div className="font-display font-semibold mt-1">{w.title}</div>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {w.items.map((it) => <li key={it} className="flex items-start gap-2"><span className="mt-1.5 size-1 rounded-full bg-primary" /> {it}</li>)}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        <div className="rounded-3xl border border-dashed border-border bg-card/60 p-6 text-sm text-muted-foreground flex flex-wrap items-center justify-between gap-3">
          <div>⚠️ Hasil ini bersifat indikatif. Gunakan sebagai panduan, bukan keputusan mutlak.</div>
          <Link to="/assessment/goal" className="inline-flex items-center gap-2 text-primary font-medium">Asesmen lagi <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </AppShell>
  );
}

function Card({ icon: Icon, title, tone, children }: { icon: React.ElementType; title: string; tone?: "success" | "warning"; children: React.ReactNode }) {
  const toneCls = tone === "success" ? "bg-success/10 text-success" : tone === "warning" ? "bg-warning/15 text-warning" : "bg-gradient-soft text-primary";
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <div className={`size-9 rounded-xl grid place-items-center ${toneCls}`}><Icon className="size-4" /></div>
        <h2 className="font-display font-semibold text-lg">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ScoreRow({ title, score, note, tone }: { title: string; score: number; note: string; tone: "success" | "warning" }) {
  const bar = tone === "success" ? "bg-success" : "bg-warning";
  return (
    <div className="rounded-2xl bg-secondary/40 p-4">
      <div className="flex items-center justify-between">
        <div className="font-medium">{title}</div>
        <div className="text-sm font-bold">{score}</div>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-background overflow-hidden">
        <div className={`h-full ${bar}`} style={{ width: `${score}%` }} />
      </div>
      <p className="text-sm text-muted-foreground mt-2">{note}</p>
    </div>
  );
}