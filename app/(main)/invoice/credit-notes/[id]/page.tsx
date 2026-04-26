import Link from "next/link";
import { notFound } from "next/navigation";
import { CreditNoteForm } from "@/app/(main)/invoice/_components/CreditNoteForm";
import { safePostSaveRedirect } from "@/app/(main)/invoice/redirect-utils";
import { getStore } from "@/app/(main)/invoice/store-actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ returnTo?: string }>;
};

export default async function EditCreditNotePage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const redirectTo = safePostSaveRedirect(
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
    "/invoice/credit-notes",
  );
  const store = await getStore();
  const note = store.creditNotes.find((c) => c.id === id);
  if (!note) notFound();

  return (
    <div className="pb-24 pt-6">
      <Link
        href="/invoice/credit-notes"
        className="text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        ← Credit notes
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
        Edit credit note
      </h1>
      <div className="mt-6 max-w-lg">
        <CreditNoteForm
          invoices={store.invoices}
          initial={note}
          redirectTo={redirectTo}
        />
      </div>
    </div>
  );
}
