import Link from "next/link";
import { getStore } from "@/app/(main)/invoice/store-actions";
import { round2 } from "@/lib/store/invoice-math";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export default async function InvoiceHubPage() {
  const store = await getStore();
  const totalBillAmount = round2(
    store.invoices.reduce((s, inv) => s + inv.invoiceAmount, 0),
  );
  const totalCommission = round2(
    store.invoices.reduce((s, inv) => s + inv.commissionAmount, 0),
  );
  const totalPaymentsReceived = round2(
    store.payments.reduce((s, p) => s + p.amount, 0),
  );

  return (
    <div className="flex flex-col gap-8 pb-8 pt-2 font-sans">
      <header className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Invoice workspace
        </h1>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Data in{" "}
          <span className="rounded-md bg-muted px-1.5 py-px font-mono text-xs text-muted-foreground">
            data/store.json
          </span>
          . Use the navigation strip above for each module — same URLs and
          flows as before.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Totals
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm shadow-black/20 backdrop-blur-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Total bills
            </p>
            <p className="mt-3 text-lg font-semibold tabular-nums text-card-foreground">
              {formatInr(totalBillAmount)}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm shadow-black/20 backdrop-blur-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Commission
            </p>
            <p className="mt-3 text-lg font-semibold tabular-nums text-card-foreground">
              {formatInr(totalCommission)}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm shadow-black/20 backdrop-blur-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Payments in
            </p>
            <p className="mt-3 text-lg font-semibold tabular-nums text-card-foreground">
              {formatInr(totalPaymentsReceived)}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Quick links
        </h2>
        <p className="flex flex-wrap gap-x-3 gap-y-2 text-sm leading-relaxed text-muted-foreground">
          <Link
            href="/invoice/invoices/new?returnTo=%2Finvoice"
            className="font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
          >
            New invoice
          </Link>
          <span className="text-border" aria-hidden>
            ·
          </span>
          <Link
            href="/invoice/payments/new?returnTo=%2Finvoice"
            className="font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
          >
            Payment
          </Link>
          <span className="text-border" aria-hidden>
            ·
          </span>
          <Link
            href="/invoice/companies/new?returnTo=%2Finvoice"
            className="font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
          >
            Company
          </Link>
        </p>
      </section>
    </div>
  );
}
