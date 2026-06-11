import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CheckSquare, Square } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/checklist")({
  head: () => ({ meta: [{ title: "Checklist — VisaHOBe" }] }),
  component: Checklist,
});

const initial = [
  "Valid passport (min. 6 months)",
  "Recent passport-size photographs",
  "Educational certificates",
  "Medical clearance report",
  "Employment offer letter",
  "Bank statements (3 months)",
  "Police clearance certificate",
  "Visa application form signed",
  "Sponsor's documents collected",
  "Insurance policy",
];

function Checklist() {
  const [done, setDone] = useState<Set<number>>(new Set([0, 1]));
  const toggle = (i: number) => {
    const n = new Set(done); n.has(i) ? n.delete(i) : n.add(i); setDone(n);
  };
  const pct = Math.round((done.size / initial.length) * 100);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <header className="mb-6">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy)]">Visa Document Checklist</h1>
          <p className="text-muted-foreground mt-1">Track required documents per applicant.</p>
        </header>

        <div className="card-surface p-4 mb-4">
          <div className="flex justify-between text-[12px] font-bold text-[var(--navy)] mb-2">
            <span>Progress</span><span>{done.size}/{initial.length} · {pct}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="card-surface divide-y divide-border">
          {initial.map((t, i) => {
            const isDone = done.has(i);
            return (
              <button
                key={i} onClick={() => toggle(i)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-secondary/50 transition"
              >
                {isDone
                  ? <CheckSquare className="h-5 w-5 text-emerald-600 shrink-0" />
                  : <Square className="h-5 w-5 text-muted-foreground shrink-0" />}
                <span className={`text-sm ${isDone ? "line-through text-muted-foreground" : "text-[var(--navy)] font-medium"}`}>{t}</span>
              </button>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
