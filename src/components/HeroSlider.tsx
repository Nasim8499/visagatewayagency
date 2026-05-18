import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export type HeroSlide = {
  eyebrow?: string;
  title: string;
  description: string;
  image: string; // URL
  accent?: string; // tailwind gradient classes
  cta?: { label: string; onClick?: () => void };
};

export function HeroSlider({ slides, autoMs = 5500 }: { slides: HeroSlide[]; autoMs?: number }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % slides.length), autoMs);
    return () => window.clearInterval(id);
  }, [paused, slides.length, autoMs]);

  const go = (d: number) => setI((v) => (v + d + slides.length) % slides.length);
  const s = slides[i];

  return (
    <div
      className="relative overflow-hidden rounded-3xl mb-6 md:mb-8 shadow-[var(--shadow-elevated)] ring-1 ring-border bg-[var(--navy)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[260px] sm:h-[320px] md:h-[380px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${s.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </AnimatePresence>

        {/* Color wash */}
        <div className={`absolute inset-0 ${s.accent ?? "bg-gradient-to-tr from-[oklch(0.18_0.08_258)/0.92] via-[oklch(0.24_0.1_258)/0.65] to-transparent"}`} />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)]/85 via-[var(--navy)]/45 to-transparent" />

        {/* Floating shapes */}
        <motion.div
          aria-hidden
          animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[oklch(0.66_0.22_25)]/30 blur-2xl"
        />
        <motion.div
          aria-hidden
          animate={{ y: [0, 12, 0], x: [0, 8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-1/3 bottom-6 h-28 w-28 rounded-full bg-white/15 blur-2xl"
        />

        {/* Content */}
        <div className="relative h-full flex items-center px-5 md:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={i + "-c"}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="max-w-xl text-white"
            >
              {s.eyebrow && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[10px] tracking-[0.2em] uppercase font-bold mb-3">
                  <Sparkles className="h-3 w-3" /> {s.eyebrow}
                </div>
              )}
              <h2 className="font-display font-extrabold text-2xl md:text-4xl leading-[1.05] tracking-tight">
                {s.title}
              </h2>
              <p className="mt-3 text-sm md:text-base text-white/85 max-w-lg">{s.description}</p>
              {s.cta && (
                <button
                  onClick={s.cta.onClick}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl gradient-red text-white px-5 py-2.5 text-sm font-bold shadow-[var(--shadow-glow)] hover:brightness-110"
                >
                  {s.cta.label}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur flex items-center justify-center transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur flex items-center justify-center transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
