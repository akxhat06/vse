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
  const collectionRate  = totalBills > 0 ? Math.round((totalPayments / totalBills) * 100) : 0;

  return (
    <div className="max-w-5xl space-y-7">

      {/* ── Greeting bar ── */}
      <div className="flex items-center justify-between gap-4">
        {/* Left — name + tagline */}
        <div className="flex items-center gap-3">
          {/* Avatar initial */}
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
            style={{
              background: "linear-gradient(135deg, rgba(129,140,248,0.3), rgba(192,132,252,0.2))",
              border: "1px solid rgba(129,140,248,0.3)",
              color: "#a5b4fc",
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-white">
              Hi, {name}
            </h1>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>
              Welcome back
            </p>
          </div>
        </div>

        {/* Right — collection rate pill */}
        <div
          className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1.5"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{
              background:
                collectionRate >= 80 ? "#34d399"
                : collectionRate >= 50 ? "#fbbf24"
                : "#f87171",
              boxShadow:
                collectionRate >= 80 ? "0 0 6px #34d39960"
                : collectionRate >= 50 ? "0 0 6px #fbbf2460"
                : "0 0 6px #f8717160",
            }}
          />
          <span className="text-xs font-semibold text-white tabular-nums">{collectionRate}%</span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>collected</span>
          <span className="mx-1 text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
          Overview
        </p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Total Bills",
              value: formatInr(totalBills),
              sub: `${store.invoices.length} invoice${store.invoices.length !== 1 ? "s" : ""}`,
              accent: "#818cf8",
              glow: "rgba(129,140,248,0.12)",
              bar: "rgba(129,140,248,0.5)",
              icon: <InvoiceIcon />,
            },
            {
              label: "Commission",
              value: formatInr(totalCommission),
              sub: "Earned so far",
              accent: "#c084fc",
              glow: "rgba(192,132,252,0.1)",
              bar: "rgba(192,132,252,0.5)",
              icon: <CommissionIcon />,
            },
            {
              label: "Payments In",
              value: formatInr(totalPayments),
              sub: `${store.payments.length} entr${store.payments.length !== 1 ? "ies" : "y"}`,
              accent: "#34d399",
              glow: "rgba(52,211,153,0.1)",
              bar: "rgba(52,211,153,0.5)",
              icon: <PaymentsIcon />,
            },
            {
              label: "Outstanding",
              value: formatInr(outstanding),
              sub: "Pending recovery",
              accent: "#fbbf24",
              glow: "rgba(251,191,36,0.1)",
              bar: "rgba(251,191,36,0.5)",
              icon: <OutstandingIcon />,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl p-4"
              style={{
                background: `linear-gradient(145deg, ${s.glow} 0%, rgba(255,255,255,0.04) 100%)`,
                border: `1px solid ${s.accent}28`,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              {/* top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${s.bar}, transparent)` }} />

              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {s.label}
                </p>
                <span className="rounded-lg p-1.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                  {s.icon}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold tabular-nums leading-none" style={{ color: s.accent }}>
                {s.value}
              </p>
              <p className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
          Quick actions
        </p>

        {/* Primary — 2 big cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: "/invoice/invoices/new", label: "New Invoice",    desc: "Create & send a bill", icon: <QAInvoiceIcon size={20} />, accent: "#818cf8", glow: "rgba(129,140,248,0.12)" },
            { href: "/invoice/payments/new", label: "Record Payment", desc: "Log incoming cash",    icon: <QAPayIcon     size={20} />, accent: "#34d399", glow: "rgba(52,211,153,0.1)"   },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="qa-card group relative overflow-hidden rounded-2xl p-4 transition-all"
              style={{
                background: `linear-gradient(145deg, ${l.glow} 0%, rgba(255,255,255,0.03) 100%)`,
                border: `1px solid ${l.accent}25`,
              }}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-200" style={{ background: `radial-gradient(circle at 30% 50%, ${l.accent}15, transparent 70%)` }} />
              <div
                className="mb-3 flex size-10 items-center justify-center rounded-xl"
                style={{ background: `${l.accent}18`, border: `1px solid ${l.accent}30` }}
              >
                {l.icon}
              </div>
              <p className="text-sm font-bold text-white">{l.label}</p>
              <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{l.desc}</p>
              <div className="mt-3 flex items-center gap-1" style={{ color: l.accent }}>
                <span className="text-xs font-semibold">Go</span>
                <ArrowIcon className="size-3" />
              </div>
            </Link>
          ))}
        </div>

        {/* Secondary — 3 compact rows */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {[
            { href: "/invoice/companies/new",    label: "Add Company",  desc: "Register a new company", icon: <QABuildingIcon size={16} />, accent: "#c084fc" },
            { href: "/invoice/retailers/new",    label: "Add Retailer", desc: "Register a retailer",    icon: <QAStoreIcon    size={16} />, accent: "#fb923c" },
            { href: "/invoice/credit-notes/new", label: "Credit Note",  desc: "Log a goods return",     icon: <QACreditIcon   size={16} />, accent: "#38bdf8" },
          ].map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover-row flex items-center gap-3 px-4 py-3 transition-all"
              style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: `${l.accent}15`, border: `1px solid ${l.accent}25` }}
              >
                {l.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{l.label}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{l.desc}</p>
              </div>
              <ArrowIcon className="size-4 shrink-0" style={{ color: "rgba(255,255,255,0.18)" }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Stat icons ── */
function InvoiceIcon() {
  return (
    <svg className="size-3.5" style={{ color: "#818cf8" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4h8a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z" />
      <path d="M9 9h6M9 12h6M9 15h4" />
    </svg>
  );
}
function CommissionIcon() {
  return (
    <svg className="size-3.5" style={{ color: "#c084fc" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function PaymentsIcon() {
  return (
    <svg className="size-3.5" style={{ color: "#34d399" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}
function OutstandingIcon() {
  return (
    <svg className="size-3.5" style={{ color: "#fbbf24" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/* ── Quick action icons ── */
function QAInvoiceIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} style={{ color: "#818cf8" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4h8a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z" />
      <path d="M9 9h6M9 12h6M9 15h4" />
    </svg>
  );
}
function QAPayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} style={{ color: "#34d399" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}
function QABuildingIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} style={{ color: "#c084fc" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22V12h6v10" />
      <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01" />
    </svg>
  );
}
function QAStoreIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} style={{ color: "#fb923c" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1-5h16l1 5" />
      <path d="M3 9a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2" />
      <path d="M5 22V11M19 11v11M9 22v-7h6v7" />
    </svg>
  );
}
function QACreditIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} style={{ color: "#38bdf8" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function ArrowIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
