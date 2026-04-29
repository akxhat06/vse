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
    <div className="max-w-2xl space-y-5">
      <div>
        <Link
          href="/invoice/retailers"
          className="hover-back inline-flex items-center gap-1 text-sm transition-colors"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <ChevronLeft className="size-4" /> Retailers
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <div
            className="flex size-9 items-center justify-center rounded-full text-sm font-bold"
            style={{ background: "rgba(192,132,252,0.2)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.25)" }}
          >
            {retailer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{retailer.name}</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Edit retailer details</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <RetailerForm companies={store.companies} initial={retailer} redirectTo={redirectTo} />
      </div>
    </div>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>;
}
