import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StepIndicator } from "./assessment.goal";

export const Route = createFileRoute("/assessment/profile")({
  head: () => ({ meta: [{ title: "Profil Singkat — Kapable.ai" }, { name: "description", content: "Isi profil singkat agar analisis AI lebih personal." }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" aria-hidden />
      <div className="relative max-w-3xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex items-center justify-between">
          <Link to="/assessment/goal" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Kembali</Link>
          <StepIndicator step={2} total={4} />
        </div>
        <h1 className="mt-10 text-3xl sm:text-4xl font-bold tracking-tight">Ceritakan tentang dirimu</h1>
        <p className="mt-2 text-muted-foreground">Konteks personal membuat rekomendasi AI lebih relevan. Field bertanda * wajib.</p>

        <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/assessment/criteria" }); }} className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-5">
          <Field label="Nama atau panggilan *" id="name" placeholder="cth: Alya" required />
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Usia *" id="age" type="number" placeholder="cth: 23" required />
            <Select label="Pendidikan terakhir *" id="edu" options={["SMA/SMK", "Diploma", "S1", "S2", "S3", "Lainnya"]} required />
          </div>
          <Field label="Pengalaman kerja / organisasi" id="exp" placeholder="cth: 2 tahun di startup edtech" />
          <Field label="Skill yang sudah dimiliki" id="skills" placeholder="cth: Figma, presentasi, React" />
          <TextArea label="Tujuan pribadi *" id="goal" placeholder="cth: ingin pindah karier ke bidang produk dalam 6 bulan" required />

          <div className="flex justify-between items-center pt-4">
            <Link to="/assessment/goal" className="text-sm text-muted-foreground hover:text-foreground">Batal</Link>
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-medium px-6 py-3 shadow-glow">
              Buat kriteria AI <ArrowRight className="size-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, id, ...p }: { label: string; id: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <input id={id} {...p} className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
function TextArea({ label, id, ...p }: { label: string; id: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <textarea id={id} rows={3} {...p} className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" />
    </div>
  );
}
function Select({ label, id, options, ...p }: { label: string; id: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <select id={id} {...p} className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring">
        <option value="">Pilih...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}