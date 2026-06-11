import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { motion } from "motion/react";
import { Sparkles, ArrowUp, ScanLine, FileText, Globe2, Receipt, FileSignature, Mic, Paperclip } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Agent — VisaHOBe" },
      { name: "description", content: "VisaHOBe AI Visa Agent — your AI assistant for visa & immigration workflows." },
    ],
  }),
  component: AIAgent,
});

const chips = [
  { icon: ScanLine, label: "Extract passport data" },
  { icon: FileText, label: "Generate work permit" },
  { icon: Globe2, label: "Check Singapore visa rules" },
  { icon: Receipt, label: "Create invoice for client" },
  { icon: FileSignature, label: "Draft employment agreement" },
];

function AIAgent() {
  const [prompt, setPrompt] = useState("");

  return (
    <AppShell>
      <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center overflow-hidden">
        {/* gradient orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-10 left-1/4 h-[420px] w-[420px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #4f7cff 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1.5 }}
          className="absolute bottom-10 right-1/4 h-[460px] w-[460px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #e63946 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 9, repeat: Infinity, delay: 0.5 }}
          className="absolute top-1/3 right-1/3 h-[300px] w-[300px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }}
        />

        <div className="relative z-10 w-full max-w-3xl px-4 text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="mx-auto mb-6 relative"
          >
            <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-rose-500 flex items-center justify-center shadow-2xl relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-3xl border-2 border-dashed border-white/30"
              />
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display font-extrabold text-4xl md:text-5xl tracking-tight"
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-rose-500 bg-clip-text text-transparent">
              VisaHOBe AI Visa Agent
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-muted-foreground text-base md:text-lg"
          >
            How can I help with your visa workflow today?
          </motion.p>

          {/* Action chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap justify-center gap-2"
          >
            {chips.map((c, i) => (
              <motion.button
                key={c.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 + i * 0.05 }}
                whileHover={{ y: -2, scale: 1.03 }}
                onClick={() => setPrompt(c.label)}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-border rounded-full px-4 py-2 text-[13px] font-medium text-[var(--navy)] hover:shadow-md transition"
              >
                <c.icon className="h-3.5 w-3.5" /> {c.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Prompt input */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 relative"
          >
            <div className="relative bg-white border border-border rounded-3xl shadow-xl shadow-blue-500/5 p-2 flex items-end gap-2">
              <button type="button" className="h-10 w-10 rounded-full hover:bg-secondary flex items-center justify-center shrink-0">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </button>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={1}
                placeholder="Ask anything about visas, documents, employees…"
                className="flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] outline-none placeholder:text-muted-foreground min-h-[44px] max-h-40"
              />
              <button type="button" className="h-10 w-10 rounded-full hover:bg-secondary flex items-center justify-center shrink-0">
                <Mic className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                type="submit"
                disabled={!prompt.trim()}
                className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:scale-105 transition shadow-lg"
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2.6} />
              </button>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              VisaHOBe AI may produce errors. Verify legal documents before submission.
            </p>
          </motion.form>
        </div>
      </div>
    </AppShell>
  );
}
