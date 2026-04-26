"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS: {
  href: string;
  label: string;
  match: (path: string) => boolean;
}[] = [
  {
    href: "/invoice/companies",
    label: "Companies",
    match: (p) => p.startsWith("/invoice/companies"),
  },
  {
    href: "/invoice/retailers",
    label: "Retailers",
    match: (p) => p.startsWith("/invoice/retailers"),
  },
  {
    href: "/invoice/invoices",
    label: "Invoices",
    match: (p) => p.startsWith("/invoice/invoices"),
  },
  {
    href: "/invoice/payments",
    label: "Payments",
    match: (p) => p.startsWith("/invoice/payments"),
  },
  {
    href: "/invoice/credit-notes",
    label: "Credit notes",
    match: (p) => p.startsWith("/invoice/credit-notes"),
  },
];

export type InvoiceNavCounts = {
  companies: number;
  retailers: number;
  invoices: number;
  payments: number;
  creditNotes: number;
};

export function InvoiceSubNav({ counts }: { counts: InvoiceNavCounts }) {
  const pathname = usePathname();
  const countByHref: Record<string, number> = {
    "/invoice/companies": counts.companies,
    "/invoice/retailers": counts.retailers,
    "/invoice/invoices": counts.invoices,
    "/invoice/payments": counts.payments,
    "/invoice/credit-notes": counts.creditNotes,
  };

  return (
    <nav
      className="sticky z-30 border-b border-white/5 bg-zinc-900/40 py-2 backdrop-blur-md supports-[backdrop-filter]:bg-zinc-900/35"
      style={{
        top: "max(0px, calc(env(safe-area-inset-top) + 3.5rem))",
      }}
      aria-label="Invoice sections"
    >
      <ul className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <li className="shrink-0">
          <Link
            href="/invoice"
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              pathname === "/invoice"
                ? "border-teal-500/45 bg-teal-500/15 text-teal-100"
                : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
            }`}
          >
            Overview
          </Link>
        </li>
        {SECTIONS.map(({ href, label, match }) => {
          const active = match(pathname);
          const n = countByHref[href] ?? 0;
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-teal-500/45 bg-teal-500/15 text-teal-100"
                    : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                }`}
              >
                {label}
                <span
                  className={`rounded-full px-1.5 py-px text-[10px] tabular-nums ${
                    active
                      ? "bg-teal-500/25 text-teal-50"
                      : "bg-white/10 text-zinc-500"
                  }`}
                >
                  {n}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
