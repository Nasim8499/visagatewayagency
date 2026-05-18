// Local persistence layer for smart templates with versioning.
// Persists in localStorage so users can reopen, edit, duplicate and regenerate.

export type SavedField = {
  id: string;
  label: string;
  type: "text" | "date" | "number" | "table" | "signature" | "qr" | "barcode" | "header" | "footer" | "watermark" | "image";
  confidence: number;
  page: number;
  bbox: { x: number; y: number; w: number; h: number }; // percentages 0-100
  boundVar?: string;
  sample?: string;
};

export type SavedTable = {
  fieldId: string;
  columns: { key: string; label: string }[];
  rows: Record<string, string>[];
};

export type SavedVersion = {
  v: number;
  createdAt: number;
  note: string;
  fields: SavedField[];
  tables: SavedTable[];
};

export type AuditEventType =
  | "created" | "edited" | "renamed" | "duplicated" | "version_saved"
  | "field_redetected" | "field_moved" | "field_bound" | "field_removed"
  | "exported" | "test_generated";

export type AuditEvent = {
  ts: number;
  type: AuditEventType;
  message: string;
  meta?: Record<string, string | number>;
};

export type SavedTemplate = {
  id: string;
  name: string;
  tag: string;
  sourceFile?: string;
  createdAt: number;
  updatedAt: number;
  currentVersion: number;
  versions: SavedVersion[];
  audit?: AuditEvent[];
};

const KEY = "vh.savedTemplates.v1";

function read(): SavedTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedTemplate[]) : [];
  } catch {
    return [];
  }
}

function write(list: SavedTemplate[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function listTemplates(): SavedTemplate[] {
  return read().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getTemplate(id: string): SavedTemplate | undefined {
  return read().find((t) => t.id === id);
}

export function saveNewTemplate(input: {
  name: string;
  tag?: string;
  sourceFile?: string;
  fields: SavedField[];
  tables: SavedTable[];
}): SavedTemplate {
  const now = Date.now();
  const tpl: SavedTemplate = {
    id: `tpl_${now.toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    name: input.name,
    tag: input.tag ?? "Custom",
    sourceFile: input.sourceFile,
    createdAt: now,
    updatedAt: now,
    currentVersion: 1,
    versions: [{ v: 1, createdAt: now, note: "Initial version", fields: input.fields, tables: input.tables }],
    audit: [{ ts: now, type: "created", message: `Template "${input.name}" created` }],
  };
  const list = read();
  list.push(tpl);
  write(list);
  return tpl;
}

export function saveNewVersion(id: string, fields: SavedField[], tables: SavedTable[], note = "Updated"): SavedTemplate | undefined {
  const list = read();
  const tpl = list.find((t) => t.id === id);
  if (!tpl) return;
  const nextV = tpl.currentVersion + 1;
  tpl.versions.push({ v: nextV, createdAt: Date.now(), note, fields, tables });
  tpl.currentVersion = nextV;
  tpl.updatedAt = Date.now();
  (tpl.audit ??= []).push({ ts: Date.now(), type: "version_saved", message: `Saved version v${nextV} — ${note}`, meta: { version: nextV } });
  write(list);
  return tpl;
}

export function duplicateTemplate(id: string): SavedTemplate | undefined {
  const src = getTemplate(id);
  if (!src) return;
  const v = src.versions.find((x) => x.v === src.currentVersion) ?? src.versions[src.versions.length - 1];
  const dup = saveNewTemplate({
    name: `${src.name} (copy)`,
    tag: src.tag,
    sourceFile: src.sourceFile,
    fields: JSON.parse(JSON.stringify(v.fields)),
    tables: JSON.parse(JSON.stringify(v.tables)),
  });
  appendAudit(dup.id, { type: "duplicated", message: `Duplicated from "${src.name}"`, meta: { sourceId: src.id } });
  return dup;
}

export function deleteTemplate(id: string) {
  write(read().filter((t) => t.id !== id));
}

export function renameTemplate(id: string, name: string) {
  const list = read();
  const tpl = list.find((t) => t.id === id);
  if (!tpl) return;
  const old = tpl.name;
  tpl.name = name;
  tpl.updatedAt = Date.now();
  (tpl.audit ??= []).push({ ts: Date.now(), type: "renamed", message: `Renamed "${old}" → "${name}"` });
  write(list);
}

export function appendAudit(id: string, ev: Omit<AuditEvent, "ts">) {
  const list = read();
  const tpl = list.find((t) => t.id === id);
  if (!tpl) return;
  (tpl.audit ??= []).push({ ts: Date.now(), ...ev });
  // cap history at 200 entries
  if (tpl.audit.length > 200) tpl.audit = tpl.audit.slice(-200);
  tpl.updatedAt = Date.now();
  write(list);
}

export function getVersion(tpl: SavedTemplate, v?: number): SavedVersion {
  const ver = tpl.versions.find((x) => x.v === (v ?? tpl.currentVersion));
  return ver ?? tpl.versions[tpl.versions.length - 1];
}
