import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, Handshake, FileText, Settings, Bell, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/employers", label: "Employers", icon: Users },
  { to: "/agencies", label: "Partner Agencies", icon: Handshake },
  { to: "/documents", label: "Documents", icon: FileText },
] as const;

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="relative h-9 w-9 rounded-xl gradient-brand flex items-center justify-center shadow-[var(--shadow-glow)] group-hover:scale-105 transition-transform">
        <Sparkles className="h-5 w-5 text-brand-foreground" strokeWidth={2.5} />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-display font-bold text-base tracking-tight">VisaHOBe</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-[0.18em]">Pte. Ltd.</div>
        </div>
      )}
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map(({ to, label, icon: Icon, exact }) => {
        const active = exact ? pathname === to : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              active
                ? "text-foreground bg-white/5 shadow-[inset_0_1px_0_0_oklch(1_0_0_/_0.06)]"
                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
            }`}
          >
            {active && (
              <motion.div
                layoutId="nav-active"
                className="absolute inset-y-1.5 left-0 w-1 rounded-r-full gradient-brand"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.4 : 2} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Sidebar() {
  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-[260px] flex-col glass-strong border-r border-white/5">
      <div className="px-5 py-5 border-b border-white/5">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto py-5">
        <div className="px-6 mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">Workspace</div>
        <NavLinks />
      </div>
      <div className="p-3 border-t border-white/5">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-colors"
        >
          <Settings className="h-[18px] w-[18px]" />
          <span>Settings</span>
        </Link>
        <div className="mt-3 glass rounded-xl p-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full gradient-brand flex items-center justify-center font-semibold text-sm">
            AH
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-sm font-medium truncate">Admin</div>
            <div className="text-xs text-muted-foreground truncate">admin@visahobe.sg</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

const pageTitleMap: Record<string, string> = {
  "/": "Dashboard",
  "/employers": "Employers",
  "/agencies": "Partner Agencies",
  "/documents": "Documents",
};

function MobileHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = pageTitleMap[pathname] ?? "VisaHOBe";

  return (
    <header className="md:hidden sticky top-0 z-40 glass-strong border-b border-white/5">
      <div className="flex items-center justify-between px-4 h-14">
        <Logo compact />
        <div className="flex-1 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="font-display font-semibold text-[15px]"
            >
              {title}
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          className="relative h-9 w-9 rounded-xl glass flex items-center justify-center hover:bg-white/5 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--color-warning)] ring-2 ring-[var(--background)]" />
        </button>
      </div>
    </header>
  );
}

function MobileSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="md:hidden fixed left-2 top-1/2 -translate-y-1/2 z-30 glass-strong rounded-2xl p-2 flex flex-col gap-1">
      {navItems.map(({ to, label, icon: Icon, exact }) => {
        const active = exact ? pathname === to : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            aria-label={label}
            className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
              active
                ? "gradient-brand text-brand-foreground shadow-[var(--shadow-glow)]"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 2} />
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen">
      <Sidebar />
      <MobileSidebar />
      <div className="md:ml-[260px] flex flex-col min-h-screen">
        <MobileHeader />
        <main className="flex-1 px-4 md:px-8 py-5 md:py-8 pl-16 md:pl-8">
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
