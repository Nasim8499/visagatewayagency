import { motion } from "motion/react";
import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, actions }: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-2">{eyebrow}</div>
        )}
        <h1 className="text-2xl md:text-[28px] font-extrabold font-display tracking-tight text-[var(--navy)]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
    </div>
  );
}

export function GlassCard({
  children,
  className = "",
  delay = 0,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`card-surface p-5 md:p-6 ${hover ? "hover-lift" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({ label, value, delta, icon: Icon, tone = "navy", delay = 0 }: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "navy" | "red" | "violet" | "sky";
  delay?: number;
}) {
  const toneMap = {
    navy: "bg-[oklch(0.95_0.02_258)] text-[var(--navy)]",
    red: "bg-[oklch(0.96_0.04_25)] text-[oklch(0.55_0.22_25)]",
    violet: "bg-[oklch(0.95_0.04_295)] text-[oklch(0.5_0.2_295)]",
    sky: "bg-[oklch(0.95_0.04_220)] text-[oklch(0.5_0.18_220)]",
  } as const;
  return (
    <GlassCard delay={delay} className="!p-4 md:!p-5">
      <div className="flex items-start gap-3">
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[12px] text-muted-foreground font-medium">{label}</div>
          <div className="mt-0.5 text-[22px] md:text-[26px] font-extrabold font-display text-[var(--navy)] leading-none">{value}</div>
          {delta && (
            <div className="mt-1.5 text-[11px] text-[var(--color-success)] font-semibold">{delta}</div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
