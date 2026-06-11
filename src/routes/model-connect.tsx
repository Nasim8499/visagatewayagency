import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Plug, CheckCircle2, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export const Route = createFileRoute("/model-connect")({
  head: () => ({ meta: [{ title: "Model Connect — VisaHOBe" }] }),
  component: ModelConnect,
});

type Slot = { name: string; provider: string; connected: boolean; color: string };

const initial: Slot[] = [
  { name: "Primary Vision Model", provider: "Gemini 2.5 Pro", connected: true, color: "from-blue-500 to-purple-600" },
  { name: "OCR Engine", provider: "GPT-5", connected: true, color: "from-emerald-500 to-teal-600" },
  { name: "Document Drafting", provider: "Claude 4.5", connected: false, color: "from-amber-500 to-rose-500" },
  { name: "Translation Model", provider: "Not selected", connected: false, color: "from-pink-500 to-rose-500" },
  { name: "Custom Fine-Tune", provider: "Not selected", connected: false, color: "from-slate-500 to-slate-700" },
];

function ModelConnect() {
  const [slots, setSlots] = useState(initial);
  const toggle = (i: number) => setSlots(slots.map((s, j) => j === i ? { ...s, connected: !s.connected } : s));

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy)] flex items-center gap-2">
            <Plug className="h-7 w-7" /> Model Connect
          </h1>
          <p className="text-muted-foreground mt-1">Connect up to 5 AI models to power VisaHOBe workflows.</p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4">
          {slots.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-surface p-5 relative overflow-hidden"
            >
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3 shadow-lg`}>
                <Plug className="h-5 w-5" />
              </div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Slot {i + 1}</div>
              <h3 className="font-display font-bold text-[var(--navy)] mt-0.5">{s.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s.provider}</p>
              <button
                onClick={() => toggle(i)}
                className={`mt-4 w-full rounded-lg py-2 text-[12px] font-bold inline-flex items-center justify-center gap-1.5 transition ${
                  s.connected
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-[var(--navy)] text-white hover:brightness-110"
                }`}
              >
                {s.connected ? <><CheckCircle2 className="h-3.5 w-3.5" /> Connected</> : <><Plus className="h-3.5 w-3.5" /> Connect</>}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
