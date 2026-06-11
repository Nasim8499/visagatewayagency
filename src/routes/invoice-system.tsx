import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Receipt, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/invoice-system")({
  head: () => ({ meta: [{ title: "Invoice System — VisaHOBe" }] }),
  component: InvoiceSystem,
});

type Item = { desc: string; qty: number; price: number };

function InvoiceSystem() {
  const [items, setItems] = useState<Item[]>([
    { desc: "Work Permit Processing", qty: 1, price: 350 },
    { desc: "Medical Examination", qty: 1, price: 80 },
    { desc: "Document Translation", qty: 3, price: 25 },
  ]);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy)] flex items-center gap-2">
            <Receipt className="h-7 w-7" /> Invoice System
          </h1>
          <p className="text-muted-foreground mt-1">Generate invoices with auto totals & GST.</p>
        </header>

        <div className="card-surface p-6 md:p-8">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
            <div>
              <div className="font-display font-extrabold text-2xl text-[var(--navy)]">INVOICE</div>
              <div className="text-[12px] text-muted-foreground font-mono mt-1">#VH-{Date.now().toString().slice(-6)}</div>
            </div>
            <div className="text-right text-[12px] text-muted-foreground">
              <div className="font-bold text-[var(--navy)] text-base">VisaHOBe PTE. LTD.</div>
              <div>123 Shenton Way, Singapore</div>
              <div>UEN: 202312345X</div>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2">Description</th>
                <th className="py-2 w-20 text-center">Qty</th>
                <th className="py-2 w-28 text-right">Price</th>
                <th className="py-2 w-28 text-right">Total</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-3">
                    <input
                      value={it.desc}
                      onChange={(e) => { const n = [...items]; n[i].desc = e.target.value; setItems(n); }}
                      className="w-full bg-transparent outline-none"
                    />
                  </td>
                  <td className="py-3 text-center">
                    <input
                      type="number" value={it.qty}
                      onChange={(e) => { const n = [...items]; n[i].qty = +e.target.value; setItems(n); }}
                      className="w-14 text-center bg-secondary rounded px-1 py-0.5 outline-none"
                    />
                  </td>
                  <td className="py-3 text-right">
                    <input
                      type="number" value={it.price}
                      onChange={(e) => { const n = [...items]; n[i].price = +e.target.value; setItems(n); }}
                      className="w-20 text-right bg-secondary rounded px-1 py-0.5 outline-none"
                    />
                  </td>
                  <td className="py-3 text-right font-bold text-[var(--navy)]">${(it.qty * it.price).toFixed(2)}</td>
                  <td>
                    <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-rose-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={() => setItems([...items, { desc: "New item", qty: 1, price: 0 }])}
            className="mt-3 text-sm text-[var(--navy)] font-bold inline-flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Item
          </button>

          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-bold">${total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">GST (9%)</span><span className="font-bold">${(total * 0.09).toFixed(2)}</span></div>
              <div className="flex justify-between text-lg pt-2 border-t border-border"><span className="font-bold text-[var(--navy)]">Total</span><span className="font-extrabold text-[var(--navy)]">${(total * 1.09).toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
