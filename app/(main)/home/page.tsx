import Link from "next/link";
import { getStore } from "@/app/(main)/invoice/store-actions";
import { createClient } from "@/lib/supabase/server";
import { round2 } from "@/lib/store/invoice-math";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const name =
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    (user?.user_metadata?.username as string | undefined)?.trim() ||
    user?.email?.split("@")[0] ||
    "there";

  const store = await getStore();
  const totalBills      = round2(store.invoices.reduce((s, inv) => s + inv.invoiceAmount, 0));
  const totalCommission = round2(store.invoices.reduce((s, inv) => s + inv.commissionAmount, 0));
  const totalPayments   = round2(store.payments.reduce((s, p) => s + p.amount, 0));
  const outstanding     = Math.max(0, round2(totalBills - totalPayments));

  const stats = [
    { label: "Total Bills",  value: formatInr(totalBills),      sub: `${store.invoices.length} invoices`,  color: "#a5b4fc" },
    { label: "Commission",   value: formatInr(totalCommission), sub: "Across all invoices",                color: "#c4b5fd" },
    { label: "Payments In",  value: formatInr(totalPayments),   sub: `${store.payments.length} entries`,   color: "#6ee7b7" },
    { label: "Outstanding",  value: formatInr(outstanding),     sub: "Bills − payments",                   color: "#fcd34d" },
  ];

  const quickLinks = [
    { href: "/invoice/companies/new",    label: "Add company"    },
    { href: "/invoice/retailers/new",    label: "Add retailer"   },
    { href: "/invoice/invoices/new",     label: "New invoice"    },
    { href: "/invoice/payments/new",     label: "Record payment" },
    { href: "/invoice/credit-notes/new", label: "Credit note"    },
  ];

  const summary = [
    { label: "Companies",    count: store.companies.length,    href: "/invoice/companies"    },
    { label: "Retailers",    count: store.retailers.length,    href: "/invoice/retailers"    },
    { label: "Invoices",     count: store.invoices.length,     href: "/invoice/invoices"     },
    { label: "Payments",     count: store.payments.length,     href: "/invoice/payments"     },
    { label: "Credit notes", count: store.creditNotes.length,  href: "/invoice/credit-notes" },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      {/* Greeting */}
      <div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Welcome back</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Hi, {name}</h1>
      </div>

      {/* Stats */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
          Overview
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>
                {s.label}
              </p>
              <p className="mt-3 text-xl font-bold tabular-nums" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
          Quick actions
        </p>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover-accent rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Data summary */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
          Data summary
        </p>
        <div className="glass rounded-2xl overflow-hidden">
          {summary.map((row, i, arr) => (
            <Link
              key={row.label}
              href={row.href}
              className="hover-row flex items-center justify-between px-5 py-3.5 transition-all"
              style={{
                borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <span className="text-sm font-medium">{row.label}</span>
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}
              >
                {row.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
