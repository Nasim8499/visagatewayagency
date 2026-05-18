import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { StatCard, PageHeader } from "@/components/ui-bits";
import {
  Upload, FileText, Search, Bell, Plus, ChevronRight,
  Cloud, Bot, Save, Sparkles, MoreVertical, Pencil, FileStack,
  Files, ScanLine, LayoutGrid, FileCheck2, HardDrive,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState, useRef, useCallback, type DragEvent } from "react";
import { templates } from "@/lib/templates";

export const Route = createFileRoute("/documents/")({
  head: () => ({
    meta: [
      { title: "Documents Templates — VisaHOBe" },
      { name: "description", content: "VisaHOBe AI Document Template Engine — upload, scan, map and generate documents in one click." },
    ],
  }),
  component: DocumentsPage,
});

const stats = [
  { label: "Total Templates", value: "128", delta: "+12.5% this month", icon: LayoutGrid, tone: "violet" as const },
  { label: "Total Documents", value: "2,854", delta: "+18.2% this month", icon: FileStack, tone: "red" as const },
  { label: "Documents Generated", value: "1,642", delta: "+14.7% this month", icon: FileCheck2, tone: "navy" as const },
  { label: "Storage Used", value: "24.6 GB", delta: "+8.3% this month", icon: HardDrive, tone: "sky" as const },
];

const flowSteps = [
  { num: 1, icon: Upload, title: "Upload Master Document", desc: "Upload your original document" },
  { num: 2, icon: ScanLine, title: "AI Scans & Detects Fields", desc: "Our AI detects editable fields automatically" },
  { num: 3, icon: Save, title: "Save as Template", desc: "Template is saved for future use" },
  { num: 4, icon: Sparkles, title: "Generate with Data", desc: "Replace data and generate new document" },
];

const categoryTabs = ["All Templates", "Work Permit", "Contracts", "Letters", "Agreements", "Invoices", "ID Cards"];

const features = [
  { icon: ScanLine, title: "AI Field Detection", desc: "AI automatically detects and maps fields" },
  { icon: FileStack, title: "Smart Templates", desc: "Reuse templates unlimited times" },
  { icon: Sparkles, title: "One Click Generate", desc: "Generate documents in one click" },
  { icon: () => <span className="font-mono font-bold text-sm">QR</span>, title: "QR / Barcode", desc: "Auto generate QR and Barcode" },
  { icon: FileCheck2, title: "Exact Design", desc: "Original layout & design preserved" },
  { icon: () => <span className="text-base">✓</span>, title: "Secure & Fast", desc: "Your data is safe and secure" },
];

