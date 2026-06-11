import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { FileText, Download, Wand2 } from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/document-generator")({
  head: () => ({ meta: [{ title: "Document Generator — VisaHOBe" }] }),
  component: DocGen,
});

const templates = [
  "Work Permit Application", "Employment Pass", "S-Pass Form",
  "Dependant Pass", "Visit Visa Cover Letter", "Salary Slip A4",
];

function DocGen() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy)]">A4 PDF Generator</h1>
          <p className="text-muted-foreground mt-1">Pick a template, fill applicant data, generate a print-ready A4 PDF.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {templates.map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="card-surface p-5 cursor-pointer group"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center mb-3 shadow-lg">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-[var(--navy)]">{t}</h3>
              <p className="text-[12px] text-muted-foreground mt-1">A4 · Print ready · Smart fields</p>
              <button className="mt-4 w-full bg-secondary text-[var(--navy)] rounded-lg py-2 text-[12px] font-bold group-hover:bg-[var(--navy)] group-hover:text-white transition flex items-center justify-center gap-1.5">
                <Wand2 className="h-3.5 w-3.5" /> Generate
              </button>
            </motion.div>
          ))}
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg text-[var(--navy)]">Live Preview</h3>
            <button className="bg-[var(--navy)] text-white rounded-xl px-4 py-2 text-[13px] font-bold inline-flex items-center gap-2">
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </div>
          <div className="aspect-[1/1.414] max-w-md mx-auto bg-white shadow-2xl rounded-lg border border-border p-8 text-sm">
            <div className="text-center font-display font-bold text-lg text-[var(--navy)]">EMPLOYMENT CONTRACT</div>
            <hr className="my-4 border-border" />
            <p>This agreement is made between <strong>VisaHOBe PTE. LTD.</strong> and the applicant.</p>
            <p className="mt-3 text-muted-foreground">[ Smart fields will render here on export ]</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
