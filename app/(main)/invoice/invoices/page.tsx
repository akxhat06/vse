import Link from "next/link";
import { AddInvoiceDialog } from "@/app/(main)/invoice/_components/AddInvoiceDialog";
import { DeleteEntityButton } from "@/app/(main)/invoice/_components/DeleteEntityButton";
import { deleteInvoice, getStore } from "@/app/(main)/invoice/store-actions";
import { round2 } from "@/lib/store/invoice-math";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STATUS = {
  paid: {
    label: "Paid",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.22)",
  },
  partial: {
    label: "Partial",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.22)",
  },
  unpaid: {
    label: "Unpaid",
    color: "#f87171",
    bg: "rgba(248,113,113,0.12)",
    border: "rgba(248,113,113,0.22)",
  },
} as const;

export default async function InvoicesListPage() {
  const store = await getStore();
  const companyById = new Map(store.companies.map((c) => [c.id, c]));
  const retailerById = new Map(store.retailers.map((r) => [r.id, r]));
  const paidByInvoiceId = new Map<string, number>();
  const creditByInvoiceId = new Map<string, number>();

  for (const payment of store.payments) {
    paidByInvoiceId.set(
      payment.invoiceId,
      round2((paidByInvoiceId.get(payment.invoiceId) ?? 0) + payment.amount),
    );
  }
  for (const creditNote of store.creditNotes) {
    creditByInvoiceId.set(
      creditNote.invoiceId,
      round2(
        (creditByInvoiceId.get(creditNote.invoiceId) ?? 0) +
          creditNote.goodsReturnAmount,
      ),
    );
  }

  return (
    <div className="pb-24 pt-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/invoice"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span aria-hidden>←</span>
            <span>Invoice</span>
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Invoices
          </h1>
        </div>
        <AddInvoiceDialog
          companies={store.companies}
          retailers={store.retailers}
          redirectTo="/invoice/invoices"
        />
      </div>

      {store.invoices.length > 0 && (
        <div className="mt-4 flex items-center gap-3">
          <span
            className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            {store.invoices.length}{" "}
            {store.invoices.length === 1 ? "invoice" : "invoices"}
          </span>
        </div>
      )}

      {store.invoices.length === 0 ? (
        <div
          className="mt-6 rounded-2xl p-12 text-center"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px dashed rgba(255,255,255,0.1)",
          }}
        >
          <div
            className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl"
            style={{
              background: "rgba(129,140,248,0.1)",
              border: "1px solid rgba(129,140,248,0.2)",
            }}
          >
            <InvoiceIcon className="size-7" style={{ color: "#818cf8" }} />
          </div>
          <p className="text-base font-semibold text-white">No invoices yet</p>
          <p
            className="mt-1 text-sm"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Add your first invoice using the button above.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {store.invoices.map((inv) => {
            const co = companyById.get(inv.companyId);
            const ret = retailerById.get(inv.retailerId);
            const creditAmount = creditByInvoiceId.get(inv.id) ?? 0;
            const paidAmount = paidByInvoiceId.get(inv.id) ?? 0;
            const outstandingAmount = Math.max(
              0,
              round2(inv.invoiceAmount - creditAmount - paidAmount),
            );
            const statusKey =
              outstandingAmount === 0
                ? "paid"
                : paidAmount > 0
                  ? "partial"
                  : "unpaid";
            const st = STATUS[statusKey];

            return (
              <article
                key={inv.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                <div
                  className="h-0.5 w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(129,140,248,0.6), rgba(167,139,250,0.3), transparent)",
                  }}
                />

                <div className="flex flex-1 flex-col gap-2.5 p-3.5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: "rgba(129,140,248,0.18)",
                          color: "#a5b4fc",
                          border: "1px solid rgba(129,140,248,0.25)",
                        }}
                      >
                        <InvoiceIcon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm leading-tight font-bold text-white">
                          {inv.invoiceNo}
                        </p>
                        <p
                          className="mt-0.5 truncate text-[11px]"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {co?.name ?? "Company"} ·{" "}
                          {ret?.name ?? "Retailer"} ·{" "}
                          {formatDate(inv.invoiceDate)}
                        </p>
                      </div>
                    </div>

                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase"
                      style={{
                        background: st.bg,
                        color: st.color,
                        border: `1px solid ${st.border}`,
                      }}
                    >
                      {st.label}
                    </span>
                  </div>

                  {/* Stats grid: Invoice / Credit / Payment / Balance */}
                  <div className="grid grid-cols-4 gap-1.5">
                    <StatCell
                      label="Invoice"
                      value={formatInr(inv.invoiceAmount)}
                      tone="neutral"
                    />
                    <StatCell
                      label="Credit"
                      value={formatInr(creditAmount)}
                      tone="amber"
                      muted={creditAmount === 0}
                    />
                    <StatCell
                      label="Payment"
                      value={formatInr(paidAmount)}
                      tone="emerald"
                      muted={paidAmount === 0}
                    />
                    <StatCell
                      label="Balance"
                      value={formatInr(outstandingAmount)}
                      tone="sky"
                      emphasised
                      muted={outstandingAmount === 0}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/invoice/payments/new?invoiceId=${encodeURIComponent(inv.id)}&returnTo=${encodeURIComponent("/invoice/invoices")}`}
                      className="flex flex-1 items-center justify-center rounded-lg px-2 py-1.5 text-[11px] font-semibold transition"
                      style={{
                        background: "rgba(52,211,153,0.1)",
                        border: "1px solid rgba(52,211,153,0.2)",
                        color: "#6ee7b7",
                      }}
                    >
                      Pay
                    </Link>
                    <Link
                      href={`/invoice/credit-notes/new?invoiceId=${encodeURIComponent(inv.id)}&returnTo=${encodeURIComponent("/invoice/invoices")}`}
                      className="flex flex-1 items-center justify-center rounded-lg px-2 py-1.5 text-[11px] font-semibold transition"
                      style={{
                        background: "rgba(251,191,36,0.1)",
                        border: "1px solid rgba(251,191,36,0.22)",
                        color: "#fcd34d",
                      }}
                    >
                      Return
                    </Link>
                    <Link
                      href={`/invoice/invoices/${inv.id}`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition"
                      style={{
                        background: "rgba(129,140,248,0.12)",
                        border: "1px solid rgba(129,140,248,0.2)",
                        color: "#a5b4fc",
                      }}
                    >
                      <EditIcon className="size-3" /> Edit
                    </Link>
                    <DeleteEntityButton
                      id={inv.id}
                      onDelete={deleteInvoice}
                      confirmMessage="Delete this invoice? Remove payments and credit notes first."
                      iconOnly
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InvoiceIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 4h8a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z" />
      <path d="M9 9h6M9 12h6M9 15h4" />
    </svg>
  );
}

type StatTone = "neutral" | "amber" | "emerald" | "sky";

const TONE: Record<
  StatTone,
  { bg: string; border: string; label: string; value: string }
> = {
  neutral: {
    bg: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.08)",
    label: "rgba(255,255,255,0.45)",
    value: "#f4f4f5",
  },
  amber: {
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
    label: "rgba(252,211,77,0.7)",
    value: "#fcd34d",
  },
  emerald: {
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    label: "rgba(110,231,183,0.7)",
    value: "#6ee7b7",
  },
  sky: {
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.22)",
    label: "rgba(125,211,252,0.7)",
    value: "#7dd3fc",
  },
};

function StatCell({
  label,
  value,
  tone,
  emphasised,
  muted,
}: {
  label: string;
  value: string;
  tone: StatTone;
  emphasised?: boolean;
  muted?: boolean;
}) {
  const t = TONE[tone];
  return (
    <div
      className="flex flex-col gap-0.5 rounded-lg px-2 py-1.5"
      style={{
        background: t.bg,
        border: `1px solid ${emphasised ? t.border : "rgba(255,255,255,0.08)"}`,
      }}
    >
      <p
        className="truncate text-[9px] font-semibold tracking-wide uppercase"
        style={{ color: t.label }}
      >
        {label}
      </p>
      <p
        className="truncate text-[11px] font-bold tabular-nums"
        style={{ color: muted ? "rgba(255,255,255,0.35)" : t.value }}
      >
        {value}
      </p>
    </div>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
