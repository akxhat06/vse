import Link from "next/link";
import { RetailerForm } from "@/app/(main)/invoice/_components/RetailerForm";
import {
  resumePathWithOptionalReturn,
  safePostSaveRedirect,
} from "@/app/(main)/invoice/redirect-utils";
import { getStore } from "@/app/(main)/invoice/store-actions";

type Props = { searchParams?: Promise<{ returnTo?: string }> };

export default async function NewRetailerPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const redirectTo = safePostSaveRedirect(
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
    "/invoice/retailers",
  );
  const retailerNewResume = resumePathWithOptionalReturn(
    "/invoice/retailers/new",
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
  );
  const companiesNewHref = `/invoice/companies/new?returnTo=${encodeURIComponent(retailerNewResume)}`;

  const { companies } = await getStore();

  return (
    <div className="pb-24 pt-6">
      <Link
        href="/invoice/retailers"
        className="text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        ← Retailers
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
        New retailer
      </h1>
      {companies.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-400">
          Add a{" "}
          <Link href={companiesNewHref} className="text-zinc-200 underline">
            company
          </Link>{" "}
          before creating a retailer.
        </p>
      ) : (
        <div className="mt-6 max-w-lg">
          <RetailerForm companies={companies} initial={null} redirectTo={redirectTo} />
        </div>
      )}
    </div>
  );
}
