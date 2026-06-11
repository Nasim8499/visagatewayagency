import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { motion } from "motion/react";
import { ScanLine, Upload, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/passport-upload")({
  head: () => ({ meta: [{ title: "Passport Upload — VisaHOBe" }] }),
  component: PassportUpload,
});

const fields = [
  { label: "Full Name", value: "ARIF HOSSAIN" },
  { label: "Passport No.", value: "BX0123456" },
  { label: "Nationality", value: "Bangladeshi" },
  { label: "Date of Birth", value: "1992-08-14" },
  { label: "Gender", value: "Male" },
  { label: "Issue Date", value: "2021-03-10" },
  { label: "Expiry Date", value: "2031-03-09" },
  { label: "Place of Issue", value: "Dhaka" },
];

function PassportUpload() {
  const [scanned, setScanned] = useState(false);
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
            <ScanLine className="h-3 w-3" /> OCR Engine
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy)] mt-3">Passport Upload</h1>
          <p className="text-muted-foreground mt-1">Upload a passport image and let the AI extract MRZ fields automatically.</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="card-surface p-8 border-2 border-dashed border-border flex flex-col items-center justify-center text-center min-h-[360px]"
          >
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
              <Upload className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-display font-bold text-lg text-[var(--navy)]">Drop passport image</h3>
            <p className="text-sm text-muted-foreground mt-1">JPG, PNG or PDF · up to 10MB</p>
            <button
              onClick={() => setScanned(true)}
              className="mt-5 bg-[var(--navy)] text-white rounded-xl px-5 py-2.5 text-sm font-bold hover:brightness-110"
            >
              {scanned ? "Re-scan Document" : "Run OCR Scan"}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            className="card-surface p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-[var(--navy)]">Detected Fields</h3>
              {scanned && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 98% confidence
                </span>
              )}
            </div>
            <div className="space-y-3">
              {fields.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: scanned ? i * 0.05 : 0 }}
                  className="flex items-center justify-between border-b border-border pb-2"
                >
                  <span className="text-[12px] text-muted-foreground font-medium uppercase tracking-wide">{f.label}</span>
                  <span className="text-sm font-bold text-[var(--navy)] font-mono">
                    {scanned ? f.value : "—"}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
