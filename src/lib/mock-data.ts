export const assessmentGoals = [
  { id: "career", title: "Rekomendasi Karier", desc: "Temukan jalur karier yang cocok dengan minat dan kemampuanmu.", icon: "Briefcase", color: "from-violet-500 to-fuchsia-500" },
  { id: "digital", title: "Skill Digital", desc: "Petakan literasi & kemampuan digital untuk era modern.", icon: "Cpu", color: "from-sky-500 to-cyan-500" },
  { id: "job-ready", title: "Kesiapan Kerja", desc: "Ukur seberapa siap kamu memasuki dunia profesional.", icon: "GraduationCap", color: "from-emerald-500 to-teal-500" },
  { id: "communication", title: "Komunikasi", desc: "Evaluasi gaya komunikasi & kemampuan interpersonal.", icon: "MessageCircle", color: "from-amber-500 to-orange-500" },
  { id: "leadership", title: "Kepemimpinan", desc: "Asesmen potensi leadership & pengambilan keputusan.", icon: "Crown", color: "from-rose-500 to-pink-500" },
  { id: "entrepreneur", title: "Kewirausahaan", desc: "Cek kesiapanmu membangun bisnis atau ide produk.", icon: "Rocket", color: "from-indigo-500 to-purple-500" },
  { id: "learning", title: "Minat & Potensi Belajar", desc: "Temukan gaya belajar dan bidang yang paling sesuai.", icon: "BookOpen", color: "from-lime-500 to-green-500" },
] as const;

export const mockCriteria = [
  { name: "Problem Solving", desc: "Kemampuan memecahkan masalah secara terstruktur dan kreatif." },
  { name: "Komunikasi", desc: "Penyampaian ide secara jelas dan efektif." },
  { name: "Kreativitas", desc: "Menghasilkan ide baru dan pendekatan inovatif." },
  { name: "Kepemimpinan", desc: "Mengarahkan tim dan mengambil keputusan." },
  { name: "Literasi Digital", desc: "Pemahaman dan penggunaan tools digital." },
  { name: "Kolaborasi", desc: "Bekerja efektif dalam tim lintas fungsi." },
  { name: "Adaptabilitas", desc: "Menyesuaikan diri dengan perubahan." },
];

export type Question = {
  id: string;
  criteria: string;
  type: "scale" | "choice" | "yesno" | "text";
  question: string;
  options?: string[];
  required?: boolean;
};

export const mockQuestions: Question[] = [
  { id: "q1", criteria: "Problem Solving", type: "scale", question: "Seberapa nyaman kamu menghadapi masalah baru tanpa panduan?", required: true },
  { id: "q2", criteria: "Problem Solving", type: "choice", question: "Saat menghadapi masalah kompleks, pendekatan pertamamu adalah:", options: ["Memecah jadi bagian kecil", "Cari referensi/contoh", "Diskusi dengan orang lain", "Mencoba langsung dengan trial-error"], required: true },
  { id: "q3", criteria: "Komunikasi", type: "scale", question: "Seberapa percaya diri kamu berbicara di depan umum?", required: true },
  { id: "q4", criteria: "Komunikasi", type: "text", question: "Ceritakan singkat pengalaman komunikasi yang menurutmu paling sukses.", required: false },
  { id: "q5", criteria: "Kreativitas", type: "yesno", question: "Apakah kamu sering memikirkan cara baru menyelesaikan tugas rutin?", required: true },
  { id: "q6", criteria: "Kreativitas", type: "scale", question: "Seberapa sering kamu mengerjakan proyek kreatif di luar kewajiban?", required: true },
  { id: "q7", criteria: "Kepemimpinan", type: "scale", question: "Seberapa nyaman kamu mengambil keputusan untuk tim?", required: true },
  { id: "q8", criteria: "Kepemimpinan", type: "choice", question: "Gaya kepemimpinan yang paling kamu rasa cocok:", options: ["Demokratis", "Visioner", "Coaching", "Servant leadership"], required: true },
  { id: "q9", criteria: "Literasi Digital", type: "scale", question: "Seberapa mahir kamu menggunakan tools produktivitas modern?", required: true },
  { id: "q10", criteria: "Kolaborasi", type: "yesno", question: "Apakah kamu lebih produktif saat bekerja dalam tim?", required: true },
  { id: "q11", criteria: "Adaptabilitas", type: "scale", question: "Seberapa cepat kamu beradaptasi dengan perubahan rencana?", required: true },
  { id: "q12", criteria: "Adaptabilitas", type: "text", question: "Apa hal baru yang kamu pelajari dalam 3 bulan terakhir?", required: false },
];

