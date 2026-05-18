import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Handshake, FileText, Settings, Bell, Sparkles,
  Menu, X, Braces,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

type NavItem = {
  to: "/" | "/employers" | "/agencies" | "/documents" | "/documents/variables";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/employers", label: "Employers", icon: Users },
  { to: "/agencies", label: "Partner Agencies", icon: Handshake },
  { to: "/documents", label: "Documents", icon: FileText, exact: true },
  { to: "/documents/variables", label: "Template Variables", icon: Braces },
];

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
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
        <Logo />
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="md:hidden h-9 w-9 rounded-xl glass flex items-center justify-center"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto py-5">
        <div className="px-6 mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">Workspace</div>
        <NavLinks onNavigate={onNavigate} />
      </div>
      <div className="p-3 border-t border-white/5">
        <Link
          to="/"
          onClick={onNavigate}
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
    </div>
  );
}

const pageTitleMap: Record<string, string> = {
  "/": "Dashboard",
  "/employers": "Employers",
  "/agencies": "Partner Agencies",
  "/documents": "Documents",
  "/documents/variables": "Variables",
};

function getTitle(path: string) {
  if (pageTitleMap[path]) return pageTitleMap[path];
  if (path.startsWith("/documents/")) return "Template";
  return "VisaHOBe";
}

function MobileHeader({ onMenu }: { onMenu: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = getTitle(pathname);

  return (
    <header className="md:hidden sticky top-0 z-40 glass-strong border-b border-white/5">
      <div className="flex items-center justify-between px-3 h-14 gap-2">
        <button
          onClick={onMenu}
          className="h-10 w-10 rounded-xl glass flex items-center justify-center hover:bg-white/5 transition shrink-0"
          aria-label="Open menu"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>
        <Logo compact />
        <div className="flex-1 text-center min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="font-display font-semibold text-[15px] truncate"
            >
              {title}
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          className="relative h-10 w-10 rounded-xl glass flex items-center justify-center hover:bg-white/5 transition shrink-0"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--color-warning)] ring-2 ring-[var(--background)]" />
        </button>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-[260px] flex-col glass-strong border-r border-white/5">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-[280px] glass-strong border-r border-white/5"
            >
              <SidebarContent onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="md:ml-[260px] flex flex-col min-h-screen">
        <MobileHeader onMenu={() => setOpen(true)} />
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
