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
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{eyebrow}</div>
        )}
        <h1 className="text-2xl md:text-4xl font-bold font-display tracking-tight">
          <span className="gradient-text">{title}</span>
        </h1>
        {description && (
          <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
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
      className={`glass rounded-2xl p-5 md:p-6 ${hover ? "hover-lift" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({ label, value, delta, icon: Icon, delay = 0 }: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
  delay?: number;
}) {
  return (
    <GlassCard delay={delay} className="!p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="mt-2 text-2xl md:text-3xl font-bold font-display">{value}</div>
          {delta && (
            <div className="mt-1.5 text-xs text-[var(--color-success)] font-medium">{delta}</div>
          )}
        </div>
        <div className="h-10 w-10 rounded-xl gradient-brand flex items-center justify-center shadow-[var(--shadow-glow)]">
          <Icon className="h-5 w-5 text-brand-foreground" />
        </div>
      </div>
    </GlassCard>
  );
}
