import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Brain, Target, LineChart, Wand2, ShieldCheck, Zap, CheckCircle2 } from "lucide-react";
import { assessmentGoals } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kapable.ai — Asesmen Kemampuan Berbasis AI" },
      { name: "description", content: "Temukan potensimu lewat asesmen personal yang dianalisis AI: kekuatan, area pengembangan, dan rencana 30 hari." },
      { property: "og:title", content: "Kapable.ai — Asesmen Kemampuan Berbasis AI" },
      { property: "og:description", content: "Asesmen personal, analisis AI kontekstual, rekomendasi karier & roadmap pengembangan." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" aria-hidden />
      <header className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow"><Sparkles className="size-5 text-primary-foreground" /></div>
          <span className="font-display font-bold text-lg">Kapable<span className="text-gradient">.ai</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Fitur</a>
          <a href="#categories" className="hover:text-foreground">Kategori</a>
          <a href="#how" className="hover:text-foreground">Cara Kerja</a>
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
        </nav>
        <Link to="/assessment/goal" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground text-sm font-medium px-4 py-2 shadow-glow hover:opacity-95 transition">
          Mulai gratis <ArrowRight className="size-4" />
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" /> Versi MVP — AI-powered capability insights
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto">
          Kenali kemampuanmu, <span className="text-gradient">jalankan potensimu.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Asesmen personal yang disusun AI berdasarkan tujuanmu. Dapatkan analisis mendalam, rekomendasi karier, dan rencana pengembangan 30 hari — dalam hitungan menit.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/assessment/goal" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-medium px-6 py-3 shadow-glow hover:opacity-95 transition">
            Mulai asesmen <ArrowRight className="size-4" />
          </Link>
          <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-medium hover:bg-secondary transition">
            Lihat contoh hasil
          </Link>
        </motion.div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-success" /> Gratis untuk individu</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-success" /> 5–10 menit</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-success" /> Hasil bisa diunduh</span>
        </div>

        {/* Preview card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative mt-16 mx-auto max-w-4xl">
          <div className="absolute -inset-4 bg-gradient-primary opacity-30 blur-3xl rounded-3xl" aria-hidden />
          <div className="relative rounded-3xl border border-border bg-card/80 backdrop-blur shadow-lift p-6 sm:p-8 text-left">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs text-muted-foreground">Hasil Asesmen — Sample</div>
                <div className="font-display font-bold text-lg">Profil Kemampuan Kreatif-Analitis</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gradient">82</div>
                <div className="text-xs text-muted-foreground">Overall Score</div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Problem Solving", v: 88 },
                { label: "Kreativitas", v: 90 },
                { label: "Komunikasi", v: 84 },
                { label: "Leadership", v: 68 },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-secondary/60 p-3">
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="font-bold text-xl mt-1">{s.v}</div>
                  <div className="mt-2 h-1.5 rounded-full bg-background overflow-hidden">
                    <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${s.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Asesmen tradisional terasa kaku. Kami berbeda.</h2>
          <p className="mt-4 text-muted-foreground">AI tidak hanya skoring — ia memahami konteks jawabanmu dan menyusun rekomendasi yang relevan.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {[
            { icon: Wand2, title: "Kriteria dibuat AI", desc: "Tujuan & profilmu menentukan kriteria yang relevan, bukan template generik." },
            { icon: Brain, title: "Analisis kontekstual", desc: "AI membaca jawaban — termasuk teks bebas — untuk wawasan yang dalam." },
            { icon: LineChart, title: "Rencana 30 hari", desc: "Roadmap konkret per minggu dengan rekomendasi skill & peran." },
            { icon: Target, title: "Multi-tujuan", desc: "Karier, kepemimpinan, kesiapan kerja, komunikasi — satu platform." },
            { icon: ShieldCheck, title: "Privasi dulu", desc: "Datamu milikmu — bisa dihapus kapan saja dari pengaturan." },
            { icon: Zap, title: "Cepat & ringan", desc: "5–10 menit untuk hasil yang bisa ditindaklanjuti." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant transition">
              <div className="size-10 rounded-xl bg-gradient-soft grid place-items-center"><f.icon className="size-5 text-primary" /></div>
              <h3 className="mt-4 font-display font-semibold text-lg">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Kategori asesmen populer</h2>
            <p className="mt-2 text-muted-foreground">Pilih satu untuk memulai.</p>
          </div>
          <Link to="/assessment/goal" className="text-sm font-medium text-primary inline-flex items-center gap-1">Lihat semua <ArrowRight className="size-4" /></Link>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assessmentGoals.slice(0, 6).map((g) => (
            <Link key={g.id} to="/assessment/goal" className="group rounded-2xl border border-border bg-card p-5 hover:shadow-lift hover:-translate-y-0.5 transition">
              <div className={`size-10 rounded-xl bg-gradient-to-br ${g.color} grid place-items-center text-white font-bold`}>{g.title.charAt(0)}</div>
              <h3 className="mt-4 font-display font-semibold">{g.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{g.desc}</p>
              <div className="mt-4 text-sm font-medium text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">Mulai <ArrowRight className="size-4" /></div>
            </Link>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">Cara kerjanya</h2>
        <div className="mt-12 grid md:grid-cols-4 gap-5">
          {[
            { n: "01", t: "Pilih tujuan", d: "Karier, skill, kepemimpinan, dll." },
            { n: "02", t: "Isi profil singkat", d: "Konteks personal untuk AI." },
            { n: "03", t: "Jawab pertanyaan", d: "Skala, pilihan, ya/tidak, teks." },
            { n: "04", t: "Dapatkan rekomendasi", d: "Skor, kekuatan, roadmap 30 hari." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-card p-6">
              <div className="text-xs font-mono text-primary">{s.n}</div>
              <div className="font-display font-semibold mt-2">{s.t}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 pb-24">
        <div className="rounded-3xl bg-gradient-primary p-10 sm:p-14 text-center text-primary-foreground shadow-lift relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,white,transparent_50%)] opacity-20" aria-hidden />
          <h2 className="relative text-3xl sm:text-4xl font-bold tracking-tight">Siap mengenal dirimu lebih dalam?</h2>
          <p className="relative mt-3 opacity-90">Mulai asesmen pertamamu gratis, hanya 5 menit.</p>
          <Link to="/assessment/goal" className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-background text-foreground font-medium px-6 py-3 hover:opacity-95">
            Mulai sekarang <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 text-sm text-muted-foreground flex flex-wrap items-center justify-between gap-3">
          <div>© 2026 Kapable.ai — Asesmen Kemampuan Berbasis AI</div>
          <div className="flex gap-5"><a href="#">Privasi</a><a href="#">Syarat</a><a href="#">Kontak</a></div>
        </div>
      </footer>
    </div>
  );
}
