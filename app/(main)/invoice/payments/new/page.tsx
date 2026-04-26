import Link from "next/link";
import { PaymentForm } from "@/app/(main)/invoice/_components/PaymentForm";
import {
  resumePathWithOptionalReturn,
  safePostSaveRedirect,
} from "@/app/(main)/invoice/redirect-utils";
import { getStore } from "@/app/(main)/invoice/store-actions";

type Props = {
  searchParams?: Promise<{ invoiceId?: string; returnTo?: string }>;
};

export default async function NewPaymentPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const invoiceId =
    typeof sp.invoiceId === "string" && sp.invoiceId ? sp.invoiceId : null;

  const redirectTo = safePostSaveRedirect(
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
    "/invoice/payments",
  );
  let paymentNewResume = resumePathWithOptionalReturn(
    "/invoice/payments/new",
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
  );
  if (invoiceId) {
    const sep = paymentNewResume.includes("?") ? "&" : "?";
    paymentNewResume = `${paymentNewResume}${sep}invoiceId=${encodeURIComponent(invoiceId)}`;
  }
  const invoiceNewHref = `/invoice/invoices/new?returnTo=${encodeURIComponent(paymentNewResume)}`;

  const store = await getStore();

  return (
    <div className="pb-24 pt-6">
      <Link
        href="/invoice/payments"
        className="text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        ← Payments
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
        New payment
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
          <PaymentForm
            invoices={store.invoices}
            initialId={invoiceId}
            redirectTo={redirectTo}
          />
        </div>
      )}
    </div>
  );
}
