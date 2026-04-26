import Link from "next/link";
import { InvoiceForm } from "@/app/(main)/invoice/_components/InvoiceForm";
import {
  resumePathWithOptionalReturn,
  safePostSaveRedirect,
} from "@/app/(main)/invoice/redirect-utils";
import { getStore } from "@/app/(main)/invoice/store-actions";

type Props = { searchParams?: Promise<{ returnTo?: string }> };

export default async function NewInvoicePage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const redirectTo = safePostSaveRedirect(
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
    "/invoice/invoices",
  );
  const invoiceNewResume = resumePathWithOptionalReturn(
    "/invoice/invoices/new",
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
  );
  const companiesNewHref = `/invoice/companies/new?returnTo=${encodeURIComponent(invoiceNewResume)}`;
  const retailersNewHref = `/invoice/retailers/new?returnTo=${encodeURIComponent(invoiceNewResume)}`;

  const store = await getStore();
  const canCreate =
    store.companies.length > 0 && store.retailers.length > 0;

  return (
    <div className="pb-24 pt-6">
      <Link
        href="/invoice/invoices"
        className="text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        ← Invoices
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
        New invoice
      </h1>
      {!canCreate ? (
        <p className="mt-6 text-sm text-zinc-400">
          You need at least one company and one retailer.{" "}
          <Link href={companiesNewHref} className="text-zinc-200 underline">
            Company
          </Link>
          {" · "}
          <Link href={retailersNewHref} className="text-zinc-200 underline">
            Retailer
          </Link>
        </p>
      ) : (
        <div className="mt-6 max-w-lg">
          <InvoiceForm
            companies={store.companies}
            retailers={store.retailers}
            redirectTo={redirectTo}
          />
        </div>
      )}
    </div>
  );
}
