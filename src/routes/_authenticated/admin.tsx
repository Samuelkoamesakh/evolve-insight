import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { mockAdminStats } from "@/lib/mock-data";
import { Users, FileBarChart, Activity, Gauge, MoreHorizontal } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Kapable.ai" }, { name: "description", content: "Pantau pengguna, asesmen, dan performa platform." }] }),
  component: AdminPage,
});

const trend = Array.from({ length: 14 }).map((_, i) => ({ day: `${i + 1}`, runs: 800 + Math.round(Math.sin(i / 2) * 200 + i * 30) }));

function AdminPage() {
  const s = mockAdminStats;
  return (
    <AppShell>
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Ringkasan platform & aktivitas pengguna.</p>
        </div>
        <div className="inline-flex rounded-full border border-border bg-card p-1 text-sm">
          {["7H", "30H", "90H"].map((t, i) => (
            <button key={t} className={`px-3 py-1.5 rounded-full ${i === 1 ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground"}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Users} label="Total Pengguna" value={s.totalUsers.toLocaleString()} delta="+8.2%" />
        <Stat icon={FileBarChart} label="Asesmen Dijalankan" value={s.assessmentsRun.toLocaleString()} delta="+12.4%" />
        <Stat icon={Gauge} label="Skor Rata-rata" value={`${s.avgScore}`} delta="+1.1" />
        <Stat icon={Activity} label="Aktif Hari Ini" value={s.activeToday.toLocaleString()} delta="+5.7%" />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display font-semibold text-lg">Aktivitas Asesmen (14 hari)</h2>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="runs" stroke="var(--color-primary)" fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display font-semibold text-lg">Tujuan Terpopuler</h2>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.topGoals} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="goal" stroke="var(--color-muted-foreground)" fontSize={11} width={90} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card overflow-hidden shadow-soft">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="font-display font-semibold text-lg">Pengguna Terbaru</h2>
          <button className="text-sm text-primary font-medium">Lihat semua</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-widest">
              <tr><th className="text-left p-4 font-medium">Nama</th><th className="text-left p-4 font-medium">Email</th><th className="text-left p-4 font-medium">Tujuan</th><th className="text-left p-4 font-medium">Bergabung</th><th /></tr>
            </thead>
            <tbody>
              {s.recentUsers.map((u) => (
                <tr key={u.email} className="border-t border-border hover:bg-secondary/30">
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-xs font-bold">{u.name.charAt(0)}</div>
                      {u.name}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{u.email}</td>
                  <td className="p-4"><span className="text-xs rounded-full bg-gradient-soft px-2 py-1">{u.goal}</span></td>
                  <td className="p-4 text-muted-foreground">{u.date}</td>
                  <td className="p-4 text-right"><button aria-label="Aksi" className="p-1.5 rounded-lg hover:bg-secondary"><MoreHorizontal className="size-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value, delta }: { icon: React.ElementType; label: string; value: string; delta: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="size-10 rounded-xl bg-gradient-soft grid place-items-center"><Icon className="size-5 text-primary" /></div>
        <span className="text-xs text-success">{delta}</span>
      </div>
      <div className="mt-4 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}