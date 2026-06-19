import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Mail, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Lupa Password — Kapable.ai" },
      { name: "description", content: "Reset password akun Kapable.ai kamu." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const emailV = z.string().trim().email("Email tidak valid").parse(email);
      const { error } = await supabase.auth.resetPasswordForEmail(emailV, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Email reset password telah dikirim.");
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
        <Link to="/auth" className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-foreground mb-4">
          <ArrowLeft className="size-3.5" /> Kembali ke masuk
        </Link>
        <div className="rounded-3xl border border-border bg-card/80 backdrop-blur shadow-lift p-6 sm:p-8">
          <div className="size-12 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight">Lupa password?</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Masukkan emailmu dan kami akan kirim tautan untuk reset password.
          </p>

          {sent ? (
            <div className="mt-6 rounded-xl bg-success/10 text-success p-4 text-sm">
              Tautan reset password sudah dikirim ke <strong>{email}</strong>. Cek inbox kamu.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Email</span>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground font-medium py-2.5 shadow-glow hover:opacity-95 transition disabled:opacity-60"
              >
                {loading && <Loader2 className="size-4 animate-spin" />} Kirim tautan reset
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}