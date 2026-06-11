import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { GraduationCap, UploadCloud, FileText } from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/sample-pdf-training")({
  head: () => ({ meta: [{ title: "Sample PDF Training — VisaHOBe" }] }),
  component: Training,
});

const samples = [
  { name: "SG Work Permit (Form 8)", trained: true, accuracy: 96 },
  { name: "MY Employment Pass", trained: true, accuracy: 92 },
  { name: "UAE Labor Card", trained: true, accuracy: 94 },
  { name: "Salary Slip A4", trained: false, accuracy: 0 },
];

function Training() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy)] flex items-center gap-2">
            <GraduationCap className="h-7 w-7" /> Sample PDF Training
          </h1>
          <p className="text-muted-foreground mt-1">Train the AI on your custom document templates.</p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="card-surface p-8 border-2 border-dashed border-border flex flex-col items-center text-center mb-6"
        >
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-rose-500 text-white flex items-center justify-center mb-3 shadow-lg">
            <UploadCloud className="h-7 w-7" />
          </div>
          <h3 className="font-display font-bold text-lg text-[var(--navy)]">Upload sample PDFs</h3>
          <p className="text-sm text-muted-foreground mt-1">The AI will learn field layouts and watermarks.</p>
          <button className="mt-4 bg-[var(--navy)] text-white rounded-xl px-5 py-2.5 text-sm font-bold">Start Training</button>
        </motion.div>

        <div className="space-y-2">
          {samples.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-surface p-4 flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <FileText className="h-5 w-5 text-[var(--navy)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-[var(--navy)] truncate">{s.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {s.trained ? `Trained · ${s.accuracy}% accuracy` : "Not trained yet"}
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${s.trained ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {s.trained ? "READY" : "PENDING"}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
