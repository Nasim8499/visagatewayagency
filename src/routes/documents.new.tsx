import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { motion, AnimatePresence } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type PointerEvent as RPointerEvent } from "react";
import {
  Upload, FileText, ScanLine, Brain, Sparkles, Check, X, ArrowRight, ArrowLeft,
  Type, Table as TableIcon, QrCode, Barcode, PenLine, Image as ImageIcon,
  Layers, ShieldCheck, Download, Plus, Trash2, Eye, Wand2, FileCheck2,
  Cloud, AlertCircle, CheckCircle2, RefreshCw, Move, Save, Zap, History,
  Undo2, Redo2, Grid3x3, PlayCircle,
} from "lucide-react";
import { allVariables } from "@/lib/templates";
import {
  saveNewTemplate, saveNewVersion, getTemplate, getVersion, appendAudit,
  type SavedField, type SavedTable,
} from "@/lib/savedTemplates";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const Route = createFileRoute("/documents/new")({
  head: () => ({ meta: [{ title: "Create Template — VisaHOBe" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    templateId: typeof s.templateId === "string" ? s.templateId : undefined,
  }),
  component: NewTemplatePage,
});

type DetectedField = SavedField;
type TableConfig = SavedTable;

const STEPS = [
  { id: 1, title: "Upload", icon: Upload },
  { id: 2, title: "AI Detect", icon: Brain },
  { id: 3, title: "Review & Map", icon: Wand2 },
  { id: 4, title: "Generate PDF", icon: Download },
] as const;

const fieldIcon = {
  text: Type, date: Type, number: Type, image: ImageIcon,
  table: TableIcon, signature: PenLine, qr: QrCode, barcode: Barcode,
  header: Layers, footer: Layers, watermark: ShieldCheck,
} as const;

const fieldTone: Record<DetectedField["type"], string> = {
  text: "bg-blue-50 text-blue-700 border-blue-200",
  date: "bg-blue-50 text-blue-700 border-blue-200",
  number: "bg-blue-50 text-blue-700 border-blue-200",
  image: "bg-violet-50 text-violet-700 border-violet-200",
  table: "bg-emerald-50 text-emerald-700 border-emerald-200",
  signature: "bg-rose-50 text-rose-700 border-rose-200",
  qr: "bg-amber-50 text-amber-700 border-amber-200",
  barcode: "bg-amber-50 text-amber-700 border-amber-200",
  header: "bg-slate-100 text-slate-700 border-slate-200",
  footer: "bg-slate-100 text-slate-700 border-slate-200",
  watermark: "bg-orange-50 text-orange-700 border-orange-200",
};

const POSITIONABLE = ["qr", "barcode", "signature", "image", "header", "footer", "watermark"] as const;
function isPositionable(t: DetectedField["type"]) {
  return (POSITIONABLE as readonly string[]).includes(t);
}

function mockDetect(fileName: string): { fields: DetectedField[]; tables: TableConfig[] } {
  const isInvoice = /invoice|salary|slip/i.test(fileName);
  const jitter = () => Math.round((0.82 + Math.random() * 0.17) * 100) / 100;
  const baseFields: DetectedField[] = [
    { id: "f1", label: "Document Title", type: "header", confidence: jitter(), page: 1, bbox: { x: 10, y: 8, w: 80, h: 6 }, sample: "EMPLOYMENT CONTRACT" },
    { id: "f2", label: "Full Name", type: "text", confidence: jitter(), page: 1, bbox: { x: 10, y: 22, w: 50, h: 5 }, boundVar: "FULL_NAME", sample: "Arif Hossain" },
    { id: "f3", label: "Passport Number", type: "text", confidence: jitter(), page: 1, bbox: { x: 10, y: 29, w: 40, h: 5 }, boundVar: "PASSPORT_NUMBER", sample: "A12345678" },
    { id: "f4", label: "Date of Birth", type: "date", confidence: jitter(), page: 1, bbox: { x: 55, y: 29, w: 30, h: 5 }, boundVar: "DATE_OF_BIRTH", sample: "12/05/1995" },
    { id: "f5", label: "Nationality", type: "text", confidence: jitter(), page: 1, bbox: { x: 10, y: 36, w: 40, h: 5 }, boundVar: "NATIONALITY", sample: "Bangladeshi" },
    { id: "f6", label: "Employer Name", type: "text", confidence: jitter(), page: 1, bbox: { x: 10, y: 43, w: 55, h: 5 }, boundVar: "EMPLOYER_NAME", sample: "TechBuild Pte. Ltd." },
    { id: "f7", label: "Job Title", type: "text", confidence: jitter(), page: 1, bbox: { x: 10, y: 50, w: 40, h: 5 }, boundVar: "JOB_TITLE", sample: "Electrician" },
    { id: "f8", label: "Salary Breakdown", type: "table", confidence: jitter(), page: 1, bbox: { x: 10, y: 58, w: 80, h: 25 } },
    { id: "f9", label: "Verification QR", type: "qr", confidence: jitter(), page: 1, bbox: { x: 82, y: 84, w: 12, h: 12 }, boundVar: "QR_CODE" },
    { id: "f10", label: "Tracking Barcode", type: "barcode", confidence: jitter(), page: 1, bbox: { x: 6, y: 88, w: 28, h: 7 }, boundVar: "BARCODE" },
    { id: "f11", label: "Employer Signature", type: "signature", confidence: jitter(), page: 1, bbox: { x: 42, y: 86, w: 28, h: 8 }, boundVar: "SIGNATURE" },
    { id: "f12", label: "Page Footer", type: "footer", confidence: jitter(), page: 1, bbox: { x: 5, y: 95, w: 90, h: 4 }, sample: "VisaHOBe Pte. Ltd. · Confidential" },
    { id: "f13", label: "Watermark Seal", type: "watermark", confidence: jitter(), page: 1, bbox: { x: 30, y: 40, w: 40, h: 20 }, sample: "OFFICIAL" },
  ];
  const tables: TableConfig[] = [{
    fieldId: "f8",
    columns: [
      { key: "item", label: "Component" },
      { key: "qty", label: "Qty / Month" },
      { key: "rate", label: "Rate (SGD)" },
      { key: "amount", label: "Amount (SGD)" },
    ],
    rows: isInvoice
      ? Array.from({ length: 18 }).map((_, i) => ({
          item: ["Basic Salary", "Overtime", "Allowance", "Bonus", "Transport", "Meal"][i % 6] + ` #${i + 1}`,
          qty: String(1 + (i % 5)),
          rate: String(120 + i * 7),
          amount: String((120 + i * 7) * (1 + (i % 5))),
        }))
      : [
          { item: "Basic Salary", qty: "1", rate: "1,200", amount: "1,200" },
          { item: "Housing Allowance", qty: "1", rate: "200", amount: "200" },
          { item: "Transport", qty: "1", rate: "120", amount: "120" },
        ],
  }];
  return { fields: baseFields, tables };
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between gap-2 mb-6 overflow-x-auto pb-1">
      {STEPS.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;
        return (
          <div key={s.id} className="flex items-center gap-2 shrink-0 flex-1 min-w-0">
            <motion.div
              initial={false}
              animate={{ scale: active ? 1.05 : 1 }}
              className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition ${
                done ? "bg-[var(--color-success)] text-white"
                  : active ? "bg-[var(--navy)] text-white shadow-md"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
            </motion.div>
            <div className="hidden sm:block min-w-0">
              <div className={`text-[11px] uppercase tracking-wider font-semibold ${active ? "text-[var(--navy)]" : "text-muted-foreground"}`}>Step {s.id}</div>
              <div className={`text-[13px] font-bold truncate ${active ? "text-[var(--navy)]" : "text-foreground"}`}>{s.title}</div>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 rounded-full ${done ? "bg-[var(--color-success)]" : "bg-border"}`} />}
          </div>
        );
      })}
    </div>
  );
}

function StepUpload({ onFile }: { onFile: (f: File) => void }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const handle = useCallback((files: FileList | null) => { if (files && files[0]) onFile(files[0]); }, [onFile]);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-surface p-6 md:p-10">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e: DragEvent) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
        onClick={() => ref.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 md:p-16 text-center transition-all ${drag ? "border-[var(--navy)] bg-[oklch(0.94_0.04_258)]" : "border-[oklch(0.78_0.06_258)] bg-[oklch(0.98_0.01_258)] hover:border-[var(--navy)]"}`}
      >
        <input ref={ref} type="file" hidden accept=".pdf,.docx,.png,.jpg,.jpeg" onChange={(e) => handle(e.target.files)} />
        <motion.div animate={{ y: drag ? -6 : 0 }} className="inline-flex h-20 w-20 rounded-2xl bg-white items-center justify-center mb-5 shadow-md">
          <Cloud className="h-10 w-10 text-[var(--navy)]" strokeWidth={1.5} />
        </motion.div>
        <h3 className="font-display font-bold text-xl text-[var(--navy)]">Upload Your Master Document</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">Drop a PDF, DOCX, PNG or JPG. AI scans layout, fonts, tables, signatures and QR/barcodes automatically.</p>
        <button className="mt-6 inline-flex items-center gap-2 bg-[var(--navy)] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:brightness-110 transition">
          <Upload className="h-4 w-4" /> Choose Document
        </button>
        <div className="mt-3 text-[11px] text-muted-foreground">or drag and drop here · Max 25 MB</div>
      </div>
    </motion.div>
  );
}

function StepDetect({ file, onComplete }: { file: File; onComplete: (f: DetectedField[], t: TableConfig[]) => void }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const stages = useMemo(() => [
    "Parsing document structure…", "Extracting fonts and styles…",
    "Detecting text fields and labels…", "Identifying tables and repeating rows…",
    "Locating QR codes, barcodes and signatures…", "Mapping watermarks, headers and footers…",
    "Compiling smart template…",
  ], []);
  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += 3 + Math.random() * 4;
      if (p >= 100) {
        p = 100; clearInterval(id);
        setTimeout(() => { const { fields, tables } = mockDetect(file.name); onComplete(fields, tables); }, 400);
      }
      setProgress(Math.min(100, p));
      setStage(Math.min(stages.length - 1, Math.floor((p / 100) * stages.length)));
    }, 200);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-surface p-6 md:p-10">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-32 w-32 mb-6">
          <div className="absolute inset-0 rounded-full border-[6px] border-[oklch(0.94_0.04_258)]" />
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--navy)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${progress * 2.76} 276`} className="transition-all duration-300" />
          </svg>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute inset-0 flex items-center justify-center">
            <Brain className="h-10 w-10 text-[var(--navy)]" />
          </motion.div>
          <div className="absolute -bottom-1 inset-x-0 text-center text-xs font-mono font-bold text-[var(--navy)]">{Math.round(progress)}%</div>
        </div>
        <h3 className="font-display font-bold text-xl text-[var(--navy)]">AI is analysing your document</h3>
        <p className="text-sm text-muted-foreground mt-1">{file.name} · {(file.size / 1024).toFixed(0)} KB</p>
        <div className="mt-6 w-full max-w-md space-y-2">
          {stages.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0.3 }} animate={{ opacity: i <= stage ? 1 : 0.3 }} className="flex items-center gap-3 text-left text-sm">
              {i < stage ? <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" />
                : i === stage ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><ScanLine className="h-4 w-4 text-[var(--navy)]" /></motion.div>
                : <div className="h-4 w-4 rounded-full border-2 border-border" />}
              <span className={i <= stage ? "text-foreground font-medium" : "text-muted-foreground"}>{s}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const tone = pct >= 92 ? "bg-[var(--color-success)]" : pct >= 80 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[10px] font-mono font-bold ${pct >= 92 ? "text-[var(--color-success)]" : pct >= 80 ? "text-amber-600" : "text-rose-600"}`}>{pct}%</span>
    </div>
  );
}

