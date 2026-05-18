import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/ui-bits";
import { HeroSlider } from "@/components/HeroSlider";
import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import {
  Search, MapPin, Briefcase, Phone, Mail, Calendar, BadgeCheck, ChevronDown,
  Plane, FileCheck, ShieldCheck, X, UserRound, Clock, Building2, Filter,
} from "lucide-react";

export const Route = createFileRoute("/workers")({
  head: () => ({
    meta: [
      { title: "Workers — VisaHOBe" },
      { name: "description", content: "Active workers, visa status and deployment history." },
    ],
  }),
  component: WorkersPage,
});

type Worker = {
  id: string;
  name: string;
  role: string;
  country: string;
  flag: string;
  age: number;
  experience: number;
  status: "Deployed" | "In Process" | "Available" | "Onboarding";
  employer: string;
  location: string;
  visa: string;
  expires: string;
  passport: string;
  phone: string;
  email: string;
  avatar: string;
  skills: string[];
};

const HERO_SLIDES = [
  {
    eyebrow: "Workforce",
    title: "Trusted workers, deployed worldwide.",
    description: "Manage every applicant, contract and visa with one elegant interface engineered for global mobility.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=70",
    cta: { label: "Add Worker" },
  },
  {
    eyebrow: "Compliance",
    title: "Every passport, permit and policy — verified.",
    description: "AI-assisted document checks flag expiring visas, missing fields and policy mismatches before they cost you.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=70",
  },
  {
    eyebrow: "Mobility",
    title: "From source country to landing — orchestrated.",
    description: "Track flights, medicals and arrival pickups in one timeline. No spreadsheets, no surprises.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=70",
  },
];

