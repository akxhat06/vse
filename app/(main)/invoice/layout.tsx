import { InvoiceSubNav } from "@/app/(main)/invoice/_components/InvoiceSubNav";
import { getStore } from "@/app/(main)/invoice/store-actions";

export default async function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await getStore();
  const counts = {
    companies: store.companies.length,
    retailers: store.retailers.length,
    invoices: store.invoices.length,
    payments: store.payments.length,
    creditNotes: store.creditNotes.length,
  };

  return (
    <>
      <div>
        <InvoiceSubNav counts={counts} />
      </div>
      {children}
    </>
  );
}
