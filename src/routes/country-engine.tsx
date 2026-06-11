import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Globe2 } from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/country-engine")({
  head: () => ({ meta: [{ title: "Country Engine — VisaHOBe" }] }),
  component: CountryEngine,
});

const countries = [
  { name: "Singapore", flag: "🇸🇬", visas: 12, processing: "5-7 days" },
  { name: "Malaysia", flag: "🇲🇾", visas: 8, processing: "10-14 days" },
  { name: "UAE", flag: "🇦🇪", visas: 14, processing: "3-5 days" },
  { name: "Saudi Arabia", flag: "🇸🇦", visas: 9, processing: "14-21 days" },
  { name: "Qatar", flag: "🇶🇦", visas: 7, processing: "7-10 days" },
  { name: "Japan", flag: "🇯🇵", visas: 11, processing: "10-15 days" },
  { name: "South Korea", flag: "🇰🇷", visas: 6, processing: "7-12 days" },
  { name: "Australia", flag: "🇦🇺", visas: 13, processing: "21-30 days" },
];

function CountryEngine() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
            <Globe2 className="h-3 w-3" /> Live Rules Engine
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy)] mt-3">Country Engine</h1>
          <p className="text-muted-foreground mt-1">Visa rules, document checklists, and processing times by country.</p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {countries.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4 }}
              className="card-surface p-5 cursor-pointer"
            >
              <div className="text-4xl mb-2">{c.flag}</div>
              <h3 className="font-display font-bold text-[var(--navy)]">{c.name}</h3>
              <div className="mt-3 space-y-1 text-[12px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Visa types</span><span className="font-bold text-[var(--navy)]">{c.visas}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Processing</span><span className="font-bold text-[var(--navy)]">{c.processing}</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
