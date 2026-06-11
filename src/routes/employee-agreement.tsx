import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { FileSignature, Download } from "lucide-react";

export const Route = createFileRoute("/employee-agreement")({
  head: () => ({ meta: [{ title: "Employee Agreement — VisaHOBe" }] }),
  component: EmployeeAgreement,
});

function EmployeeAgreement() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy)] flex items-center gap-2">
              <FileSignature className="h-7 w-7" /> Employee Agreement
            </h1>
            <p className="text-muted-foreground mt-1">Draft and e-sign employment contracts.</p>
          </div>
          <button className="bg-[var(--navy)] text-white rounded-xl px-4 py-2.5 text-sm font-bold inline-flex items-center gap-2">
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </header>

        <article className="bg-white shadow-2xl rounded-lg border border-border p-10 md:p-14 prose prose-sm max-w-none text-[var(--navy)]">
          <h2 className="text-center font-display font-extrabold text-2xl">EMPLOYMENT AGREEMENT</h2>
          <p className="text-center text-xs text-muted-foreground">Effective Date: <strong>{new Date().toLocaleDateString()}</strong></p>
          <hr />
          <p>This Employment Agreement ("Agreement") is entered into between <strong>VisaHOBe PTE. LTD.</strong> ("Employer") and <strong>{`{{FULL_NAME}}`}</strong> ("Employee").</p>
          <h3>1. Position & Duties</h3>
          <p>The Employee shall serve as <strong>{`{{POSITION}}`}</strong> and perform duties assigned by the Employer.</p>
          <h3>2. Compensation</h3>
          <p>The Employee shall receive a monthly salary of <strong>SGD {`{{SALARY}}`}</strong>, payable on the last working day of each month.</p>
          <h3>3. Term</h3>
          <p>This Agreement commences on <strong>{`{{START_DATE}}`}</strong> and continues for a period of <strong>24 months</strong>.</p>
          <h3>4. Confidentiality</h3>
          <p>Employee agrees to maintain confidentiality of proprietary information.</p>
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div className="border-t border-border pt-2 text-center text-xs">Employer Signature</div>
            <div className="border-t border-border pt-2 text-center text-xs">Employee Signature</div>
          </div>
        </article>
      </div>
    </AppShell>
  );
}
