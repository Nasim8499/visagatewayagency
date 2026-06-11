import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Settings, Building2, Shield, Bell } from "lucide-react";

export const Route = createFileRoute("/admin-settings")({
  head: () => ({ meta: [{ title: "Admin Settings — VisaHOBe" }] }),
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy)] flex items-center gap-2">
            <Settings className="h-7 w-7" /> Admin Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your organisation, security, and notifications.</p>
        </header>

        <div className="space-y-4">
          <section className="card-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-[var(--navy)]" />
              <h2 className="font-display font-bold text-lg text-[var(--navy)]">Organisation</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[["Company", "VisaHOBe PTE. LTD."], ["UEN", "202312345X"], ["Email", "hello@visahobe.com"], ["Phone", "+65 6123 4567"]].map(([l, v]) => (
                <div key={l}>
                  <label className="text-[11px] font-bold uppercase text-muted-foreground">{l}</label>
                  <input defaultValue={v} className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
              ))}
            </div>
          </section>

          <section className="card-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-[var(--navy)]" />
              <h2 className="font-display font-bold text-lg text-[var(--navy)]">Security</h2>
            </div>
            {["Two-factor authentication", "Single sign-on (SSO)", "Session timeout (1h)"].map((t) => (
              <label key={t} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <span className="text-sm text-[var(--navy)]">{t}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--navy)]" />
              </label>
            ))}
          </section>

          <section className="card-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-[var(--navy)]" />
              <h2 className="font-display font-bold text-lg text-[var(--navy)]">Notifications</h2>
            </div>
            {["Email when visa is approved", "Slack alert on document upload", "Daily summary report"].map((t) => (
              <label key={t} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <span className="text-sm text-[var(--navy)]">{t}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--navy)]" />
              </label>
            ))}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
