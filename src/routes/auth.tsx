import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Sparkles, Mail, Lock, Loader2, ArrowRight, Chrome } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

type Search = { redirect?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Masuk — Kapable.ai" },
      { name: "description", content: "Masuk atau buat akun untuk memulai asesmen kemampuanmu." },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Email tidak valid").max(255);
const passwordSchema = z.string().min(8, "Minimal 8 karakter").max(72);
const nameSchema = z.string().trim().min(1, "Nama wajib diisi").max(100);

function AuthPage() {
  const search = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: (search.redirect as any) || "/dashboard" });
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const emailV = emailSchema.parse(email);
      const passwordV = passwordSchema.parse(password);
      if (mode === "signup") {
        const nameV = nameSchema.parse(name);
        const { error } = await supabase.auth.signUp({
          email: emailV,
          password: passwordV,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: nameV, name: nameV },
          },
        });
        if (error) throw error;
        toast.success("Akun dibuat! Cek email untuk konfirmasi (jika diminta), lalu masuk.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: emailV, password: passwordV });
        if (error) throw error;
        toast.success("Berhasil masuk");
        navigate({ to: (search.redirect as any) || "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/dashboard",
      });
      if (result.error) {
        toast.error(result.error.message ?? "Gagal masuk dengan Google");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? "Gagal masuk dengan Google");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden grid place-items-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" aria-hidden />
      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">Kapable<span className="text-gradient">.ai</span></span>
        </Link>

        <div className="rounded-3xl border border-border bg-card/80 backdrop-blur shadow-lift p-6 sm:p-8">
          <div className="flex p-1 rounded-xl bg-secondary mb-6">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 text-sm font-medium py-2 rounded-lg transition ${
                  mode === m ? "bg-card shadow-soft" : "text-muted-foreground"
                }`}
              >
                {m === "signin" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "signin" ? "Selamat datang kembali" : "Buat akun baru"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "Lanjutkan perjalanan asesmenmu." : "Mulai mengenal kemampuanmu hari ini."}
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background hover:bg-secondary px-4 py-2.5 text-sm font-medium transition disabled:opacity-60"
          >
            <Chrome className="size-4" /> Lanjutkan dengan Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> atau <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <Field icon={Sparkles} label="Nama lengkap" type="text" value={name} onChange={setName} placeholder="Nama kamu" />
            )}
            <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="nama@email.com" />
            <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="Minimal 8 karakter" />

            {mode === "signin" && (
              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Lupa password?</Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground font-medium py-2.5 shadow-glow hover:opacity-95 transition disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
              {mode === "signin" ? "Masuk" : "Daftar"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Dengan melanjutkan, kamu menyetujui Ketentuan & Kebijakan Privasi Kapable.ai.
        </p>
      </div>
    </div>
  );
}

function Field({
  icon: Icon, label, type, value, onChange, placeholder,
}: { icon: React.ElementType; label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1 relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type={type}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </label>
  );
}