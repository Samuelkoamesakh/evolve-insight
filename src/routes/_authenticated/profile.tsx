import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, User as UserIcon, Save, ArrowRight, History as HistoryIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [{ title: "Profil — Kapable.ai" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const profileQ = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, avatar_url, created_at")
        .eq("id", u.user.id)
        .maybeSingle();
      if (error) throw error;
      return { profile: data, authEmail: u.user.email ?? "" };
    },
  });

  const assessmentsQ = useQuery({
    queryKey: ["assessments", "profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessments")
        .select("id, goal, score, level, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (profileQ.data) {
      setName(profileQ.data.profile?.name ?? "");
      setEmail(profileQ.data.profile?.email ?? profileQ.data.authEmail);
    }
  }, [profileQ.data]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const nameV = z.string().trim().min(1, "Nama wajib diisi").max(100).parse(name);
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: u.user.id, name: nameV, email: u.user.email ?? null });
      if (error) throw error;
      toast.success("Profil berhasil diperbarui");
      qc.invalidateQueries({ queryKey: ["profile"] });
    } catch (err: any) {
      toast.error(err?.message ?? "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  const initials = (name || email || "U").trim().charAt(0).toUpperCase();

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
          <p className="text-muted-foreground mt-1">Kelola informasi akun dan lihat riwayat asesmenmu.</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center text-2xl font-bold shadow-glow shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="font-display font-semibold text-lg truncate">{name || "Pengguna Kapable"}</div>
              <div className="text-sm text-muted-foreground truncate">{email}</div>
            </div>
          </div>

          <form onSubmit={handleSave} className="mt-6 grid sm:grid-cols-2 gap-4">
            <Field label="Nama" icon={UserIcon} value={name} onChange={setName} placeholder="Nama lengkap" />
            <Field label="Email" icon={Mail} value={email} onChange={() => {}} disabled />
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={saving || profileQ.isLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground font-medium px-5 py-2.5 shadow-glow hover:opacity-95 transition disabled:opacity-60"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Simpan
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-gradient-soft text-primary grid place-items-center">
                <HistoryIcon className="size-4" />
              </div>
              <h2 className="font-display font-semibold text-lg">Riwayat Asesmen</h2>
            </div>
            <Link to="/history" className="text-sm font-medium text-primary inline-flex items-center gap-1">
              Lihat semua <ArrowRight className="size-4" />
            </Link>
          </div>

          {assessmentsQ.isLoading ? (
            <div className="mt-6 grid place-items-center py-8 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : (assessmentsQ.data ?? []).length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">Belum ada asesmen.</p>
              <Link to="/assessment/goal" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground px-5 py-2 text-sm shadow-glow">
                Mulai asesmen pertamamu <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-border">
              {assessmentsQ.data!.map((a) => (
                <div key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{a.goal}</div>
                    <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString("id-ID")}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-lg font-bold text-gradient">{a.score}</span>
                    <Link to="/report/$id" params={{ id: a.id }} className="text-xs sm:text-sm font-medium text-primary inline-flex items-center gap-1">
                      Detail <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Field({
  label, icon: Icon, value, onChange, placeholder, disabled,
}: { label: string; icon: React.ElementType; value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1 relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>
    </label>
  );
}