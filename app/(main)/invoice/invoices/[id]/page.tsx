import { notFound } from "next/navigation";
import { safePostSaveRedirect } from "@/app/(main)/invoice/redirect-utils";
import { getStore } from "@/app/(main)/invoice/store-actions";
import { round2 } from "@/lib/store/invoice-math";
import { EditInvoiceClient } from "./EditInvoiceClient";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ returnTo?: string }>;
};

export default async function EditInvoicePage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const redirectTo = safePostSaveRedirect(
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
    "/invoice/invoices",
  );
  const store = await getStore();
  const invoice = store.invoices.find((i) => i.id === id);
  if (!invoice) notFound();

  const payments = store.payments.filter((p) => p.invoiceId === id);
  const creditNotes = store.creditNotes.filter((c) => c.invoiceId === id);

  const paidTotal = round2(payments.reduce((s, p) => s + p.amount, 0));
  const creditTotal = round2(
    creditNotes.reduce((s, c) => s + c.goodsReturnAmount, 0),
  );

  return (
    <EditInvoiceClient
      invoice={invoice}
      companies={store.companies}
      retailers={store.retailers}
      payments={payments}
      creditNotes={creditNotes}
      redirectTo={redirectTo}
      paidTotal={paidTotal}
      creditTotal={creditTotal}
    />
  );
}
