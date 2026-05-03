import {
  ArrowRight,
  Building2,
  Clock3,
  CreditCard,
  FileText,
  PiggyBank,
  Plus,
  Receipt,
  Store,
  TrendingUp,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { getStore } from "@/app/(main)/invoice/store-actions";
import { createClient } from "@/lib/supabase/server";
import { round2 } from "@/lib/store/invoice-math";

const INDIGO = "#818cf8";
const VIOLET = "#a78bfa";
const EMERALD = "#34d399";
const ROSE = "#fb7185";
const SKY = "#38bdf8";
const AMBER = "#fbbf24";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatCompact(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name =
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    (user?.user_metadata?.username as string | undefined)?.trim() ||
    user?.email?.split("@")[0] ||
    "there";

  const store = await getStore();
  const totalBills = round2(
    store.invoices.reduce((s, inv) => s + inv.invoiceAmount, 0),
  );
  const totalCommission = round2(
    store.invoices.reduce((s, inv) => s + inv.commissionAmount, 0),
  );
  const totalPayments = round2(
    store.payments.reduce((s, p) => s + p.amount, 0),
  );
  const outstanding = Math.max(0, round2(totalBills - totalPayments));
  const collectionRate =
    totalBills > 0 ? Math.round((totalPayments / totalBills) * 100) : 0;

  const dateLabel = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="mx-auto max-w-md space-y-5 px-1 pb-8">
      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex size-9 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`,
              boxShadow: `0 4px 14px ${INDIGO}40`,
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[11px] text-white/40">Welcome back</p>
            <p className="text-sm font-semibold leading-tight text-white">
              Hi, {name}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/55">
          {dateLabel}
        </span>
      </header>

      {/* 3 stat cards */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard
          label="Billed"
          value={formatCompact(totalBills)}
          color={INDIGO}
          Icon={FileText}
        />
        <StatCard
          label="Paid"
          value={formatCompact(totalPayments)}
          color={EMERALD}
          Icon={PiggyBank}
        />
        <StatCard
          label="Due"
          value={formatCompact(outstanding)}
          color={outstanding > 0 ? ROSE : EMERALD}
          Icon={Clock3}
        />
      </div>

      {/* Collection card */}
      <div
        className="overflow-hidden rounded-2xl p-3.5"
        style={{
          background: `linear-gradient(135deg, ${INDIGO}14, ${VIOLET}0a)`,
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="mb-2 flex items-baseline justify-between">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-white/65">
            <TrendingUp className="size-3" style={{ color: INDIGO }} />
            Collection rate
          </p>
          <p
            className="text-base font-bold tabular-nums"
            style={{ color: INDIGO }}
          >
            {collectionRate}%
          </p>
        </div>
        <div className="relative h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${collectionRate}%`,
              background: `linear-gradient(90deg, ${INDIGO}, ${VIOLET})`,
              boxShadow: `0 0 10px ${INDIGO}80`,
            }}
          />
        </div>
        <p className="mt-2 text-[10px] text-white/45">
          {store.invoices.length} invoice
          {store.invoices.length !== 1 ? "s" : ""} ·{" "}
          {store.payments.length} payment
          {store.payments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Overview list */}
      <section>
        <SectionTitle>Overview</SectionTitle>
        <div className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
          <Row
            Icon={PiggyBank}
            label="Commission earned"
            value={formatInr(totalCommission)}
            color={VIOLET}
          />
          <Row
            Icon={Receipt}
            label="Payments received"
            value={formatInr(totalPayments)}
            color={EMERALD}
            sub={`${store.payments.length} entries`}
          />
          <Row
            Icon={Clock3}
            label="Outstanding"
            value={formatInr(outstanding)}
            color={outstanding > 0 ? ROSE : EMERALD}
            sub="Pending recovery"
            isLast
          />
        </div>
      </section>

      {/* Primary actions */}
      <section>
        <SectionTitle>Quick actions</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <ActionCard
            href="/invoice/invoices/new"
            Icon={Plus}
            label="New invoice"
            desc="Create & send"
            from={INDIGO}
            to={VIOLET}
          />
          <ActionCard
            href="/invoice/payments/new"
            Icon={CreditCard}
            label="Record payment"
            desc="Log incoming"
            from={EMERALD}
            to="#10b981"
          />
        </div>
      </section>

      {/* Secondary actions */}
      <section>
        <SectionTitle>More</SectionTitle>
        <div className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
          <SecondaryRow
            href="/invoice/companies/new"
            Icon={Building2}
            label="Add company"
            color={SKY}
          />
          <SecondaryRow
            href="/invoice/retailers/new"
            Icon={Store}
            label="Add retailer"
            color={AMBER}
          />
          <SecondaryRow
            href="/invoice/credit-notes/new"
            Icon={Undo2}
            label="Credit note"
            color={ROSE}
            isLast
          />
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-white/35">
      {children}
    </p>
  );
}