const WORKERS: Worker[] = [
  { id: "W-001", name: "Mohammed Rahman", role: "Electrician", country: "Bangladesh", flag: "🇧🇩", age: 29, experience: 7, status: "Deployed", employer: "Marina Bay Construction", location: "Singapore", visa: "Work Permit", expires: "2027-04-12", passport: "BD7821934", phone: "+880 1712 884 920", email: "m.rahman@visahobe.app", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=facearea&facepad=2.4&w=400&h=400&q=80", skills: ["High-voltage", "Wiring", "BS7671"] },
  { id: "W-002", name: "Aung Min Thant", role: "Welder", country: "Myanmar", flag: "🇲🇲", age: 32, experience: 9, status: "In Process", employer: "Lion City Marine", location: "Tuas", visa: "S-Pass", expires: "2026-09-30", passport: "MM4421102", phone: "+95 9 7711 2233", email: "aung.thant@visahobe.app", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=facearea&facepad=2.4&w=400&h=400&q=80", skills: ["MIG", "TIG", "Marine grade"] },
  { id: "W-003", name: "Jocelyn Reyes", role: "Hospitality Lead", country: "Philippines", flag: "🇵🇭", age: 27, experience: 5, status: "Deployed", employer: "Orchard Hospitality Group", location: "Orchard", visa: "S-Pass", expires: "2027-01-22", passport: "PH9982341", phone: "+63 917 442 5510", email: "j.reyes@visahobe.app", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2.4&w=400&h=400&q=80", skills: ["F&B", "Concierge", "5-star service"] },
  { id: "W-004", name: "Suresh Kumar", role: "CNC Operator", country: "India", flag: "🇮🇳", age: 34, experience: 11, status: "Deployed", employer: "Jurong Manufacturing Pte", location: "Jurong", visa: "Work Permit", expires: "2026-12-04", passport: "IN1192884", phone: "+91 98765 22184", email: "s.kumar@visahobe.app", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2.4&w=400&h=400&q=80", skills: ["Mazak", "Fanuc", "GD&T"] },
  { id: "W-005", name: "Nguyen Thi Lan", role: "Garment Specialist", country: "Vietnam", flag: "🇻🇳", age: 26, experience: 6, status: "Available", employer: "Open Assignment", location: "Hanoi", visa: "Pending", expires: "—", passport: "VN3318220", phone: "+84 90 220 7711", email: "lan.nguyen@visahobe.app", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2.4&w=400&h=400&q=80", skills: ["Pattern", "Quality control"] },
  { id: "W-006", name: "Dipesh Karki", role: "Scaffolder", country: "Nepal", flag: "🇳🇵", age: 31, experience: 8, status: "Onboarding", employer: "Marina Bay Construction", location: "Kathmandu → SG", visa: "Work Permit", expires: "2028-02-18", passport: "NP2241095", phone: "+977 984 110 5522", email: "d.karki@visahobe.app", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2.4&w=400&h=400&q=80", skills: ["Tower", "Suspended", "WAH cert"] },
  { id: "W-007", name: "Pranav Wijesinghe", role: "Site Supervisor", country: "Sri Lanka", flag: "🇱🇰", age: 38, experience: 14, status: "Deployed", employer: "Changi Logistics Co", location: "Changi", visa: "S-Pass", expires: "2027-06-30", passport: "LK6710992", phone: "+94 77 553 8821", email: "p.wije@visahobe.app", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2.4&w=400&h=400&q=80", skills: ["Logistics", "EHS", "Leadership"] },
  { id: "W-008", name: "Ratna Sari", role: "Pastry Chef", country: "Indonesia", flag: "🇮🇩", age: 30, experience: 9, status: "Deployed", employer: "Sentosa F&B Holdings", location: "Sentosa", visa: "S-Pass", expires: "2026-11-08", passport: "ID8821774", phone: "+62 812 998 4421", email: "r.sari@visahobe.app", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=facearea&facepad=2.4&w=400&h=400&q=80", skills: ["Patisserie", "Plating", "Allergens"] },
];

const STATUS_TONE: Record<Worker["status"], string> = {
  Deployed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "In Process": "bg-amber-50 text-amber-700 border-amber-200",
  Available: "bg-sky-50 text-sky-700 border-sky-200",
  Onboarding: "bg-violet-50 text-violet-700 border-violet-200",
};

function WorkersPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Worker["status"]>("All");
  const [active, setActive] = useState<Worker | null>(null);

  const filtered = useMemo(() => {
    return WORKERS.filter((w) => {
      const m = (w.name + w.role + w.country + w.employer + w.location).toLowerCase().includes(query.toLowerCase());
      const s = statusFilter === "All" || w.status === statusFilter;
      return m && s;
    });
  }, [query, statusFilter]);

  const counts = {
    All: WORKERS.length,
    Deployed: WORKERS.filter((w) => w.status === "Deployed").length,
    "In Process": WORKERS.filter((w) => w.status === "In Process").length,
    Available: WORKERS.filter((w) => w.status === "Available").length,
    Onboarding: WORKERS.filter((w) => w.status === "Onboarding").length,
  } as const;

  return (
    <AppShell>
      <HeroSlider slides={HERO_SLIDES} />

      <PageHeader
        eyebrow="People"
        title="Workers"
        description="Browse every worker in your network. Click a card to see contracts, passports, visas and deployment history."
        actions={
          <div className="flex items-center gap-2 card-surface px-3 py-2 min-w-[260px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, role, employer…"
              className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
            />
          </div>
        }
      />

      <div className="mb-5 flex items-center gap-2 flex-wrap">
        <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground inline-flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5" /> Filter
        </div>
        {(["All", "Deployed", "In Process", "Available", "Onboarding"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition ${
              statusFilter === s
                ? "bg-[var(--navy)] text-white border-[var(--navy)]"
                : "bg-white text-[var(--navy)] border-border hover:bg-secondary"
            }`}
          >
            {s} <span className="opacity-70">· {counts[s]}</span>
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((w, i) => (
          <motion.button
            key={w.id}
            onClick={() => setActive(w)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="card-surface text-left p-4 flex flex-col group hover:shadow-[var(--shadow-elevated)] transition-shadow"
          >
            <div className="relative h-36 w-full rounded-xl overflow-hidden ring-1 ring-border">
              <img src={w.avatar} alt={w.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute top-2 left-2 text-[10px] font-mono bg-white/90 text-[var(--navy)] rounded px-1.5 py-0.5">{w.id}</span>
              <span className={`absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 border ${STATUS_TONE[w.status]}`}>
                {w.status}
              </span>
              <div className="absolute bottom-2 left-2 text-white text-[11px] inline-flex items-center gap-1.5">
                <span className="text-base leading-none">{w.flag}</span> {w.country}
              </div>
            </div>
            <div className="mt-3 flex-1">
              <div className="font-display font-bold text-[var(--navy)] leading-tight">{w.name}</div>
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                <Briefcase className="h-3 w-3" /> {w.role}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {w.skills.slice(0, 3).map((s) => (
                  <span key={s} className="text-[10px] bg-secondary text-[var(--navy)] rounded px-1.5 py-0.5 font-semibold">{s}</span>
                ))}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><BadgeCheck className="h-3 w-3 text-[var(--color-success)]" /> {w.visa}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[var(--navy)]">
                Details <ChevronDown className="h-3 w-3 -rotate-90" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card-surface p-10 text-center text-muted-foreground">No workers match your filters.</div>
      )}

      <WorkerDrawer worker={active} onClose={() => setActive(null)} />
    </AppShell>
  );
}

function WorkerDrawer({ worker, onClose }: { worker: Worker | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {worker && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-background shadow-2xl overflow-y-auto"
          >
            <div className="relative h-48 bg-[var(--navy)]">
              <img src={worker.avatar} alt={worker.name} className="absolute inset-0 h-full w-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-[var(--navy)]/70 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 h-9 w-9 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-5 text-white">
                <div className="text-[10px] uppercase tracking-[0.22em] opacity-80">{worker.id}</div>
                <div className="font-display font-extrabold text-2xl leading-tight">{worker.name}</div>
                <div className="text-sm opacity-90 inline-flex items-center gap-1.5"><span className="text-base">{worker.flag}</span> {worker.role} · {worker.country}</div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 border ${STATUS_TONE[worker.status]}`}>
                  {worker.status}
                </span>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {worker.experience} yrs experience</span>
              </div>

              <Section title="Assignment">
                <Row icon={Building2} label="Employer" value={worker.employer} />
                <Row icon={MapPin} label="Location" value={worker.location} />
                <Row icon={UserRound} label="Age" value={`${worker.age}`} />
              </Section>

              <Section title="Visa & Documents">
                <Row icon={ShieldCheck} label="Visa" value={worker.visa} />
                <Row icon={Calendar} label="Expires" value={worker.expires} />
                <Row icon={FileCheck} label="Passport" value={worker.passport} />
              </Section>

              <Section title="Contact">
                <Row icon={Phone} label="Phone" value={worker.phone} />
                <Row icon={Mail} label="Email" value={worker.email} />
              </Section>

              <Section title="Skills">
                <div className="flex flex-wrap gap-1.5">
                  {worker.skills.map((s) => (
                    <span key={s} className="text-xs bg-secondary text-[var(--navy)] rounded-full px-2.5 py-1 font-semibold">{s}</span>
                  ))}
                </div>
              </Section>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button className="rounded-xl bg-[var(--navy)] text-white py-2.5 text-sm font-bold hover:brightness-110 inline-flex items-center justify-center gap-1.5">
                  <Plane className="h-4 w-4" /> Deployment Log
                </button>
                <button className="rounded-xl bg-white border border-border text-[var(--navy)] py-2.5 text-sm font-bold hover:bg-secondary inline-flex items-center justify-center gap-1.5">
                  <FileCheck className="h-4 w-4" /> Generate PDF
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-2">{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground inline-flex items-center gap-2"><Icon className="h-3.5 w-3.5" /> {label}</span>
      <span className="font-semibold text-[var(--navy)] truncate max-w-[60%] text-right">{value}</span>
    </div>
  );
}
