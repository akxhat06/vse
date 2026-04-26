import Link from "next/link";
import { getStore } from "@/app/(main)/invoice/store-actions";
import { createClient } from "@/lib/supabase/server";
import { round2 } from "@/lib/store/invoice-math";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name =
    (user?.user_metadata?.username as string | undefined)?.trim() ||
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    user?.email?.split("@")[0] ||
    "there";

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
    <div className="flex flex-col gap-10 pb-2 pt-1 font-sans">
      <header className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Welcome back</p>
        <h1 className="text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-[1.75rem]">
          Hi, {name}
        </h1>
      </header>

      <section aria-labelledby="home-summary-heading" className="space-y-4">
        <h2
          id="home-summary-heading"
          className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
        >
          Summary
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm shadow-black/20 backdrop-blur-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Total bills
            </p>
            <p className="mt-3 text-lg font-semibold tabular-nums leading-none text-card-foreground">
              {formatInr(totalBillAmount)}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {store.invoices.length}{" "}
              {store.invoices.length === 1 ? "invoice" : "invoices"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm shadow-black/20 backdrop-blur-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Commission
            </p>
            <p className="mt-3 text-lg font-semibold tabular-nums leading-none text-card-foreground">
              {formatInr(totalCommission)}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Across all invoices
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm shadow-black/20 backdrop-blur-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Payments in
            </p>
            <p className="mt-3 text-lg font-semibold tabular-nums leading-none text-card-foreground">
              {formatInr(totalPaymentsReceived)}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {store.payments.length}{" "}
              {store.payments.length === 1 ? "entry" : "entries"}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="home-actions-heading" className="space-y-4">
        <h2
          id="home-actions-heading"
          className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
        >
          Quick actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/invoice/invoices/new?returnTo=%2Fhome"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            New invoice
          </Link>
          <Link
            href="/invoice/payments/new?returnTo=%2Fhome"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            Record payment
          </Link>
          <Link
            href="/invoice"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-primary/35 bg-primary/15 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/25"
          >
            Invoice hub
          </Link>
        </div>
      </section>
    </div>
  );
}
