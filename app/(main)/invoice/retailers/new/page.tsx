import Link from "next/link";
import { RetailerForm } from "@/app/(main)/invoice/_components/RetailerForm";
import { resumePathWithOptionalReturn, safePostSaveRedirect } from "@/app/(main)/invoice/redirect-utils";
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
    <div className="max-w-2xl space-y-5">
      <div>
        <Link
          href="/invoice/retailers"
          className="hover-back inline-flex items-center gap-1 text-sm transition-colors"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <ChevronLeft className="size-4" /> Retailers
        </Link>
        <h1 className="mt-2 text-xl font-bold text-white">New retailer</h1>
        <p className="mt-0.5 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          Fill in the details below to add a new retailer.
        </p>
      </div>

      {companies.length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.1)" }}
        >
          <p className="text-sm font-medium text-white">No companies found</p>
          <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            A retailer must belong to a company. Add a company first.
          </p>
          <Link
            href={companiesNewHref}
            className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
            style={{ background: "rgba(129,140,248,0.2)", border: "1px solid rgba(129,140,248,0.3)" }}
          >
            Add company
          </Link>
        </div>
      ) : (
        <div className="glass rounded-2xl p-6">
          <RetailerForm companies={companies} initial={null} redirectTo={redirectTo} />
        </div>
      )}
    </div>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>;
}
