import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Plane } from "lucide-react";
import heroVisa from "@/assets/hero-visa.png";
import heroWorkers from "@/assets/hero-workers.png";
import heroDocs from "@/assets/hero-documents.png";

type Slide = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  cta?: { label: string; href: string };
  accent: string; // tailwind gradient classes
  icon: typeof Sparkles;
};

const defaultSlides: Slide[] = [
  {
    eyebrow: "AI Document Engine",
    title: "Turn one master doc into infinite smart templates",
    body: "Upload PDF/DOCX → AI detects fields, tables, QR & signatures → save as a reusable template.",
    image: heroDocs,
    cta: { label: "Open Document Hub", href: "/documents" },
    accent: "from-[#1e3a8a] via-[#1e40af] to-[#0ea5e9]",
    icon: Sparkles,
  },
  {
    eyebrow: "Workforce Operations",
    title: "Recruit, deploy & track every worker globally",
    body: "Manage employers, quotas and active worker portfolios across borders in one place.",
    image: heroWorkers,
    cta: { label: "View Employers", href: "/employers" },
    accent: "from-[#0f172a] via-[#1e293b] to-[#dc2626]",
    icon: ShieldCheck,
  },
  {
    eyebrow: "Embassy & Visa",
    title: "Generate visa-ready letters in one click",
    body: "Branded letters, IPA forms and worker IDs auto-filled and exported as print-ready A4 PDFs.",
    image: heroVisa,
    cta: { label: "Generate PDF", href: "/documents/new" },
    accent: "from-[#7c2d12] via-[#dc2626] to-[#f59e0b]",
    icon: Plane,
  },
];

export function HeroSlider({ slides = defaultSlides, autoplayMs = 6000 }: { slides?: Slide[]; autoplayMs?: number }) {
  const [i, setI] = useState(0);
  const n = slides.length;
  const go = (d: number) => setI((p) => (p + d + n) % n);

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % n), autoplayMs);
    return () => clearInterval(id);
  }, [n, autoplayMs]);

  const s = slides[i];
  const Icon = s.icon;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-border shadow-[0_10px_40px_-12px_rgba(15,23,42,0.25)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={`relative bg-gradient-to-br ${s.accent}`}
        >
          {/* decorative shapes */}
          <div className="absolute -top-16 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          <div className="relative grid md:grid-cols-2 gap-6 md:gap-8 p-5 sm:p-7 md:p-10 min-h-[260px] md:min-h-[300px]">
            <div className="flex flex-col justify-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 self-start rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
              >
                <Icon className="h-3.5 w-3.5" /> {s.eyebrow}
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl leading-tight mt-3"
              >
                {s.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 }}
                className="mt-3 text-sm md:text-[15px] text-white/85 max-w-md"
              >
                {s.body}
              </motion.p>
              {s.cta && (
                <motion.a
                  href={s.cta.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.34 }}
                  className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-white text-[var(--navy)] px-4 py-2.5 text-sm font-bold shadow hover:scale-[1.02] transition-transform"
                >
                  {s.cta.label} <ChevronRight className="h-4 w-4" />
                </motion.a>
              )}
            </div>

            <div className="relative hidden md:flex items-center justify-center">
              <motion.img
                key={s.image}
                src={s.image}
                alt=""
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.6 }}
                className="max-h-[240px] w-auto object-contain drop-shadow-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* controls */}
      <button
        aria-label="Previous slide"
        onClick={() => go(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 flex items-center justify-center"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        aria-label="Next slide"
        onClick={() => go(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 flex items-center justify-center"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
