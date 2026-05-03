import { Building2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { CompanyForm } from "@/app/(main)/invoice/_components/CompanyForm";
import { safePostSaveRedirect } from "@/app/(main)/invoice/redirect-utils";

const SKY = "#38bdf8";
const INDIGO = "#818cf8";

type Props = { searchParams?: Promise<{ returnTo?: string }> };

export default async function NewCompanyPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const redirectTo = safePostSaveRedirect(
    typeof sp.returnTo === "string" ? sp.returnTo : undefined,
    "/invoice/companies",
  );

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

      <header className="flex items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${SKY}, ${INDIGO})`,
            boxShadow: `0 4px 14px ${SKY}40`,
          }}
        >
          <Building2 className="size-5 text-white" />
        </div>
        <div>
          <p className="text-[11px] text-white/40">New entry</p>
          <h1 className="text-xl font-bold leading-tight text-white">
            Add company
          </h1>
        </div>
      </header>

      <CompanyForm initial={null} redirectTo={redirectTo} />
    </div>
  );
}