export const mockResult = {
  overallScore: 82,
  level: "Advanced",
  summary: "Kamu menunjukkan profil kemampuan yang kuat di area analitis dan komunikasi. Potensi kepemimpinanmu sedang berkembang, dengan kreativitas sebagai keunggulan unik.",
  radar: [
    { subject: "Problem Solving", value: 88, full: 100 },
    { subject: "Komunikasi", value: 84, full: 100 },
    { subject: "Kreativitas", value: 90, full: 100 },
    { subject: "Kepemimpinan", value: 68, full: 100 },
    { subject: "Literasi Digital", value: 86, full: 100 },
    { subject: "Kolaborasi", value: 78, full: 100 },
    { subject: "Adaptabilitas", value: 80, full: 100 },
  ],
  strengths: [
    { title: "Kreativitas", score: 90, note: "Kamu unggul dalam menghasilkan ide segar." },
    { title: "Problem Solving", score: 88, note: "Pendekatan terstruktur saat menghadapi masalah." },
    { title: "Literasi Digital", score: 86, note: "Sangat nyaman dengan tools modern." },
  ],
  growth: [
    { title: "Kepemimpinan", score: 68, note: "Latih pengambilan keputusan di skenario tim nyata." },
    { title: "Kolaborasi", score: 78, note: "Tingkatkan partisipasi pada proyek lintas fungsi." },
  ],
  roles: [
    { name: "Product Designer", match: 92, why: "Kombinasi kreativitas + literasi digital + problem solving." },
    { name: "Innovation Strategist", match: 88, why: "Mampu menyusun ide kompleks jadi narasi jelas." },
    { name: "UX Researcher", match: 84, why: "Analitis dan komunikatif." },
    { name: "Technical PM (Jr)", match: 78, why: "Perlu pengembangan leadership untuk versi senior." },
  ],
  roadmap: [
    { week: "Minggu 1", title: "Foundations", items: ["Audit skill harian", "Pilih 1 proyek kecil", "Set jurnal refleksi mingguan"] },
    { week: "Minggu 2", title: "Skill Boost", items: ["Kursus komunikasi 4 jam", "Workshop design thinking", "Mentor 1:1"] },
    { week: "Minggu 3", title: "Apply", items: ["Pimpin 1 meeting tim", "Publikasi case study", "Feedback loop dengan rekan"] },
    { week: "Minggu 4", title: "Reflect & Plan", items: ["Review hasil", "Update portofolio", "Tentukan tujuan 90 hari"] },
  ],
  skills: ["Design Systems", "User Research", "Public Speaking", "Stakeholder Mgmt", "Prompt Engineering"],
};

export const mockHistory = [
  { id: "a1", date: "2 Juni 2026", goal: "Rekomendasi Karier", score: 82, level: "Advanced" },
  { id: "a2", date: "18 Mei 2026", goal: "Skill Digital", score: 74, level: "Intermediate" },
  { id: "a3", date: "9 April 2026", goal: "Kepemimpinan", score: 66, level: "Intermediate" },
  { id: "a4", date: "22 Feb 2026", goal: "Komunikasi", score: 88, level: "Advanced" },
];

export const mockAdminStats = {
  totalUsers: 12480,
  assessmentsRun: 38221,
  avgScore: 76,
  activeToday: 412,
  topGoals: [
    { goal: "Karier", count: 14820 },
    { goal: "Skill Digital", count: 9210 },
    { goal: "Kesiapan Kerja", count: 6020 },
    { goal: "Komunikasi", count: 4180 },
    { goal: "Kepemimpinan", count: 3991 },
  ],
  recentUsers: [
    { name: "Alya Kusuma", email: "alya@example.com", goal: "Karier", date: "Hari ini" },
    { name: "Bima Pratama", email: "bima@example.com", goal: "Komunikasi", date: "Hari ini" },
    { name: "Citra Andini", email: "citra@example.com", goal: "Kepemimpinan", date: "Kemarin" },
    { name: "Dimas Saputra", email: "dimas@example.com", goal: "Skill Digital", date: "Kemarin" },
    { name: "Eka Putri", email: "eka@example.com", goal: "Kesiapan Kerja", date: "2 hari lalu" },
  ],
};