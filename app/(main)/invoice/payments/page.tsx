import Link from "next/link";
import { DeleteEntityButton } from "@/app/(main)/invoice/_components/DeleteEntityButton";
import { deletePayment, getStore } from "@/app/(main)/invoice/store-actions";

export default async function PaymentsListPage() {
  const store = await getStore();
  const invoiceById = new Map(store.invoices.map((i) => [i.id, i]));

  return (
    <div className="pb-24 pt-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/invoice"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            ← Invoice
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Payments
          </h1>
        </div>
        <Link
          href="/invoice/payments/new?returnTo=%2Finvoice%2Fpayments"
          className="shrink-0 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          New
        </Link>
      </div>

      {store.payments.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-8 text-center text-sm text-zinc-500">
          No payments. Create an invoice first, then{" "}
          <Link
            href="/invoice/payments/new?returnTo=%2Finvoice%2Fpayments"
            className="text-zinc-300 underline"
          >
            add a payment
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {store.payments.map((p) => {
            const inv = invoiceById.get(p.invoiceId);
            return (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">
                    ₹{p.amount}{" "}
                    <span className="font-normal text-zinc-500">· {p.method}</span>
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {inv?.invoiceNo ?? "Invoice"} · {p.date}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/invoice/payments/${p.id}`}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-900"
                  >
                    Edit
                  </Link>
                  <DeleteEntityButton id={p.id} onDelete={deletePayment} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
