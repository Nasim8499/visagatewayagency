import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { motion } from "motion/react";
import {
  FileCheck, Users, Clock, TrendingUp, ArrowRight, Sparkles, Plus,
  CheckCircle2, AlertCircle, FileText, Plane, ScanLine, Wand2, Download,
  Briefcase, Building2, Bell, ArrowUpRight,
} from "lucide-react";
import heroVisa from "@/assets/hero-visa.png";
import heroWorkers from "@/assets/hero-workers.png";
import heroDocuments from "@/assets/hero-documents.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — VisaHOBe" },
      { name: "description", content: "VisaHOBe immigration & document operations dashboard." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Active Cases", value: "248", delta: "+12%", icon: FileCheck, tone: "navy", spark: [12, 18, 14, 22, 19, 28, 32] },
  { label: "Employers", value: "64", delta: "+4 new", icon: Building2, tone: "red", spark: [4, 8, 6, 10, 9, 14, 17] },
  { label: "Processing", value: "6.2d", delta: "-1.1d", icon: Clock, tone: "violet", spark: [9, 8, 8, 7, 7, 6.5, 6.2] },
  { label: "Success Rate", value: "97%", delta: "+2.1%", icon: TrendingUp, tone: "sky", spark: [88, 90, 91, 93, 94, 96, 97] },
] as const;

const toneClasses = {
  navy: { bg: "bg-[oklch(0.95_0.02_258)]", text: "text-[var(--navy)]", grad: "from-[oklch(0.42_0.13_258)] to-[oklch(0.28_0.1_258)]" },
  red: { bg: "bg-[oklch(0.96_0.04_25)]", text: "text-[oklch(0.55_0.22_25)]", grad: "from-[oklch(0.68_0.22_25)] to-[oklch(0.52_0.22_20)]" },
  violet: { bg: "bg-[oklch(0.95_0.04_295)]", text: "text-[oklch(0.5_0.2_295)]", grad: "from-[oklch(0.6_0.22_295)] to-[oklch(0.45_0.2_290)]" },
  sky: { bg: "bg-[oklch(0.95_0.04_220)]", text: "text-[oklch(0.5_0.18_220)]", grad: "from-[oklch(0.62_0.18_220)] to-[oklch(0.45_0.18_220)]" },
} as const;

function Sparkline({ values, color = "currentColor" }: { values: readonly number[]; color?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 100;
    const y = 30 - ((v - min) / range) * 28;
    return `${x},${y}`;
  });
  return (
    <svg viewBox="0 0 100 32" className="w-full h-8" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g-${values.join("")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polyline
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points={pts.join(" ")}
      />
      <motion.polygon
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        fill={`url(#g-${values.join("")})`}
        points={`0,32 ${pts.join(" ")} 100,32`}
      />
    </svg>
  );
}

function FloatingShapes() {
  return (
    <>
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -right-6 h-24 w-24 rounded-3xl bg-gradient-to-br from-[oklch(0.7_0.22_25)] to-[oklch(0.55_0.22_25)] opacity-90 shadow-2xl"
        style={{ transform: "perspective(600px) rotateX(20deg) rotateY(-15deg)" }}
      />
      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute top-12 right-32 h-14 w-14 rounded-2xl bg-gradient-to-br from-[oklch(0.55_0.18_220)] to-[oklch(0.38_0.15_220)] opacity-90 shadow-xl"
        style={{ transform: "perspective(500px) rotateX(30deg)" }}
      />
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute bottom-6 right-20 h-10 w-10 rounded-full bg-gradient-to-br from-white/40 to-white/10 backdrop-blur shadow-lg"
      />
    </>
  );
}

function HeroBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl mb-6"
      style={{
        background: "linear-gradient(135deg, #152a4d 0%, #1f3a6e 60%, #2b4d8c 100%)",
      }}
    >
      {/* animated grid bg */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -top-20 -left-20 h-80 w-80 rounded-full"
        style={{ background: "radial-gradient(circle, #e63946 0%, transparent 70%)" }}
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full"
        style={{ background: "radial-gradient(circle, #4f7cff 0%, transparent 70%)" }}
      />

      <FloatingShapes />

      <div className="relative grid md:grid-cols-2 gap-4 p-6 md:p-10 items-center">
        <div className="text-white">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider mb-3"
          >
            <Sparkles className="h-3 w-3" /> AI Powered · Real-time
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display font-extrabold text-3xl md:text-[40px] leading-[1.05] tracking-tight"
          >
            Welcome back,<br />
            <span className="bg-gradient-to-r from-white via-amber-200 to-rose-300 bg-clip-text text-transparent">
              Arif Hossain
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-white/70 text-sm md:text-[15px] max-w-md leading-relaxed"
          >
            248 active visa cases · 12 documents awaiting AI review · Your team processed 47 templates today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-5 flex flex-wrap gap-2"
          >
            <Link to="/documents/new" className="inline-flex items-center gap-2 bg-white text-[var(--navy)] rounded-xl px-5 py-3 text-sm font-bold hover:scale-105 transition shadow-lg">
              <Plus className="h-4 w-4" /> New Smart Template
            </Link>
            <Link to="/documents" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white rounded-xl px-5 py-3 text-sm font-semibold hover:bg-white/20 transition">
              <FileText className="h-4 w-4" /> Browse Templates
            </Link>
          </motion.div>
        </div>

        <div className="relative h-[220px] md:h-[280px] hidden md:block">
          <motion.img
            src={heroVisa}
            alt="3D airplane"
            width={400}
            height={400}
            initial={{ opacity: 0, y: 30, rotate: -10 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute top-0 right-8 w-64 h-64 object-contain drop-shadow-2xl"
            style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.35))" }}
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 right-0 w-44"
          >
            <img src={heroDocuments} alt="3D documents" width={300} height={300} className="w-full object-contain" loading="lazy" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function StatTile({ s, i }: { s: typeof stats[number]; i: number }) {
  const c = toneClasses[s.tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: i * 0.08, type: "spring", stiffness: 260, damping: 22 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card-surface p-5 relative overflow-hidden group cursor-pointer"
    >
      <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${c.grad} opacity-15 blur-2xl group-hover:opacity-30 transition`} />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${c.grad} text-white flex items-center justify-center shadow-lg`}>
            <s.icon className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold text-[var(--color-success)] bg-[oklch(0.94_0.08_155)] rounded-full px-2 py-1 inline-flex items-center gap-0.5">
            <ArrowUpRight className="h-3 w-3" /> {s.delta}
          </span>
        </div>
        <div className="mt-3 text-[12px] text-muted-foreground font-medium">{s.label}</div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.08 + 0.3 }}
          className="text-[28px] md:text-[32px] font-extrabold font-display text-[var(--navy)] leading-none mt-1"
        >
          {s.value}
        </motion.div>
        <div className={`mt-3 ${c.text}`}>
          <Sparkline values={s.spark} color="currentColor" />
        </div>
      </div>
    </motion.div>
  );
}

const recentApps = [
  { name: "Rahim Uddin", type: "Work Permit", status: "In Review", id: "VH-2841", img: "🇸🇬" },
  { name: "Maria Santos", type: "Employment Pass", status: "Approved", id: "VH-2840", img: "🇸🇬" },
  { name: "Ahmed Khan", type: "S-Pass", status: "Pending", id: "VH-2839", img: "🇸🇬" },
  { name: "Linh Nguyen", type: "Visit Visa", status: "In Review", id: "VH-2838", img: "🇸🇬" },
];

const activity = [
  { icon: CheckCircle2, text: "IPA generated for Maria Santos", time: "2m ago", tone: "success" },
  { icon: Wand2, text: "Template 'Employment Contract v3' updated", time: "18m ago", tone: "info" },
  { icon: AlertCircle, text: "Document review pending for VH-2839", time: "1h ago", tone: "warning" },
  { icon: Users, text: "New employer onboarded: Marina Bay Construction", time: "3h ago", tone: "info" },
  { icon: Download, text: "5 work permits exported as PDF", time: "5h ago", tone: "success" },
] as const;

const quickActions = [
  { icon: ScanLine, label: "Scan Master Doc", to: "/documents/new", grad: "from-rose-500 to-red-600" },
  { icon: Wand2, label: "Generate Document", to: "/documents", grad: "from-violet-500 to-purple-600" },
  { icon: Briefcase, label: "Add Employer", to: "/employers", grad: "from-amber-500 to-orange-600" },
  { icon: Plane, label: "New Visa Case", to: "/agencies", grad: "from-sky-500 to-blue-600" },
] as const;

