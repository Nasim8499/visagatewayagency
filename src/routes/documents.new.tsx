import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { motion, AnimatePresence } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
  Upload, FileText, ScanLine, Brain, Sparkles, Check, X, ArrowRight, ArrowLeft,
  Type, Table as TableIcon, QrCode, Barcode, PenLine, Image as ImageIcon,
  Layers, ShieldCheck, Download, Plus, Trash2, Eye, Wand2, FileCheck2,
  Cloud, AlertCircle, CheckCircle2,
} from "lucide-react";
import { allVariables } from "@/lib/templates";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const Route = createFileRoute("/documents/new")({
  head: () => ({ meta: [{ title: "Create Template — VisaHOBe" }] }),
  component: NewTemplatePage,
});

type DetectedField = {
  id: string;
  label: string;
  type: "text" | "date" | "number" | "table" | "signature" | "qr" | "barcode" | "header" | "footer" | "watermark" | "image";
  confidence: number;
  page: number;
  bbox: { x: number; y: number; w: number; h: number };
  boundVar?: string;
  sample?: string;
};

type TableColumn = { key: string; label: string };
type TableConfig = { fieldId: string; columns: TableColumn[]; rows: Record<string, string>[] };

const STEPS = [
  { id: 1, title: "Upload", icon: Upload },
  { id: 2, title: "AI Detect", icon: Brain },
  { id: 3, title: "Map Fields", icon: Wand2 },
  { id: 4, title: "Preview & Export", icon: Download },
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

// Mock AI detection — produces a realistic field set
function mockDetect(fileName: string): { fields: DetectedField[]; tables: TableConfig[] } {
  const isInvoice = /invoice|salary|slip/i.test(fileName);
  const baseFields: DetectedField[] = [
    { id: "f1", label: "Document Title", type: "header", confidence: 0.99, page: 1, bbox: { x: 10, y: 4, w: 80, h: 6 }, sample: "EMPLOYMENT CONTRACT" },
    { id: "f2", label: "Full Name", type: "text", confidence: 0.97, page: 1, bbox: { x: 10, y: 18, w: 50, h: 5 }, boundVar: "FULL_NAME", sample: "Arif Hossain" },
    { id: "f3", label: "Passport Number", type: "text", confidence: 0.96, page: 1, bbox: { x: 10, y: 25, w: 40, h: 5 }, boundVar: "PASSPORT_NUMBER", sample: "A12345678" },
    { id: "f4", label: "Date of Birth", type: "date", confidence: 0.94, page: 1, bbox: { x: 55, y: 25, w: 30, h: 5 }, boundVar: "DATE_OF_BIRTH", sample: "12/05/1995" },
    { id: "f5", label: "Nationality", type: "text", confidence: 0.93, page: 1, bbox: { x: 10, y: 32, w: 40, h: 5 }, boundVar: "NATIONALITY", sample: "Bangladeshi" },
    { id: "f6", label: "Employer Name", type: "text", confidence: 0.95, page: 1, bbox: { x: 10, y: 39, w: 55, h: 5 }, boundVar: "EMPLOYER_NAME", sample: "TechBuild Pte. Ltd." },
    { id: "f7", label: "Job Title", type: "text", confidence: 0.91, page: 1, bbox: { x: 10, y: 46, w: 40, h: 5 }, boundVar: "JOB_TITLE", sample: "Electrician" },
    { id: "f8", label: "Salary Breakdown", type: "table", confidence: 0.89, page: 1, bbox: { x: 10, y: 55, w: 80, h: 25 } },
    { id: "f9", label: "Verification QR", type: "qr", confidence: 0.98, page: 1, bbox: { x: 80, y: 82, w: 12, h: 12 }, boundVar: "QR_CODE" },
    { id: "f10", label: "Tracking Barcode", type: "barcode", confidence: 0.92, page: 1, bbox: { x: 10, y: 86, w: 35, h: 8 }, boundVar: "BARCODE" },
    { id: "f11", label: "Employer Signature", type: "signature", confidence: 0.88, page: 1, bbox: { x: 55, y: 92, w: 30, h: 6 }, boundVar: "SIGNATURE" },
    { id: "f12", label: "Page Footer", type: "footer", confidence: 0.96, page: 1, bbox: { x: 10, y: 96, w: 80, h: 3 }, sample: "VisaHOBe Pte. Ltd. · Confidential" },
    { id: "f13", label: "Watermark Seal", type: "watermark", confidence: 0.86, page: 1, bbox: { x: 40, y: 50, w: 20, h: 20 }, sample: "OFFICIAL" },
  ];

  const tables: TableConfig[] = [
    {
      fieldId: "f8",
      columns: [
        { key: "item", label: "Component" },
        { key: "qty", label: "Qty / Month" },
        { key: "rate", label: "Rate (SGD)" },
        { key: "amount", label: "Amount (SGD)" },
      ],
      rows: isInvoice
        ? [
            { item: "Basic Salary", qty: "1", rate: "1,200", amount: "1,200" },
            { item: "Overtime", qty: "20h", rate: "12", amount: "240" },
            { item: "Allowance", qty: "1", rate: "150", amount: "150" },
          ]
        : [
            { item: "Basic Salary", qty: "1", rate: "1,200", amount: "1,200" },
            { item: "Housing Allowance", qty: "1", rate: "200", amount: "200" },
          ],
    },
  ];
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
                done
                  ? "bg-[var(--color-success)] text-white"
                  : active
                  ? "bg-[var(--navy)] text-white shadow-md"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
            </motion.div>
            <div className="hidden sm:block min-w-0">
              <div className={`text-[11px] uppercase tracking-wider font-semibold ${active ? "text-[var(--navy)]" : "text-muted-foreground"}`}>
                Step {s.id}
              </div>
              <div className={`text-[13px] font-bold truncate ${active ? "text-[var(--navy)]" : "text-foreground"}`}>{s.title}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 rounded-full ${done ? "bg-[var(--color-success)]" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepUpload({ onFile }: { onFile: (f: File) => void }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const handle = useCallback((files: FileList | null) => {
    if (files && files[0]) onFile(files[0]);
  }, [onFile]);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-surface p-6 md:p-10">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e: DragEvent) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
        onClick={() => ref.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 md:p-16 text-center transition-all ${
          drag ? "border-[var(--navy)] bg-[oklch(0.94_0.04_258)]" : "border-[oklch(0.78_0.06_258)] bg-[oklch(0.98_0.01_258)] hover:border-[var(--navy)]"
        }`}
      >
        <input ref={ref} type="file" hidden accept=".pdf,.docx,.png,.jpg,.jpeg"
          onChange={(e) => handle(e.target.files)} />
        <motion.div animate={{ y: drag ? -6 : 0 }} className="inline-flex h-20 w-20 rounded-2xl bg-white items-center justify-center mb-5 shadow-md">
          <Cloud className="h-10 w-10 text-[var(--navy)]" strokeWidth={1.5} />
        </motion.div>
        <h3 className="font-display font-bold text-xl text-[var(--navy)]">Upload Your Master Document</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Drop a PDF, DOCX, PNG or JPG. Our AI will scan layout, fonts, tables, signatures and QR/barcodes automatically.
        </p>
        <button className="mt-6 inline-flex items-center gap-2 bg-[var(--navy)] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:brightness-110 transition">
          <Upload className="h-4 w-4" /> Choose Document
        </button>
        <div className="mt-3 text-[11px] text-muted-foreground">or drag and drop here · Max 25 MB</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { icon: ScanLine, t: "Text & Fields" },
          { icon: TableIcon, t: "Tables" },
          { icon: PenLine, t: "Signatures" },
          { icon: QrCode, t: "QR / Barcode" },
        ].map((x, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-secondary text-[var(--navy)]"
          >
            <x.icon className="h-4 w-4" />
            <span className="text-xs font-semibold">{x.t}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function StepDetect({ file, onComplete }: { file: File; onComplete: (fields: DetectedField[], tables: TableConfig[]) => void }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const stages = useMemo(() => [
    "Parsing document structure…",
    "Extracting fonts and styles…",
    "Detecting text fields and labels…",
    "Identifying tables and repeating rows…",
    "Locating QR codes, barcodes and signatures…",
    "Mapping watermarks, headers and footers…",
    "Compiling smart template…",
  ], []);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += 3 + Math.random() * 4;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
        setTimeout(() => {
          const { fields, tables } = mockDetect(file.name);
          onComplete(fields, tables);
        }, 500);
      }
      setProgress(Math.min(100, p));
      setStage(Math.min(stages.length - 1, Math.floor((p / 100) * stages.length)));
    }, 220);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-surface p-6 md:p-10">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-32 w-32 mb-6">
          <motion.div
            className="absolute inset-0 rounded-full border-[6px] border-[oklch(0.94_0.04_258)]"
          />
          <motion.svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--navy)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${progress * 2.76} 276`} className="transition-all duration-300" />
          </motion.svg>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Brain className="h-10 w-10 text-[var(--navy)]" />
          </motion.div>
          <div className="absolute -bottom-1 inset-x-0 text-center text-xs font-mono font-bold text-[var(--navy)]">
            {Math.round(progress)}%
          </div>
        </div>
        <h3 className="font-display font-bold text-xl text-[var(--navy)]">AI is analysing your document</h3>
        <p className="text-sm text-muted-foreground mt-1">{file.name} · {(file.size / 1024).toFixed(0)} KB</p>
        <div className="mt-6 w-full max-w-md space-y-2">
          {stages.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: i <= stage ? 1 : 0.3 }}
              className="flex items-center gap-3 text-left text-sm"
            >
              {i < stage ? (
                <CheckCircle2 className="h-4 w-4 text-[var(--color-success)] shrink-0" />
              ) : i === stage ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <ScanLine className="h-4 w-4 text-[var(--navy)] shrink-0" />
                </motion.div>
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-border shrink-0" />
              )}
              <span className={i <= stage ? "text-foreground font-medium" : "text-muted-foreground"}>{s}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FieldRow({
  field, onChange, onRemove,
}: {
  field: DetectedField; onChange: (f: DetectedField) => void; onRemove: () => void;
}) {
  const Icon = fieldIcon[field.type as keyof typeof fieldIcon] ?? Type;
  const canBind = !["header", "footer", "watermark", "table"].includes(field.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="card-surface p-4 hover-lift"
    >
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${fieldTone[field.type]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <input
              value={field.label}
              onChange={(e) => onChange({ ...field, label: e.target.value })}
              className="bg-transparent outline-none border-b border-transparent hover:border-border focus:border-[var(--navy)] text-[14px] font-semibold text-[var(--navy)] min-w-0"
            />
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${fieldTone[field.type]}`}>
              {field.type}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              {Math.round(field.confidence * 100)}% conf · pg{field.page}
            </span>
          </div>
          {field.sample && (
            <div className="text-[11px] text-muted-foreground mt-1 truncate">Sample: "{field.sample}"</div>
          )}
          {canBind && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">Bind →</span>
              <select
                value={field.boundVar ?? ""}
                onChange={(e) => onChange({ ...field, boundVar: e.target.value || undefined })}
                className="bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-[12px] font-mono font-semibold text-[var(--navy)] outline-none focus:border-[var(--navy)]"
              >
                <option value="">— unmapped —</option>
                {allVariables
                  .filter((v) => v.type === field.type || (["text", "date", "number"].includes(field.type) && ["text", "date", "number"].includes(v.type)))
                  .map((v) => (
                    <option key={v.key} value={v.key}>{`{{${v.key}}} · ${v.label}`}</option>
                  ))}
              </select>
              {field.boundVar && (
                <span className="text-[10px] text-[var(--color-success)] font-bold flex items-center gap-1">
                  <Check className="h-3 w-3" /> bound
                </span>
              )}
            </div>
          )}
          {field.type === "table" && (
            <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
              <TableIcon className="h-3 w-3" /> Dynamic repeating rows — configure in next step
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
  const updateCell = (rIdx: number, key: string, val: string) => {
    const rows = table.rows.map((r, i) => i === rIdx ? { ...r, [key]: val } : r);
    onChange({ ...table, rows });
  };
  const removeRow = (i: number) => onChange({ ...table, rows: table.rows.filter((_, j) => j !== i) });

  return (
    <div className="card-surface p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TableIcon className="h-4 w-4 text-emerald-700" />
          <span className="font-display font-bold text-sm text-[var(--navy)]">Dynamic Table — Salary Breakdown</span>
        </div>
        <button onClick={addRow} className="text-[12px] font-semibold text-[var(--navy)] inline-flex items-center gap-1 hover:underline">
          <Plus className="h-3.5 w-3.5" /> Add row
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-secondary">
              {table.columns.map((c) => (
                <th key={c.key} className="text-left px-2 py-2 font-bold text-[var(--navy)]">{c.label}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i} className="border-b border-border">
                {table.columns.map((c) => (
                  <td key={c.key} className="p-1">
                    <input
                      value={r[c.key] ?? ""}
                      onChange={(e) => updateCell(i, c.key, e.target.value)}
                      className="w-full bg-transparent rounded px-2 py-1.5 outline-none hover:bg-secondary focus:bg-secondary"
                    />
                  </td>
                ))}
                <td>
                  <button onClick={() => removeRow(i)} className="h-7 w-7 rounded hover:bg-rose-50 text-rose-500 flex items-center justify-center">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StepMap({
  fields, setFields, tables, setTables, onNext, onBack,
}: {
  fields: DetectedField[]; setFields: (f: DetectedField[]) => void;
  tables: TableConfig[]; setTables: (t: TableConfig[]) => void;
  onNext: () => void; onBack: () => void;
}) {
  const bound = fields.filter((f) => f.boundVar).length;
  const totalBindable = fields.filter((f) => !["header", "footer", "watermark", "table"].includes(f.type)).length;
  const tableFields = fields.filter((f) => f.type === "table");

  return (
    <div className="space-y-4">
      <div className="card-surface p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="font-display font-bold text-[var(--navy)]">Confirm & Map Detected Fields</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {fields.length} elements detected · {bound}/{totalBindable} variables bound
          </p>
        </div>
        <div className="flex-1 max-w-md md:ml-6">
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              animate={{ width: `${(bound / Math.max(totalBindable, 1)) * 100}%` }}
              className="h-full gradient-brand"
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <AnimatePresence>
            {fields.map((f) => (
              <FieldRow
                key={f.id}
                field={f}
                onChange={(nf) => setFields(fields.map((x) => x.id === f.id ? nf : x))}
                onRemove={() => setFields(fields.filter((x) => x.id !== f.id))}
              />
            ))}
          </AnimatePresence>
          {tableFields.map((tf) => {
            const tcfg = tables.find((t) => t.fieldId === tf.id);
            if (!tcfg) return null;
            return (
              <TableEditor
                key={tf.id}
                table={tcfg}
                onChange={(nt) => setTables(tables.map((t) => t.fieldId === nt.fieldId ? nt : t))}
              />
            );
          })}
        </div>

        <div className="space-y-3">
          <div className="card-surface p-4">
            <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3">Live Preview</div>
            <DocumentRender fields={fields} tables={tables} live />
          </div>
          <div className="card-surface p-4">
            <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3">Smart Variables Detected</div>
            <div className="flex flex-wrap gap-1.5">
              {fields.filter((f) => f.boundVar).map((f) => (
                <span key={f.id} className="text-[11px] font-mono font-bold bg-[var(--navy)] text-white rounded px-2 py-1">
                  {`{{${f.boundVar}}}`}
                </span>
              ))}
              {bound === 0 && <span className="text-xs text-muted-foreground">No variables bound yet</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button onClick={onBack} className="inline-flex items-center gap-2 bg-white border border-border text-[var(--navy)] rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-secondary transition">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button onClick={onNext} className="inline-flex items-center gap-2 bg-[var(--navy)] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:brightness-110 transition">
          Save Template & Preview <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function QRBlock({ size = 64 }: { size?: number }) {
  // deterministic checker pattern (mock QR)
  const cells = 8;
  return (
    <div style={{ width: size, height: size }} className="grid grid-cols-8 gap-[1px] bg-white p-1 border border-slate-900">
      {Array.from({ length: cells * cells }).map((_, i) => {
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
      {bars.map((b, i) => (
        <div key={i} style={{ height: `${60 + (b * 6)}%`, width: `${b}px` }} className="bg-slate-900" />
      ))}
    </div>
  );
}

function DocumentRender({ fields, tables, live = false, refEl }: {
  fields: DetectedField[]; tables: TableConfig[]; live?: boolean; refEl?: React.Ref<HTMLDivElement>;
}) {
  const header = fields.find((f) => f.type === "header");
  const footer = fields.find((f) => f.type === "footer");
  const watermark = fields.find((f) => f.type === "watermark");
  const qr = fields.find((f) => f.type === "qr");
  const barcode = fields.find((f) => f.type === "barcode");
  const sig = fields.find((f) => f.type === "signature");
  const textFields = fields.filter((f) => ["text", "date", "number"].includes(f.type));
  const tableField = fields.find((f) => f.type === "table");
  const table = tableField ? tables.find((t) => t.fieldId === tableField.id) : undefined;

  const NAVY = "#152a4d";
  const RED = "#e63946";
  return (
    <div
      ref={refEl}
      style={{ color: "#0f172a", backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
      className="relative aspect-[1/1.414] mx-auto w-full max-w-[520px] rounded shadow-md overflow-hidden border"
    >
      {watermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ color: "rgba(15,23,42,0.05)" }} className="text-7xl font-display font-extrabold rotate-[-30deg] tracking-widest">
            {watermark.sample}
          </div>
        </div>
      )}
      <div style={{ backgroundColor: NAVY }} className="h-12 flex items-center justify-between px-4 text-white">
        <div className="flex items-center gap-2">
          <div style={{ backgroundColor: RED }} className="h-6 w-6 rounded flex items-center justify-center">
            <span className="text-[10px]">✈</span>
          </div>
          <div className="text-[10px] font-extrabold tracking-tight">VisaHOBe</div>
        </div>
        <div className="text-[9px] font-mono opacity-70">REF-{Math.floor(Math.random() * 9999)}</div>
      </div>

      <div className="px-6 pt-5">
        {header && (
          <div style={{ color: NAVY }} className="text-center font-display font-extrabold tracking-wider text-[15px] mb-4">
            {header.sample}
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[10.5px]">
          {textFields.slice(0, 6).map((f) => (
            <div key={f.id} className="leading-tight">
              <div style={{ color: "#64748b" }} className="text-[8px] uppercase tracking-wider font-semibold">{f.label}</div>
              <div style={{ color: NAVY }} className="font-semibold">
                {f.boundVar ? (
                  <span style={live ? { backgroundColor: "#fef3c7", borderRadius: 3, padding: "0 4px" } : undefined}>
                    {f.sample ?? `{{${f.boundVar}}}`}
                  </span>
                ) : (
                  f.sample ?? "—"
                )}
              </div>
            </div>
          ))}
        </div>

        {table && (
          <div className="mt-4">
            <div style={{ color: "#64748b" }} className="text-[8px] uppercase tracking-wider font-semibold mb-1">Salary Breakdown</div>
            <table className="w-full text-[9px]" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#eef2f9", color: NAVY }}>
                  {table.columns.map((c) => (
                    <th key={c.key} className="text-left px-2 py-1.5 font-bold">{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    {table.columns.map((c) => (
                      <td key={c.key} className="px-2 py-1.5">{r[c.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ borderTop: "1px solid #e2e8f0" }} className="flex items-end justify-between mt-5 pt-3">
          <div>
            {barcode && (
              <>
                <BarcodeBlock />
                <div className="text-[7px] font-mono mt-0.5">VH-{Date.now().toString().slice(-8)}</div>
              </>
            )}
          </div>
          {sig && (
            <div className="text-center">
              <div style={{ color: NAVY, borderBottom: "1px solid #334155" }} className="font-display italic text-[14px] px-3 pb-0.5">A. Hossain</div>
              <div style={{ color: "#64748b" }} className="text-[8px] mt-1">{sig.label}</div>
            </div>
          )}
          {qr && <QRBlock />}
        </div>
      </div>

      {footer && (
        <div style={{ backgroundColor: "#f8fafc", color: "#64748b", borderTop: "1px solid #e2e8f0" }} className="absolute bottom-0 inset-x-0 px-4 py-2 text-[8px] text-center">
          {footer.sample}
        </div>
      )}
    </div>
  );
}

function StepExport({ fields, tables, onBack }: { fields: DetectedField[]; tables: TableConfig[]; onBack: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const exportPDF = async () => {
    if (!ref.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: "#ffffff" });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, w, h);
      pdf.save(`VisaHOBe-${Date.now()}.pdf`);
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
            <h3 className="font-display font-bold text-[var(--navy)]">Template Ready</h3>
            <p className="text-xs text-muted-foreground">All fields mapped. Generate print-ready A4 PDFs in one click.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onBack} className="bg-white border border-border text-[var(--navy)] rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-secondary inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button
            onClick={exportPDF}
            disabled={exporting}
            className="bg-[var(--navy)] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:brightness-110 transition inline-flex items-center gap-2 disabled:opacity-60"
          >
            {exporting ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <ScanLine className="h-4 w-4" />
                </motion.div>
                Generating…
              </>
            ) : done ? (
              <>
                <Check className="h-4 w-4" /> Downloaded
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="card-surface p-4 md:p-6">
        <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3 flex items-center gap-2">
          <Eye className="h-3.5 w-3.5" /> A4 Print Preview
        </div>
        <DocumentRender fields={fields} tables={tables} refEl={ref} />
      </div>
    </div>
  );
}

function NewTemplatePage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<DetectedField[]>([]);
  const [tables, setTables] = useState<TableConfig[]>([]);

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-1">AI Template Engine</div>
          <h1 className="text-2xl md:text-[28px] font-extrabold font-display tracking-tight text-[var(--navy)]">Create Smart Template</h1>
        </div>
        <Link to="/documents" className="text-sm text-[var(--navy)] font-semibold hover:underline inline-flex items-center gap-1">
          <X className="h-4 w-4" /> Cancel
        </Link>
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
            <StepDetect
              file={file}
              onComplete={(f, t) => { setFields(f); setTables(t); setStep(3); }}
            />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <StepMap
              fields={fields}
              setFields={setFields}
              tables={tables}
              setTables={setTables}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          </motion.div>
        )}
        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <StepExport fields={fields} tables={tables} onBack={() => setStep(3)} />
          </motion.div>
        )}
      </AnimatePresence>

      {step === 1 && (
        <div className="mt-6 card-surface p-4 flex items-start gap-3 bg-[oklch(0.97_0.02_258)]">
          <AlertCircle className="h-5 w-5 text-[var(--navy)] shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <strong className="text-[var(--navy)]">Tip:</strong> Tables, signatures, QR codes and watermarks are detected automatically.
            You can re-bind any variable like <code className="font-mono text-[var(--navy)]">{`{{FULL_NAME}}`}</code> in the next step.
          </div>
        </div>
      )}
    </AppShell>
  );
}
