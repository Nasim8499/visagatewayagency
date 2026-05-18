import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/ui-bits";
import { HeroSlider } from "@/components/HeroSlider";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  FileText, Copy, Trash2, Pencil, History, Plus, Sparkles, Calendar, Layers,
  ClipboardList, Download, Filter,
} from "lucide-react";
import {
  listTemplates, duplicateTemplate, deleteTemplate, renameTemplate,
  type SavedTemplate, type AuditEvent, type AuditEventType,
} from "@/lib/savedTemplates";

export const Route = createFileRoute("/documents/saved")({
  head: () => ({ meta: [{ title: "Saved Templates — VisaHOBe" }] }),
  component: SavedPage,
});

// Group similar event types into user-friendly buckets for filtering.
const EVENT_GROUPS: { key: string; label: string; match: AuditEventType[] }[] = [
  { key: "all", label: "All", match: [] },
  { key: "edit", label: "Edit", match: ["edited", "renamed", "field_bound", "field_removed"] },
  { key: "redetect", label: "Re-detect", match: ["field_redetected"] },
  { key: "move", label: "Move", match: ["field_moved"] },
  { key: "version", label: "Version", match: ["created", "duplicated", "version_saved"] },
  { key: "export", label: "Export", match: ["exported", "test_generated"] },
];

const HERO_SLIDES = [
  {
    eyebrow: "Library",
    title: "Every smart template, versioned and audited.",
    description: "Reopen, duplicate or roll back any document template. Every action is timestamped for full traceability.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=70",
  },
  {
    eyebrow: "Compliance",
    title: "Audit-ready exports in one click.",
    description: "Download a complete CSV or JSON log of every edit, re-detection, repositioning and PDF export.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=70",
  },
];

