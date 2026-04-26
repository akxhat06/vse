"use client";

import { useActionState, useMemo, useState } from "react";
import { FormDatePicker } from "@/app/(main)/invoice/_components/FormDatePicker";
import { FormSelectField } from "@/app/(main)/invoice/_components/FormSelectField";
import {
  type ActionResult,
  saveCreditNote,
} from "@/app/(main)/invoice/store-actions";
import type { CreditNote, Invoice } from "@/lib/store/types";

export function CreditNoteForm({
  invoices,
  initial,
  initialInvoiceId,
  redirectTo,
}: {
  invoices: Invoice[];
  initial: CreditNote | null;
  /** When creating from invoice list (?invoiceId=) */
  initialInvoiceId?: string;
  redirectTo: string;
}) {
  const [invoiceId, setInvoiceId] = useState(
    initial?.invoiceId ?? initialInvoiceId ?? "",
  );
  const inv = useMemo(
    () => invoices.find((i) => i.id === invoiceId),
    [invoices, invoiceId],
  );

  const [state, formAction, pending] = useActionState<
    ActionResult | undefined,
    FormData
  >(saveCreditNote, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={initial?.id ?? ""} />
      <input type="hidden" name="_redirect" value={redirectTo} />

      {state?.ok === false ? (
        <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}

      <FormSelectField
        name="invoiceId"
        label="Invoice number *"
        placeholder="Select invoice"
        value={invoiceId}
        onValueChange={setInvoiceId}
        options={invoices.map((i) => ({
          value: i.id,
          label: `${i.invoiceNo} (qty ${i.quantity})`,
        }))}
        disabled={!!initial}
      />

      {inv ? (
        <p className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
          Qty on invoice:{" "}
          <span className="font-mono text-white">{inv.quantity}</span>
        </p>
      ) : null}

      <FormDatePicker
        name="date"
        label="Date *"
        defaultValue={initial?.date.slice(0, 10)}
      />

      <div>
        <label className="text-sm font-medium text-zinc-300">
          No. of qty to be returned *
        </label>
        <input
          name="qtyReturned"
          type="number"
          min={1}
          step={1}
          required
          defaultValue={initial?.qtyReturned ?? ""}
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-300">
          Goods return amount * (₹, 2 decimals)
        </label>
        <input
          name="goodsReturnAmount"
          type="number"
          min={0}
          step="0.01"
          required
          defaultValue={initial?.goodsReturnAmount ?? ""}
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl border border-zinc-600 bg-zinc-900 py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {pending ? "Saving…" : initial ? "Update credit note" : "Save credit note"}
      </button>
    </form>
  );
}
