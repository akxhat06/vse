import Link from "next/link";
import { DeleteEntityButton } from "@/app/(main)/invoice/_components/DeleteEntityButton";
import { deleteRetailer, getStore } from "@/app/(main)/invoice/store-actions";

export default async function RetailersListPage() {
  const store = await getStore();
  const companyById = new Map(store.companies.map((c) => [c.id, c]));

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
            Retailers
          </h1>
        </div>
        <Link
          href="/invoice/retailers/new?returnTo=%2Finvoice%2Fretailers"
          className="shrink-0 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          New
        </Link>
      </div>

      {store.retailers.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-8 text-center text-sm text-zinc-500">
          No retailers. Add a company first, then{" "}
          <Link
            href="/invoice/retailers/new?returnTo=%2Finvoice%2Fretailers"
            className="text-zinc-300 underline"
          >
            create a retailer
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {store.retailers.map((r) => {
            const co = companyById.get(r.companyId);
            return (
              <li
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              >
                <Link href={`/invoice/retailers/${r.id}`} className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{r.name}</p>
                  <p className="truncate text-xs text-zinc-500">
                    {co?.name ?? "Unknown company"} · {r.taxIdType} {r.taxId}
                  </p>
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/invoice/retailers/${r.id}`}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-900"
                  >
                    Edit
                  </Link>
                  <DeleteEntityButton
                    id={r.id}
                    onDelete={deleteRetailer}
                    confirmMessage="Delete this retailer? Remove its invoices first."
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
