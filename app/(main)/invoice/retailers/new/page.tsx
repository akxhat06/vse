import { AlertTriangle, ChevronLeft, Plus, Store } from "lucide-react";
import Link from "next/link";
import { RetailerForm } from "@/app/(main)/invoice/_components/RetailerForm";
import {
  resumePathWithOptionalReturn,
  safePostSaveRedirect,
} from "@/app/(main)/invoice/redirect-utils";
import { getStore } from "@/app/(main)/invoice/store-actions";

const INDIGO = "#818cf8";
const VIOLET = "#a78bfa";
const ROSE = "#fb7185";
const EMERALD = "#34d399";

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
    <div className="mx-auto max-w-2xl space-y-5 px-1 pb-6">
      <Link
        href="/invoice/retailers"
        className="inline-flex items-center gap-1 text-[12px] font-semibold transition active:opacity-70"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        <ChevronLeft className="size-3.5" style={{ color: EMERALD }} />
        Retailers
      </Link>

      <header className="flex items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`,
            boxShadow: `0 4px 14px ${INDIGO}40`,
          }}
        >
          <Store className="size-5 text-white" />
        </div>
        <div>
          <p className="text-[11px] text-white/40">New entry</p>
          <h1 className="text-xl font-bold leading-tight text-white">
            Add retailer
          </h1>
        </div>
      </header>

      {companies.length === 0 ? (
        <div
          className="rounded-2xl px-5 py-10 text-center"
          style={{
            background: `linear-gradient(180deg, ${ROSE}10, transparent)`,
            border: "1px dashed rgba(255,255,255,0.1)",
          }}
        >
          <div
            className="mx-auto flex size-12 items-center justify-center rounded-2xl"
            style={{ background: `${ROSE}1f` }}
          >
            <AlertTriangle className="size-5" style={{ color: ROSE }} />
          </div>
          <p className="mt-3 text-sm font-bold text-white">
            No companies on record
          </p>
          <p className="mt-1 text-[11px] text-white/45">
            A retailer must belong to a company. Add one first.
          </p>
          <Link
            href={companiesNewHref}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[11px] font-bold text-white transition active:scale-[0.97]"
            style={{
              background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`,
              boxShadow: `0 4px 14px ${INDIGO}40`,
            }}
          >
            <Plus className="size-3" /> Add company
          </Link>
        </div>
      ) : (
        <RetailerForm
          companies={companies}
          initial={null}
          redirectTo={redirectTo}
        />
      )}
    </div>
  );
}
