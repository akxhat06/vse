import Link from "next/link";
import { notFound } from "next/navigation";
import { CompanyForm } from "@/app/(main)/invoice/_components/CompanyForm";
import { safePostSaveRedirect } from "@/app/(main)/invoice/redirect-utils";
import { getStore } from "@/app/(main)/invoice/store-actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ returnTo?: string }>;
};

export default async function EditCompanyPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const redirectTo = safePostSaveRedirect(
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
    "/invoice/companies",
  );
  const store = await getStore();
  const company = store.companies.find((c) => c.id === id);
  if (!company) notFound();

  return (
    <div className="pb-24 pt-6">
      <Link
        href="/invoice/companies"
        className="text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        ← Companies
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
        Edit company
      </h1>
      <div className="mt-6 max-w-lg">
        <CompanyForm initial={company} redirectTo={redirectTo} />
      </div>
    </div>
  );
}
