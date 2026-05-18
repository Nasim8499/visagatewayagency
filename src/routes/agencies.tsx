import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { GlassCard, PageHeader } from "@/components/ui-bits";
import { HeroSlider } from "@/components/HeroSlider";
import { Handshake, Plus, Globe2, Star, TrendingUp, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/agencies")({
  head: () => ({
    meta: [
      { title: "Partner Agencies — VisaHOBe" },
      { name: "description", content: "Recruitment partners, source-country agencies and performance metrics." },
    ],
  }),
  component: AgenciesPage,
});

const agencies = [
  { name: "Dhaka Manpower Services", country: "Bangladesh", flag: "🇧🇩", placed: 184, rating: 4.8, trend: "+12%" },
  { name: "Manila Overseas Partners", country: "Philippines", flag: "🇵🇭", placed: 152, rating: 4.9, trend: "+8%" },
  { name: "Jakarta Talent Bridge", country: "Indonesia", flag: "🇮🇩", placed: 121, rating: 4.6, trend: "+5%" },
  { name: "Yangon Worker Connect", country: "Myanmar", flag: "🇲🇲", placed: 98, rating: 4.5, trend: "+3%" },
  { name: "Colombo Skill Source", country: "Sri Lanka", flag: "🇱🇰", placed: 76, rating: 4.7, trend: "+9%" },
  { name: "Kathmandu Pro Recruiters", country: "Nepal", flag: "🇳🇵", placed: 64, rating: 4.4, trend: "+2%" },
];

function AgenciesPage() {
  return (
    <AppShell>
      <HeroSlider
        slides={[
          { eyebrow: "Partners", title: "Ethical recruitment — across nine source countries.", description: "Manage every overseas agency, performance score and placement pipeline from one prestigious cockpit.", image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1600&q=70" },
          { eyebrow: "Performance", title: "Star-rated partners, transparent placements.", description: "See who delivers — placements YTD, growth trends and quality scores by source country.", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=70" },
        ]}
      />
      <PageHeader
        eyebrow="Network"
        title="Partner Agencies"
        description="Source-country partners powering ethical recruitment pipelines."
        actions={
          <button className="inline-flex items-center gap-2 gradient-brand text-brand-foreground rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[var(--shadow-glow)] hover:brightness-110 transition">
            <Plus className="h-4 w-4" /> Invite Agency
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <GlassCard delay={0}>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Partners</div>
          <div className="mt-2 text-2xl md:text-3xl font-bold font-display">28</div>
        </GlassCard>
        <GlassCard delay={0.05}>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Countries</div>
          <div className="mt-2 text-2xl md:text-3xl font-bold font-display">9</div>
        </GlassCard>
        <GlassCard delay={0.1}>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Placed YTD</div>
          <div className="mt-2 text-2xl md:text-3xl font-bold font-display">1,284</div>
        </GlassCard>
        <GlassCard delay={0.15}>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Avg. Rating</div>
          <div className="mt-2 text-2xl md:text-3xl font-bold font-display flex items-center gap-1">
            4.7 <Star className="h-5 w-5 text-[var(--color-warning)] fill-[var(--color-warning)]" />
          </div>
        </GlassCard>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agencies.map((a, i) => (
          <motion.div
            key={a.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-2xl p-5 hover-lift"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{a.flag}</div>
              <div className="flex items-center gap-1 text-xs glass-strong rounded-full px-2.5 py-1">
                <Star className="h-3 w-3 text-[var(--color-warning)] fill-[var(--color-warning)]" />
                <span className="font-semibold">{a.rating}</span>
              </div>
            </div>
            <h3 className="font-display font-semibold leading-tight">{a.name}</h3>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <Globe2 className="h-3 w-3" /> {a.country}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Placed</div>
                <div className="text-lg font-display font-bold mt-0.5">{a.placed}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Growth</div>
                <div className="text-lg font-display font-bold mt-0.5 text-[var(--color-success)] flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" /> {a.trend}
                </div>
              </div>
            </div>

            <button className="mt-4 w-full glass-strong rounded-xl py-2 text-xs font-semibold hover:bg-white/5 transition flex items-center justify-center gap-2">
              View Partner <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
}
