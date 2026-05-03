import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompanyForm } from "@/app/(main)/invoice/_components/CompanyForm";
import { DeleteEntityButton } from "@/app/(main)/invoice/_components/DeleteEntityButton";
import { safePostSaveRedirect } from "@/app/(main)/invoice/redirect-utils";
import {
  deleteCompany,
  getStore,
} from "@/app/(main)/invoice/store-actions";

const SKY = "#38bdf8";
const INDIGO = "#818cf8";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ returnTo?: string }>;
};

export default async function EditCompanyPage({
  params,
  searchParams,
}: Props) {
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
    <div className="mx-auto max-w-2xl space-y-5 px-1 pb-6">
      <Link
        href="/invoice/companies"
        className="inline-flex items-center gap-1 text-[12px] font-semibold transition active:opacity-70"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        <ChevronLeft className="size-3.5" style={{ color: SKY }} />
        Companies
      </Link>

      <header className="flex items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${SKY}, ${INDIGO})`,
              boxShadow: `0 4px 14px ${SKY}40`,
            }}
          >
            {company.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-white/40">Update entry</p>
            <h1 className="truncate text-xl font-bold leading-tight text-white">
              {company.name}
            </h1>
          </div>
        </div>

        <DeleteEntityButton
          id={company.id}
          onDelete={deleteCompany}
          confirmMessage="Delete this company? Retailers and invoices must be removed first."
        />
      </header>

      <CompanyForm initial={company} redirectTo={redirectTo} />
    </div>
  );
}
