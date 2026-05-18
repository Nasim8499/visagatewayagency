import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { GlassCard, PageHeader } from "@/components/ui-bits";
import {
  Upload, FileText, Sparkles, Wand2, ScanLine, MousePointer2,
  FileCheck2, Download, Search, Folder, Clock, ArrowRight, Braces,
  FileUp, X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState, useRef, useCallback, type DragEvent } from "react";
import { templates } from "@/lib/templates";

export const Route = createFileRoute("/documents/")({
  head: () => ({
    meta: [
      { title: "Document Hub — VisaHOBe" },
      { name: "description", content: "AI-powered document template engine. Upload master files, generate hundreds with one click." },
    ],
  }),
  component: DocumentsPage,
});

const flowSteps = [
  { icon: Upload, title: "Upload Master", desc: "PDF, DOCX, or scanned image" },
  { icon: ScanLine, title: "AI Analyzes", desc: "Layout, fonts, tables, QR, signatures" },
  { icon: MousePointer2, title: "Map Fields", desc: "Drag {{variables}} with snapping" },
  { icon: Wand2, title: "Generate", desc: "One-click A4 print-ready PDF" },
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
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer relative rounded-2xl border-2 border-dashed transition-all p-6 md:p-10 text-center ${
        drag
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
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
        className="inline-flex h-14 w-14 rounded-2xl gradient-brand items-center justify-center shadow-[var(--shadow-glow)] mb-4"
      >
        <FileUp className="h-7 w-7 text-brand-foreground" />
      </motion.div>
      <div className="font-display font-semibold text-base md:text-lg">
        {drag ? "Drop your master document" : "Drop a master document to begin"}
      </div>
      <p className="text-xs md:text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
        PDF · DOCX · PNG · JPG · scanned files — AI detects layout, sections, tables, signatures, QR/barcode automatically.
      </p>
      <div className="mt-4 inline-flex glass rounded-xl px-3.5 py-2 text-xs font-semibold">
        or click to browse
      </div>
    </div>
  );
}

function DocumentsPage() {
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<File[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const tags = useMemo(() => ["All", ...Array.from(new Set(templates.map((t) => t.tag)))], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
      if (activeFilter !== "All" && t.tag !== activeFilter) return false;
      if (!q) return true;
      return t.name.toLowerCase().includes(q) || t.tag.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    });
  }, [query, activeFilter]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="AI Template Engine"
        title="Document Hub"
        description="Upload a master document once. Generate every future version automatically — design, fonts and watermarks preserved."
        actions={
          <>
            <Link
              to="/documents/variables"
              className="hidden md:inline-flex items-center gap-2 glass rounded-xl px-3.5 py-2.5 text-sm font-medium hover:bg-white/5 transition"
            >
              <Braces className="h-4 w-4" /> Variables
            </Link>
            <button className="inline-flex items-center gap-2 gradient-brand text-brand-foreground rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[var(--shadow-glow)] hover:brightness-110 transition">
              <Upload className="h-4 w-4" /> Upload Master
            </button>
          </>
        }
      />

      {/* Upload + Flow */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-strong rounded-2xl p-5 md:p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full gradient-brand opacity-15 blur-3xl pointer-events-none" />

        <Dropzone onFiles={(f) => setPending((p) => [...p, ...f])} />

        <AnimatePresence>
          {pending.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-2 overflow-hidden"
            >
              {pending.map((f, i) => (
                <div key={i} className="glass rounded-xl px-3 py-2.5 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg glass-strong flex items-center justify-center text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{f.name}</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <span>{(f.size / 1024).toFixed(0)} KB</span>
                      <span className="flex items-center gap-1 text-primary">
                        <ScanLine className="h-3 w-3 animate-pulse" /> AI analyzing…
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setPending((p) => p.filter((_, j) => j !== i))}
                    className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {flowSteps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="glass rounded-xl p-3.5"
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

      {/* Library header + search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg md:text-xl font-display font-semibold flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" /> Template Library
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} of {templates.length} templates</p>
        </div>
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 md:min-w-[300px]">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates…"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground min-w-0"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-1">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveFilter(tag)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              activeFilter === tag
                ? "gradient-brand text-brand-foreground shadow-[var(--shadow-glow)]"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass rounded-2xl p-10 text-center"
          >
            <div className="text-sm text-muted-foreground">No templates match "{query}"</div>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filtered.map((t, i) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to="/documents/$templateId"
                  params={{ templateId: t.id }}
                  className="glass rounded-2xl p-5 hover-lift block group relative overflow-hidden"
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
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                    <div className="text-xs text-muted-foreground mt-2 flex items-center gap-3">
                      <span className="flex items-center gap-1"><FileCheck2 className="h-3 w-3" /> {t.uses.toLocaleString()}</span>
                      <span>{t.pages}p</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t.updated}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                      <span className="flex-1 gradient-brand text-brand-foreground rounded-lg py-2 text-xs font-semibold inline-flex items-center justify-center gap-1.5 group-hover:brightness-110 transition">
                        <Wand2 className="h-3.5 w-3.5" /> Open Template
                      </span>
                      <span className="glass-strong rounded-lg px-3 flex items-center">
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

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
