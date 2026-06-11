import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, ScanLine, FileText, Globe2, Receipt, FileSignature, Mic, Paperclip, Plane, Square, Copy } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";

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
  { icon: ScanLine, label: "Extract passport data", prompt: "Walk me through extracting passport data with OCR and mapping fields to template variables." },
  { icon: FileText, label: "Generate work permit", prompt: "What information do I need to generate a Singapore Work Permit PDF for a foreign worker?" },
  { icon: Globe2, label: "Singapore visa rules", prompt: "Summarize Singapore Employment Pass eligibility and required documents in 2026." },
  { icon: Receipt, label: "Create client invoice", prompt: "Draft a sample invoice line items list for visa processing services with GST 9%." },
  { icon: FileSignature, label: "Draft agreement", prompt: "Draft a 24-month employment agreement clause for a construction worker in Singapore." },
];

function MessageBubble({ m }: { m: UIMessage }) {
  const text = useMemo(
    () => m.parts.map((p) => (p.type === "text" ? p.text : "")).join(""),
    [m.parts],
  );
  const isUser = m.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-rose-500 flex items-center justify-center shrink-0 shadow">
          <Plane className="h-4 w-4 text-white -rotate-45" />
        </div>
      )}
      <div className={`max-w-[80%] ${isUser ? "" : "flex-1"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-[var(--navy)] text-white rounded-tr-md"
              : "bg-white border border-border text-[var(--navy)] rounded-tl-md shadow-sm"
          }`}
        >
          {text || (
            <span className="inline-flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-current/40 animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-current/40 animate-bounce [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-current/40 animate-bounce [animation-delay:240ms]" />
            </span>
          )}
        </div>
        {!isUser && text && (
          <button
            onClick={() => navigator.clipboard.writeText(text)}
            className="mt-1.5 text-[11px] text-muted-foreground hover:text-[var(--navy)] inline-flex items-center gap-1"
          >
            <Copy className="h-3 w-3" /> Copy
          </button>
        )}
      </div>
    </motion.div>
  );
}

function AIAgent() {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, stop, error } = useChat({ transport });

  const isLoading = status === "submitted" || status === "streaming";
  const empty = messages.length === 0;

  useEffect(() => { inputRef.current?.focus(); }, [status]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || isLoading) return;
    sendMessage({ text: t });
    setInput("");
  };

  return (
    <AppShell>
      <div className="relative min-h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
        {/* gradient orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-10 left-1/4 h-[420px] w-[420px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #4f7cff 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1.5 }}
          className="absolute bottom-10 right-1/4 h-[460px] w-[460px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #e63946 0%, transparent 70%)" }}
        />

        {/* Hero / transcript */}
        <div className="relative z-10 flex-1 w-full max-w-3xl mx-auto px-4 pt-4 pb-40">
          <AnimatePresence mode="wait">
            {empty ? (
              <motion.div
                key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center pt-12 md:pt-20"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="mx-auto mb-6 relative"
                >
                  <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-rose-500 flex items-center justify-center shadow-2xl relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-3xl border-2 border-dashed border-white/30"
                    />
                    <Plane className="h-9 w-9 text-white -rotate-45" />
                  </div>
                </motion.div>
                <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-rose-500 bg-clip-text text-transparent">
                    VisaHOBe AI Visa Agent
                  </span>
                </h1>
                <p className="mt-3 text-muted-foreground text-base md:text-lg">
                  How can I help with your visa workflow today?
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="space-y-5 pt-2"
              >
                {messages.map((m) => <MessageBubble key={m.id} m={m} />)}
                {error && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3">
                    {error.message || "Something went wrong. Please try again."}
                  </div>
                )}
                <div ref={endRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom dock: chips + prompt */}
        <div className="fixed bottom-0 inset-x-0 md:left-[260px] z-20 pointer-events-none">
          <div className="max-w-3xl mx-auto px-4 pb-5 pointer-events-auto">
            {empty && (
              <div className="mb-3 flex flex-wrap justify-center gap-2">
                {chips.map((c, i) => (
                  <motion.button
                    key={c.label}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    whileHover={{ y: -2 }}
                    onClick={() => send(c.prompt)}
                    className="inline-flex items-center gap-2 bg-white/90 backdrop-blur border border-border rounded-full px-3.5 py-1.5 text-[12px] font-medium text-[var(--navy)] hover:shadow-md transition"
                  >
                    <c.icon className="h-3.5 w-3.5" /> {c.label}
                  </motion.button>
                ))}
              </div>
            )}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="relative bg-white/95 backdrop-blur border border-border rounded-3xl shadow-xl shadow-blue-500/5 p-2 flex items-end gap-2"
            >
              <button type="button" className="h-10 w-10 rounded-full hover:bg-secondary flex items-center justify-center shrink-0">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                rows={1}
                placeholder="Ask anything about visas, documents, employees…"
                className="flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] outline-none placeholder:text-muted-foreground min-h-[44px] max-h-40"
              />
              <button type="button" className="h-10 w-10 rounded-full hover:bg-secondary flex items-center justify-center shrink-0">
                <Mic className="h-4 w-4 text-muted-foreground" />
              </button>
              {isLoading ? (
                <button
                  type="button" onClick={stop}
                  className="h-10 w-10 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 hover:scale-105 transition shadow-lg"
                  aria-label="Stop"
                >
                  <Square className="h-4 w-4" fill="currentColor" />
                </button>
              ) : (
                <button
                  type="submit" disabled={!input.trim()}
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:scale-105 transition shadow-lg"
                >
                  <ArrowUp className="h-4 w-4" strokeWidth={2.6} />
                </button>
              )}
            </form>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              VisaHOBe AI may produce errors. Verify legal documents before submission.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
