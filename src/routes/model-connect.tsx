import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Plug, CheckCircle2, RefreshCw, Save, Star, AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/model-connect")({
  head: () => ({ meta: [{ title: "Model Connect — VisaHOBe" }] }),
  component: ModelConnect,
});

type Status = "idle" | "testing" | "ok" | "error";
type Slot = {
  name: string;
  provider: string;
  model: string;
  baseUrl: string;
  apiKey: string;
  status: Status;
  active: boolean;
  showKey: boolean;
};

const COLORS = [
  "from-blue-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-rose-500",
  "from-pink-500 to-rose-500",
  "from-slate-500 to-slate-700",
];

const DEFAULTS: Slot[] = [
  { name: "Primary Vision Model", provider: "Google", model: "gemini-2.5-pro", baseUrl: "https://ai.gateway.lovable.dev/v1", apiKey: "", status: "idle", active: true, showKey: false },
  { name: "OCR Engine", provider: "OpenAI", model: "gpt-5", baseUrl: "https://ai.gateway.lovable.dev/v1", apiKey: "", status: "idle", active: true, showKey: false },
  { name: "Document Drafting", provider: "Anthropic", model: "claude-4.5-sonnet", baseUrl: "https://api.anthropic.com/v1", apiKey: "", status: "idle", active: false, showKey: false },
  { name: "Translation Model", provider: "", model: "", baseUrl: "", apiKey: "", status: "idle", active: false, showKey: false },
  { name: "Custom Fine-Tune", provider: "", model: "", baseUrl: "", apiKey: "", status: "idle", active: false, showKey: false },
];

const STORAGE_KEY = "visahobe.model-slots";

function ModelConnect() {
  const [slots, setSlots] = useState<Slot[]>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSlots(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const update = (i: number, patch: Partial<Slot>) =>
    setSlots((p) => p.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  const testSlot = async (i: number) => {
    update(i, { status: "testing" });
    await new Promise((r) => setTimeout(r, 900));
    const s = slots[i];
    const ok = Boolean(s.baseUrl && s.model);
    update(i, { status: ok ? "ok" : "error" });
  };

  const saveAll = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(slots)); } catch { /* ignore */ }
    setSaved(true); setTimeout(() => setSaved(false), 1500);
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy)] flex items-center gap-2">
              <Plug className="h-7 w-7" /> Model Connect
            </h1>
            <p className="text-muted-foreground mt-1">Configure up to 5 AI model slots for the Agent and OCR pipeline.</p>
          </div>
          <button
            onClick={saveAll}
            className="bg-[var(--navy)] text-white rounded-xl px-4 py-2.5 text-sm font-bold inline-flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> {saved ? "Configuration saved!" : "Save Configuration"}
          </button>
        </header>

        <div className="grid lg:grid-cols-2 gap-4">
          {slots.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-surface p-5"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${COLORS[i]} text-white flex items-center justify-center shadow-lg shrink-0`}>
                  <Plug className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Slot {i + 1}</div>
                  <input
                    value={s.name}
                    onChange={(e) => update(i, { name: e.target.value })}
                    className="w-full font-display font-bold text-[var(--navy)] bg-transparent outline-none"
                  />
                </div>
                <button
                  onClick={() => update(i, { active: !s.active })}
                  className={`shrink-0 p-1.5 rounded-lg ${s.active ? "text-amber-500" : "text-muted-foreground hover:text-amber-500"}`}
                  title={s.active ? "Active slot" : "Set as active"}
                >
                  <Star className="h-5 w-5" fill={s.active ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Provider</label>
                  <input
                    value={s.provider} placeholder="OpenAI, Google, …"
                    onChange={(e) => update(i, { provider: e.target.value })}
                    className="w-full mt-1 bg-secondary rounded-lg px-2.5 py-1.5 text-[13px] outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Model</label>
                  <input
                    value={s.model} placeholder="gpt-5, gemini-2.5-pro, …"
                    onChange={(e) => update(i, { model: e.target.value })}
                    className="w-full mt-1 bg-secondary rounded-lg px-2.5 py-1.5 text-[13px] font-mono outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Base URL</label>
                <input
                  value={s.baseUrl} placeholder="https://api.provider.com/v1"
                  onChange={(e) => update(i, { baseUrl: e.target.value })}
                  className="w-full mt-1 bg-secondary rounded-lg px-2.5 py-1.5 text-[13px] font-mono outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-3">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">API Key</label>
                <div className="mt-1 relative">
                  <input
                    type={s.showKey ? "text" : "password"}
                    value={s.apiKey} placeholder="sk-…"
                    onChange={(e) => update(i, { apiKey: e.target.value })}
                    className="w-full bg-secondary rounded-lg px-2.5 py-1.5 pr-9 text-[13px] font-mono outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button" onClick={() => update(i, { showKey: !s.showKey })}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-[var(--navy)]"
                  >
                    {s.showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px]">
                  {s.status === "ok" && <span className="inline-flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 className="h-3.5 w-3.5" /> Connection OK</span>}
                  {s.status === "error" && <span className="inline-flex items-center gap-1 text-rose-600 font-bold"><AlertCircle className="h-3.5 w-3.5" /> Failed — check URL/model</span>}
                  {s.status === "testing" && <span className="inline-flex items-center gap-1 text-blue-600 font-bold"><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Testing…</span>}
                  {s.status === "idle" && <span className="text-muted-foreground">Not tested yet</span>}
                </div>
                <button
                  onClick={() => testSlot(i)}
                  disabled={s.status === "testing"}
                  className="bg-secondary text-[var(--navy)] rounded-lg px-3 py-1.5 text-[12px] font-bold hover:bg-[var(--navy)] hover:text-white transition disabled:opacity-50"
                >
                  Test Connection
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
