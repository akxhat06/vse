import Link from "next/link";
import { RetailerCard } from "@/app/(main)/invoice/_components/RetailerCard";
import { getStore } from "@/app/(main)/invoice/store-actions";

export default async function RetailersListPage() {
  const store = await getStore();
  const companyById = new Map(store.companies.map((c) => [c.id, c]));

  // Pre-aggregate per-retailer invoice stats
  const statsByRetailer = new Map<string, { count: number; total: number }>();
  for (const inv of store.invoices) {
    const cur = statsByRetailer.get(inv.retailerId) ?? { count: 0, total: 0 };
    statsByRetailer.set(inv.retailerId, {
      count: cur.count + 1,
      total: Math.round((cur.total + inv.invoiceAmount) * 100) / 100,
    });
  }

  return (
    <div className="max-w-5xl space-y-4 pt-1 pb-8 lg:pb-4">

      {/* Count pill */}
      {store.retailers.length > 0 && (
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.45)" }}
          >
            {store.retailers.length} {store.retailers.length === 1 ? "retailer" : "retailers"}
          </span>
        </div>
      )}

      {/* Empty */}
      {store.retailers.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.1)" }}
        >
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl" style={{ background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.2)" }}>
            <StoreIcon className="size-7" style={{ color: "#818cf8" }} />
          </div>
          <p className="text-base font-semibold text-white">No retailers yet</p>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            {store.companies.length === 0
              ? "Add a company first, then create a retailer."
              : "Add your first retailer to get started."}
          </p>
          {store.companies.length > 0 && (
            <Link
              href="/invoice/retailers/new?returnTo=%2Finvoice%2Fretailers"
              className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition"
              style={{ background: "rgba(129,140,248,0.2)", border: "1px solid rgba(129,140,248,0.3)" }}
            >
              <PlusIcon className="size-4" /> Add retailer
            </Link>
          )}
        </div>
      ) : (
        /* Card grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {store.retailers.map((r) => {
            const co = companyById.get(r.companyId);
            const stats = statsByRetailer.get(r.id);
            return (
              <RetailerCard
                key={r.id}
                id={r.id}
                name={r.name}
                companyName={co?.name ?? null}
                taxIdType={r.taxIdType}
                invoiceCount={stats?.count ?? 0}
                totalBilled={stats?.total ?? 0}
              />
            );
          })}
        </div>
      )}

      {/* Mobile FAB */}
      {store.companies.length > 0 && (
        <Link
          href="/invoice/retailers/new?returnTo=%2Finvoice%2Fretailers"
          className="lg:hidden fixed bottom-24 right-5 z-40 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.85))",
            border: "1px solid rgba(129,140,248,0.4)",
            boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
          }}
        >
          <PlusIcon className="size-4" /> Add retailer
        </Link>
      )}
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
function StoreIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 9l1-5h16l1 5" /><path d="M3 9a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2" /><path d="M5 22V11M19 11v11M9 22v-7h6v7" /></svg>;
}
