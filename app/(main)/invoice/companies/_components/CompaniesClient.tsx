"use client";

import { useState } from "react";
import Link from "next/link";
import type { Company } from "@/lib/store/types";
import { DeleteEntityButton } from "@/app/(main)/invoice/_components/DeleteEntityButton";
import { deleteCompany } from "@/app/(main)/invoice/store-actions";

const glass = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
} as React.CSSProperties;

export function CompaniesClient({ companies }: { companies: Company[] }) {
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
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies…"
          className="w-full rounded-xl py-2.5 pr-9 pl-9 text-sm text-white placeholder-white/30 outline-none transition"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(129,140,248,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(129,140,248,0.1)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} className="absolute top-1/2 right-3 -translate-y-1/2 transition" style={{ color: "rgba(255,255,255,0.3)" }} aria-label="Clear">
            <XIcon className="size-3.5" />
          </button>
        )}
      </div>

      {query && (
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          {filtered.length === 0 ? "No results" : `${filtered.length} of ${companies.length} companies`}
        </p>
      )}

      {/* Empty */}
      {companies.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ ...glass, borderStyle: "dashed" }}>
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
            <BuildingIcon className="size-6" style={{ color: "rgba(255,255,255,0.3)" }} />
          </div>
          <p className="font-medium text-white/70">No companies yet</p>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Add your first company to get started</p>
          <Link
            href="/invoice/companies/new?returnTo=%2Finvoice%2Fcompanies"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white transition"
            style={{ background: "rgba(129,140,248,0.2)", border: "1px solid rgba(129,140,248,0.3)" }}
          >
            <PlusIcon className="size-4" /> New company
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={glass}>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>No companies match &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={glass}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>Company</th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>GST</th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>Phone</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>Location</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                  className="group transition-colors"
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{ background: "rgba(129,140,248,0.2)", color: "#a5b4fc", border: "1px solid rgba(129,140,248,0.25)" }}
                      >
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate">{c.name}</p>
                        {c.email && <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{c.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-4 py-3.5">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)" }}>
                      {c.gstNumber}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                    +91 {c.phone}
                  </td>
                  <td className="hidden lg:table-cell px-4 py-3.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {[c.city, c.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/invoice/companies/${c.id}`}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium transition"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
                      >
                        Edit
                      </Link>
                      <DeleteEntityButton id={c.id} onDelete={deleteCompany} confirmMessage="Delete this company? Retailers and invoices must be removed first." iconOnly />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

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
