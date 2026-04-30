"use client";

import { useState } from "react";
import Link from "next/link";
import { DeleteEntityButton } from "@/app/(main)/invoice/_components/DeleteEntityButton";
import { deleteCompany } from "@/app/(main)/invoice/store-actions";
import type { CompanyWithStats } from "../page";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n);
}

const STATUS = {
  paid:    { label: "Paid",    color: "#34d399", bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.22)"  },
  partial: { label: "Partial", color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.22)"  },
  unpaid:  { label: "Unpaid",  color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.22)" },
};

export function CompaniesClient({ companies }: { companies: CompanyWithStats[] }) {
  const [query, setQuery] = useState("");

  const filtered = companies.filter((c) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.gstNumber.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.city ?? "").toLowerCase().includes(q) ||
      (c.state ?? "").toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 pt-1 pb-24 lg:pb-4">

      {/* ── Toolbar: search + desktop count ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies…"
            className="w-full rounded-xl py-2.5 pr-9 pl-9 text-sm text-white placeholder-white/30 outline-none transition"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(129,140,248,0.45)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(129,140,248,0.1)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="absolute top-1/2 right-3 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} aria-label="Clear">
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>

        {/* Filtered counter — only shown when searching */}
        {query && companies.length > 0 && (
          <span
            className="hidden sm:inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.45)" }}
          >
            {filtered.length} / {companies.length}
          </span>
        )}
      </div>

      {/* ── Empty state ── */}
      {companies.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.1)" }}
        >
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl" style={{ background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.2)" }}>
            <BuildingIcon className="size-7" style={{ color: "#818cf8" }} />
          </div>
          <p className="text-base font-semibold text-white">No companies yet</p>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Add your first company to get started</p>
          <Link
            href="/invoice/companies/new?returnTo=%2Finvoice%2Fcompanies"
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition"
            style={{ background: "rgba(129,140,248,0.2)", border: "1px solid rgba(129,140,248,0.3)" }}
          >
            <PlusIcon className="size-4" /> Add company
          </Link>
        </div>

      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>No companies match &ldquo;{query}&rdquo;</p>
        </div>

      ) : (
        /* ── Card grid ── */
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => {
            return (
              <div
                key={c.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                {/* Top accent line */}
                <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, rgba(129,140,248,0.6), rgba(167,139,250,0.3), transparent)" }} />

                <div className="flex flex-1 flex-col gap-2.5 p-3">

                  {/* ── Header row ── */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Avatar */}
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                      style={{ background: "rgba(129,140,248,0.18)", color: "#a5b4fc", border: "1px solid rgba(129,140,248,0.25)" }}
                    >
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-tight text-white truncate">{c.name}</p>
                      <p className="mt-0.5 text-[10px] font-mono truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {c.gstNumber}
                      </p>
                    </div>
                  </div>

                  {/* ── Inline stats: Invoices count + Total amount ── */}
                  <div className="flex items-end justify-between gap-3 border-t pt-2.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Invoices
                      </p>
                      <p className="text-base font-bold leading-tight tabular-nums" style={{ color: c.invoiceCount > 0 ? "#ffffff" : "rgba(255,255,255,0.3)" }}>
                        {c.invoiceCount}
                      </p>
                    </div>
                    <div className="min-w-0 text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Total amount
                      </p>
                      <p className="truncate text-base font-bold leading-tight tabular-nums" style={{ color: c.invoiceCount > 0 ? "#a5b4fc" : "rgba(255,255,255,0.3)" }}>
                        {c.invoiceCount > 0 ? formatInr(c.totalBilled) : "—"}
                      </p>
                    </div>
                  </div>

                  {/* ── Footer row: location + actions ── */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {(c.city || c.state) ? (
                        <span className="flex items-center gap-1 min-w-0">
                          <PinIcon className="size-3 shrink-0" />
                          <span className="truncate">{[c.city, c.state].filter(Boolean).join(", ")}</span>
                        </span>
                      ) : (
                        <span className="opacity-60">No location</span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        href={`/invoice/companies/${c.id}`}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition"
                        style={{ background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.2)", color: "#a5b4fc" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(129,140,248,0.22)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(129,140,248,0.12)"; }}
                      >
                        <EditIcon className="size-3" /> Edit
                      </Link>
                      <DeleteEntityButton
                        id={c.id}
                        onDelete={deleteCompany}
                        confirmMessage="Delete this company? Retailers and invoices must be removed first."
                        iconOnly
                      />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Mobile FAB: + Add company ── */}
      <Link
        href="/invoice/companies/new?returnTo=%2Finvoice%2Fcompanies"
        className="lg:hidden fixed bottom-24 right-5 z-40 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-2xl transition-all"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.85))",
          border: "1px solid rgba(129,140,248,0.4)",
          boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
        }}
        aria-label="Add company"
      >
        <PlusIcon className="size-4" />
        Add company
      </Link>
    </div>
  );
}

/* ── Icons ── */
function SearchIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>;
}
function XIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}
function PlusIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
function BuildingIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22V12h6v10" /><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01" /></svg>;
}
function EditIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}
function PinIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z" /><circle cx="12" cy="9" r="2.5" /></svg>;
}
