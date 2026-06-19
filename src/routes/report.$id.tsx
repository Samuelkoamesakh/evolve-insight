import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { mockHistory, mockResult } from "@/lib/mock-data";
import {
  Award, Download, Share2, TrendingUp, AlertCircle, Target, MapPin, Sparkles,
  ArrowLeft, BookOpen, Loader2,
} from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis,
} from "recharts";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

export const Route = createFileRoute("/report/$id")({
  head: () => ({
    meta: [
      { title: "Capability Report — Kapable.ai" },
      { name: "description", content: "Laporan kemampuan lengkap: skor, kekuatan, kelemahan, jalur karier & belajar, serta roadmap 30 hari." },
    ],
  }),
  component: ReportPage,
  notFoundComponent: () => (
    <AppShell>
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Laporan tidak ditemukan</h1>
        <Link to="/history" className="mt-4 inline-block text-primary">Kembali ke riwayat</Link>
      </div>
    </AppShell>
  ),
});

function ReportPage() {
  const { id } = useParams({ from: "/report/$id" });
  const entry = mockHistory.find((h) => h.id === id) ?? mockHistory[0];
  const r = mockResult;
  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const learningPaths = [
    { title: "Design Thinking Foundations", provider: "Coursera", hours: 12, level: "Beginner" },
    { title: "Public Speaking Mastery", provider: "Udemy", hours: 8, level: "Intermediate" },
    { title: "Product Leadership", provider: "Reforge", hours: 20, level: "Advanced" },
    { title: "Prompt Engineering for Pros", provider: "DeepLearning.AI", hours: 6, level: "Intermediate" },
  ];

  async function handleDownload() {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: getComputedStyle(document.body).backgroundColor || "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`kapable-report-${entry.id}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Gagal mengunduh laporan. Coba lagi.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top bar */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <Link to="/history" className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="size-3.5" /> Kembali ke riwayat
            </Link>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-soft px-3 py-1 text-xs">
              <Sparkles className="size-3 text-primary" /> Capability Report · {entry.date}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 sm:px-4 py-2 text-sm hover:bg-secondary">
              <Share2 className="size-4" /> <span className="hidden sm:inline">Bagikan</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground px-3 sm:px-4 py-2 text-sm shadow-glow disabled:opacity-70"
            >
              {downloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              {downloading ? "Menyiapkan..." : "Download Report (PDF)"}
            </button>
          </div>
        </div>

        <div ref={reportRef} className="space-y-6 bg-background">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Profil Kemampuan — {entry.goal}</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl text-sm sm:text-base">{r.summary}</p>
          </div>

          {/* Score + Radar */}
          <div className="grid lg:grid-cols-3 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-border bg-gradient-primary text-primary-foreground p-6 shadow-lift relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)] opacity-20" aria-hidden />
              <div className="relative">
                <div className="text-xs uppercase tracking-widest opacity-80">Overall Capability Score</div>
                <div className="mt-3 flex items-end gap-2">
                  <div className="text-6xl sm:text-7xl font-bold leading-none">{r.overallScore}</div>
                  <div className="pb-2 opacity-80">/ 100</div>
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-sm bg-background/15 rounded-full px-3 py-1">
                  <Award className="size-3.5" /> Level: {r.level}
                </div>
                <div className="mt-6 h-1.5 rounded-full bg-background/20 overflow-hidden">
                  <div className="h-full bg-background/80" style={{ width: `${r.overallScore}%` }} />
                </div>
                <p className="mt-4 text-sm opacity-90">Lebih tinggi dari 78% pengguna dengan tujuan serupa.</p>
              </div>
            </motion.div>

            <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display font-semibold text-lg">Peta Kemampuan</h2>
              <p className="text-sm text-muted-foreground">Distribusi skor per kriteria.</p>
              <div className="h-72 mt-2">
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

          {/* Strengths + Weaknesses */}
          <div className="grid lg:grid-cols-2 gap-5">
            <SectionCard icon={TrendingUp} title="Strength Analysis" tone="success">
              <div className="space-y-3 mt-4">
                {r.strengths.map((s) => <ScoreRow key={s.title} title={s.title} score={s.score} note={s.note} tone="success" />)}
              </div>
            </SectionCard>
            <SectionCard icon={AlertCircle} title="Weakness Analysis" tone="warning">
              <div className="space-y-3 mt-4">
                {r.growth.map((s) => <ScoreRow key={s.title} title={s.title} score={s.score} note={s.note} tone="warning" />)}
              </div>
            </SectionCard>
          </div>

          {/* Career paths */}
          <SectionCard icon={Target} title="Recommended Career Paths">
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {r.roles.map((role) => (
                <div key={role.name} className="rounded-2xl border border-border bg-secondary/40 p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <div className="font-display font-semibold truncate">{role.name}</div>
                    <div className="text-sm font-bold text-primary shrink-0">{role.match}% match</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{role.why}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-background overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${role.match}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Learning paths */}
          <SectionCard icon={BookOpen} title="Recommended Learning Paths">
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {learningPaths.map((l) => (
                <div key={l.title} className="rounded-2xl border border-border bg-card p-4 hover:shadow-soft transition">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-gradient-soft grid place-items-center text-primary shrink-0">
                      <BookOpen className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{l.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{l.provider} · {l.hours} jam</div>
                    </div>
                  </div>
                  <div className="mt-3 inline-flex text-[10px] uppercase tracking-widest bg-gradient-soft rounded-full px-2 py-1">{l.level}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {r.skills.map((s) => (
                <span key={s} className="rounded-full bg-gradient-soft border border-border px-3 py-1.5 text-sm">{s}</span>
              ))}
            </div>
          </SectionCard>

          {/* Roadmap */}
          <SectionCard icon={MapPin} title="30-Day Improvement Roadmap">
            <div className="mt-6 relative">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-border" aria-hidden />
              <div className="space-y-6">
                {r.roadmap.map((w, i) => (
                  <motion.div
                    key={w.week}
                    initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="relative pl-12"
                  >
                    <div className="absolute left-0 top-1 size-8 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-xs font-bold shadow-glow">{i + 1}</div>
                    <div className="text-xs uppercase tracking-widest text-primary">{w.week}</div>
                    <div className="font-display font-semibold mt-1">{w.title}</div>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {w.items.map((it) => (
                        <li key={it} className="flex items-start gap-2">
                          <span className="mt-1.5 size-1 rounded-full bg-primary" /> {it}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </SectionCard>

          <div className="rounded-3xl border border-dashed border-border bg-card/60 p-6 text-xs sm:text-sm text-muted-foreground">
            ⚠️ Hasil ini bersifat indikatif. Gunakan sebagai panduan pengembangan, bukan keputusan mutlak.
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SectionCard({
  icon: Icon, title, tone, children,
}: { icon: React.ElementType; title: string; tone?: "success" | "warning"; children: React.ReactNode }) {
  const toneCls = tone === "success" ? "bg-success/10 text-success"
    : tone === "warning" ? "bg-warning/15 text-warning"
    : "bg-gradient-soft text-primary";
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
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <div className="font-medium truncate">{title}</div>
        <div className="text-sm font-bold shrink-0">{score}</div>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-background overflow-hidden">
        <div className={`h-full ${bar}`} style={{ width: `${score}%` }} />
      </div>
      <p className="text-sm text-muted-foreground mt-2">{note}</p>
    </div>
  );
}