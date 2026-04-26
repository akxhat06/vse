import Link from "next/link";
import { DeleteEntityButton } from "@/app/(main)/invoice/_components/DeleteEntityButton";
import { deleteCreditNote, getStore } from "@/app/(main)/invoice/store-actions";

export default async function CreditNotesListPage() {
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
            Credit notes
          </h1>
        </div>
        <Link
          href="/invoice/credit-notes/new?returnTo=%2Finvoice%2Fcredit-notes"
          className="shrink-0 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          New
        </Link>
      </div>

      {store.creditNotes.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-8 text-center text-sm text-zinc-500">
          No credit notes.{" "}
          <Link
            href="/invoice/credit-notes/new?returnTo=%2Finvoice%2Fcredit-notes"
            className="text-zinc-300 underline"
          >
            Record a goods return
          </Link>{" "}
          against an invoice.
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {store.creditNotes.map((cn) => {
            const inv = invoiceById.get(cn.invoiceId);
            return (
              <li
                key={cn.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              >
                <Link href={`/invoice/credit-notes/${cn.id}`} className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">
                    ₹{cn.goodsReturnAmount}{" "}
                    <span className="font-normal text-zinc-500">
                      · qty {cn.qtyReturned}
                    </span>
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {inv?.invoiceNo ?? "Invoice"} · {cn.date} · snapshot qty{" "}
                    {cn.invoiceQtySnapshot}
                  </p>
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/invoice/credit-notes/${cn.id}`}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-900"
                  >
                    Edit
                  </Link>
                  <DeleteEntityButton id={cn.id} onDelete={deleteCreditNote} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
