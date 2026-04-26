export default function InvoicePage() {
  return (
    <div className="px-5 pt-10">
      <h1 className="text-2xl font-bold tracking-tight text-white">Invoice</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Your invoice list and actions will live here. Connect Supabase data when
        you&apos;re ready.
      </p>
      <div className="mt-8 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-8 text-center text-sm text-zinc-500">
        No invoices yet
      </div>
    </div>
  );
}
