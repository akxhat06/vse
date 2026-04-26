import Link from "next/link";
import { notFound } from "next/navigation";
import { PaymentEditForm } from "@/app/(main)/invoice/_components/PaymentEditForm";
import { safePostSaveRedirect } from "@/app/(main)/invoice/redirect-utils";
import { getStore } from "@/app/(main)/invoice/store-actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ returnTo?: string }>;
};

export default async function EditPaymentPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const redirectTo = safePostSaveRedirect(
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
    "/invoice/payments",
  );
  const store = await getStore();
  const payment = store.payments.find((p) => p.id === id);
  if (!payment) notFound();

  return (
    <div className="pb-24 pt-6">
      <Link
        href="/invoice/payments"
        className="text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        ← Payments
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
        Edit payment
      </h1>
      <div className="mt-6 max-w-lg">
        <PaymentEditForm
          invoices={store.invoices}
          payment={payment}
          redirectTo={redirectTo}
        />
      </div>
    </div>
  );
}
