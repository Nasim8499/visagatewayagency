import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/ui-bits";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  FileText, Copy, Trash2, Pencil, History, Plus, Sparkles, Calendar, Layers, ClipboardList,
} from "lucide-react";
import {
  listTemplates, duplicateTemplate, deleteTemplate, renameTemplate,
  type SavedTemplate,
} from "@/lib/savedTemplates";

export const Route = createFileRoute("/documents/saved")({
  head: () => ({ meta: [{ title: "Saved Templates — VisaHOBe" }] }),
  component: SavedPage,
});

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
                {(t.audit?.length ?? 0) > 0 && (
                  <details className="mt-3 group">
                    <summary className="text-[11px] font-bold text-muted-foreground cursor-pointer hover:text-[var(--navy)] inline-flex items-center gap-1.5 list-none">
                      <ClipboardList className="h-3.5 w-3.5" /> Audit Log ({t.audit!.length})
                    </summary>
                    <div className="mt-2 max-h-40 overflow-y-auto space-y-1.5 pr-1">
                      {[...t.audit!].reverse().slice(0, 30).map((e, idx) => (
                        <div key={idx} className="text-[10.5px] flex items-start gap-2 border-l-2 border-[var(--navy)]/30 pl-2">
                          <span className="font-mono text-muted-foreground shrink-0">{new Date(e.ts).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                          <span className="text-foreground">{e.message}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
