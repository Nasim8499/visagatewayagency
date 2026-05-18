import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { GlassCard, PageHeader } from "@/components/ui-bits";
import {
  Upload, FileText, Sparkles, Wand2, ScanLine, MousePointer2,
  FileCheck2, Download, Search, Folder, Clock, ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — VisaHOBe" },
      { name: "description", content: "AI-powered document template engine. Upload master files, generate hundreds with one click." },
    ],
  }),
  component: DocumentsPage,
});

const templates = [
  { name: "Work Permit", uses: 1284, tag: "Government", color: "from-blue-500/20 to-cyan-500/20" },
  { name: "Employment Contract", uses: 842, tag: "Legal", color: "from-emerald-500/20 to-teal-500/20" },
  { name: "IPA Letter", uses: 612, tag: "Government", color: "from-violet-500/20 to-purple-500/20" },
  { name: "Offer Letter", uses: 548, tag: "HR", color: "from-amber-500/20 to-orange-500/20" },
  { name: "Visa Letter", uses: 421, tag: "Embassy", color: "from-rose-500/20 to-pink-500/20" },
  { name: "Worker ID Card", uses: 380, tag: "ID", color: "from-sky-500/20 to-indigo-500/20" },
];

const flowSteps = [
  { icon: Upload, title: "Upload Master", desc: "PDF, DOCX, or scanned image" },
  { icon: ScanLine, title: "AI Analyzes", desc: "Layout, fonts, tables, QR, signatures" },
  { icon: MousePointer2, title: "Map Fields", desc: "Drag {{variables}} with snapping" },
  { icon: Wand2, title: "Generate", desc: "One-click A4 print-ready PDF" },
];

function DocumentsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="AI Template Engine"
        title="Document Hub"
        description="Upload a master document once. Generate every future version automatically — design, fonts and watermarks preserved."
        actions={
          <>
            <div className="hidden md:flex items-center gap-2 glass rounded-xl px-3 py-2 min-w-[240px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search templates…"
                className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
              />
            </div>
            <button className="inline-flex items-center gap-2 gradient-brand text-brand-foreground rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[var(--shadow-glow)] hover:brightness-110 transition">
              <Upload className="h-4 w-4" /> Upload Master
            </button>
          </>
        }
      />

      {/* Upload dropzone */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-strong rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full gradient-brand opacity-15 blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="h-14 w-14 rounded-2xl gradient-brand flex items-center justify-center shadow-[var(--shadow-glow)] shrink-0">
            <Sparkles className="h-7 w-7 text-brand-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-semibold text-lg md:text-xl">Drop a master document to begin</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Our AI engine will detect layout, sections, tables, watermarks, signatures, and QR/barcode placements automatically.
            </p>
          </div>
          <button className="glass rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-white/5 transition inline-flex items-center gap-2">
            Browse files <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {flowSteps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="glass rounded-xl p-3.5 relative"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg glass-strong flex items-center justify-center text-primary">
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">0{i + 1}</span>
              </div>
              <div className="text-sm font-semibold">{s.title}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Template library */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-lg md:text-xl font-display font-semibold flex items-center gap-2">
          <Folder className="h-5 w-5 text-primary" /> Template Library
        </h2>
        <span className="text-xs text-muted-foreground">{templates.length} templates</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {templates.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5 hover-lift group relative overflow-hidden"
          >
            <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${t.color} blur-2xl opacity-60`} />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="h-11 w-11 rounded-xl glass-strong flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-white/5 text-muted-foreground">
                  {t.tag}
                </span>
              </div>
              <h3 className="font-display font-semibold">{t.name}</h3>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <FileCheck2 className="h-3 w-3" /> {t.uses.toLocaleString()} generated
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                <button className="flex-1 gradient-brand text-brand-foreground rounded-lg py-2 text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:brightness-110 transition">
                  <Wand2 className="h-3.5 w-3.5" /> Generate
                </button>
                <button className="glass-strong rounded-lg px-3 hover:bg-white/5 transition">
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent docs */}
      <GlassCard delay={0.2}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Recent Documents
          </h3>
          <button className="text-xs text-primary font-medium hover:underline">View all</button>
        </div>
        <div className="divide-y divide-white/5">
          {["VH-2841-WorkPermit.pdf", "VH-2840-IPA.pdf", "VH-2839-Contract.pdf", "VH-2838-VisaLetter.pdf"].map((f, i) => (
            <motion.div
              key={f}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="flex items-center gap-3 py-3 hover:bg-white/[0.03] -mx-2 px-2 rounded-lg transition"
            >
              <div className="h-9 w-9 rounded-lg glass-strong flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{f}</div>
                <div className="text-xs text-muted-foreground">Generated {i + 1}h ago · A4 · 2 pages</div>
              </div>
              <button className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center">
                <Download className="h-4 w-4 text-muted-foreground" />
              </button>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </AppShell>
  );
}
