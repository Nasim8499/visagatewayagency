import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader, GlassCard } from "@/components/ui-bits";
import { HeroSlider } from "@/components/HeroSlider";
import { allVariables, type TemplateField } from "@/lib/templates";
import {
  Braces, Plus, Search, Copy, Check, ArrowLeft, Type, Calendar,
  Hash, Image as ImageIcon, QrCode, Barcode, PenTool, Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/documents/variables")({
  head: () => ({
    meta: [
      { title: "Template Variables — VisaHOBe" },
      { name: "description", content: "Define dynamic fields like {{FULL_NAME}}, {{PASSPORT_NUMBER}}, QR_CODE, BARCODE and SIGNATURE for template auto-fill." },
    ],
  }),
  component: VariablesPage,
});

const typeIcon: Record<TemplateField["type"], typeof Type> = {
  text: Type,
  date: Calendar,
  number: Hash,
  image: ImageIcon,
  qr: QrCode,
  barcode: Barcode,
  signature: PenTool,
};

const typeColor: Record<TemplateField["type"], string> = {
  text: "text-cyan-300 bg-cyan-500/10",
  date: "text-amber-300 bg-amber-500/10",
  number: "text-emerald-300 bg-emerald-500/10",
  image: "text-rose-300 bg-rose-500/10",
  qr: "text-violet-300 bg-violet-500/10",
  barcode: "text-fuchsia-300 bg-fuchsia-500/10",
  signature: "text-blue-300 bg-blue-500/10",
};

function VariablesPage() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const groups = useMemo(() => {
    const q = query.toLowerCase().trim();
    const filtered = allVariables.filter(
      (v) => !q || v.key.toLowerCase().includes(q) || v.label.toLowerCase().includes(q),
    );
    const byGroup: Record<string, typeof allVariables> = {};
    for (const v of filtered) {
      (byGroup[v.group] ??= []).push(v);
    }
    return byGroup;
  }, [query]);

  const copy = (key: string) => {
    navigator.clipboard.writeText(`{{${key}}}`);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <AppShell>
      <Link
        to="/documents"
        className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Document Hub
      </Link>

      <div className="mb-6"><HeroSlider /></div>
      <PageHeader
        eyebrow="Field Mapping"
        title="Template Variables"
        description="Define the dynamic tokens that get auto-filled when generating documents. Drop {{TOKENS}} into any template — the AI engine handles the rest."
        actions={
          <>
            <div className="hidden md:flex items-center gap-2 glass rounded-xl px-3 py-2 min-w-[260px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search variables…"
                className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
              />
            </div>
            <button className="inline-flex items-center gap-2 gradient-brand text-brand-foreground rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[var(--shadow-glow)] hover:brightness-110 transition">
              <Plus className="h-4 w-4" /> New Variable
            </button>
          </>
        }
      />

      <div className="md:hidden flex items-center gap-2 glass rounded-xl px-3 py-2 mb-5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search variables…"
          className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          { label: "Total Variables", value: allVariables.length.toString() },
          { label: "Groups", value: new Set(allVariables.map((v) => v.group)).size.toString() },
          { label: "Smart Fields", value: allVariables.filter((v) => ["qr", "barcode", "signature"].includes(v.type)).length.toString() },
          { label: "Type Coverage", value: "100%" },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.05}>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.label}</div>
            <div className="mt-2 text-2xl md:text-3xl font-bold font-display gradient-text">{s.value}</div>
          </GlassCard>
        ))}
      </div>

      <div className="space-y-6">
        {Object.entries(groups).map(([group, vars], gi) => (
          <motion.section
            key={group}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.06 }}
          >
            <div className="flex items-center gap-2 mb-3 px-1">
              <Braces className="h-4 w-4 text-primary" />
              <h2 className="font-display font-semibold text-base">{group}</h2>
              <span className="text-xs text-muted-foreground">· {vars.length}</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {vars.map((v, i) => {
                const Icon = typeIcon[v.type];
                const isCopied = copied === v.key;
                return (
                  <motion.div
                    key={v.key}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 + i * 0.03 }}
                    className="glass rounded-xl p-4 hover-lift group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${typeColor[v.type]}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                        {v.type}
                      </span>
                    </div>
                    <div className="mt-3 text-sm font-medium">{v.label}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="flex-1 font-mono text-[11px] glass-strong rounded-md px-2 py-1.5 truncate text-primary">
                        {`{{${v.key}}}`}
                      </code>
                      <button
                        onClick={() => copy(v.key)}
                        className="h-7 w-7 rounded-md glass-strong hover:bg-white/5 flex items-center justify-center transition shrink-0"
                        aria-label="Copy"
                      >
                        {isCopied ? (
                          <Check className="h-3.5 w-3.5 text-[var(--color-success)]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        className="h-7 w-7 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition shrink-0"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        ))}
      </div>
    </AppShell>
  );
}
