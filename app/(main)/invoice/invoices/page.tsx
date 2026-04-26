import Link from "next/link";
import { DeleteEntityButton } from "@/app/(main)/invoice/_components/DeleteEntityButton";
import { deleteInvoice, getStore } from "@/app/(main)/invoice/store-actions";

export default async function InvoicesListPage() {
  const store = await getStore();
  const companyById = new Map(store.companies.map((c) => [c.id, c]));
  const retailerById = new Map(store.retailers.map((r) => [r.id, r]));

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
            Invoices
          </h1>
        </div>
        <Link
          href="/invoice/invoices/new?returnTo=%2Finvoice%2Finvoices"
          className="shrink-0 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          New
        </Link>
      </div>

      {store.invoices.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-8 text-center text-sm text-zinc-500">
          No invoices.{" "}
          <Link
            href="/invoice/invoices/new?returnTo=%2Finvoice%2Finvoices"
            className="text-zinc-300 underline"
          >
            Create one
          </Link>{" "}
          with an existing company and retailer.
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {store.invoices.map((inv) => {
            const co = companyById.get(inv.companyId);
            const ret = retailerById.get(inv.retailerId);
            return (
              <li
                key={inv.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <Link
                    href={`/invoice/invoices/${inv.id}`}
                    className="min-w-0 flex-1 space-y-1.5"
                  >
                    <p className="font-medium text-foreground">{inv.invoiceNo}</p>
                    <p className="text-xs leading-relaxed break-words text-zinc-500">
                      <span className="text-zinc-400">{co?.name ?? "Company"}</span>
                      <span className="text-zinc-600"> · </span>
                      <span className="text-zinc-400">{ret?.name ?? "Retailer"}</span>
                      <span className="text-zinc-600"> · </span>
                      <span>{inv.invoiceDate}</span>
                    </p>
                    <div className="space-y-0.5 text-sm text-zinc-400">
                      <p>
                        Invoice total{" "}
                        <span className="font-medium text-zinc-200">
                          ₹{inv.invoiceAmount}
                        </span>
                      </p>
                      <p>
                        Commission{" "}
                        <span className="font-medium text-zinc-200">
                          ₹{inv.commissionAmount}
                        </span>
                      </p>
                    </div>
                  </Link>
                  <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
                    <Link
                      href={`/invoice/payments/new?invoiceId=${encodeURIComponent(inv.id)}&returnTo=${encodeURIComponent("/invoice/invoices")}`}
                      className="rounded-lg border border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-900"
                    >
                      Pay
                    </Link>
                    <Link
                      href={`/invoice/credit-notes/new?invoiceId=${encodeURIComponent(inv.id)}&returnTo=${encodeURIComponent("/invoice/invoices")}`}
                      className="rounded-lg border border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-900"
                    >
                      Return
                    </Link>
                    <Link
                      href={`/invoice/invoices/${inv.id}`}
                      className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-900"
                    >
                      Edit
                    </Link>
                    <DeleteEntityButton
                      id={inv.id}
                      onDelete={deleteInvoice}
                      confirmMessage="Delete this invoice? Remove payments and credit notes first."
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
