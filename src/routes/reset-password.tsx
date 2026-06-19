import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset Password — Kapable.ai" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase parses the URL hash and emits PASSWORD_RECOVERY when arriving from reset email
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const passwordV = z.string().min(8, "Minimal 8 karakter").parse(password);
      if (password !== confirm) throw new Error("Password tidak cocok");
      const { error } = await supabase.auth.updateUser({ password: passwordV });
      if (error) throw error;
      toast.success("Password berhasil diperbarui.");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background relative grid place-items-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" aria-hidden />
      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">Kapable<span className="text-gradient">.ai</span></span>
        </Link>
        <div className="rounded-3xl border border-border bg-card/80 backdrop-blur shadow-lift p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight">Atur password baru</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {ready ? "Masukkan password baru untuk akunmu." : "Memverifikasi tautan reset..."}
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <PassField label="Password baru" value={password} onChange={setPassword} />
            <PassField label="Konfirmasi password" value={confirm} onChange={setConfirm} />
            <button
              type="submit"
              disabled={loading || !ready}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground font-medium py-2.5 shadow-glow hover:opacity-95 transition disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" />} Simpan password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function PassField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1 relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="password"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </label>
  );
}