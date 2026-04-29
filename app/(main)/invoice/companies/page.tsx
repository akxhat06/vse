import Link from "next/link";
import { getStore } from "@/app/(main)/invoice/store-actions";
import { CompaniesClient } from "./_components/CompaniesClient";

export default async function CompaniesListPage() {
  const { companies } = await getStore();

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Companies</h1>
          <p className="mt-0.5 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            {companies.length === 0
              ? "No companies yet"
              : `${companies.length} ${companies.length === 1 ? "company" : "companies"}`}
          </p>
        </div>
        <Link
          href="/invoice/companies/new?returnTo=%2Finvoice%2Fcompanies"
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all"
          style={{
            background: "rgba(129,140,248,0.2)",
            border: "1px solid rgba(129,140,248,0.3)",
          }}
        >
          <PlusIcon className="size-4" />
          New company
        </Link>
      </div>

      <CompaniesClient companies={companies} />
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
