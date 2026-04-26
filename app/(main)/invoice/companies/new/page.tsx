import Link from "next/link";
import { CompanyForm } from "@/app/(main)/invoice/_components/CompanyForm";
import { safePostSaveRedirect } from "@/app/(main)/invoice/redirect-utils";

type Props = { searchParams?: Promise<{ returnTo?: string }> };

export default async function NewCompanyPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const redirectTo = safePostSaveRedirect(
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
    "/invoice/companies",
  );

  return (
    <div className="pb-24 pt-6">
      <Link
        href="/invoice/companies"
        className="text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        ← Companies
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
        New company
      </h1>
      <div className="mt-6 max-w-lg">
        <CompanyForm initial={null} redirectTo={redirectTo} />
      </div>
    </div>
  );
}
