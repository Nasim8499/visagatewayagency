import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { motion } from "motion/react";
import { Globe2, CheckSquare, Square, Download, FileText, Printer, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [mobilePickerOpen, setMobilePickerOpen] = useState(false);

  useEffect(() => { setVisa(country.visas[0]); setChecked(new Set()); }, [sel, country.visas]);

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
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #a4-print, #a4-print * { visibility: visible !important; }
          #a4-print { position: absolute; inset: 0; margin: 0 !important; box-shadow: none !important; border: 0 !important; }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <header className="mb-5 print:hidden">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
            <Globe2 className="h-3 w-3" /> Country Builder
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-[var(--navy)] mt-3">Country Engine</h1>
          <p className="text-sm text-muted-foreground mt-1">Pick a country & visa, tick documents, print or export A4 PDF.</p>
        </header>

        {/* Mobile country selector (collapsed) */}
        <div className="lg:hidden mb-4 print:hidden">
          <button
            onClick={() => setMobilePickerOpen((v) => !v)}
            className="w-full card-surface px-4 py-3 flex items-center gap-3"
          >
            <span className="text-2xl">{country.flag}</span>
            <div className="flex-1 text-left">
              <div className="text-sm font-bold text-[var(--navy)]">{country.name}</div>
              <div className="text-[11px] text-muted-foreground">{country.processing}</div>
            </div>
            <ChevronDown className={`h-4 w-4 transition ${mobilePickerOpen ? "rotate-180" : ""}`} />
          </button>
          {mobilePickerOpen && (
            <div className="card-surface mt-2 p-2 space-y-1 max-h-72 overflow-y-auto">
              {COUNTRIES.map((c, i) => (
                <button key={c.name}
                  onClick={() => { setSel(i); setMobilePickerOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${sel === i ? "bg-[var(--navy)] text-white" : "hover:bg-secondary"}`}>
                  <span className="text-lg">{c.flag}</span>
                  <span className="text-sm font-semibold">{c.name}</span>
                  <span className={`ml-auto text-[11px] ${sel === i ? "text-white/70" : "text-muted-foreground"}`}>{c.processing}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Picker (desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className="card-surface p-4 hidden lg:block h-fit sticky top-4 print:hidden"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">Country</div>
            <div className="space-y-1">
              {COUNTRIES.map((c, i) => (
                <button key={c.name} onClick={() => setSel(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${
                    sel === i ? "bg-[var(--navy)] text-white" : "hover:bg-secondary"
                  }`}>
                  <span className="text-xl">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{c.name}</div>
                    <div className={`text-[11px] ${sel === i ? "text-white/70" : "text-muted-foreground"}`}>{c.processing}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Builder + A4 Preview */}
          <div className="lg:col-span-2 space-y-5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-surface p-4 sm:p-6 print:hidden">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="font-display font-extrabold text-lg sm:text-xl text-[var(--navy)] flex items-center gap-2">
                    <span className="text-2xl">{country.flag}</span> {country.name}
                  </h2>
                  <p className="text-[12px] text-muted-foreground mt-0.5">Processing: {country.processing}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={() => window.print()}
                    className="flex-1 sm:flex-none bg-white border border-[var(--navy)] text-[var(--navy)] rounded-xl px-3 py-2.5 text-sm font-bold inline-flex items-center justify-center gap-2 hover:bg-secondary">
                    <Printer className="h-4 w-4" /> Print
                  </button>
                  <button onClick={downloadPdf}
                    className="flex-1 sm:flex-none bg-[var(--navy)] text-white rounded-xl px-3 py-2.5 text-sm font-bold inline-flex items-center justify-center gap-2 hover:brightness-110">
                    <Download className="h-4 w-4" /> PDF
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Visa Type</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {country.visas.map((v) => (
                    <button key={v} onClick={() => setVisa(v)}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition ${
                        visa === v ? "bg-[var(--navy)] text-white border-[var(--navy)]" : "bg-white text-[var(--navy)] border-border hover:border-[var(--navy)]"
                      }`}>{v}</button>
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
                      <button key={d} onClick={() => toggle(d)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/50 transition">
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
                <FileText className="h-3.5 w-3.5" /> Live A4 preview below mirrors the printed/exported PDF.
              </div>
            </motion.div>

            {/* A4 Live Preview */}
            <div className="overflow-x-auto print:overflow-visible">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1 print:hidden">A4 Preview</div>
              <motion.div
                id="a4-print"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="doc-paper mx-auto rounded-sm"
                style={{ width: "210mm", minHeight: "297mm", padding: "20mm", boxSizing: "border-box", fontFamily: "Helvetica, Arial, sans-serif", color: "#0f2447" }}
              >
                <div className="flex items-start justify-between border-b-2 pb-4" style={{ borderColor: "#0f2447" }}>
                  <div>
                    <div className="text-[10pt] tracking-widest font-bold text-[#b91c1c]">VISAHOBE PTE. LTD.</div>
                    <h1 className="text-[20pt] font-extrabold mt-1 leading-tight">Visa Document Checklist</h1>
                    <div className="text-[10pt] text-gray-600 mt-1">Sample generated by VisaHOBe AI Visa Agent</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[44pt] leading-none">{country.flag}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-5 text-[10pt]">
                  <div><div className="font-bold uppercase text-[8pt] text-gray-500">Country</div><div className="mt-0.5 font-semibold">{country.name}</div></div>
                  <div><div className="font-bold uppercase text-[8pt] text-gray-500">Visa Type</div><div className="mt-0.5 font-semibold">{visa}</div></div>
                  <div><div className="font-bold uppercase text-[8pt] text-gray-500">Processing</div><div className="mt-0.5 font-semibold">{country.processing}</div></div>
                </div>

                <h2 className="text-[13pt] font-extrabold mt-7 mb-3">Required Documents</h2>
                <ol className="space-y-2">
                  {country.docs.map((d, i) => {
                    const isChecked = checked.has(d);
                    return (
                      <li key={d} className="flex items-start gap-3 text-[11pt]">
                        <span className={`inline-flex items-center justify-center w-5 h-5 mt-[2px] border-2 rounded ${isChecked ? "bg-[#0f2447] border-[#0f2447] text-white" : "border-gray-400"}`}>
                          {isChecked ? "✓" : ""}
                        </span>
                        <span className="font-semibold w-6">{i + 1}.</span>
                        <span className={isChecked ? "line-through text-gray-500" : ""}>{d}</span>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-10 grid grid-cols-2 gap-6">
                  <div>
                    <div className="border-t border-gray-400 pt-1 text-[9pt] text-gray-600">Applicant Signature</div>
                  </div>
                  <div>
                    <div className="border-t border-gray-400 pt-1 text-[9pt] text-gray-600">Authorised Officer</div>
                  </div>
                </div>

                <div className="absolute" />
                <div className="mt-10 pt-3 border-t text-[8pt] text-gray-500 flex items-center justify-between">
                  <span>VisaHOBe Pte. Ltd. — visahobe.com</span>
                  <span>Generated {new Date().toLocaleDateString()}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
