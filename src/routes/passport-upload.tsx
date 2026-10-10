import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, MoreVertical, Cloud, Box, FolderOpen, FileText, Receipt, IdCard,
  Paperclip, Send, Loader2, Download, Printer, X, Eye, Sparkles, ChevronLeft,
} from "lucide-react";
import { useRef, useState } from "react";

export const Route = createFileRoute("/passport-upload")({
  head: () => ({
    meta: [
      { title: "Passport Upload & AI Files — VisaHOBe" },
      { name: "description", content: "Upload passports, generate visa PDFs with one prompt and preview them in an A4 workspace." },
      { property: "og:title", content: "Passport Upload & AI Files — VisaHOBe" },
      { property: "og:description", content: "One-prompt AI visa PDF generation with live A4 preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PassportUpload,
});

type Doc = {
  title: string; country: string; visaType: string;
  applicant: Record<string, string>;
  employer: { name: string; jobTitle: string; salary: string };
  body: string; checklist: string[];
};
type FileItem = { id: string; name: string; when: string; pages: number; doc?: Doc; thumb?: string };

const CHIPS = [
  "Generate Saudi Arabia work visa letter",
  "UAE employment visa application",
  "Romania work permit invitation letter",
  "Malaysia offer letter for this passport",
];

const CATS = [
  { icon: IdCard, name: "Passports & IDs", n: 12 },
  { icon: FileText, name: "Visa Documents", n: 28 },
  { icon: FolderOpen, name: "Contracts", n: 9 },
  { icon: Receipt, name: "Invoices", n: 15 },
];

const LABELS: Record<string, string> = {
  fullName: "Full Name", passportNumber: "Passport No.", nationality: "Nationality",
  dateOfBirth: "Date of Birth", gender: "Gender", issueDate: "Issue Date",
  expiryDate: "Expiry Date", placeOfIssue: "Place of Issue",
};

function PassportUpload() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Passport_Arif_Hossain.jpg", when: "12 minutes ago", pages: 1 },
    { id: "2", name: "UAE_Visa_Checklist.pdf", when: "Yesterday", pages: 3 },
  ]);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imgName, setImgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doc, setDoc] = useState<Doc | null>(null);
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const pick = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      setImage(r.result as string); setImgName(f.name);
      setFiles((p) => [{ id: crypto.randomUUID(), name: f.name, when: "Just now", pages: 1, thumb: r.result as string }, ...p]);
    };
    r.readAsDataURL(f);
  };

  const generate = async (text?: string) => {
    const q = (text ?? prompt).trim();
    if (!q || loading) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/generate-doc", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q, image: image ?? undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      const d: Doc = { ...data, applicant: data.applicant ?? {}, employer: data.employer ?? { name: "", jobTitle: "", salary: "" }, checklist: data.checklist ?? [] };
      setDoc(d); setOpen(true); setPrompt("");
      setFiles((p) => [{ id: crypto.randomUUID(), name: `${d.title || "Document"}.pdf`, when: "Just now", pages: 1, doc: d }, ...p]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  };

  const download = async () => {
    if (!pageRef.current) return;
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
    const canvas = await html2canvas(pageRef.current, { scale: 2, backgroundColor: "#ffffff" });
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const h = (canvas.height * 210) / canvas.width;
    let y = 0;
    while (y < h) {
      if (y > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, -y, 210, h);
      y += 297;
    }
    pdf.save(`${doc?.title || "VisaHOBe-document"}.pdf`);
  };

  const setA = (k: string, v: string) => doc && setDoc({ ...doc, applicant: { ...doc.applicant, [k]: v } });

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto pb-44">
        {/* Dark header */}
        <motion.section initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] bg-[#161922] text-white p-5 md:p-7 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="flex items-center justify-between relative">
            <button className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center"><ChevronLeft className="h-5 w-5" /></button>
            <div className="flex gap-2">
              <button className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center"><Search className="h-4 w-4" /></button>
              <button className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center"><MoreVertical className="h-4 w-4" /></button>
            </div>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mt-5 relative">All your files<br />are saved here</h1>
          <div className="grid grid-cols-2 gap-3 mt-5 relative">
            {[{ icon: Cloud, n: "Google Drive", used: 8, tot: 16, c: "from-emerald-400 to-blue-500" },
              { icon: Box, n: "Dropbox", used: 3, tot: 10, c: "from-blue-400 to-indigo-500" }].map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${s.c} flex items-center justify-center`}><s.icon className="h-4 w-4" /></div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 rounded-full px-2 py-0.5">Synced</span>
                </div>
                <div className="mt-3 text-sm font-semibold">{s.n}</div>
                <div className="h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(s.used / s.tot) * 100}%` }} transition={{ duration: 1 }} className={`h-full bg-gradient-to-r ${s.c}`} />
                </div>
                <div className="text-[11px] text-white/60 mt-1">{s.used} / {s.tot} GB</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* White sheet */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="-mt-4 relative rounded-[28px] bg-card border border-border shadow-xl p-5 md:p-7">
          <h2 className="font-display font-bold text-lg text-[var(--navy)]">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {CATS.map((c, i) => (
              <motion.div key={c.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.05 }}
                className="rounded-2xl bg-secondary/60 p-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[var(--navy)] text-white flex items-center justify-center"><c.icon className="h-4 w-4" /></div>
                <div><div className="text-[13px] font-semibold text-[var(--navy)]">{c.name}</div><div className="text-[11px] text-muted-foreground">{c.n} files</div></div>
              </motion.div>
            ))}
          </div>

          <h2 className="font-display font-bold text-lg text-[var(--navy)] mt-6">Recent files</h2>
          <div className="mt-3 space-y-2">
            <AnimatePresence>
              {files.map((f) => (
                <motion.div key={f.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/60">
                  <div className="h-11 w-11 rounded-xl bg-secondary overflow-hidden flex items-center justify-center shrink-0">
                    {f.thumb ? <img src={f.thumb} alt="" className="h-full w-full object-cover" /> : <FileText className="h-5 w-5 text-[var(--navy)]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-[var(--navy)] truncate">{f.name}</div>
                    <div className="text-[11px] text-muted-foreground">{f.when} · {f.pages} page</div>
                  </div>
                  {f.doc && (
                    <button onClick={() => { setDoc(f.doc!); setOpen(true); }} className="h-9 w-9 rounded-full bg-[var(--navy)] text-white flex items-center justify-center"><Eye className="h-4 w-4" /></button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>

      {/* Fixed AI prompt footer */}
      <div className="fixed bottom-0 inset-x-0 lg:left-64 z-40 p-3 md:p-4 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CHIPS.map((c) => (
              <button key={c} onClick={() => generate(c)} className="shrink-0 text-[12px] rounded-full bg-card border border-border px-3 py-1.5 hover:bg-secondary">{c}</button>
            ))}
          </div>
          {error && <div className="text-[12px] text-rose-600 mb-1">{error}</div>}
          <div className="rounded-3xl bg-card border border-border shadow-xl p-2 flex items-center gap-2">
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
            <button onClick={() => fileRef.current?.click()} className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0" aria-label="Attach passport"><Paperclip className="h-4 w-4" /></button>
            {image && (
              <div className="flex items-center gap-1 bg-secondary rounded-full pl-1 pr-2 py-1 shrink-0">
                <img src={image} alt="" className="h-7 w-7 rounded-full object-cover" />
                <span className="text-[11px] max-w-20 truncate">{imgName}</span>
                <button onClick={() => setImage(null)}><X className="h-3 w-3" /></button>
              </div>
            )}
            <input value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="Describe the visa PDF to generate…" className="flex-1 min-w-0 bg-transparent outline-none text-sm px-1" />
            <button onClick={() => generate()} disabled={loading} className="h-10 w-10 rounded-full bg-[var(--navy)] text-white flex items-center justify-center shrink-0 disabled:opacity-60" aria-label="Generate">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* A4 preview */}
      <AnimatePresence>
        {open && doc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 flex flex-col">
            <div className="flex items-center justify-between gap-2 p-3 bg-[#161922] text-white print:hidden">
              <div className="flex items-center gap-2 min-w-0"><Sparkles className="h-4 w-4 shrink-0" /><span className="text-sm font-semibold truncate">{doc.title}</span></div>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="h-9 px-3 rounded-full bg-white/10 text-[12px] inline-flex items-center gap-1"><Printer className="h-4 w-4" /> Print</button>
                <button onClick={download} className="h-9 px-3 rounded-full bg-white text-[#161922] text-[12px] font-bold inline-flex items-center gap-1"><Download className="h-4 w-4" /> PDF</button>
                <button onClick={() => setOpen(false)} className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center"><X className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-3 md:p-8">
              <div className="mx-auto origin-top" style={{ width: "min(210mm, 100%)" }}>
                <div ref={pageRef} id="a4-print" style={{ background: "#fff", color: "#111", minHeight: "297mm", padding: "18mm 16mm", fontFamily: "Georgia, serif" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "3px solid #161922", paddingBottom: 10 }}>
                    <div><div style={{ fontSize: 20, fontWeight: 800, color: "#161922" }}>VisaHOBe PTE. LTD.</div><div style={{ fontSize: 10, color: "#555" }}>Immigration & Recruitment Services · Singapore</div></div>
                    <div style={{ textAlign: "right", fontSize: 10, color: "#555" }}>Ref: VH-{Date.now().toString().slice(-6)}<br />{new Date().toLocaleDateString()}</div>
                  </div>
                  <h2 style={{ textAlign: "center", fontSize: 17, fontWeight: 800, margin: "18px 0 4px", textTransform: "uppercase" }}>{doc.title}</h2>
                  <div style={{ textAlign: "center", fontSize: 11, color: "#555", marginBottom: 14 }}>{doc.country} · {doc.visaType}</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 14 }}>
                    <tbody>
                      {Object.keys(LABELS).map((k) => (
                        <tr key={k}>
                          <td style={{ border: "1px solid #ccc", padding: "5px 8px", background: "#f4f5f8", width: "35%", fontWeight: 700 }}>{LABELS[k]}</td>
                          <td style={{ border: "1px solid #ccc", padding: "2px 6px" }}>
                            <input value={doc.applicant[k] ?? ""} onChange={(e) => setA(k, e.target.value)} style={{ width: "100%", border: 0, outline: "none", fontSize: 11, background: "transparent", fontFamily: "inherit" }} />
                          </td>
                        </tr>
                      ))}
                      {doc.employer.name && <tr><td style={{ border: "1px solid #ccc", padding: "5px 8px", background: "#f4f5f8", fontWeight: 700 }}>Employer / Position</td><td style={{ border: "1px solid #ccc", padding: "5px 8px" }}>{doc.employer.name} — {doc.employer.jobTitle} {doc.employer.salary && `(${doc.employer.salary})`}</td></tr>}
                    </tbody>
                  </table>
                  <textarea value={doc.body} onChange={(e) => setDoc({ ...doc, body: e.target.value })}
                    style={{ width: "100%", minHeight: 180, border: 0, outline: "none", resize: "vertical", fontSize: 12, lineHeight: 1.6, fontFamily: "inherit", color: "#111", background: "transparent" }} />
                  {doc.checklist.length > 0 && (
                    <>
                      <div style={{ fontWeight: 800, fontSize: 12, marginTop: 10, borderBottom: "1px solid #ccc", paddingBottom: 4 }}>REQUIRED DOCUMENTS CHECKLIST</div>
                      <ol style={{ fontSize: 11, paddingLeft: 18, marginTop: 6, lineHeight: 1.7 }}>{doc.checklist.map((c, i) => <li key={i}>☐ {c}</li>)}</ol>
                    </>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 30 }}>
                    <div style={{ fontSize: 11 }}><div style={{ borderTop: "1px solid #111", width: 160, paddingTop: 4 }}>Authorized Signatory</div>VisaHOBe PTE. LTD.</div>
                    <div style={{ height: 80, width: 80, borderRadius: "50%", border: "3px double #b91c1c", color: "#b91c1c", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transform: "rotate(-12deg)" }}>VISAHOBE<br />VERIFIED</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
