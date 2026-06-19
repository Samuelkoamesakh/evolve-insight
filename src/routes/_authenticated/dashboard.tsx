import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { mockResult } from "@/lib/mock-data";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight, ArrowUpRight, Sparkles, Plus, Trophy, Flame, Target, TrendingUp,
  CalendarCheck, Clock, FileBarChart,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Kapable.ai" },
      { name: "description", content: "Ringkasan progres asesmen, skor terbaru, dan capaian pengembangan kemampuanmu." },
    ],
  }),
  component: DashboardHome,
});

function DashboardHome() {
  const { data: history = [] } = useQuery({
    queryKey: ["assessments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessments")
        .select("id, goal, score, level, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("name").eq("id", u.user.id).maybeSingle();
      return { name: data?.name ?? u.user.email?.split("@")[0] ?? "kamu" };
    },
  });

  const hasData = history.length > 0;
  const latest = history[0];
  const avg = hasData ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length) : 0;
  const best = hasData ? Math.max(...history.map((h) => h.score)) : 0;
  const completed = history.length;
  const delta = history.length > 1 ? history[0].score - history[1].score : 0;
  const progressData = [...history]
    .slice()
    .reverse()
    .map((h) => ({
      date: new Date(h.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      score: h.score,
    }));

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-soft px-3 py-1 text-xs">
              <Sparkles className="size-3 text-primary" /> Welcome back
            </div>
            <h1 className="mt-3 truncate text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Halo, {profile?.name ?? "kamu"} 👋
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
              Lanjutkan perjalananmu mengenal kemampuan. Berikut ringkasan progresmu sejauh ini.
            </p>
          </div>
          <Link
            to="/assessment/goal"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-glow"
          >
            <Plus className="size-4" /> <span className="hidden sm:inline">Asesmen baru</span>
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Trophy}
            label="Skor Terbaru"
            value={hasData ? latest.score.toString() : "—"}
            sub={hasData ? `${latest.goal} · ${new Date(latest.created_at).toLocaleDateString("id-ID")}` : "Belum ada hasil"}
            accent
            delta={delta}
          />
          <StatCard icon={Flame} label="Skor Tertinggi" value={hasData ? best.toString() : "—"} sub="All-time best" />
          <StatCard icon={Target} label="Rata-rata" value={hasData ? avg.toString() : "—"} sub={`dari ${completed} asesmen`} />
          <StatCard icon={CalendarCheck} label="Selesai" value={completed.toString()} sub="Asesmen dijalankan" />
        </div>

        {/* Latest result + Progress */}
        <div className="grid lg:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border bg-gradient-primary text-primary-foreground p-6 shadow-lift relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)] opacity-20" aria-hidden />
            <div className="relative">
              <div className="text-xs uppercase tracking-widest opacity-80">Latest Assessment Score</div>
              <div className="mt-3 flex items-end gap-2">
                <div className="text-6xl sm:text-7xl font-bold leading-none">{hasData ? latest.score : 0}</div>
                <div className="pb-2 opacity-80">/ 100</div>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 text-sm bg-background/15 rounded-full px-3 py-1">
                <Sparkles className="size-3.5" /> {hasData ? `${latest.level ?? "—"} · ${latest.goal}` : "Belum ada asesmen"}
              </div>
              <div className="mt-6 h-1.5 rounded-full bg-background/20 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${hasData ? latest.score : 0}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-background/80"
                />
              </div>
              {hasData ? (
                <Link
                  to="/report/$id"
                  params={{ id: latest.id }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-background text-foreground font-medium px-4 py-2 text-sm hover:opacity-95"
                >
                  Lihat laporan lengkap <ArrowUpRight className="size-4" />
                </Link>
              ) : (
                <Link to="/assessment/goal" className="mt-6 inline-flex items-center gap-2 rounded-full bg-background text-foreground font-medium px-4 py-2 text-sm hover:opacity-95">
                  Mulai asesmen pertamamu <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </motion.div>

          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="font-display font-semibold text-lg">Progress Overview</h2>
                <p className="text-sm text-muted-foreground">Tren skor dari setiap asesmen yang telah kamu kerjakan.</p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="size-3.5 text-success" /> {delta >= 0 ? `+${delta}` : delta} pts vs sebelumnya
              </div>
            </div>
            <div className="h-64 mt-4 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: "var(--color-muted-foreground)" }}
                  />
                  <Area type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#scoreGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent + quick actions */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="font-display font-semibold text-lg">Asesmen Terbaru</h2>
              <Link to="/history" className="text-sm font-medium text-primary inline-flex items-center gap-1">
                Lihat semua <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-4 divide-y divide-border">
              {history.slice(0, 4).map((h) => (
                <div key={h.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 sm:flex sm:flex-wrap">
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="size-10 shrink-0 rounded-xl bg-gradient-soft grid place-items-center text-primary">
                      <FileBarChart className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{h.goal}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" /> {new Date(h.created_at).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 sm:ml-auto">
                    <span className="text-lg font-bold text-gradient">{h.score}</span>
                    <Link
                      to="/report/$id"
                      params={{ id: h.id }}
                      className="text-xs sm:text-sm font-medium text-primary inline-flex items-center gap-1"
                    >
                      Detail <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">Belum ada asesmen. <Link to="/assessment/goal" className="text-primary font-medium">Mulai sekarang</Link>.</div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft flex flex-col">
            <h2 className="font-display font-semibold text-lg">Highlight Kemampuan</h2>
            <p className="text-sm text-muted-foreground">3 kekuatan teratas dari laporan terakhirmu.</p>
            <div className="mt-4 space-y-3 flex-1">
              {mockResult.strengths.map((s) => (
                <div key={s.title} className="rounded-2xl bg-secondary/40 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{s.title}</div>
                    <div className="text-sm font-bold">{s.score}</div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-background overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${s.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
            {hasData ? (
              <Link
                to="/report/$id"
                params={{ id: latest.id }}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary text-primary-foreground text-sm font-medium px-4 py-2.5 shadow-glow"
              >
                Buka laporan kemampuan <ArrowRight className="size-4" />
              </Link>
            ) : (
              <Link to="/assessment/goal" className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary text-primary-foreground text-sm font-medium px-4 py-2.5 shadow-glow">
                Mulai asesmen <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  icon: Icon, label, value, sub, accent, delta,
}: {
  icon: React.ElementType; label: string; value: string; sub?: string; accent?: boolean; delta?: number;
}) {
  return (
    <div className={`rounded-2xl border border-border p-4 sm:p-5 shadow-soft ${accent ? "bg-gradient-soft" : "bg-card"}`}>
      <div className="flex items-center justify-between">
        <div className="size-9 rounded-xl bg-background grid place-items-center text-primary shrink-0">
          <Icon className="size-4" />
        </div>
        {typeof delta === "number" && delta !== 0 && (
          <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${delta > 0 ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5 truncate">{label}</div>
      {sub && <div className="text-[11px] text-muted-foreground/80 mt-1 truncate">{sub}</div>}
    </div>
  );
}