import Link from "next/link";
import { CreditNoteForm } from "@/app/(main)/invoice/_components/CreditNoteForm";
import {
  resumePathWithOptionalReturn,
  safePostSaveRedirect,
} from "@/app/(main)/invoice/redirect-utils";
import { getStore } from "@/app/(main)/invoice/store-actions";

type Props = {
  searchParams?: Promise<{ invoiceId?: string; returnTo?: string }>;
};

export default async function NewCreditNotePage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const preselect =
    typeof sp.invoiceId === "string" && sp.invoiceId ? sp.invoiceId : undefined;

  const redirectTo = safePostSaveRedirect(
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
    "/invoice/credit-notes",
  );
  let creditNewResume = resumePathWithOptionalReturn(
    "/invoice/credit-notes/new",
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
  );
  if (preselect) {
    const sep = creditNewResume.includes("?") ? "&" : "?";
    creditNewResume = `${creditNewResume}${sep}invoiceId=${encodeURIComponent(preselect)}`;
  }
  const invoiceNewHref = `/invoice/invoices/new?returnTo=${encodeURIComponent(creditNewResume)}`;

  const store = await getStore();

  return (
    <div className="pb-24 pt-6">
      <Link
        href="/invoice/credit-notes"
        className="text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        ← Credit notes
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
        New credit note
      </h1>
      {store.invoices.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-400">
          <Link href={invoiceNewHref} className="text-zinc-200 underline">
            Create an invoice
          </Link>{" "}
          first.
        </p>
      ) : (
        <div className="mt-6 max-w-lg">
          <CreditNoteForm
            invoices={store.invoices}
            initial={null}
            initialInvoiceId={preselect}
            redirectTo={redirectTo}
          />
        </div>
      )}
    </div>
  );
}
