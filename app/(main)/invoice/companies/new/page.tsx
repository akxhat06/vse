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
    <div className="max-w-2xl space-y-5">
      <div>
        <Link
          href="/invoice/companies"
          className="hover-back inline-flex items-center gap-1 text-sm transition-colors"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <ChevronLeft className="size-4" /> Companies
        </Link>
        <h1 className="mt-2 text-xl font-bold text-white">New company</h1>
        <p className="mt-0.5 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          Fill in the details below to add a new company.
        </p>
      </div>

      <div className="glass rounded-2xl p-6">
        <CompanyForm initial={null} redirectTo={redirectTo} />
      </div>
    </div>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