function statusBadge(s: string) {
  if (s === "Approved") return { cls: "bg-[oklch(0.94_0.1_155)] text-[oklch(0.4_0.15_155)]" };
  if (s === "Pending") return { cls: "bg-[oklch(0.94_0.12_70)] text-[oklch(0.45_0.18_70)]" };
  return { cls: "bg-[oklch(0.93_0.06_258)] text-[var(--navy)]" };
}

function toneBg(t: "success" | "info" | "warning") {
  if (t === "success") return "bg-[oklch(0.94_0.1_155)] text-[oklch(0.4_0.15_155)]";
  if (t === "warning") return "bg-[oklch(0.94_0.12_70)] text-[oklch(0.45_0.18_70)]";
  return "bg-[oklch(0.93_0.06_258)] text-[var(--navy)]";
}

function Dashboard() {
  return (
    <AppShell>
      <HeroBanner />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {stats.map((s, i) => <StatTile key={s.label} s={s} i={i} />)}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {quickActions.map((qa, i) => (
          <motion.div
            key={qa.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            whileHover={{ y: -3 }}
          >
            <Link to={qa.to} className="card-surface p-4 flex items-center gap-3 group relative overflow-hidden">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${qa.grad} text-white flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
                <qa.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-[var(--navy)] truncate">{qa.label}</div>
                <div className="text-[11px] text-muted-foreground">Tap to start</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--navy)] group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Two-column main */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Recent Apps */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 card-surface p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-[var(--navy)] text-[17px]">Recent Applications</h3>
              <p className="text-[11px] text-muted-foreground">Last 7 days</p>
            </div>
            <Link to="/employers" className="text-xs text-[var(--navy)] font-semibold hover:underline">View all →</Link>
          </div>
          <div className="space-y-2.5">
            {recentApps.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.05 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition cursor-pointer"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--navy)] to-blue-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-[var(--navy)] truncate">{a.name}</div>
                    <span className="text-base leading-none">{a.img}</span>
                  </div>
                  <div className="text-[12px] text-muted-foreground">{a.type} · <span className="font-mono">{a.id}</span></div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusBadge(a.status).cls}`}>
                  {a.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Workers spotlight + activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="card-surface p-5 relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #fff 0%, #f1f5ff 100%)" }}
        >
          <motion.div
            animate={{ rotate: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-4 -right-4 w-44 h-44 opacity-90"
          >
            <img src={heroWorkers} alt="Workers" width={400} height={400} className="w-full h-full object-contain" loading="lazy" />
          </motion.div>
          <div className="relative max-w-[60%]">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-white flex items-center justify-center mb-3 shadow-lg">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-[var(--navy)] text-[17px] leading-tight">Workforce<br />Hub</h3>
            <div className="text-[11px] text-muted-foreground mt-1.5">3,284 active workers · 64 employers</div>
            <Link to="/employers" className="inline-flex items-center gap-1.5 mt-4 bg-[var(--navy)] text-white rounded-lg px-3 py-2 text-[12px] font-bold hover:brightness-110">
              View Hub <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Activity feed + AI engine */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 card-surface p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-[var(--navy)] text-[17px]">Activity Feed</h3>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
              Live
            </div>
          </div>
          <ul className="space-y-1">
            {activity.map((a, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.05 }}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary transition"
              >
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${toneBg(a.tone)}`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] text-[var(--navy)]">{a.text}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{a.time}</div>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="card-surface p-5 relative overflow-hidden text-white"
          style={{ background: "linear-gradient(160deg, #152a4d 0%, #2b4d8c 100%)" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-16 -right-16 h-48 w-48 rounded-full border border-white/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full border border-white/5"
          />
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-[18px] leading-tight">AI Document Engine</h3>
            <p className="text-[12.5px] text-white/70 mt-1.5 leading-relaxed">
              Upload one master doc. AI maps every field. Generate hundreds in one click.
            </p>
            <div className="mt-4 space-y-2">
              {["Detects tables, signatures, QR", "Auto-binds {{variables}}", "Print-ready A4 PDF export"].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.08 }}
                  className="flex items-center gap-2 text-[12px] text-white/85"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> {t}
                </motion.div>
              ))}
            </div>
            <Link to="/documents/new" className="mt-5 w-full bg-white text-[var(--navy)] rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition">
              Try Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