type IconProp = React.ComponentType<{
  className?: string;
  style?: React.CSSProperties;
}>;

function StatCard({
  label,
  value,
  color,
  Icon,
}: {
  label: string;
  value: string;
  color: string;
  Icon: IconProp;
}) {
  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: `linear-gradient(180deg, ${color}1f, transparent)`,
        border: `1px solid ${color}22`,
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-medium uppercase tracking-wide text-white/45">
          {label}
        </p>
        <Icon className="size-3" style={{ color }} />
      </div>
      <p
        className="mt-1 text-base font-bold tabular-nums leading-tight"
        style={{ color }}
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  Icon,
  label,
  value,
  color,
  sub,
  isLast,
}: {
  Icon: IconProp;
  label: string;
  value: string;
  color: string;
  sub?: string;
  isLast?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-3 py-2.5"
      style={{
        borderBottom: isLast
          ? "none"
          : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${color}1f` }}
        >
          <Icon className="size-3.5" style={{ color }} />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-medium leading-tight text-white">
            {label}
          </p>
          {sub && (
            <p className="mt-0.5 text-[10px] text-white/40">{sub}</p>
          )}
        </div>
      </div>
      <p
        className="shrink-0 text-[13px] font-bold tabular-nums"
        style={{ color }}
      >
        {value}
      </p>
    </div>
  );
}

function ActionCard({
  href,
  Icon,
  label,
  desc,
  from,
  to,
}: {
  href: string;
  Icon: IconProp;
  label: string;
  desc: string;
  from: string;
  to: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl p-3 transition active:scale-[0.97]"
      style={{
        background: `linear-gradient(135deg, ${from}22, ${to}11)`,
        border: `1px solid ${from}30`,
      }}
    >
      <div
        className="mb-2 flex size-8 items-center justify-center rounded-lg"
        style={{
          background: `linear-gradient(135deg, ${from}, ${to})`,
          boxShadow: `0 4px 12px ${from}40`,
        }}
      >
        <Icon className="size-4 text-white" />
      </div>
      <p className="text-[12px] font-bold leading-tight text-white">
        {label}
      </p>
      <p className="mt-0.5 text-[10px] text-white/45">{desc}</p>
      <ArrowRight
        className="absolute right-3 top-3 size-3"
        style={{ color: from }}
      />
    </Link>
  );
}

function SecondaryRow({
  href,
  Icon,
  label,
  color,
  isLast,
}: {
  href: string;
  Icon: IconProp;
  label: string;
  color: string;
  isLast?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 px-3 py-2.5 transition active:opacity-70"
      style={{
        borderBottom: isLast
          ? "none"
          : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex size-7 items-center justify-center rounded-lg"
          style={{ background: `${color}1f` }}
        >
          <Icon className="size-3.5" style={{ color }} />
        </span>
        <p className="text-[12px] font-medium text-white">{label}</p>
      </div>
      <ArrowRight className="size-3.5" style={{ color }} />
    </Link>
  );
}