function Dropzone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  }, [onFiles]);

  return (
    <Link
      to="/documents/new"
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      className={`block cursor-pointer relative rounded-2xl border-2 border-dashed transition-all p-6 md:p-8 text-center bg-[oklch(0.97_0.02_258)] ${
        drag
          ? "border-[var(--navy)] bg-[oklch(0.94_0.04_258)]"
          : "border-[oklch(0.78_0.06_258)] hover:border-[var(--navy)]"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => e.target.files && onFiles(Array.from(e.target.files))}
      />
      <motion.div
        animate={{ y: drag ? -4 : 0 }}
        className="inline-flex h-16 w-16 rounded-2xl bg-white items-center justify-center mb-3 shadow-sm"
      >
        <Cloud className="h-8 w-8 text-[var(--navy)]" strokeWidth={1.8} />
      </motion.div>
      <div className="font-display font-bold text-[15px] md:text-base text-[var(--navy)]">
        Upload Master Document
      </div>
      <p className="text-[12px] text-muted-foreground mt-1.5 max-w-sm mx-auto leading-relaxed">
        Upload your original document (PDF, DOCX, PNG, JPG). Our AI will scan and create a reusable template.
      </p>
      <span className="mt-4 inline-flex items-center gap-2 bg-[var(--navy)] text-white rounded-xl px-5 py-2.5 text-[13px] font-semibold hover:brightness-110 transition">
        <Upload className="h-4 w-4" /> Upload Document
      </span>
      <div className="mt-3 text-[11px] text-muted-foreground">or drag and drop here</div>
    </Link>
  );
}

function DocPaper({ accent, hasQr, hasPhoto, tag }: { accent: "blue" | "red" | "navy" | "green"; hasQr?: boolean; hasPhoto?: boolean; tag?: string }) {
  const stripes: Record<string, string> = {
    blue: "from-sky-400 to-blue-600",
    red: "from-rose-500 to-red-600",
    navy: "from-[var(--navy)] to-blue-900",
    green: "from-emerald-400 to-teal-600",
  };
  return (
    <div className="relative aspect-[4/5] doc-paper rounded-lg overflow-hidden">
      {/* curved stripe header */}
      <div className={`absolute top-0 inset-x-0 h-10 bg-gradient-to-r ${stripes[accent]}`} style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)" }} />
      {/* logo block */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 text-white">
        <div className="h-3 w-3 rounded-sm bg-white/90" />
        <div className="text-[7px] font-extrabold tracking-tight">VisaHOBe</div>
      </div>
      {/* tag badge */}
      {tag && (
        <div className="absolute top-12 left-2.5 text-[7px] font-bold tracking-widest uppercase text-rose-500 bg-rose-50 rounded-sm px-1.5 py-0.5">
          {tag}
        </div>
      )}
      {/* lines */}
      <div className="absolute inset-x-3 top-[68px] space-y-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-[3px] rounded-full bg-slate-200" style={{ width: `${60 + Math.random() * 35}%` }} />
        ))}
      </div>
      {/* photo */}
      {hasPhoto && (
        <div className="absolute right-2 top-12 h-10 w-9 rounded bg-gradient-to-br from-slate-400 to-slate-600" />
      )}
      {/* qr */}
      {hasQr && (
        <div className="absolute bottom-2 right-2 h-7 w-7 bg-slate-900 rounded-sm p-[2px] grid grid-cols-4 gap-[1px]">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className={`${Math.random() > 0.5 ? "bg-white" : "bg-slate-900"}`} />
          ))}
        </div>
      )}
    </div>
  );
}

const cardData = [
  { id: "work-permit", title: "Employment Contract", tag: "WORK PERMIT", updated: "2 days ago", accent: "blue" as const, hasQr: true },
  { id: "visa-letter", title: "Visa Approval Letter", tag: "VISA LETTER", updated: "3 days ago", accent: "navy" as const, hasQr: true },
  { id: "agreement", title: "Worker Agreement", tag: "AGREEMENT", updated: "5 days ago", accent: "blue" as const, hasQr: true },
  { id: "invitation", title: "Invitation Letter", tag: "LETTER", updated: "1 week ago", accent: "red" as const, hasQr: true },
  { id: "employer-agreement", title: "Employer Agreement", tag: "CONTRACT", updated: "1 week ago", accent: "blue" as const, hasQr: true },
  { id: "offer-letter", title: "Offer Letter", tag: "DOCUMENT", updated: "2 weeks ago", accent: "navy" as const, hasQr: true },
  { id: "ipa", title: "IPA Approval", tag: "PERMIT", updated: "2 weeks ago", accent: "red" as const, hasQr: true },
  { id: "worker-id", title: "Worker ID Card", tag: "ID CARD", updated: "3 weeks ago", accent: "green" as const, hasQr: true, hasPhoto: true },
];

function DocumentsPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All Templates");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cardData.filter((t) => {
      if (activeFilter !== "All Templates") {
        const tagMatch = t.tag.toLowerCase().includes(activeFilter.toLowerCase()) || activeFilter.toLowerCase().includes(t.tag.toLowerCase());
        if (!tagMatch) return false;
      }
      if (!q) return true;
      return t.title.toLowerCase().includes(q) || t.tag.toLowerCase().includes(q);
    });
  }, [query, activeFilter]);

  const templateRoute = (id: string) => templates.find((x) => x.id === id)?.id ?? templates[0].id;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Documents Template Engine"
        title="Documents Templates"
        actions={
          <>
            <div className="hidden md:flex items-center gap-2 bg-white border border-border rounded-xl px-3.5 py-2.5 min-w-[320px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates, documents..."
                className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
              />
            </div>
            <button className="hidden md:flex relative h-11 w-11 rounded-xl bg-white border border-border items-center justify-center hover:bg-secondary transition">
              <Bell className="h-[18px] w-[18px] text-[var(--navy)]" />
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full gradient-red text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-background">
                12
              </span>
            </button>
            <Link to="/documents/new" className="inline-flex items-center gap-2 bg-[var(--navy)] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:brightness-110 transition shadow-sm">
              <Plus className="h-4 w-4" /> New Template
            </Link>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.04} />
        ))}
      </div>

      {/* Upload + How it works */}
      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card-surface p-5"
        >
          <Dropzone onFiles={() => {}} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="card-surface p-5 md:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-[15px] text-[var(--navy)]">How Template Engine Works</h3>
            <button className="text-[12px] text-[var(--navy)] font-semibold flex items-center gap-1 hover:underline">
              View Guide <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-3.5">
            {flowSteps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="flex items-start gap-3"
              >
                <div className="h-10 w-10 rounded-xl bg-[oklch(0.96_0.02_258)] flex items-center justify-center text-[var(--navy)] shrink-0">
                  <s.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[12px] font-bold text-[var(--navy)]">{s.num}</span>
                    <span className="text-[13.5px] font-semibold text-[var(--navy)]">{s.title}</span>
                  </div>
                  <div className="text-[12px] text-muted-foreground mt-0.5">{s.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* My Templates */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="font-display font-bold text-[18px] text-[var(--navy)]">My Templates</h2>
        <button className="flex items-center gap-1.5 bg-white border border-border rounded-xl px-3 py-2 text-[12px] font-semibold text-[var(--navy)] hover:bg-secondary transition">
          All Categories <ChevronRight className="h-3.5 w-3.5 rotate-90" />
        </button>
      </div>

      <div className="flex gap-1 mb-5 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-1 border-b border-border">
        {categoryTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`shrink-0 px-3.5 py-2.5 text-[13px] font-semibold transition relative ${
              activeFilter === tab
                ? "text-[var(--navy)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeFilter === tab && (
              <motion.div
                layoutId="tpl-tab"
                className="absolute inset-x-2 -bottom-px h-0.5 bg-[var(--navy)] rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id + i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="card-surface p-2.5 hover-lift group"
          >
            <Link to="/documents/$templateId" params={{ templateId: templateRoute(c.id) }} className="block">
              <DocPaper accent={c.accent} hasQr={c.hasQr} hasPhoto={c.hasPhoto} tag={c.tag} />
            </Link>
            <div className="px-1 pt-3 pb-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[13.5px] font-bold text-[var(--navy)] truncate">{c.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Updated: {c.updated}</div>
                </div>
                <div className="flex items-center gap-0.5 text-muted-foreground">
                  <button className="h-7 w-7 rounded-md hover:bg-secondary flex items-center justify-center"><Pencil className="h-3.5 w-3.5" /></button>
                  <button className="h-7 w-7 rounded-md hover:bg-secondary flex items-center justify-center"><MoreVertical className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Feature strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card-surface p-4 text-center"
          >
            <div className="mx-auto h-12 w-12 rounded-xl bg-[oklch(0.96_0.02_258)] text-[var(--navy)] flex items-center justify-center mb-2.5">
              <f.icon className="h-5 w-5" />
            </div>
            <div className="text-[12.5px] font-bold text-[var(--navy)]">{f.title}</div>
            <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{f.desc}</div>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
}
