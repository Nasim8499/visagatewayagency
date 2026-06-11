import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sparkles, ScanLine, FileText, Globe2, ClipboardList, FileSignature,
  Receipt, CheckSquare, GraduationCap, Settings, Plug, Plane, ChevronDown,
  Bell, Menu, X, Rocket,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, type ReactNode } from "react";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Sparkles;
};

const navItems: NavItem[] = [
  { to: "/", label: "AI Agent", icon: Sparkles },
  { to: "/passport-upload", label: "Passport Upload", icon: ScanLine },
  { to: "/document-generator", label: "Document Generator", icon: FileText },
  { to: "/country-engine", label: "Country Engine", icon: Globe2 },
  { to: "/employee-forms", label: "Employee Forms", icon: ClipboardList },
  { to: "/employee-agreement", label: "Employee Agreement", icon: FileSignature },
  { to: "/invoice-system", label: "Invoice System", icon: Receipt },
  { to: "/checklist", label: "Checklist", icon: CheckSquare },
  { to: "/sample-pdf-training", label: "Sample PDF Training", icon: GraduationCap },
  { to: "/admin-settings", label: "Admin Settings", icon: Settings },
  { to: "/model-connect", label: "Model Connect", icon: Plug },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="relative h-10 w-10 rounded-xl gradient-red flex items-center justify-center shadow-[var(--shadow-glow)] group-hover:scale-105 transition-transform">
        <Plane className="h-5 w-5 text-white -rotate-45" strokeWidth={2.5} />
      </div>
      <div className="leading-tight">
        <div className="font-display font-extrabold text-[15px] tracking-tight text-white">
          VisaHOBe <span className="font-medium opacity-80">AI</span>
        </div>
        <div className="text-[9px] text-white/60 uppercase tracking-[0.18em] font-semibold">
          Visa Agent Platform
        </div>
      </div>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex flex-col h-full sidebar-navy">
      <div className="px-5 pt-6 pb-5">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={label}
              to={to}
              onClick={onNavigate}
              className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all mb-0.5 ${
                isActive
                  ? "bg-white text-[oklch(0.24_0.08_258)] shadow-sm"
                  : "text-white/75 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={isActive ? 2.4 : 2} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
        <div className="rounded-2xl p-4 bg-white/[0.05] border border-white/[0.08]">
          <div className="flex items-start gap-2 mb-2">
            <div className="h-9 w-9 rounded-xl gradient-red flex items-center justify-center shrink-0">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-white leading-tight">Pro Plan</div>
              <div className="text-[11px] text-white/60 leading-snug mt-0.5">
                Unlock unlimited AI requests & all models.
              </div>
            </div>
          </div>
          <button className="w-full mt-2 gradient-red text-white rounded-xl py-2.5 text-[13px] font-semibold hover:brightness-110 transition shadow-[var(--shadow-glow)]">
            Upgrade Now
          </button>
        </div>
      </div>

      <div className="px-3 pb-4">
        <div className="rounded-2xl p-2.5 bg-white/[0.05] border border-white/[0.08] flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center font-bold text-white text-xs ring-2 ring-white/20">
            AH
          </div>
          <div className="leading-tight min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-white truncate">Arif Hossain</div>
            <div className="text-[11px] text-white/55 truncate">Super Admin</div>
          </div>
          <ChevronDown className="h-4 w-4 text-white/50" />
        </div>
      </div>
    </div>
  );
}

function getTitle(path: string) {
  const item = navItems.find((n) => n.to === path);
  return item?.label ?? "VisaHOBe";
}

function MobileHeader({ onMenu }: { onMenu: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = getTitle(pathname);

  return (
    <header className="md:hidden sticky top-0 z-40 bg-[var(--navy)] text-white">
      <div className="flex items-center justify-between px-4 h-14 gap-3">
        <button
          className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center"
          aria-label="Menu"
          onClick={onMenu}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex-1 text-center min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="font-display font-bold text-[15px] truncate"
            >
              {title}
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          className="relative h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full gradient-red text-[10px] font-bold flex items-center justify-center ring-2 ring-[var(--navy)]">
            12
          </span>
        </button>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-[260px] flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col"
            >
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 text-white flex items-center justify-center"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="md:ml-[260px] flex flex-col min-h-screen">
        <MobileHeader onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 md:px-8 py-5 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
