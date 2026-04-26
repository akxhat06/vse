"use client";

import { useActionState, useState } from "react";
import { FormSelectField } from "@/app/(main)/invoice/_components/FormSelectField";
import {
  type ActionResult,
  saveRetailer,
} from "@/app/(main)/invoice/store-actions";
import type { Company, Retailer } from "@/lib/store/types";

export function RetailerForm({
  companies,
  initial,
  redirectTo,
}: {
  companies: Company[];
  initial: Retailer | null;
  redirectTo: string;
}) {
  const [companyId, setCompanyId] = useState(initial?.companyId ?? "");
  const [taxType, setTaxType] = useState<"GST" | "PAN">(
    initial?.taxIdType ?? "GST",
  );

  const [state, formAction, pending] = useActionState<
    ActionResult | undefined,
    FormData
  >(saveRetailer, undefined);

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
        name="companyId"
        label="Company *"
        placeholder="Select company"
        value={companyId}
        onValueChange={setCompanyId}
        options={companies.map((c) => ({ value: c.id, label: c.name }))}
      />

      <div>
        <label className="text-sm font-medium text-zinc-300">
          Retailer name *
        </label>
        <input
          name="name"
          required
          defaultValue={initial?.name ?? ""}
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-300">Address *</label>
        <textarea
          name="address"
          required
          rows={3}
          defaultValue={initial?.address ?? ""}
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-300">Phone * (+91)</label>
        <div className="mt-1 flex rounded-xl border border-zinc-700 bg-zinc-900">
          <span className="flex items-center border-r border-zinc-700 px-3 text-sm text-zinc-500">
            +91
          </span>
          <input
            name="phone"
            required
            inputMode="numeric"
            maxLength={10}
            defaultValue={initial?.phone ?? ""}
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none"
          />
        </div>
      </div>

      <FormSelectField
        name="taxIdType"
        label="Tax ID type *"
        placeholder="Select type"
        value={taxType}
        onValueChange={(v) => setTaxType(v as "GST" | "PAN")}
        options={[
          { value: "GST", label: "GST" },
          { value: "PAN", label: "PAN" },
        ]}
      />

      <div>
        <label className="text-sm font-medium text-zinc-300">
          {taxType === "GST" ? "GST number *" : "PAN *"}
        </label>
        <input
          name="taxId"
          required
          maxLength={taxType === "GST" ? 15 : 10}
          defaultValue={initial?.taxId ?? ""}
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white uppercase"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-300">
          Contact person
        </label>
        <input
          name="contactPersonName"
          defaultValue={initial?.contactPersonName ?? ""}
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-300">Telephone</label>
        <input
          name="telephone"
          defaultValue={initial?.telephone ?? ""}
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-300">
          Alternative no. (+91)
        </label>
        <div className="mt-1 flex rounded-xl border border-zinc-700 bg-zinc-900">
          <span className="flex items-center border-r border-zinc-700 px-3 text-sm text-zinc-500">
            +91
          </span>
          <input
            name="altPhone"
            inputMode="numeric"
            maxLength={10}
            defaultValue={initial?.altPhone ?? ""}
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl border border-zinc-600 bg-zinc-900 py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {pending ? "Saving…" : initial ? "Update retailer" : "Create retailer"}
      </button>
    </form>
  );
}
