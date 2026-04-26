import Link from "next/link";
import { notFound } from "next/navigation";
import { RetailerForm } from "@/app/(main)/invoice/_components/RetailerForm";
import { safePostSaveRedirect } from "@/app/(main)/invoice/redirect-utils";
import { getStore } from "@/app/(main)/invoice/store-actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ returnTo?: string }>;
};

export default async function EditRetailerPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const redirectTo = safePostSaveRedirect(
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
    "/invoice/retailers",
  );
  const store = await getStore();
  const retailer = store.retailers.find((r) => r.id === id);
  if (!retailer) notFound();

  return (
    <div className="pb-24 pt-6">
      <Link
        href="/invoice/retailers"
        className="text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        ← Retailers
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
        Edit retailer
      </h1>
      <div className="mt-6 max-w-lg">
        <RetailerForm
          companies={store.companies}
          initial={retailer}
          redirectTo={redirectTo}
        />
      </div>
    </div>
  );
}
