import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { motion } from "framer-motion";

export const Route = createFileRoute("/ai-agent")({
  head: () => ({ meta: [{ title: "AI Agent — VisaHOBe" }] }),
  component: AiAgent,
});

function AiAgent() {
  return (
    <AppShell>
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl rounded-3xl p-8 md:p-12 relative bg-gradient-to-b from-[#0f1724] via-[#102441] to-[#19325a] shadow-2xl"
        >
          <div className="flex flex-col items-center text-center text-white">
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="h-28 w-28 rounded-full bg-white/6 flex items-center justify-center mb-4"
            >
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.12" strokeWidth="1.5" />
                <path d="M8 12c1.5-3 6-3 7.5 0" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>

            <motion.h1 initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 }} className="text-2xl md:text-4xl font-bold">
              VisaHOBe AI
              <span className="block text-3xl md:text-5xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-white to-rose-300">
                Visa Agent
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }} className="mt-3 text-sm text-white/70 max-w-xl">
              Conversational assistant for immigration operations — passport checks, document generation, country rules and more.
            </motion.p>

            <div className="mt-6 flex gap-2 flex-wrap justify-center">
              {[
                "Check visa eligibility",
                "Generate employment contract",
                "Extract passport data",
                "Prepare invoice",
              ].map((c) => (
                <motion.button key={c} whileHover={{ scale: 1.03 }} className="px-4 py-2 rounded-full bg-white/6 text-white/90 text-sm">
                  {c}
                </motion.button>
              ))}
            </div>

            <div className="mt-8 w-full flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-full bg-white/6 px-4 py-3 flex items-center gap-3">
                  <input placeholder="Ask VisaHOBe — e.g., 'How to sponsor an Employment Pass for Singapore?'" className="flex-1 bg-transparent outline-none text-white text-sm" />
                  <button className="rounded-full bg-gradient-to-r from-amber-400 to-rose-500 px-4 py-2 text-sm font-semibold text-white">Send</button>
                </motion.div>
                <div className="mt-2 text-[12px] text-white/50 text-center">Tip: Use short prompts. Model selected in Model Connect will be used for responses.</div>
              </div>
            </div>

            <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/4 text-white/90">Quick actions, conversation history and summaries will appear here.</div>
              <div className="p-4 rounded-2xl bg-white/4 text-white/90">Model selector & settings (see Model Connect).</div>
            </div>

            <div className="mt-6 text-sm text-white/60">Powered by VisaHOBe • Keep API keys server-side only.</div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