function FieldRow({ field, onChange, onRemove, onRedetect }: {
  field: DetectedField; onChange: (f: DetectedField) => void; onRemove: () => void; onRedetect: () => void;
}) {
  const Icon = fieldIcon[field.type as keyof typeof fieldIcon] ?? Type;
  const canBind = !["header", "footer", "watermark", "table"].includes(field.type);
  const low = field.confidence < 0.9;
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className={`card-surface p-3.5 hover-lift ${low ? "ring-1 ring-amber-300" : ""}`}>
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${fieldTone[field.type]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <input value={field.label} onChange={(e) => onChange({ ...field, label: e.target.value })} className="bg-transparent outline-none border-b border-transparent hover:border-border focus:border-[var(--navy)] text-[14px] font-semibold text-[var(--navy)] min-w-0" />
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${fieldTone[field.type]}`}>{field.type}</span>
            <ConfidenceBar value={field.confidence} />
            {low && (
              <button onClick={onRedetect} title="Re-run AI on this field" className="text-[10px] inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded px-1.5 py-0.5">
                <RefreshCw className="h-3 w-3" /> Re-detect
              </button>
            )}
          </div>
          {field.sample && <div className="text-[11px] text-muted-foreground mt-1 truncate">Sample: "{field.sample}"</div>}
          {canBind && (
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-muted-foreground">Bind →</span>
              <select value={field.boundVar ?? ""} onChange={(e) => onChange({ ...field, boundVar: e.target.value || undefined })} className="bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-[12px] font-mono font-semibold text-[var(--navy)] outline-none focus:border-[var(--navy)]">
                <option value="">— unmapped —</option>
                {allVariables.filter((v) => v.type === field.type || (["text", "date", "number"].includes(field.type) && ["text", "date", "number"].includes(v.type))).map((v) => (
                  <option key={v.key} value={v.key}>{`{{${v.key}}} · ${v.label}`}</option>
                ))}
              </select>
              {field.boundVar && <span className="text-[10px] text-[var(--color-success)] font-bold flex items-center gap-1"><Check className="h-3 w-3" /> bound</span>}
            </div>
          )}
          {field.type === "table" && (
            <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
              <TableIcon className="h-3 w-3" /> Repeating rows — auto-paginated across pages
            </div>
          )}
          {isPositionable(field.type) && (
            <div className="text-[10px] text-muted-foreground mt-1 inline-flex items-center gap-1">
              <Move className="h-3 w-3" /> Drag on preview to reposition · x:{Math.round(field.bbox.x)}% y:{Math.round(field.bbox.y)}%
            </div>
          )}
        </div>
        <button onClick={onRemove} className="h-8 w-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground" aria-label="Remove">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

function TableEditor({ table, onChange }: { table: TableConfig; onChange: (t: TableConfig) => void }) {
  const addRow = () => onChange({ ...table, rows: [...table.rows, Object.fromEntries(table.columns.map((c) => [c.key, ""]))] });
  const updateCell = (rIdx: number, key: string, val: string) => onChange({ ...table, rows: table.rows.map((r, i) => i === rIdx ? { ...r, [key]: val } : r) });
  const removeRow = (i: number) => onChange({ ...table, rows: table.rows.filter((_, j) => j !== i) });
  return (
    <div className="card-surface p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TableIcon className="h-4 w-4 text-emerald-700" />
          <span className="font-display font-bold text-sm text-[var(--navy)]">Dynamic Table · {table.rows.length} rows</span>
          <span className="text-[10px] text-muted-foreground">(auto-paginates ~18/page)</span>
        </div>
        <button onClick={addRow} className="text-[12px] font-semibold text-[var(--navy)] inline-flex items-center gap-1 hover:underline">
          <Plus className="h-3.5 w-3.5" /> Add row
        </button>
      </div>
      <div className="overflow-x-auto max-h-64 overflow-y-auto">
        <table className="w-full text-[12px]">
          <thead className="sticky top-0 bg-secondary">
            <tr>{table.columns.map((c) => <th key={c.key} className="text-left px-2 py-2 font-bold text-[var(--navy)]">{c.label}</th>)}<th /></tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i} className="border-b border-border">
                {table.columns.map((c) => (
                  <td key={c.key} className="p-1">
                    <input value={r[c.key] ?? ""} onChange={(e) => updateCell(i, c.key, e.target.value)} className="w-full bg-transparent rounded px-2 py-1.5 outline-none hover:bg-secondary focus:bg-secondary" />
                  </td>
                ))}
                <td><button onClick={() => removeRow(i)} className="h-7 w-7 rounded hover:bg-rose-50 text-rose-500 flex items-center justify-center"><Trash2 className="h-3.5 w-3.5" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QRBlock({ size = 64 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="grid grid-cols-8 gap-[1px] bg-white p-1 border border-slate-900">
      {Array.from({ length: 64 }).map((_, i) => {
        const on = (i * 7 + 3) % 5 < 2 || i % 11 === 0;
        return <div key={i} className={on ? "bg-slate-900" : "bg-white"} />;
      })}
    </div>
  );
}
function BarcodeBlock({ width = 140, height = 36 }: { width?: number; height?: number }) {
  const bars = Array.from({ length: 30 }).map((_, i) => ((i * 13) % 5) + 1);
  return (
    <div style={{ width, height }} className="flex items-end gap-[2px] bg-white p-1">
      {bars.map((b, i) => <div key={i} style={{ height: `${60 + (b * 6)}%`, width: `${b}px` }} className="bg-slate-900" />)}
    </div>
  );
}

const NAVY = "#152a4d";
const RED = "#e63946";
const ROWS_PER_PAGE = 18;

function renderFieldVisual(f: DetectedField, applicant: Record<string, string>) {
  if (f.type === "qr") return <QRBlock size={56} />;
  if (f.type === "barcode") return <BarcodeBlock width={120} height={30} />;
  if (f.type === "signature") return (
    <div className="text-center">
      <div style={{ color: NAVY, borderBottom: "1px solid #334155" }} className="font-display italic text-[14px] px-3 pb-0.5">{applicant.SIGNATURE || "A. Hossain"}</div>
      <div style={{ color: "#64748b" }} className="text-[8px] mt-1">{f.label}</div>
    </div>
  );
  if (f.type === "image") return <div className="h-full w-full bg-zinc-100 border border-zinc-300 flex items-center justify-center text-[8px] text-zinc-400">PHOTO</div>;
  if (f.type === "header") return <div style={{ color: NAVY }} className="text-center font-display font-extrabold tracking-wider text-[14px]">{f.sample}</div>;
  if (f.type === "footer") return <div style={{ color: "#64748b", backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0" }} className="w-full h-full flex items-center justify-center text-[8px]">{f.sample}</div>;
  if (f.type === "watermark") return <div style={{ color: "rgba(15,23,42,0.06)" }} className="w-full h-full flex items-center justify-center text-5xl font-display font-extrabold rotate-[-30deg] tracking-widest select-none">{f.sample}</div>;
  return null;
}

// One A4 page rendering with absolute positioning + table chunk
function DocumentPage({
  fields, table, applicant, tableSlice, isFirstPage, totalPages, pageNum, editable, onMove, refEl, snap, showGrid,
}: {
  fields: DetectedField[]; table?: TableConfig; applicant: Record<string, string>;
  tableSlice: Record<string, string>[]; isFirstPage: boolean; totalPages: number; pageNum: number;
  editable?: boolean; onMove?: (id: string, x: number, y: number) => void; refEl?: React.Ref<HTMLDivElement>;
  snap?: boolean; showGrid?: boolean;
}) {
  const paperRef = useRef<HTMLDivElement>(null);
  const [guides, setGuides] = useState<{ v?: number; h?: number; cv?: boolean; ch?: boolean }>({});
  const positioned = fields.filter((f) => isPositionable(f.type));
  const textFields = fields.filter((f) => ["text", "date", "number"].includes(f.type));
  const tableField = fields.find((f) => f.type === "table");

  const onDragStart = (e: RPointerEvent<HTMLDivElement>, id: string) => {
    if (!editable) return;
    e.preventDefault();
    const paper = paperRef.current; if (!paper) return;
    const rect = paper.getBoundingClientRect();
    const SNAP_STEP = 2; // % grid
    const GUIDE_TOL = 1.2; // %
    const others = positioned.filter((p) => p.id !== id);

    const move = (ev: PointerEvent) => {
      let nx = ((ev.clientX - rect.left) / rect.width) * 100 - 5;
      let ny = ((ev.clientY - rect.top) / rect.height) * 100 - 3;
      nx = Math.max(0, Math.min(95, nx));
      ny = Math.max(0, Math.min(97, ny));

      // alignment guides — snap to centers/edges of other items + page center
      const targetsX = [50 - 0, ...others.map((o) => o.bbox.x), ...others.map((o) => o.bbox.x + o.bbox.w / 2)];
      const targetsY = [50, ...others.map((o) => o.bbox.y), ...others.map((o) => o.bbox.y + o.bbox.h / 2)];
      let vGuide: number | undefined; let hGuide: number | undefined; let cv = false; let ch = false;
      for (const tx of targetsX) {
        if (Math.abs(nx - tx) < GUIDE_TOL) { vGuide = tx; nx = tx; if (tx === 50) cv = true; break; }
      }
      for (const ty of targetsY) {
        if (Math.abs(ny - ty) < GUIDE_TOL) { hGuide = ty; ny = ty; if (ty === 50) ch = true; break; }
      }

      if (snap) {
        nx = Math.round(nx / SNAP_STEP) * SNAP_STEP;
        ny = Math.round(ny / SNAP_STEP) * SNAP_STEP;
      }
      setGuides({ v: vGuide, h: hGuide, cv, ch });
      onMove?.(id, nx, ny);
    };
    const up = () => {
      setGuides({});
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const renderText = (f: DetectedField) => {
    if (f.boundVar && applicant[f.boundVar]) return applicant[f.boundVar];
    return f.sample ?? `{{${f.boundVar ?? f.label}}}`;
  };

  return (
    <div
      ref={(node) => {
        (paperRef as { current: HTMLDivElement | null }).current = node;
        if (typeof refEl === "function") refEl(node);
        else if (refEl) (refEl as { current: HTMLDivElement | null }).current = node;
      }}
      style={{ color: "#0f172a", backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
      className="relative aspect-[1/1.414] mx-auto w-full max-w-[560px] rounded shadow-md overflow-hidden border"
    >
      <div style={{ backgroundColor: NAVY }} className="h-10 flex items-center justify-between px-4 text-white">
        <div className="flex items-center gap-2">
          <div style={{ backgroundColor: RED }} className="h-5 w-5 rounded flex items-center justify-center text-[10px]">✈</div>
          <div className="text-[10px] font-extrabold tracking-tight">VisaHOBe</div>
        </div>
        <div className="text-[9px] font-mono opacity-70">PAGE {pageNum} / {totalPages}</div>
      </div>

      {/* Body */}
      <div className="px-6 pt-4 relative" style={{ minHeight: "calc(100% - 40px)" }}>
        {isFirstPage && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10.5px] mt-8">
            {textFields.map((f) => (
              <div key={f.id} className="leading-tight">
                <div style={{ color: "#64748b" }} className="text-[8px] uppercase tracking-wider font-semibold">{f.label}</div>
                <div style={{ color: NAVY }} className="font-semibold">
                  {f.boundVar && applicant[f.boundVar] ? (
                    <span style={{ backgroundColor: "#fef3c7", borderRadius: 3, padding: "0 4px" }}>{applicant[f.boundVar]}</span>
                  ) : (renderText(f))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tableField && table && tableSlice.length > 0 && (
          <div className="mt-4">
            <div style={{ color: "#64748b" }} className="text-[8px] uppercase tracking-wider font-semibold mb-1">
              {tableField.label} {totalPages > 1 && `(cont. p${pageNum})`}
            </div>
            <table className="w-full text-[9px]" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#eef2f9", color: NAVY }}>
                  {table.columns.map((c) => <th key={c.key} className="text-left px-2 py-1.5 font-bold">{c.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {tableSlice.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    {table.columns.map((c) => <td key={c.key} className="px-2 py-1.5">{r[c.key]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid overlay (editable) */}
        {editable && showGrid && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(21,42,77,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(21,42,77,0.06) 1px, transparent 1px)",
              backgroundSize: "5% 5%",
            }}
          />
        )}

        {/* Alignment guides */}
        {editable && guides.v !== undefined && (
          <div className={`absolute top-0 bottom-0 w-px pointer-events-none ${guides.cv ? "bg-rose-500" : "bg-cyan-500"}`} style={{ left: `${guides.v}%` }} />
        )}
        {editable && guides.h !== undefined && (
          <div className={`absolute left-0 right-0 h-px pointer-events-none ${guides.ch ? "bg-rose-500" : "bg-cyan-500"}`} style={{ top: `${guides.h - 10}%` }} />
        )}

        {/* Absolute positioned items */}
        {positioned.map((f) => (
          <div
            key={f.id}
            onPointerDown={(e) => onDragStart(e, f.id)}
            style={{
              position: "absolute",
              left: `${f.bbox.x}%`, top: `${f.bbox.y - 10}%`,
              width: `${f.bbox.w}%`, height: `${f.bbox.h}%`,
              cursor: editable ? "grab" : "default",
              touchAction: "none",
            }}
            className={editable ? "outline-dashed outline-1 outline-[var(--navy)]/40 hover:outline-[var(--navy)] rounded-sm transition-colors" : ""}
          >
            <div className="w-full h-full flex items-center justify-center pointer-events-none">
              {renderFieldVisual(f, applicant)}
            </div>
            {editable && (
              <div className="absolute -top-4 left-0 text-[8px] font-bold text-[var(--navy)] bg-white/90 px-1 rounded pointer-events-none">
                {f.label}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentRender({
  fields, tables, applicant = {}, editable, onMove, pageRefs, snap, showGrid,
}: {
  fields: DetectedField[]; tables: TableConfig[]; applicant?: Record<string, string>;
  editable?: boolean; onMove?: (id: string, x: number, y: number) => void;
  pageRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>;
  snap?: boolean; showGrid?: boolean;
}) {
  const tableField = fields.find((f) => f.type === "table");
  const table = tableField ? tables.find((t) => t.fieldId === tableField.id) : undefined;
  const rows = table?.rows ?? [];
  const tablePages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));
  const totalPages = tablePages;

  return (
    <div className="space-y-4">
      {Array.from({ length: totalPages }).map((_, i) => {
        const slice = rows.slice(i * ROWS_PER_PAGE, (i + 1) * ROWS_PER_PAGE);
        return (
          <DocumentPage
            key={i}
            fields={fields}
            table={table}
            applicant={applicant}
            tableSlice={slice}
            isFirstPage={i === 0}
            totalPages={totalPages}
            pageNum={i + 1}
            editable={editable && i === 0}
            onMove={onMove}
            snap={snap}
            showGrid={showGrid}
            refEl={(el) => { if (pageRefs) pageRefs.current[i] = el; }}
          />
        );
      })}
    </div>
  );
}

function StepMap({
  fields, setFields, tables, setTables, onNext, onBack, onSave, savedName, isExisting,
}: {
  fields: DetectedField[]; setFields: (f: DetectedField[]) => void;
  tables: TableConfig[]; setTables: (t: TableConfig[]) => void;
  onNext: () => void; onBack: () => void;
  onSave: (name: string, asNewVersion: boolean) => void;
  savedName?: string; isExisting: boolean;
}) {
  const [name, setName] = useState(savedName ?? "Untitled Smart Template");
  const bound = fields.filter((f) => f.boundVar).length;
  const totalBindable = fields.filter((f) => !["header", "footer", "watermark", "table"].includes(f.type)).length;
  const tableFields = fields.filter((f) => f.type === "table");
  const lowConf = fields.filter((f) => f.confidence < 0.9).length;
  const avgConf = Math.round((fields.reduce((s, f) => s + f.confidence, 0) / Math.max(fields.length, 1)) * 100);

  const onMove = (id: string, x: number, y: number) => {
    setFields(fields.map((f) => f.id === id ? { ...f, bbox: { ...f.bbox, x, y: y + 10 } } : f));
  };
  const redetect = (id: string) => {
    setFields(fields.map((f) => f.id === id ? { ...f, confidence: Math.min(0.99, 0.9 + Math.random() * 0.09) } : f));
  };

  return (
    <div className="space-y-4">
      <div className="card-surface p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Sparkles className="h-5 w-5 text-[var(--navy)]" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Template name" className="flex-1 bg-transparent border-b border-border focus:border-[var(--navy)] outline-none text-sm font-bold text-[var(--navy)] py-1" />
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div><span className="text-muted-foreground">Avg confidence:</span> <span className="font-mono font-bold text-[var(--navy)]">{avgConf}%</span></div>
          <div><span className="text-muted-foreground">Bound:</span> <span className="font-mono font-bold text-[var(--navy)]">{bound}/{totalBindable}</span></div>
          {lowConf > 0 && <div className="text-amber-700 font-bold">{lowConf} need review</div>}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-1">
          <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground px-1">AI Detection Review</div>
          <AnimatePresence>
            {fields.map((f) => (
              <FieldRow key={f.id} field={f}
                onChange={(nf) => setFields(fields.map((x) => x.id === f.id ? nf : x))}
                onRemove={() => setFields(fields.filter((x) => x.id !== f.id))}
                onRedetect={() => redetect(f.id)}
              />
            ))}
          </AnimatePresence>
          {tableFields.map((tf) => {
            const tcfg = tables.find((t) => t.fieldId === tf.id);
            if (!tcfg) return null;
            return <TableEditor key={tf.id} table={tcfg} onChange={(nt) => setTables(tables.map((t) => t.fieldId === nt.fieldId ? nt : t))} />;
          })}
        </div>

        <div className="space-y-3 lg:sticky lg:top-4 self-start">
          <div className="card-surface p-4">
            <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3 flex items-center gap-2">
              <Move className="h-3.5 w-3.5" /> Drag-and-Drop Layout Editor
            </div>
            <DocumentRender fields={fields} tables={tables} editable onMove={onMove} />
            <div className="text-[10.5px] text-muted-foreground mt-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Drag any QR, barcode, signature, header, footer or watermark on the page to reposition.
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button onClick={onBack} className="inline-flex items-center justify-center gap-2 bg-white border border-border text-[var(--navy)] rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-secondary">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex gap-2">
          {isExisting && (
            <button onClick={() => onSave(name, true)} className="inline-flex items-center gap-2 bg-white border border-[var(--navy)] text-[var(--navy)] rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-secondary">
              <History className="h-4 w-4" /> Save New Version
            </button>
          )}
          <button onClick={() => { onSave(name, false); onNext(); }} className="inline-flex items-center gap-2 bg-[var(--navy)] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:brightness-110">
            <Save className="h-4 w-4" /> Save & Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepExport({ fields, tables, onBack }: { fields: DetectedField[]; tables: TableConfig[]; onBack: () => void }) {
  const [applicant, setApplicant] = useState<Record<string, string>>({});
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const boundVars = useMemo(() => {
    const set = new Set<string>();
    fields.forEach((f) => f.boundVar && set.add(f.boundVar));
    return Array.from(set);
  }, [fields]);

  const fillSample = () => {
    const samples: Record<string, string> = {
      FULL_NAME: "Md. Arif Hossain", PASSPORT_NUMBER: "BD9482731", DATE_OF_BIRTH: "1995-05-12",
      NATIONALITY: "Bangladeshi", EMPLOYER_NAME: "TechBuild Pte. Ltd.", JOB_TITLE: "Senior Electrician",
      SALARY: "1850", VISA_TYPE: "Work Permit", APPLICATION_ID: "WP-2026-009431",
      ISSUE_DATE: "2026-05-18", EXPIRY_DATE: "2028-05-17",
    };
    const next: Record<string, string> = {};
    boundVars.forEach((k) => { next[k] = samples[k] ?? ""; });
    setApplicant(next);
  };

  const exportPDF = async () => {
    setExporting(true);
    try {
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();
      const pages = pageRefs.current.filter(Boolean) as HTMLDivElement[];
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], { scale: 2, backgroundColor: "#ffffff" });
        const img = canvas.toDataURL("image/png");
        const imgH = (canvas.height * w) / canvas.width;
        if (i > 0) pdf.addPage();
        pdf.addImage(img, "PNG", 0, 0, w, Math.min(imgH, h));
      }
      pdf.save(`VisaHOBe-${applicant.FULL_NAME?.replace(/\s+/g, "_") || "document"}-${Date.now()}.pdf`);
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card-surface p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-[var(--color-success)]/15 text-[var(--color-success)] flex items-center justify-center">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-[var(--navy)]">One-Click Generate</h3>
            <p className="text-xs text-muted-foreground">Fill applicant data, then export a print-ready A4 PDF with all pages.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onBack} className="bg-white border border-border text-[var(--navy)] rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-secondary inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button onClick={fillSample} className="bg-white border border-[var(--navy)] text-[var(--navy)] rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-secondary inline-flex items-center gap-2">
            <Zap className="h-4 w-4" /> Auto-fill Sample
          </button>
          <button onClick={exportPDF} disabled={exporting} className="bg-[var(--navy)] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:brightness-110 inline-flex items-center gap-2 disabled:opacity-60">
            {exporting ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><ScanLine className="h-4 w-4" /></motion.div> Generating…</>
              : done ? <><Check className="h-4 w-4" /> Downloaded</>
              : <><Download className="h-4 w-4" /> Generate PDF</>}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 card-surface p-4 space-y-3 max-h-[80vh] overflow-y-auto">
          <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Applicant Data ({boundVars.length} fields)</div>
          {boundVars.length === 0 && <div className="text-xs text-muted-foreground">No bound variables. Go back and bind some fields.</div>}
          {boundVars.map((k) => {
            const meta = allVariables.find((v) => v.key === k);
            return (
              <div key={k}>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1">{meta?.label ?? k} <span className="font-mono text-[9px] text-[var(--navy)]">{`{{${k}}}`}</span></label>
                <input
                  type={meta?.type === "date" ? "date" : meta?.type === "number" ? "number" : "text"}
                  value={applicant[k] ?? ""}
                  onChange={(e) => setApplicant((a) => ({ ...a, [k]: e.target.value }))}
                  placeholder={`Enter ${meta?.label ?? k}`}
                  className="mt-1 w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--navy)]"
                />
              </div>
            );
          })}
        </div>
        <div className="lg:col-span-3 card-surface p-4">
          <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3 flex items-center gap-2">
            <Eye className="h-3.5 w-3.5" /> A4 Print Preview · {Math.max(1, Math.ceil((tables[0]?.rows.length ?? 1) / ROWS_PER_PAGE))} page(s)
          </div>
          <DocumentRender fields={fields} tables={tables} applicant={applicant} pageRefs={pageRefs} />
        </div>
      </div>
    </div>
  );
}

function NewTemplatePage() {
  const { templateId } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<DetectedField[]>([]);
  const [tables, setTables] = useState<TableConfig[]>([]);
  const [savedId, setSavedId] = useState<string | undefined>(templateId);
  const [savedName, setSavedName] = useState<string | undefined>();

  // Load existing template if templateId is in the URL
  useEffect(() => {
    if (!templateId) return;
    const tpl = getTemplate(templateId);
    if (!tpl) return;
    const ver = getVersion(tpl);
    setFields(ver.fields);
    setTables(ver.tables);
    setSavedName(tpl.name);
    setSavedId(tpl.id);
    setStep(3);
  }, [templateId]);

  const onSave = (name: string, asNewVersion: boolean) => {
    if (savedId && asNewVersion) {
      saveNewVersion(savedId, fields, tables, "Edited via wizard");
      setSavedName(name);
      return;
    }
    if (savedId) {
      saveNewVersion(savedId, fields, tables, "Auto-save");
      setSavedName(name);
      return;
    }
    const tpl = saveNewTemplate({ name, fields, tables, sourceFile: file?.name });
    setSavedId(tpl.id);
    setSavedName(tpl.name);
    navigate({ to: "/documents/new", search: { templateId: tpl.id }, replace: true });
  };

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-1">AI Template Engine</div>
          <h1 className="text-2xl md:text-[28px] font-extrabold font-display tracking-tight text-[var(--navy)]">
            {savedName ?? "Create Smart Template"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link to="/documents/saved" className="text-sm text-[var(--navy)] font-semibold hover:underline inline-flex items-center gap-1">
            <History className="h-4 w-4" /> Saved
          </Link>
          <Link to="/documents" className="text-sm text-[var(--navy)] font-semibold hover:underline inline-flex items-center gap-1">
            <X className="h-4 w-4" /> Cancel
          </Link>
        </div>
      </div>

      <StepIndicator current={step} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <StepUpload onFile={(f) => { setFile(f); setStep(2); }} />
          </motion.div>
        )}
        {step === 2 && file && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <StepDetect file={file} onComplete={(f, t) => { setFields(f); setTables(t); setStep(3); }} />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <StepMap fields={fields} setFields={setFields} tables={tables} setTables={setTables}
              onNext={() => setStep(4)} onBack={() => setStep(savedId ? 3 : 2)}
              onSave={onSave} savedName={savedName} isExisting={Boolean(savedId)}
            />
          </motion.div>
        )}
        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <StepExport fields={fields} tables={tables} onBack={() => setStep(3)} />
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
