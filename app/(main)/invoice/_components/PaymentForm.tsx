"use client";

import { useActionState, useState } from "react";
import { FormDatePicker } from "@/app/(main)/invoice/_components/FormDatePicker";
import { FormSelectField } from "@/app/(main)/invoice/_components/FormSelectField";
import {
  type ActionResult,
  savePayment,
} from "@/app/(main)/invoice/store-actions";
import type { Invoice } from "@/lib/store/types";

const METHODS = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Cheque",
  "Other",
] as const;

export function PaymentForm({
  invoices,
  initialId,
  redirectTo,
}: {
  invoices: Invoice[];
  initialId?: string | null;
  redirectTo: string;
}) {
  const [invoiceId, setInvoiceId] = useState(initialId ?? "");
  const [method, setMethod] = useState<string>("Cash");

  const [state, formAction, pending] = useActionState<
    ActionResult | undefined,
    FormData
  >(savePayment, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value="" />
      <input type="hidden" name="_redirect" value={redirectTo} />

      {state?.ok === false ? (
        <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}

      <FormSelectField
        name="invoiceId"
        label="Invoice *"
        placeholder="Select invoice"
        value={invoiceId}
        onValueChange={setInvoiceId}
        options={invoices.map((i) => ({
          value: i.id,
          label: `${i.invoiceNo} · ₹${i.invoiceAmount}`,
        }))}
      />

      <FormDatePicker name="date" label="Date *" />

      <FormSelectField
        name="method"
        label="Payment method *"
        placeholder="Select method"
        value={method}
        onValueChange={setMethod}
        options={METHODS.map((m) => ({ value: m, label: m }))}
      />

      <div>
        <label className="text-sm font-medium text-zinc-300">
          Payment amount *
        </label>
        <input
          name="amount"
          type="number"
          min={0}
          step="0.01"
          required
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl border border-zinc-600 bg-zinc-900 py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save payment"}
      </button>
    </form>
  );
}
