import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { GlassCard, PageHeader, StatCard } from "@/components/ui-bits";
import { SwipeCarousel } from "@/components/SwipeCarousel";
import {
  FileCheck, Users, Clock, TrendingUp, ArrowRight, Sparkles,
  CheckCircle2, AlertCircle, FileText, Plus,
} from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — VisaHOBe" },
      { name: "description", content: "VisaHOBe immigration & document operations dashboard." },
    ],
  }),
  component: Dashboard,
});

const recentApps = [
  { name: "Rahim Uddin", type: "Work Permit", status: "In Review", country: "🇸🇬", id: "VH-2841" },
  { name: "Maria Santos", type: "Employment Pass", status: "Approved", country: "🇸🇬", id: "VH-2840" },
  { name: "Ahmed Khan", type: "S-Pass", status: "Pending", country: "🇸🇬", id: "VH-2839" },
  { name: "Linh Nguyen", type: "Visit Visa", status: "In Review", country: "🇸🇬", id: "VH-2838" },
  { name: "Priya Sharma", type: "Dependant Pass", status: "Approved", country: "🇸🇬", id: "VH-2837" },
];

const activity = [
  { icon: CheckCircle2, text: "IPA generated for Maria Santos", time: "2m ago", tone: "success" as const },
  { icon: FileText, text: "Template 'Employment Contract v3' updated", time: "18m ago", tone: "info" as const },
  { icon: AlertCircle, text: "Document review pending for VH-2839", time: "1h ago", tone: "warning" as const },
  { icon: Users, text: "New employer onboarded: Marina Bay Construction", time: "3h ago", tone: "info" as const },
  { icon: CheckCircle2, text: "5 work permits issued today", time: "5h ago", tone: "success" as const },
];

function statusColor(s: string) {
  if (s === "Approved") return "text-[var(--color-success)] bg-[oklch(0.72_0.16_165/0.12)]";
  if (s === "Pending") return "text-[var(--color-warning)] bg-[oklch(0.78_0.16_78/0.12)]";
  return "text-primary bg-[oklch(0.65_0.13_245/0.12)]";
}

function toneColor(t: "success" | "info" | "warning") {
  if (t === "success") return "text-[var(--color-success)] bg-[oklch(0.72_0.16_165/0.12)]";
  if (t === "warning") return "text-[var(--color-warning)] bg-[oklch(0.78_0.16_78/0.12)]";
  return "text-primary bg-[oklch(0.65_0.13_245/0.12)]";
}

function ApplicationCard({ app }: { app: typeof recentApps[number] }) {
  return (
    <div className="glass rounded-2xl p-4 h-full hover-lift">
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl">{app.country}</div>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${statusColor(app.status)}`}>
          {app.status}
        </span>
      </div>
      <div className="font-semibold text-sm">{app.name}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{app.type}</div>
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground font-mono">{app.id}</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Overview"
        title="Welcome back, Admin"
        description="Your immigration operations at a glance."
        actions={
          <button className="inline-flex items-center gap-2 gradient-brand text-brand-foreground rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[var(--shadow-glow)] hover:brightness-110 transition">
            <Plus className="h-4 w-4" /> New Application
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard label="Active Cases" value="248" delta="↑ 12% this week" icon={FileCheck} delay={0} />
        <StatCard label="Employers" value="64" delta="↑ 4 new" icon={Users} delay={0.05} />
        <StatCard label="Avg. Processing" value="6.2d" delta="↓ 1.1d faster" icon={Clock} delay={0.1} />
        <StatCard label="Success Rate" value="97%" delta="↑ 2.1%" icon={TrendingUp} delay={0.15} />
      </div>

      <section className="mb-7">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg md:text-xl font-display font-semibold">Recent Applications</h2>
          <button className="text-xs text-primary font-medium hover:underline">View all</button>
        </div>
        <SwipeCarousel>
          {recentApps.map((a) => <ApplicationCard key={a.id} app={a} />)}
        </SwipeCarousel>
      </section>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        <GlassCard className="lg:col-span-2" delay={0.1}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Activity Feed</h3>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <div className="md:hidden">
            <SwipeCarousel>
              {activity.map((a, i) => (
                <div key={i} className="glass rounded-xl p-4 h-full">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-3 ${toneColor(a.tone)}`}>
                    <a.icon className="h-4 w-4" />
                  </div>
                  <div className="text-sm">{a.text}</div>
                  <div className="text-xs text-muted-foreground mt-1">{a.time}</div>
                </div>
              ))}
            </SwipeCarousel>
          </div>
          <ul className="hidden md:flex flex-col gap-3">
            {activity.map((a, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition"
              >
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${toneColor(a.tone)}`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{a.text}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.time}</div>
                </div>
              </motion.li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard delay={0.15} className="relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full gradient-brand opacity-20 blur-3xl" />
          <div className="relative">
            <div className="h-10 w-10 rounded-xl gradient-brand flex items-center justify-center mb-4 shadow-[var(--shadow-glow)]">
              <Sparkles className="h-5 w-5 text-brand-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg">AI Document Engine</h3>
            <p className="text-sm text-muted-foreground mt-1.5">
              Upload a master document once. Generate hundreds with one click.
            </p>
            <button className="mt-5 w-full glass-strong rounded-xl py-2.5 text-sm font-semibold hover:bg-white/5 transition flex items-center justify-center gap-2">
              Open Document Hub <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
