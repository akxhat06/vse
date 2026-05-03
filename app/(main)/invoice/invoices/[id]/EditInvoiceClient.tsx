"use client";

import {
  ArrowRight,
  ChevronLeft,
  Construction,
  CreditCard,
  FileText,
  Plus,
  Truck,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DeleteEntityButton } from "@/app/(main)/invoice/_components/DeleteEntityButton";
import { InvoiceForm } from "@/app/(main)/invoice/_components/InvoiceForm";
import {
  type ActionResult,
  deleteCreditNote,
  deleteInvoice,
  deletePayment,
} from "@/app/(main)/invoice/store-actions";
import type {
  Company,
  CreditNote,
  Invoice,
  Payment,
  Retailer,
} from "@/lib/store/types";

const VIOLET = "#a78bfa";
const INDIGO = "#818cf8";
const EMERALD = "#34d399";
const SKY = "#38bdf8";
const ROSE = "#fb7185";
const AMBER = "#fbbf24";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

const TABS = [
  { id: "invoice", label: "Invoice", color: VIOLET, Icon: FileText },
  { id: "payments", label: "Payments", color: EMERALD, Icon: CreditCard },
  { id: "credit", label: "Credit", color: SKY, Icon: Undo2 },
  { id: "transport", label: "Transport", color: AMBER, Icon: Truck },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function EditInvoiceClient({
  invoice,
  companies,
  retailers,
  payments,
  creditNotes,
  redirectTo,
  paidTotal,
  creditTotal,
}: {
  invoice: Invoice;
  companies: Company[];
  retailers: Retailer[];
  payments: Payment[];
  creditNotes: CreditNote[];
  redirectTo: string;
  paidTotal: number;
  creditTotal: number;
}) {
  const [active, setActive] = useState<TabId>("invoice");

  const company = companies.find((c) => c.id === invoice.companyId);
  const retailer = retailers.find((r) => r.id === invoice.retailerId);
  const outstanding = Math.max(
    0,
    invoice.invoiceAmount - paidTotal - creditTotal,
  );

  const counts: Record<TabId, number> = {
    invoice: 0,
    payments: payments.length,
    credit: creditNotes.length,
    transport: 0,
  };

  const returnTo = encodeURIComponent(`/invoice/invoices/${invoice.id}`);

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-1 pb-6">
      {/* Back */}
      <Link
        href={redirectTo}
        className="inline-flex items-center gap-1 text-[12px] font-semibold transition active:opacity-70"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        <ChevronLeft className="size-3.5" style={{ color: VIOLET }} />
        {redirectTo === "/invoice/invoices" ? "Invoices" : "Back"}
      </Link>

      {/* Heading */}
      <header className="flex items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${VIOLET}, ${INDIGO})`,
              boxShadow: `0 4px 14px ${VIOLET}40`,
            }}
          >
            <FileText className="size-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-white/40">Update entry</p>
            <h1 className="truncate text-xl font-bold leading-tight text-white">
              {invoice.invoiceNo}
            </h1>
          </div>
        </div>

        <DeleteEntityButton
          id={invoice.id}
          onDelete={deleteInvoice}
          confirmMessage="Delete this invoice? Remove payments and credit notes first."
        />
      </header>

      {/* Snapshot card */}
      <section
        className="overflow-hidden rounded-xl p-3"
        style={{
          background: `linear-gradient(135deg, ${VIOLET}10, ${INDIGO}05)`,
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <p className="truncate text-[11px] text-white/55">
          {company?.name ?? "—"} · {retailer?.name ?? "—"} ·{" "}
          {formatDate(invoice.invoiceDate)}
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <SnapStat
            label="Billed"
            value={inr.format(invoice.invoiceAmount)}
            color={VIOLET}
          />
          <SnapStat
            label="Paid"
            value={paidTotal > 0 ? inr.format(paidTotal) : "—"}
            color={paidTotal > 0 ? EMERALD : "rgba(255,255,255,0.3)"}
          />
          <SnapStat
            label="Due"
            value={inr.format(outstanding)}
            color={outstanding > 0 ? ROSE : EMERALD}
            align="right"
          />
        </div>
      </section>

      {/* Tab strip */}
      <div
        className="grid grid-cols-4 gap-1 rounded-xl p-1"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {TABS.map((t) => {
          const isActive = active === t.id;
          const count = counts[t.id];
          const showCount = t.id !== "invoice" && t.id !== "transport";
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-bold transition active:scale-[0.97]"
              aria-current={isActive ? "page" : undefined}
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${t.color}22, ${t.color}11)`,
                      color: t.color,
                      border: `1px solid ${t.color}33`,
                      boxShadow: `0 4px 12px ${t.color}25`,
                    }
                  : { color: "rgba(255,255,255,0.5)" }
              }
            >
              <t.Icon className="size-3.5" />
              <span>{t.label}</span>
              {showCount && (
                <span className="text-[9px] tabular-nums opacity-70">
                  {String(count).padStart(2, "0")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {active === "invoice" && (
        <InvoiceForm
          companies={companies}
          retailers={retailers}
          initial={invoice}
          redirectTo={redirectTo}
        />
      )}

      {active === "payments" && (
        <PaymentsTab
          invoiceId={invoice.id}
          payments={payments}
          returnTo={returnTo}
        />
      )}

      {active === "credit" && (
        <CreditTab
          invoiceId={invoice.id}
          creditNotes={creditNotes}
          returnTo={returnTo}
        />
      )}

      {active === "transport" && <TransportTab />}
    </div>
  );
}

function SnapStat({
  label,
  value,
  color,
  align = "left",
}: {
  label: string;
  value: string;
  color: string;
  align?: "left" | "right";
}) {
  return (
    <div style={{ textAlign: align }}>
      <p className="text-[9px] uppercase tracking-wide text-white/40">
        {label}
      </p>
      <p
        className="mt-0.5 text-[13px] font-bold tabular-nums"
        style={{ color }}
      >
        {value}
      </p>
    </div>
  );
}

/* ── Payments tab ── */
function PaymentsTab({
  invoiceId,
  payments,
  returnTo,
}: {
  invoiceId: string;
  payments: Payment[];
  returnTo: string;
}) {
  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[13px] font-bold text-white">
          <CreditCard className="size-3.5" style={{ color: EMERALD }} />
          Payments
        </p>
        <Link
          href={`/invoice/payments/new?invoiceId=${invoiceId}&returnTo=${returnTo}`}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition active:opacity-70"
          style={{
            color: EMERALD,
            background: `${EMERALD}1f`,
            border: `1px solid ${EMERALD}33`,
          }}
        >
          <Plus className="size-3" /> Record payment
        </Link>
      </div>

      {payments.length === 0 ? (
        <EmptyTab
          color={EMERALD}
          Icon={CreditCard}
          title="No payments yet"
          desc="Tap “Record payment” to log incoming cash."
        />
      ) : (
        <>
          <SubtotalPill
            color={EMERALD}
            count={payments.length}
            countLabel="payments"
            total={total}
          />
          <ul className="space-y-2">
            {payments.map((p) => (
              <RelatedRow
                key={p.id}
                href={`/invoice/payments/${p.id}?returnTo=${returnTo}`}
                title={p.method}
                sub={formatDate(p.date)}
                amount={p.amount}
                color={EMERALD}
                deleteAction={deletePayment}
                deleteId={p.id}
                deleteMessage="Delete this payment?"
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/* ── Credit notes tab ── */
function CreditTab({
  invoiceId,
  creditNotes,
  returnTo,
}: {
  invoiceId: string;
  creditNotes: CreditNote[];
  returnTo: string;
}) {
  const total = creditNotes.reduce((s, cn) => s + cn.goodsReturnAmount, 0);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[13px] font-bold text-white">
          <Undo2 className="size-3.5" style={{ color: SKY }} />
          Credit notes
        </p>
        <Link
          href={`/invoice/credit-notes/new?invoiceId=${invoiceId}&returnTo=${returnTo}`}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition active:opacity-70"
          style={{
            color: SKY,
            background: `${SKY}1f`,
            border: `1px solid ${SKY}33`,
          }}
        >
          <Plus className="size-3" /> New credit note
        </Link>
      </div>

      {creditNotes.length === 0 ? (
        <EmptyTab
          color={SKY}
          Icon={Undo2}
          title="No credit notes yet"
          desc="Log a goods return for this invoice."
        />
      ) : (
        <>
          <SubtotalPill
            color={SKY}
            count={creditNotes.length}
            countLabel="notes"
            total={total}
          />
          <ul className="space-y-2">
            {creditNotes.map((cn) => (
              <RelatedRow
                key={cn.id}
                href={`/invoice/credit-notes/${cn.id}?returnTo=${returnTo}`}
                title={`Returned · qty ${cn.qtyReturned}`}
                sub={formatDate(cn.date)}
                amount={cn.goodsReturnAmount}
                color={SKY}
                deleteAction={deleteCreditNote}
                deleteId={cn.id}
                deleteMessage="Delete this credit note?"
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/* ── Transport tab (placeholder) ── */
function TransportTab() {
  return (
    <section
      className="rounded-2xl px-5 py-10 text-center"
      style={{
        background: `linear-gradient(180deg, ${AMBER}10, transparent)`,
        border: "1px dashed rgba(255,255,255,0.1)",
      }}
    >
      <div
        className="mx-auto flex size-12 items-center justify-center rounded-2xl"
        style={{ background: `${AMBER}1f` }}
      >
        <Construction className="size-5" style={{ color: AMBER }} />
      </div>
      <p className="mt-3 text-sm font-bold text-white">
        Transportation — coming soon
      </p>
      <p className="mt-1 text-[11px] text-white/45">
        Track transporter, vehicle no., LR no., and freight cost
        per invoice. Wire it up by adding a{" "}
        <code className="rounded bg-white/5 px-1 py-0.5 text-[10px]">
          transports
        </code>{" "}
        table to your store and a{" "}
        <code className="rounded bg-white/5 px-1 py-0.5 text-[10px]">
          saveTransport
        </code>{" "}
        action.
      </p>
    </section>
  );
}

/* ── Shared bits ── */
type IconType = React.ComponentType<{
  className?: string;
  style?: React.CSSProperties;
}>;

function EmptyTab({
  color,
  Icon,
  title,
  desc,
}: {
  color: string;
  Icon: IconType;
  title: string;
  desc: string;
}) {
  return (
    <div
      className="rounded-xl px-4 py-8 text-center"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(255,255,255,0.08)",
      }}
    >
      <Icon className="mx-auto size-5" style={{ color, opacity: 0.6 }} />
      <p className="mt-2 text-[12px] font-semibold text-white/70">
        {title}
      </p>
      <p className="mt-0.5 text-[10px] text-white/40">{desc}</p>
    </div>
  );
}

function SubtotalPill({
  color,
  count,
  countLabel,
  total,
}: {
  color: string;
  count: number;
  countLabel: string;
  total: number;
}) {
  return (
    <div
      className="flex items-center justify-between gap-2 rounded-xl px-3 py-2"
      style={{
        background: `linear-gradient(135deg, ${color}14, ${color}05)`,
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span className="text-[11px] text-white/55">
        <span
          className="font-bold tabular-nums"
          style={{ color }}
        >
          {String(count).padStart(2, "0")}
        </span>{" "}
        {countLabel}
      </span>
      <span
        className="text-[12px] font-bold tabular-nums"
        style={{ color }}
      >
        {inr.format(total)}
      </span>
    </div>
  );
}

function RelatedRow({
  href,
  title,
  sub,
  amount,
  color,
  deleteId,
  deleteAction,
  deleteMessage,
}: {
  href: string;
  title: string;
  sub: string;
  amount: number;
  color: string;
  deleteId: string;
  deleteAction: (id: string) => Promise<ActionResult>;
  deleteMessage: string;
}) {
  return (
    <li
      className="flex items-center gap-2 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <Link
        href={href}
        className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3 py-2.5 transition active:opacity-70"
      >
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-white">
            {title}
          </p>
          <p className="mt-0.5 text-[10px] text-white/40">{sub}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[13px] font-bold tabular-nums"
            style={{ color }}
          >
            {inr.format(amount)}
          </span>
          <ArrowRight
            className="size-3.5"
            style={{ color, opacity: 0.5 }}
          />
        </div>
      </Link>
      <div className="pr-2">
        <DeleteEntityButton
          id={deleteId}
          onDelete={deleteAction}
          confirmMessage={deleteMessage}
          iconOnly
        />
      </div>
    </li>
  );
}
