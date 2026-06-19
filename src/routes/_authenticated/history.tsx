import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Plus, ArrowRight, FileText, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({ meta: [{ title: "Riwayat Asesmen — Kapable.ai" }, { name: "description", content: "Lihat semua asesmen yang pernah kamu kerjakan." }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
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
  const items = (data ?? []).filter((h) => h.goal.toLowerCase().includes(q.toLowerCase()));
  return (
    <AppShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Riwayat Asesmen</h1>
          <p className="text-muted-foreground mt-1">Lacak perkembangan kemampuanmu dari waktu ke waktu.</p>
        </div>
        <Link to="/assessment/goal" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground px-4 py-2 text-sm shadow-glow"><Plus className="size-4" /> Asesmen baru</Link>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari berdasarkan tujuan..." className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
      </div>

      {isLoading ? (
        <div className="mt-10 grid place-items-center py-12 text-muted-foreground"><Loader2 className="size-5 animate-spin" /></div>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-6 rounded-3xl border border-border bg-card overflow-hidden shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-widest">
              <tr><th className="text-left p-4 font-medium">Tanggal</th><th className="text-left p-4 font-medium">Tujuan</th><th className="text-left p-4 font-medium">Skor</th><th className="text-left p-4 font-medium">Level</th><th className="p-4" /></tr>
            </thead>
            <tbody>
              {items.map((h) => (
                <tr key={h.id} className="border-t border-border hover:bg-secondary/30 transition">
                  <td className="p-4">{new Date(h.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</td>
                  <td className="p-4 font-medium">{h.goal}</td>
                  <td className="p-4"><span className="font-bold text-gradient">{h.score}</span></td>
                  <td className="p-4"><span className="text-xs rounded-full bg-gradient-soft px-2 py-1">{h.level ?? "-"}</span></td>
                  <td className="p-4 text-right"><Link to="/report/$id" params={{ id: h.id }} className="inline-flex items-center gap-1 text-primary font-medium text-sm">View Details <ArrowRight className="size-4" /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
      <div className="mx-auto size-14 rounded-2xl bg-gradient-soft grid place-items-center"><FileText className="size-6 text-primary" /></div>
      <h3 className="mt-4 font-display font-semibold text-lg">Belum ada riwayat</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">Mulai asesmen pertamamu untuk melihat hasil di sini.</p>
      <Link to="/assessment/goal" className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground px-5 py-2.5 text-sm shadow-glow">Mulai sekarang</Link>
    </div>
  );
}