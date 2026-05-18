import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { GlassCard, PageHeader } from "@/components/ui-bits";
import { Building2, Search, Plus, MapPin, Users, FileCheck, MoreHorizontal } from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/employers")({
  head: () => ({
    meta: [
      { title: "Employers — VisaHOBe" },
      { name: "description", content: "Manage employers, sponsor licenses and active worker quotas." },
    ],
  }),
  component: EmployersPage,
});

const employers = [
  { name: "Marina Bay Construction", industry: "Construction", workers: 142, quota: 200, location: "Singapore", status: "Active", tier: "Premium" },
  { name: "Lion City Marine", industry: "Marine", workers: 86, quota: 120, location: "Tuas", status: "Active", tier: "Standard" },
  { name: "Orchard Hospitality Group", industry: "Hospitality", workers: 54, quota: 80, location: "Orchard", status: "Active", tier: "Premium" },
  { name: "Jurong Manufacturing Pte", industry: "Manufacturing", workers: 210, quota: 250, location: "Jurong", status: "Review", tier: "Premium" },
  { name: "Sentosa F&B Holdings", industry: "F&B", workers: 32, quota: 60, location: "Sentosa", status: "Active", tier: "Standard" },
  { name: "Changi Logistics Co", industry: "Logistics", workers: 78, quota: 100, location: "Changi", status: "Active", tier: "Standard" },
];

function tierBadge(tier: string) {
  if (tier === "Premium") return "gradient-brand text-brand-foreground";
  return "bg-white/5 text-muted-foreground";
}

function EmployersPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Network"
        title="Employers"
        description="Sponsor companies, quotas, and active worker portfolios."
        actions={
          <>
            <div className="hidden md:flex items-center gap-2 glass rounded-xl px-3 py-2 min-w-[260px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search employers…"
                className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
              />
            </div>
            <button className="inline-flex items-center gap-2 gradient-brand text-brand-foreground rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[var(--shadow-glow)] hover:brightness-110 transition">
              <Plus className="h-4 w-4" /> Add Employer
            </button>
          </>
        }
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {employers.map((e, i) => {
          const pct = Math.round((e.workers / e.quota) * 100);
          return (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-2xl p-5 hover-lift relative group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-11 w-11 rounded-xl glass-strong flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${tierBadge(e.tier)}`}>
                  {e.tier}
                </span>
              </div>
              <h3 className="font-display font-semibold text-base leading-tight">{e.name}</h3>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                <span>{e.industry}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.location}</span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Users className="h-3 w-3" /> Workers</span>
                  <span className="font-mono font-medium">{e.workers}/{e.quota}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full gradient-brand"
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs flex items-center gap-1.5 text-[var(--color-success)]">
                  <FileCheck className="h-3.5 w-3.5" /> {e.status}
                </span>
                <button className="h-7 w-7 rounded-lg hover:bg-white/5 flex items-center justify-center">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}
