import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ClipboardList } from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/employee-forms")({
  head: () => ({ meta: [{ title: "Employee Forms — VisaHOBe" }] }),
  component: EmployeeForms,
});

function EmployeeForms() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy)] flex items-center gap-2">
            <ClipboardList className="h-7 w-7" /> Employee Forms
          </h1>
          <p className="text-muted-foreground mt-1">Collect employee onboarding details with smart validation.</p>
        </header>

        <motion.form
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="card-surface p-6 space-y-4"
        >
          {[
            ["Full Name", "John Doe"],
            ["NRIC / Passport No.", "BX1234567"],
            ["Date of Birth", "1990-01-01"],
            ["Nationality", "Bangladeshi"],
            ["Position Applied", "Construction Worker"],
            ["Monthly Salary (SGD)", "1800"],
            ["Contact Number", "+65 9123 4567"],
            ["Address", "Blk 123, Singapore 560123"],
          ].map(([label, ph]) => (
            <div key={label}>
              <label className="block text-[12px] font-bold text-[var(--navy)] uppercase tracking-wide mb-1">{label}</label>
              <input
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={ph}
              />
            </div>
          ))}
          <button type="button" className="w-full bg-[var(--navy)] text-white rounded-xl py-3 text-sm font-bold hover:brightness-110">
            Save Employee
          </button>
        </motion.form>
      </div>
    </AppShell>
  );
}
