import Link from "next/link";
import { getStore } from "@/app/(main)/invoice/store-actions";
import { round2 } from "@/lib/store/invoice-math";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

const SECTIONS = [
  { href: "/invoice/companies",    label: "Companies",       desc: "Manage your companies",       icon: "🏢" },
  { href: "/invoice/retailers",    label: "Retailers",       desc: "Manage retailers",             icon: "🏪" },
  { href: "/invoice/invoices",     label: "Bills / Invoice", desc: "Create and track invoices",    icon: "📄" },
  { href: "/invoice/payments",     label: "Payment",         desc: "Record and view payments",     icon: "💳" },
  { href: "/invoice/credit-notes", label: "Credit Note",     desc: "Goods returns & credit notes", icon: "↩️" },
];

export default async function InvoiceHubPage() {
  const store = await getStore();
  const totalBills    = round2(store.invoices.reduce((s, inv) => s + inv.invoiceAmount, 0));
  const totalPayments = round2(store.payments.reduce((s, p) => s + p.amount, 0));
  const outstanding   = Math.max(0, round2(totalBills - totalPayments));

  const counts: Record<string, number> = {
    "/invoice/companies":    store.companies.length,
    "/invoice/retailers":    store.retailers.length,
    "/invoice/invoices":     store.invoices.length,
    "/invoice/payments":     store.payments.length,
    "/invoice/credit-notes": store.creditNotes.length,
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Invoice workspace</h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          Manage all your billing from here
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Billed",  value: formatInr(totalBills),    color: "#a5b4fc" },
          { label: "Payments In",   value: formatInr(totalPayments), color: "#6ee7b7" },
          { label: "Outstanding",   value: formatInr(outstanding),   color: "#fcd34d" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>
              {s.label}
            </p>
            <p className="mt-2 text-lg font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Section cards */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
          Sections
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="hover-accent glass flex items-center gap-4 rounded-2xl px-4 py-4 transition-all"
            >
              <span className="text-2xl">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">{s.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{s.desc}</p>
              </div>
              <span
                className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
              >
                {counts[s.href] ?? 0}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