function SavedPage() {
  const [items, setItems] = useState<SavedTemplate[]>([]);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const navigate = useNavigate();

  const refresh = () => setItems(listTemplates());
  useEffect(() => { refresh(); }, []);

  const onDuplicate = (id: string) => { duplicateTemplate(id); refresh(); };
  const onDelete = (id: string) => { if (confirm("Delete this template and all versions?")) { deleteTemplate(id); refresh(); } };
  const startRename = (t: SavedTemplate) => { setRenaming(t.id); setRenameValue(t.name); };
  const commitRename = () => { if (renaming) { renameTemplate(renaming, renameValue.trim() || "Untitled"); setRenaming(null); refresh(); } };

  return (
    <AppShell>
      <HeroSlider slides={HERO_SLIDES} />

      <PageHeader
        eyebrow="My Library"
        title="Saved Smart Templates"
        description="Reopen any template, edit variables and layout, save new versions, and regenerate PDFs anytime."
        actions={
          <button
            onClick={() => navigate({ to: "/documents/new" })}
            className="inline-flex items-center gap-2 bg-[var(--navy)] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> New Template
          </button>
        }
      />

      {items.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-secondary items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-[var(--navy)]" />
          </div>
          <h3 className="font-display font-bold text-xl text-[var(--navy)]">No saved templates yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">Upload a master document, let AI map the fields, then save it here to reuse forever.</p>
          <Link to="/documents/new" className="mt-5 inline-flex items-center gap-2 bg-[var(--navy)] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:brightness-110">
            <Plus className="h-4 w-4" /> Create First Template
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => {
            const ver = t.versions.find((v) => v.v === t.currentVersion) ?? t.versions[t.versions.length - 1];
            const boundCount = ver.fields.filter((f) => f.boundVar).length;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card-surface p-5 hover-lift flex flex-col"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="h-11 w-11 rounded-xl bg-[var(--navy)] text-white flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-secondary rounded px-2 py-0.5">{t.tag}</span>
                </div>
                <div className="mt-3 flex-1">
                  {renaming === t.id ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenaming(null); }}
                      className="w-full bg-transparent border-b border-[var(--navy)] outline-none font-display font-bold text-[var(--navy)]"
                    />
                  ) : (
                    <h3 className="font-display font-bold text-[var(--navy)] truncate">{t.name}</h3>
                  )}
                  <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Layers className="h-3 w-3" /> v{t.currentVersion} · {t.versions.length} version(s)</span>
                    <span className="inline-flex items-center gap-1"><Sparkles className="h-3 w-3" /> {boundCount} bound</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(t.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    to="/documents/new"
                    search={{ templateId: t.id }}
                    className="flex-1 text-center bg-[var(--navy)] text-white rounded-lg px-3 py-2 text-xs font-bold hover:brightness-110 inline-flex items-center justify-center gap-1"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Open & Edit
                  </Link>
                  <button onClick={() => startRename(t)} title="Rename" className="h-9 w-9 rounded-lg bg-secondary hover:bg-border flex items-center justify-center text-[var(--navy)]">
                    <History className="h-4 w-4" />
                  </button>
                  <button onClick={() => onDuplicate(t.id)} title="Duplicate" className="h-9 w-9 rounded-lg bg-secondary hover:bg-border flex items-center justify-center text-[var(--navy)]">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button onClick={() => onDelete(t.id)} title="Delete" className="h-9 w-9 rounded-lg bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <AuditPanel template={t} />
              </motion.div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

function AuditPanel({ template }: { template: SavedTemplate }) {
  const [versionFilter, setVersionFilter] = useState<number | "all">("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const events = template.audit ?? [];

  const filtered = useMemo(() => {
    const group = EVENT_GROUPS.find((g) => g.key === eventFilter);
    return [...events].reverse().filter((e) => {
      if (versionFilter !== "all" && (e.meta?.version ?? template.currentVersion) !== versionFilter) {
        // Only "version_saved" events carry a version meta; for other events
        // we associate them with the version active at that moment by
        // counting prior version_saved events.
        const ts = e.ts;
        let v = 1;
        for (const ev of events) {
          if (ev.ts > ts) break;
          if (ev.type === "version_saved" && typeof ev.meta?.version === "number") v = ev.meta.version as number;
        }
        if (v !== versionFilter) return false;
      }
      if (group && group.key !== "all" && !group.match.includes(e.type)) return false;
      return true;
    });
  }, [events, eventFilter, versionFilter, template.currentVersion]);

  if (events.length === 0) return null;

  const downloadCsv = () => downloadFile(toCsv(filtered), `${slug(template.name)}-audit.csv`, "text/csv");
  const downloadJson = () => downloadFile(JSON.stringify(filtered.map(serializeEvent), null, 2), `${slug(template.name)}-audit.json`, "application/json");

  return (
    <details className="mt-3 group">
      <summary className="text-[11px] font-bold text-muted-foreground cursor-pointer hover:text-[var(--navy)] inline-flex items-center gap-1.5 list-none">
        <ClipboardList className="h-3.5 w-3.5" /> Audit Log ({events.length})
      </summary>

      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
            <Filter className="h-3 w-3" /> Version
          </span>
          <select
            value={versionFilter === "all" ? "all" : String(versionFilter)}
            onChange={(e) => setVersionFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="text-[10.5px] bg-secondary rounded px-1.5 py-1 font-semibold text-[var(--navy)] outline-none"
          >
            <option value="all">All</option>
            {template.versions.map((v) => <option key={v.v} value={v.v}>v{v.v}</option>)}
          </select>

          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">
            Type
          </span>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="text-[10.5px] bg-secondary rounded px-1.5 py-1 font-semibold text-[var(--navy)] outline-none"
          >
            {EVENT_GROUPS.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}
          </select>

          <div className="flex-1" />
          <button onClick={downloadCsv} title="Download CSV" className="inline-flex items-center gap-1 text-[10.5px] font-bold rounded px-2 py-1 bg-[var(--navy)] text-white hover:brightness-110">
            <Download className="h-3 w-3" /> CSV
          </button>
          <button onClick={downloadJson} title="Download JSON" className="inline-flex items-center gap-1 text-[10.5px] font-bold rounded px-2 py-1 bg-white border border-border text-[var(--navy)] hover:bg-secondary">
            <Download className="h-3 w-3" /> JSON
          </button>
        </div>

        <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
          {filtered.length === 0 && (
            <div className="text-[10.5px] text-muted-foreground italic">No events match these filters.</div>
          )}
          {filtered.slice(0, 60).map((e, idx) => (
            <div key={idx} className="text-[10.5px] flex items-start gap-2 border-l-2 border-[var(--navy)]/30 pl-2">
              <span className="font-mono text-muted-foreground shrink-0">{new Date(e.ts).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              <span className="text-foreground">{e.message}</span>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}

function serializeEvent(e: AuditEvent) {
  return {
    timestamp: new Date(e.ts).toISOString(),
    type: e.type,
    message: e.message,
    meta: e.meta ?? {},
  };
}

function toCsv(events: AuditEvent[]) {
  const rows = [["timestamp", "type", "message", "meta"]];
  for (const e of events) {
    rows.push([
      new Date(e.ts).toISOString(),
      e.type,
      e.message,
      e.meta ? JSON.stringify(e.meta) : "",
    ]);
  }
  return rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "template";
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
