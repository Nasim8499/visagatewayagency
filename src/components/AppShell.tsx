import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FileText, FilePlus2, Library,
  FolderTree, Database, UsersRound,
  Bell, Plane, Rocket, ChevronDown, Menu, X, HardHat,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

type NavTo = "/" | "/employers" | "/agencies" | "/workers" | "/documents" | "/documents/new" | "/documents/variables" | "/documents/saved";
type NavItem = {
  to: NavTo;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

// Each item navigates to a unique route. No duplicates.
const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/workers", label: "Workers", icon: HardHat },
  { to: "/employers", label: "Employers", icon: FolderTree },
  { to: "/agencies", label: "Agencies", icon: UsersRound },
  { to: "/documents", label: "Templates", icon: FileText, exact: true },
  { to: "/documents/new", label: "Create Document", icon: FilePlus2 },
  { to: "/documents/saved", label: "Saved Library", icon: Library },
  { to: "/documents/variables", label: "Data Fields", icon: Database },
];

// Unused icon imports kept to satisfy tree-shaking-free dead refs (no-op).
void Files; void PenTool; void QrCode; void Settings; void ClipboardList; void Trash2;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="relative h-10 w-10 rounded-xl gradient-red flex items-center justify-center shadow-[var(--shadow-glow)] group-hover:scale-105 transition-transform">
        <Plane className="h-5 w-5 text-white -rotate-45" strokeWidth={2.5} />
      </div>
      <div className="leading-tight">
        <div className="font-display font-extrabold text-[15px] tracking-tight text-white">
          VisaHOBe <span className="font-medium opacity-80">PTE. LTD.</span>
        </div>
        <div className="text-[9px] text-white/60 uppercase tracking-[0.18em] font-semibold">
          Global Manpower & Visa Partner
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
        {navItems.map(({ to, label, icon: Icon, exact }, i) => {
          const active = exact ? pathname === to : pathname === to;
          const isTemplates = label === "Templates" && pathname.startsWith("/documents") && !pathname.includes("variables") && !pathname.includes("saved");
          const isSaved = label === "Saved Library" && pathname === "/documents/saved";
          const isActive = active || isTemplates || isSaved;
          return (
            <Link
              key={`${label}-${i}`}
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
              <div className="text-[13px] font-bold text-white leading-tight">Upgrade Plan</div>
              <div className="text-[11px] text-white/60 leading-snug mt-0.5">
                Unlock prestigious features and automate your document workflow.
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

const pageTitleMap: Record<string, string> = {
  "/": "Dashboard",
  "/workers": "Workers",
  "/employers": "Employers",
  "/agencies": "Partner Agencies",
  "/documents": "Templates",
  "/documents/variables": "Data Fields",
  "/documents/saved": "Saved Library",
  "/documents/new": "Smart Template",
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
    <header className="md:hidden sticky top-0 z-40 bg-[var(--navy)] text-white">
      <div className="flex items-center justify-between px-3 h-14 gap-2">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 active:scale-95 transition shrink-0"
        >
          <Menu className="h-[20px] w-[20px]" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-red flex items-center justify-center">
            <Plane className="h-4 w-4 text-white -rotate-45" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-[12px] font-extrabold tracking-tight">VisaHOBe</div>
            <div className="text-[8px] text-white/60 uppercase tracking-[0.18em]">Visa Partner</div>
          </div>
        </Link>
        <div className="flex-1 text-center min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="font-display font-bold text-[14px] truncate"
            >
              {title}
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          className="relative h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition shrink-0"
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

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
            className="md:hidden fixed inset-0 z-50 bg-black/55 backdrop-blur-[3px]"
          />
          <motion.aside
            initial={{ x: "-100%", opacity: 0.4 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0.4 }}
            transition={{ type: "spring", damping: 32, stiffness: 320, mass: 0.9 }}
            className="md:hidden fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] shadow-2xl"
          >
            <motion.button
              onClick={onClose}
              aria-label="Close menu"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.25 }}
              className="absolute top-4 right-3 z-10 h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </motion.button>
            <SidebarContent onNavigate={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

const DRAWER_KEY = "vh.drawer.open";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Lazy initializer reads sessionStorage so the drawer's last state is remembered per session.
  const [menuOpen, setMenuOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try { return window.sessionStorage.getItem(DRAWER_KEY) === "1"; } catch { return false; }
  });

  // Persist drawer state per session
  useEffect(() => {
    try { window.sessionStorage.setItem(DRAWER_KEY, menuOpen ? "1" : "0"); } catch { /* noop */ }
  }, [menuOpen]);

  // Auto-close drawer after route change (don't close on every render — only when path changes)
  useEffect(() => {
    setMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-[260px] flex-col">
        <SidebarContent />
      </aside>

      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="md:ml-[260px] flex flex-col min-h-screen">
        <MobileHeader onMenu={() => setMenuOpen((v) => !v)} />
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
