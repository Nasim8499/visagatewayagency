import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { GlassCard, PageHeader } from "@/components/ui-bits";
import { templates, type TemplateField, type Template } from "@/lib/templates";
import {
  ArrowLeft, Wand2, Download, FileText, Type, Calendar, Hash,
  Image as ImageIcon, QrCode, Barcode, PenTool, Sparkles, CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/documents/$templateId")({
  head: ({ params }) => {
    const t = templates.find((x) => x.id === params.templateId);
    return {
      meta: [
        { title: `${t?.name ?? "Template"} — VisaHOBe` },
        { name: "description", content: t?.description ?? "VisaHOBe template preview." },
      ],
    };
  },
  loader: ({ params }) => {
    const t = templates.find((x) => x.id === params.templateId);
    if (!t) throw notFound();
    return { template: t };
  },
  component: TemplateDetail,
});

const typeIcon: Record<TemplateField["type"], typeof Type> = {
  text: Type, date: Calendar, number: Hash, image: ImageIcon,
  qr: QrCode, barcode: Barcode, signature: PenTool,
};

function TemplateDetail() {
  const { template } = Route.useLoaderData();
  const [values, setValues] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const progress = useMemo(() => {
    const filled = template.fields.filter((f) => values[f.key]?.trim()).length;
    return Math.round((filled / template.fields.length) * 100);
  }, [values, template.fields]);

  const generate = () => {
    setGenerating(true); setDone(false);
    setTimeout(() => { setGenerating(false); setDone(true); }, 1600);
  };

  return (
    <AppShell>
      <Link
        to="/documents"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Document Hub
      </Link>

      <PageHeader
        eyebrow={template.tag}
        title={template.name}
        description={template.description}
        actions={
          <button
            onClick={generate}
            disabled={generating}
            className="inline-flex items-center gap-2 gradient-brand text-brand-foreground rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[var(--shadow-glow)] hover:brightness-110 transition disabled:opacity-60"
          >
            {generating ? (
              <><Sparkles className="h-4 w-4 animate-spin" /> Generating…</>
            ) : done ? (
              <><Download className="h-4 w-4" /> Download PDF</>
            ) : (
              <><Wand2 className="h-4 w-4" /> Generate PDF</>
            )}
          </button>
        }
      />

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Field form */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-sm">Applicant Data</h3>
              <span className="text-xs font-mono text-muted-foreground">{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-5">
              <motion.div
                className="h-full gradient-brand"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="space-y-3">
              {template.fields.map((f, i) => {
                const Icon = typeIcon[f.type];
                return (
                  <motion.div
                    key={f.key}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5 mb-1.5">
                      <Icon className="h-3 w-3" /> {f.label}
                      {f.required && <span className="text-destructive">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={f.type === "date" ? "date" : f.type === "number" ? "number" : "text"}
                        value={values[f.key] ?? ""}
                        onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                        placeholder={`{{${f.key}}}`}
                        className="w-full glass-strong rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50 placeholder:font-mono placeholder:text-xs"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Preview */}
        <div className="lg:col-span-3">
          <GlassCard delay={0.1} hover={false} className="!p-4 md:!p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Live Preview
              </h3>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">A4 · {template.pages} page{template.pages > 1 ? "s" : ""}</span>
            </div>

            {/* A4 paper mock */}
            <div className="bg-white text-zinc-900 rounded-lg shadow-2xl aspect-[1/1.414] p-6 md:p-10 overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.04),_transparent_60%)]" />

              <div className="flex items-start justify-between border-b border-zinc-200 pb-4">
                <div>
                  <div className="text-[8px] uppercase tracking-[0.2em] text-zinc-500">VisaHOBe Pte. Ltd.</div>
                  <div className="font-serif text-base md:text-xl font-bold mt-1 leading-tight">{template.name}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Singapore · Ministry of Manpower</div>
                </div>
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-md bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold tracking-wider">
                  SEAL
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                {template.fields.filter((f) => ["text", "date", "number"].includes(f.type)).map((f) => (
                  <div key={f.key} className="grid grid-cols-[110px_1fr] gap-3 text-[10px] md:text-xs">
                    <div className="text-zinc-500 uppercase tracking-wider">{f.label}</div>
                    <div className="border-b border-dashed border-zinc-300 pb-0.5">
                      {values[f.key] || (
                        <span className="font-mono text-zinc-400">{`{{${f.key}}}`}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {template.fields.some((f) => ["qr", "barcode", "signature", "image"].includes(f.type)) && (
                <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex items-end gap-3">
                  {template.fields.find((f) => f.type === "image") && (
                    <div className="h-16 w-12 md:h-20 md:w-16 rounded border border-zinc-300 bg-zinc-100 flex items-center justify-center text-[8px] text-zinc-400">
                      PHOTO
                    </div>
                  )}
                  {template.fields.find((f) => f.type === "qr") && (
                    <div className="h-14 w-14 md:h-16 md:w-16 grid grid-cols-5 grid-rows-5 gap-px bg-white p-1 border border-zinc-300">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={(i * 7 + 3) % 3 === 0 ? "bg-zinc-900" : "bg-white"} />
                      ))}
                    </div>
                  )}
                  {template.fields.find((f) => f.type === "barcode") && (
                    <div className="flex items-end gap-px h-10 md:h-12">
                      {Array.from({ length: 28 }).map((_, i) => (
                        <div key={i} className="bg-zinc-900" style={{ width: 1.5, height: 30 + ((i * 13) % 14) }} />
                      ))}
                    </div>
                  )}
                  {template.fields.find((f) => f.type === "signature") && (
                    <div className="border-t border-zinc-400 pt-1 w-24 md:w-32 text-[8px] text-zinc-500 text-center">
                      Authorized Signature
                    </div>
                  )}
                </div>
              )}

              <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between text-[8px] text-zinc-400">
                <span>VH-{template.id.toUpperCase()}</span>
                <span>Page 1 of {template.pages}</span>
              </div>
            </div>
          </GlassCard>

          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-strong rounded-xl p-3.5 mt-4 flex items-center gap-3"
              >
                <div className="h-9 w-9 rounded-lg bg-[oklch(0.74_0.18_158/0.15)] text-[var(--color-success)] flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-semibold">PDF generated</div>
                  <div className="text-xs text-muted-foreground">Original design and watermarks preserved · A4 print-ready</div>
                </div>
                <button className="text-xs glass rounded-lg px-3 py-2 font-semibold inline-flex items-center gap-1.5 hover:bg-white/5 transition">
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}
