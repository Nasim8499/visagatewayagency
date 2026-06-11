import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { motion } from "motion/react";
import { ScanLine, Upload, CheckCircle2, RefreshCw, Save } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/passport-upload")({
  head: () => ({ meta: [{ title: "Passport Upload — VisaHOBe" }] }),
  component: PassportUpload,
});

type Field = { key: string; label: string; value: string; confidence: number; variable: string };

const VARS = [
  "{{FULL_NAME}}", "{{PASSPORT_NUMBER}}", "{{NATIONALITY}}",
  "{{DOB}}", "{{GENDER}}", "{{ISSUE_DATE}}", "{{EXPIRY_DATE}}",
  "{{PLACE_OF_ISSUE}}", "{{MRZ}}", "—",
];

const initial: Field[] = [
  { key: "name", label: "Full Name", value: "ARIF HOSSAIN", confidence: 98, variable: "{{FULL_NAME}}" },
  { key: "no", label: "Passport No.", value: "BX0123456", confidence: 99, variable: "{{PASSPORT_NUMBER}}" },
  { key: "nat", label: "Nationality", value: "Bangladeshi", confidence: 95, variable: "{{NATIONALITY}}" },
  { key: "dob", label: "Date of Birth", value: "1992-08-14", confidence: 92, variable: "{{DOB}}" },
  { key: "gender", label: "Gender", value: "Male", confidence: 97, variable: "{{GENDER}}" },
  { key: "iss", label: "Issue Date", value: "2021-03-10", confidence: 89, variable: "{{ISSUE_DATE}}" },
  { key: "exp", label: "Expiry Date", value: "2031-03-09", confidence: 96, variable: "{{EXPIRY_DATE}}" },
  { key: "place", label: "Place of Issue", value: "Dhaka", confidence: 78, variable: "{{PLACE_OF_ISSUE}}" },
];

function confColor(c: number) {
  if (c >= 95) return "bg-emerald-100 text-emerald-700";
  if (c >= 85) return "bg-blue-100 text-blue-700";
  if (c >= 70) return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

function PassportUpload() {
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [fields, setFields] = useState<Field[]>(initial);
  const [saved, setSaved] = useState(false);

  const runScan = () => {
    setScanning(true); setSaved(false);
    setTimeout(() => { setScanning(false); setScanned(true); }, 1200);
  };

  const update = (i: number, patch: Partial<Field>) => {
    setFields((prev) => prev.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
            <ScanLine className="h-3 w-3" /> AI OCR Engine
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy)] mt-3">Passport Upload</h1>
          <p className="text-muted-foreground mt-1">Upload a passport image. AI extracts MRZ fields with confidence scores and maps them to template variables.</p>
        </header>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Upload */}
          <motion.div
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="card-surface p-6 lg:col-span-2"
          >
            <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center text-center min-h-[280px] justify-center bg-secondary/30">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                <Upload className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--navy)]">Drop passport image</h3>
              <p className="text-sm text-muted-foreground mt-1">JPG, PNG or PDF · up to 10MB</p>
              <button
                onClick={runScan} disabled={scanning}
                className="mt-5 bg-[var(--navy)] text-white rounded-xl px-5 py-2.5 text-sm font-bold hover:brightness-110 inline-flex items-center gap-2 disabled:opacity-60"
              >
                {scanning ? <><RefreshCw className="h-4 w-4 animate-spin" /> Scanning…</> : (scanned ? "Re-scan" : "Run OCR Scan")}
              </button>
            </div>
            {scanned && (
              <div className="mt-4 text-[12px] text-muted-foreground">
                <div className="flex justify-between"><span>Engine</span><span className="font-mono">Gemini 2.5 Vision</span></div>
                <div className="flex justify-between"><span>Pages</span><span className="font-mono">1</span></div>
                <div className="flex justify-between"><span>Avg. confidence</span><span className="font-mono">93%</span></div>
              </div>
            )}
          </motion.div>

          {/* Fields */}
          <motion.div
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            className="card-surface p-6 lg:col-span-3"
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="font-display font-bold text-lg text-[var(--navy)]">Detected Fields & Mapping</h3>
              <button
                onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1500); }}
                disabled={!scanned}
                className="inline-flex items-center gap-1.5 bg-[var(--navy)] text-white rounded-lg px-3 py-1.5 text-[12px] font-bold disabled:opacity-40"
              >
                <Save className="h-3.5 w-3.5" /> {saved ? "Saved!" : "Save Mapping"}
              </button>
            </div>

            {!scanned ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                Run an OCR scan to see extracted fields here.
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 pb-1 border-b border-border">
                  <div className="col-span-3">Field</div>
                  <div className="col-span-4">Value</div>
                  <div className="col-span-3">Variable</div>
                  <div className="col-span-2 text-right">Confidence</div>
                </div>
                {fields.map((f, i) => (
                  <motion.div
                    key={f.key}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="grid grid-cols-12 gap-2 items-center px-2 py-1.5 rounded-lg hover:bg-secondary/50"
                  >
                    <div className="col-span-3 text-[12px] font-semibold text-[var(--navy)]">{f.label}</div>
                    <div className="col-span-4">
                      <input
                        value={f.value}
                        onChange={(e) => update(i, { value: e.target.value })}
                        className="w-full bg-secondary rounded-md px-2 py-1.5 text-[13px] font-mono outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-3">
                      <select
                        value={f.variable}
                        onChange={(e) => update(i, { variable: e.target.value })}
                        className="w-full bg-secondary rounded-md px-2 py-1.5 text-[12px] font-mono outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {VARS.map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${confColor(f.confidence)}`}>
                        <CheckCircle2 className="h-3 w-3" /> {f.confidence}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
