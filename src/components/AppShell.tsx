import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FileText, FilePlus2, Files, Library, FolderTree,
  Database, PenTool, QrCode, Settings, UsersRound, ClipboardList, Trash2,
  Bell, Plane, Rocket, ChevronDown, Home, User, Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { type ReactNode } from "react";

type NavItem = {
  to: "/" | "/employers" | "/agencies" | "/documents" | "/documents/variables";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/documents", label: "Templates", icon: FileText, exact: true },
  { to: "/documents", label: "Create Document", icon: FilePlus2 },
  { to: "/documents", label: "Documents", icon: Files },
  { to: "/documents", label: "Template Library", icon: Library },
  { to: "/employers", label: "Categories", icon: FolderTree },
  { to: "/documents/variables", label: "Data Fields", icon: Database },
  { to: "/agencies", label: "Page Designer", icon: PenTool },
  { to: "/documents/variables", label: "QR / Barcode", icon: QrCode },
  { to: "/employers", label: "Settings", icon: Settings },
  { to: "/agencies", label: "Team Access", icon: UsersRound },
  { to: "/documents", label: "Activity Log", icon: ClipboardList },
  { to: "/documents", label: "Trash", icon: Trash2 },
];

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

function SidebarContent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex flex-col h-full sidebar-navy">
      <div className="px-5 pt-6 pb-5">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        {navItems.map(({ to, label, icon: Icon, exact }, i) => {
          const active = exact ? pathname === to : pathname === to;
          // Mark "Templates" as active when on /documents
          const isTemplates = label === "Templates" && pathname.startsWith("/documents") && !pathname.includes("variables");
          const isActive = active || isTemplates;
          return (
            <Link
              key={`${label}-${i}`}
              to={to}
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

      {/* Upgrade card */}
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

      {/* Profile card */}
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
  "/employers": "Employers",
  "/agencies": "Partner Agencies",
  "/documents": "Templates",
  "/documents/variables": "Data Fields",
};

function getTitle(path: string) {
  if (pageTitleMap[path]) return pageTitleMap[path];
  if (path.startsWith("/documents/")) return "Template";
  return "VisaHOBe";
}

function MobileHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = getTitle(pathname);

  return (
    <header className="md:hidden sticky top-0 z-40 bg-[var(--navy)] text-white">
      <div className="flex items-center justify-between px-4 h-14 gap-3">
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
              className="font-display font-bold text-[15px] truncate"
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

function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tabs: { to: "/" | "/documents" | "/employers"; label: string; icon: typeof Home; match: (p: string) => boolean }[] = [
    { to: "/", label: "Home", icon: Home, match: (p) => p === "/" },
    { to: "/documents", label: "Templates", icon: FileText, match: (p) => p.startsWith("/documents") && !p.includes("variables") },
  ];
  const right: { to: "/documents/variables" | "/employers"; label: string; icon: typeof Home; match: (p: string) => boolean }[] = [
    { to: "/documents/variables", label: "Documents", icon: Files, match: (p) => p.includes("variables") },
    { to: "/employers", label: "Profile", icon: User, match: (p) => p === "/employers" || p === "/agencies" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border h-[68px] flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
      {tabs.map((t) => {
        const active = t.match(pathname);
        return (
          <Link key={t.label} to={t.to} className="flex flex-col items-center justify-center gap-1 px-3 py-1.5 min-w-[56px]">
            <t.icon className={`h-[22px] w-[22px] ${active ? "text-[var(--navy)]" : "text-muted-foreground"}`} strokeWidth={active ? 2.4 : 2} />
            <span className={`text-[10px] font-semibold ${active ? "text-[var(--navy)]" : "text-muted-foreground"}`}>{t.label}</span>
          </Link>
        );
      })}
      <Link
        to="/documents"
        className="-mt-8 h-14 w-14 rounded-full gradient-red flex items-center justify-center shadow-[var(--shadow-glow)] ring-4 ring-white"
        aria-label="Create"
      >
        <Plus className="h-6 w-6 text-white" strokeWidth={2.6} />
      </Link>
      {right.map((t) => {
        const active = t.match(pathname);
        return (
          <Link key={t.label} to={t.to} className="flex flex-col items-center justify-center gap-1 px-3 py-1.5 min-w-[56px]">
            <t.icon className={`h-[22px] w-[22px] ${active ? "text-[var(--navy)]" : "text-muted-foreground"}`} strokeWidth={active ? 2.4 : 2} />
            <span className={`text-[10px] font-semibold ${active ? "text-[var(--navy)]" : "text-muted-foreground"}`}>{t.label}</span>
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
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-[260px] flex-col">
        <SidebarContent />
      </aside>

      <div className="md:ml-[260px] flex flex-col min-h-screen">
        <MobileHeader />
        <main className="flex-1 px-4 md:px-8 py-5 md:py-8 pb-[96px] md:pb-8">
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
        <MobileBottomNav />
      </div>
    </div>
  );
}
