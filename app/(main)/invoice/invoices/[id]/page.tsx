import Link from "next/link";
import { notFound } from "next/navigation";
import { InvoiceForm } from "@/app/(main)/invoice/_components/InvoiceForm";
import { safePostSaveRedirect } from "@/app/(main)/invoice/redirect-utils";
import { getStore } from "@/app/(main)/invoice/store-actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ returnTo?: string }>;
};

export default async function EditInvoicePage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const redirectTo = safePostSaveRedirect(
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
    "/invoice/invoices",
  );
  const store = await getStore();
  const invoice = store.invoices.find((i) => i.id === id);
  if (!invoice) notFound();

  return (
    <div className="pb-24 pt-6">
      <Link
        href="/invoice/invoices"
        className="text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        ← Invoices
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
        Edit invoice
      </h1>
      <div className="mt-6 max-w-lg">
        <InvoiceForm
          companies={store.companies}
          retailers={store.retailers}
          initial={invoice}
          redirectTo={redirectTo}
        />
      </div>
    </div>
  );
}
