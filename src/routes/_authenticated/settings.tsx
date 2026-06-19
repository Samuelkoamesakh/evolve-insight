import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { User, Bell, Lock, Trash2, Mail, Globe } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Pengaturan — Kapable.ai" }, { name: "description", content: "Kelola profil, notifikasi, dan privasi." }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [tab, setTab] = useState<"profile" | "notif" | "privacy">("profile");
  return (
    <AppShell>
      <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
      <p className="text-muted-foreground mt-1">Kelola akun & preferensi.</p>
      <div className="mt-8 grid lg:grid-cols-[220px_1fr] gap-6">
        <nav className="flex lg:flex-col gap-1 overflow-x-auto">
          {[
            { id: "profile", label: "Profil", icon: User },
            { id: "notif", label: "Notifikasi", icon: Bell },
            { id: "privacy", label: "Privasi", icon: Lock },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition shrink-0 ${tab === t.id ? "bg-gradient-soft font-medium" : "text-muted-foreground hover:bg-secondary"}`}>
              <t.icon className="size-4" /> {t.label}
            </button>
          ))}
        </nav>
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          {tab === "profile" && (
            <div className="space-y-5 max-w-lg">
              <h2 className="font-display font-semibold text-lg">Informasi Profil</h2>
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-bold text-xl">A</div>
                <button className="text-sm font-medium text-primary">Ubah foto</button>
              </div>
              <Input label="Nama" defaultValue="Alya Kusuma" />
              <Input label="Email" defaultValue="alya@example.com" type="email" />
              <Input label="Pendidikan" defaultValue="S1 Ilmu Komunikasi" />
              <button className="rounded-full bg-gradient-primary text-primary-foreground px-5 py-2.5 text-sm shadow-glow">Simpan perubahan</button>
            </div>
          )}
          {tab === "notif" && (
            <div className="space-y-4 max-w-lg">
              <h2 className="font-display font-semibold text-lg">Notifikasi</h2>
              <Toggle icon={Mail} title="Email ringkasan mingguan" desc="Pengingat progress dan rekomendasi baru." defaultChecked />
              <Toggle icon={Bell} title="Reminder asesmen" desc="Asesmen ulang setiap 3 bulan." defaultChecked />
              <Toggle icon={Globe} title="Newsletter produk" desc="Update fitur dan tips." />
            </div>
          )}
          {tab === "privacy" && (
            <div className="space-y-5 max-w-lg">
              <h2 className="font-display font-semibold text-lg">Privasi & Data</h2>
              <p className="text-sm text-muted-foreground">Datamu dienkripsi dan tidak dibagikan tanpa izin.</p>
              <button className="w-full text-left rounded-xl border border-border p-4 hover:bg-secondary transition">
                <div className="font-medium">Unduh data saya</div>
                <div className="text-sm text-muted-foreground">Salinan semua data asesmen (.json).</div>
              </button>
              <button className="w-full text-left rounded-xl border border-destructive/30 bg-destructive/5 p-4 hover:bg-destructive/10 transition">
                <div className="font-medium text-destructive flex items-center gap-2"><Trash2 className="size-4" /> Hapus akun</div>
                <div className="text-sm text-muted-foreground">Permanen dan tidak bisa dibatalkan.</div>
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Input({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input {...p} className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
function Toggle({ icon: Icon, title, desc, defaultChecked }: { icon: React.ElementType; title: string; desc: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
      <div className="flex items-start gap-3">
        <div className="size-9 rounded-lg bg-gradient-soft grid place-items-center"><Icon className="size-4 text-primary" /></div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-muted-foreground">{desc}</div>
        </div>
      </div>
      <button role="switch" aria-checked={on} onClick={() => setOn(!on)} className={`relative w-11 h-6 rounded-full transition shrink-0 ${on ? "bg-gradient-primary" : "bg-border"}`}>
        <span className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-background shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}