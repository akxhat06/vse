"use client";

import Link from "next/link";
import { DeleteEntityButton } from "@/app/(main)/invoice/_components/DeleteEntityButton";
import { deleteRetailer } from "@/app/(main)/invoice/store-actions";

type Props = {
  id: string;
  name: string;
  companyName?: string | null;
  taxIdType: "GST" | "PAN";
  invoiceCount: number;
  totalBilled: number;
};

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function RetailerCard({ id, name, companyName, taxIdType, invoiceCount, totalBilled }: Props) {
  const initial = name.charAt(0).toUpperCase();
  const invoiceLabel = invoiceCount === 1 ? "1 invoice" : `${invoiceCount} invoices`;

  return (
    <article
      className="flex flex-col overflow-hidden rounded-2xl"
      style={{
        background: "#212121",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-xl text-base font-bold"
              style={{ background: "#E8EAF6", color: "#1e3a8a" }}
            >
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-white">{name}</p>
              {companyName ? (
                <p className="mt-0.5 truncate text-sm" style={{ color: "#A0A0A0" }}>
                  {companyName}
                </p>
              ) : null}
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span
                  className="inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
                  style={
                    taxIdType === "GST"
                      ? { background: "#C6F6D5", color: "#22543D" }
                      : { background: "rgba(251,191,36,0.2)", color: "#b45309", border: "1px solid rgba(251,191,36,0.35)" }
                  }
                >
                  {taxIdType}
                </span>
                <span className="text-[10px] leading-none" style={{ color: "#666" }}>
                  ·
                </span>
                <span className="text-xs" style={{ color: "#A0A0A0" }}>
                  {invoiceLabel}
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-lg font-bold tabular-nums text-white sm:text-xl">{inr.format(totalBilled)}</p>
            <p className="mt-0.5 text-xs" style={{ color: "#A0A0A0" }}>
              total billed
            </p>
          </div>
        </div>

        <div className="h-px w-full shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} aria-hidden />

        <div className="flex gap-2">
          <Link
            href={`/invoice/retailers/${id}`}
            className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white transition hover:brightness-110"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <PencilSquareIcon className="size-4 shrink-0 opacity-90" />
            Edit
          </Link>
          <DeleteEntityButton
            id={id}
            onDelete={deleteRetailer}
            confirmMessage="Delete retailer? Remove invoices first."
            variant="card"
          />
        </div>
      </div>
    </article>
  );
}

function PencilSquareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
