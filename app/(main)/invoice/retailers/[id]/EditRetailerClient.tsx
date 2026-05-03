"use client";

import {
  ArrowRight,
  FileText,
  Plus,
  Receipt,
  Search,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RetailerForm } from "@/app/(main)/invoice/_components/RetailerForm";
import type { Company, Retailer } from "@/lib/store/types";

const INDIGO = "#818cf8";
const VIOLET = "#a78bfa";
const EMERALD = "#34d399";
const SKY = "#38bdf8";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

type AnyInvoice = {
  id: string;
  invoiceNumber?: string;
  date?: string;
  invoiceAmount: number;
};
type AnyPayment = {
  id: string;
  date?: string;
  amount: number;
};
type AnyCreditNote = {
  id: string;
  date?: string;
  amount: number;
  noteNumber?: string;
};

const TABS = [
  { id: "retailer", label: "Retailer", color: INDIGO },
  { id: "invoices", label: "Invoices", color: VIOLET },
  { id: "credit", label: "Credit", color: SKY },
  { id: "payments", label: "Payments", color: EMERALD },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function EditRetailerClient({
  retailer,
  companies,
  redirectTo,
  invoices,
  payments,
  creditNotes,
}: {
  retailer: Retailer;
  companies: Company[];
  redirectTo: string;
  invoices: AnyInvoice[];
  payments: AnyPayment[];
  creditNotes: AnyCreditNote[];
}) {
  const [active, setActive] = useState<TabId>("retailer");

  const counts: Record<TabId, number> = {
    retailer: 0,
    invoices: invoices.length,
    credit: creditNotes.length,
    payments: payments.length,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-1 pb-6">
      {/* Back */}
      <Link
        href="/invoice/retailers"
        className="inline-flex items-center gap-1 text-[12px] font-semibold transition active:opacity-70"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        <ArrowRight
          className="size-3.5 rotate-180"
          style={{ color: EMERALD }}
        />
        Retailers
      </Link>

      {/* Heading */}
      <header className="flex items-center gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`,
            boxShadow: `0 4px 14px ${INDIGO}40`,
          }}
        >
          {retailer.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-white/40">Update entry</p>
          <h1 className="truncate text-xl font-bold leading-tight text-white">
            {retailer.name}
          </h1>
        </div>
      </header>

      {/* Tab strip */}
      <div
        className="grid grid-cols-4 rounded-xl p-1"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {TABS.map((t) => {
          const isActive = active === t.id;
          const count = counts[t.id];
          const showCount = t.id !== "retailer";
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className="relative flex items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-bold transition active:scale-[0.97]"
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
      {active === "retailer" && (
        <RetailerForm
          companies={companies}
          initial={retailer}
          redirectTo={redirectTo}
        />
      )}

      {active === "invoices" && (
        <RelatedList
          title="Invoices"
          color={VIOLET}
          Icon={FileText}
          searchable
          searchPlaceholder="Search by invoice no…"
          items={invoices.map((i) => ({
            id: i.id,
            label: i.invoiceNumber
              ? `Inv #${i.invoiceNumber}`
              : `Invoice`,
            sub: i.date,
            amount: i.invoiceAmount,
            search: i.invoiceNumber ?? "",
          }))}
          emptyText="No invoices for this retailer."
          openHref={(id) => `/invoice/invoices/${id}`}
          newHref={`/invoice/invoices/new?retailerId=${retailer.id}&returnTo=${encodeURIComponent(`/invoice/retailers/${retailer.id}`)}`}
          newLabel="New invoice"
        />
      )}

      {active === "credit" && (
        <RelatedList
          title="Credit notes"
          color={SKY}
          Icon={Undo2}
          items={creditNotes.map((cn) => ({
            id: cn.id,
            label: cn.noteNumber
              ? `CN #${cn.noteNumber}`
              : "Credit note",
            sub: cn.date,
            amount: cn.amount,
          }))}
          emptyText="No credit notes for this retailer."
          openHref={(id) => `/invoice/credit-notes/${id}`}
          newHref={`/invoice/credit-notes/new?retailerId=${retailer.id}&returnTo=${encodeURIComponent(`/invoice/retailers/${retailer.id}`)}`}
          newLabel="New credit note"
        />
      )}

      {active === "payments" && (
        <RelatedList
          title="Payments"
          color={EMERALD}
          Icon={Receipt}
          items={payments.map((p) => ({
            id: p.id,
            label: "Payment",
            sub: p.date,
            amount: p.amount,
          }))}
          emptyText="No payments recorded."
          openHref={(id) => `/invoice/payments/${id}`}
          newHref={`/invoice/payments/new?retailerId=${retailer.id}&returnTo=${encodeURIComponent(`/invoice/retailers/${retailer.id}`)}`}
          newLabel="Record payment"
        />
      )}
    </div>
  );
}

type ListItem = {
  id: string;
  label: string;
  sub?: string;
  amount: number;
  search?: string;
};

type IconType = React.ComponentType<{
  className?: string;
  style?: React.CSSProperties;
}>;

function RelatedList({
  title,
  color,
  Icon,
  items,
  emptyText,
  openHref,
  newHref,
  newLabel,
  searchable,
  searchPlaceholder,
}: {
  title: string;
  color: string;
  Icon: IconType;
  items: ListItem[];
  emptyText: string;
  openHref: (id: string) => string;
  newHref: string;
  newLabel: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const [query, setQuery] = useState("");
  const filtered = items.filter((x) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      (x.search ?? x.label).toLowerCase().includes(q) ||
      x.label.toLowerCase().includes(q)
    );
  });
  const total = filtered.reduce((s, x) => s + x.amount, 0);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[13px] font-bold text-white">
          <Icon className="size-3.5" style={{ color }} />
          {title}
        </p>
        <Link
          href={newHref}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition active:opacity-70"
          style={{
            color,
            background: `${color}1f`,
            border: `1px solid ${color}33`,
          }}
        >
          <Plus className="size-3" /> {newLabel}
        </Link>
      </div>

      {searchable && items.length > 0 && (
        <div
          className="relative flex items-center gap-2 rounded-xl px-3 py-2"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Search className="size-3.5 shrink-0 text-white/35" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder ?? "Search…"}
            className="min-w-0 flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-white/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white/55 transition hover:bg-white/5"
            >
              clear
            </button>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <div
          className="rounded-xl px-4 py-8 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-[11px] text-white/40">{emptyText}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-xl px-4 py-6 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-[11px] text-white/40">
            No results for &ldquo;
            <span className="text-white/75">{query}</span>&rdquo;
          </p>
        </div>
      ) : (
        <>
          {/* Subtotal pill */}
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
                {String(filtered.length).padStart(2, "0")}
              </span>
              {query && (
                <span className="text-white/35">
                  {" "}
                  / {items.length}
                </span>
              )}{" "}
              {title.toLowerCase()}
            </span>
            <span
              className="text-[12px] font-bold tabular-nums"
              style={{ color }}
            >
              {inr.format(total)}
            </span>
          </div>

          <ul className="space-y-2">
            {filtered.map((item) => (
              <li
                key={item.id}
                className="rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <Link
                  href={openHref(item.id)}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 transition active:opacity-70"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-white">
                      {item.label}
                    </p>
                    {item.sub && (
                      <p className="mt-0.5 text-[10px] text-white/40">
                        {item.sub}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[13px] font-bold tabular-nums"
                      style={{ color }}
                    >
                      {inr.format(item.amount)}
                    </span>
                    <ArrowRight
                      className="size-3.5"
                      style={{ color, opacity: 0.5 }}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

