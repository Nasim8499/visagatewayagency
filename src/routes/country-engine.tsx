import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { motion } from "motion/react";
import { Globe2, CheckSquare, Square, Download, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import jsPDF from "jspdf";

export const Route = createFileRoute("/country-engine")({
  head: () => ({ meta: [{ title: "Country Engine — VisaHOBe" }] }),
  component: CountryEngine,
});

type Country = {
  name: string; flag: string; processing: string; visas: string[];
  docs: string[];
};

const COUNTRIES: Country[] = [
  { name: "Singapore", flag: "🇸🇬", processing: "5-7 days",
    visas: ["Work Permit", "Employment Pass", "S-Pass", "Dependant Pass", "Visit Visa"],
    docs: ["Valid passport (6+ months)", "Recent photographs (35x45mm)", "Educational certificates", "Medical clearance (SG-approved clinic)", "Employment offer letter (MOM Form 8)", "Bank statements (3 months)", "Insurance policy"] },
  { name: "Malaysia", flag: "🇲🇾", processing: "10-14 days",
    visas: ["Employment Pass", "Professional Visit", "Spouse Visa"],
    docs: ["Valid passport (12+ months)", "Photos (white background)", "Educational certificates (attested)", "Medical report (Fomema)", "Letter of offer", "CV / resume", "Insurance policy"] },
  { name: "UAE", flag: "🇦🇪", processing: "3-5 days",
    visas: ["Employment Visa", "Investor Visa", "Family Visa", "Visit Visa"],
    docs: ["Valid passport (6+ months)", "Photos (white background)", "Attested degree certificate", "Medical test (DHA)", "Emirates ID application", "Labour contract", "Tenancy contract (Ejari)"] },
  { name: "Saudi Arabia", flag: "🇸🇦", processing: "14-21 days",
    visas: ["Work Visa (Iqama)", "Business Visa", "Family Visit"],
    docs: ["Valid passport (6+ months)", "Photos", "Attested degree", "Police clearance (apostilled)", "Medical exam (GAMCA)", "Work contract", "Sponsor's CR copy"] },
  { name: "Qatar", flag: "🇶🇦", processing: "7-10 days",
    visas: ["Work Residence", "Business Visa", "Family Visa"],
    docs: ["Valid passport (6+ months)", "Photos", "Medical fitness certificate", "Attested degree", "Police clearance", "Employment contract"] },
  { name: "Japan", flag: "🇯🇵", processing: "10-15 days",
    visas: ["Specified Skilled Worker", "Engineer/Specialist", "Student"],
    docs: ["Valid passport", "Visa application form", "Photos (45x45mm)", "Certificate of Eligibility (COE)", "JLPT N4+ certificate", "Bank statements", "Itinerary"] },
];

function CountryEngine() {
  const [sel, setSel] = useState(0);
  const country = COUNTRIES[sel];
  const [visa, setVisa] = useState(country.visas[0]);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  // reset when country changes
  useMemo(() => { setVisa(country.visas[0]); setChecked(new Set()); }, [sel]);

  const toggle = (d: string) => {
    const n = new Set(checked); n.has(d) ? n.delete(d) : n.add(d); setChecked(n);
  };

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48; let y = margin;
    doc.setFont("helvetica", "bold"); doc.setFontSize(20);
    doc.text("VisaHOBe — Visa Document Checklist", margin, y); y += 28;
    doc.setFontSize(12); doc.setFont("helvetica", "normal");
    doc.text(`Country: ${country.name}`, margin, y); y += 16;
    doc.text(`Visa Type: ${visa}`, margin, y); y += 16;
    doc.text(`Processing Time: ${country.processing}`, margin, y); y += 16;
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, y); y += 28;
    doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text("Required Documents", margin, y); y += 20;
    doc.setFont("helvetica", "normal"); doc.setFontSize(11);
    country.docs.forEach((d, i) => {
      const mark = checked.has(d) ? "[x]" : "[ ]";
      doc.text(`${mark}  ${i + 1}. ${d}`, margin, y); y += 18;
    });
    y += 12; doc.setDrawColor(200); doc.line(margin, y, 595 - margin, y); y += 22;
    doc.setFontSize(9); doc.setTextColor(120);
    doc.text("This is a sample VisaHOBe checklist. Verify with the official embassy before submission.", margin, y);
    doc.save(`visahobe-${country.name.toLowerCase()}-${visa.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
            <Globe2 className="h-3 w-3" /> Country Builder
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy)] mt-3">Country Engine</h1>
          <p className="text-muted-foreground mt-1">Choose a country and visa type, build the checklist, export a sample PDF.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Picker */}
          <motion.div
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className="card-surface p-4"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">Country</div>
            <div className="space-y-1">
              {COUNTRIES.map((c, i) => (
                <button
                  key={c.name} onClick={() => setSel(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${
                    sel === i ? "bg-[var(--navy)] text-white" : "hover:bg-secondary"
                  }`}
                >
                  <span className="text-xl">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{c.name}</div>
                    <div className={`text-[11px] ${sel === i ? "text-white/70" : "text-muted-foreground"}`}>{c.processing}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Builder */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="card-surface p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h2 className="font-display font-extrabold text-xl text-[var(--navy)] flex items-center gap-2">
                  <span className="text-2xl">{country.flag}</span> {country.name}
                </h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">Processing: {country.processing}</p>
              </div>
              <button
                onClick={downloadPdf}
                className="bg-[var(--navy)] text-white rounded-xl px-4 py-2.5 text-sm font-bold inline-flex items-center gap-2 hover:brightness-110"
              >
                <Download className="h-4 w-4" /> Download Sample PDF
              </button>
            </div>

            <div className="mb-4">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Visa Type</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {country.visas.map((v) => (
                  <button
                    key={v} onClick={() => setVisa(v)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition ${
                      visa === v ? "bg-[var(--navy)] text-white border-[var(--navy)]" : "bg-white text-[var(--navy)] border-border hover:border-[var(--navy)]"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Document Checklist</label>
                <span className="text-[11px] text-muted-foreground">{checked.size}/{country.docs.length} ready</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
                <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all"
                  style={{ width: `${(checked.size / country.docs.length) * 100}%` }} />
              </div>
              <div className="border border-border rounded-2xl divide-y divide-border">
                {country.docs.map((d) => {
                  const isChecked = checked.has(d);
                  return (
                    <button
                      key={d} onClick={() => toggle(d)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/50 transition"
                    >
                      {isChecked
                        ? <CheckSquare className="h-5 w-5 text-emerald-600 shrink-0" />
                        : <Square className="h-5 w-5 text-muted-foreground shrink-0" />}
                      <span className={`text-sm ${isChecked ? "line-through text-muted-foreground" : "text-[var(--navy)] font-medium"}`}>{d}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
              <FileText className="h-3.5 w-3.5" /> The exported PDF includes country, visa type, processing time, and the current checklist state.
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
