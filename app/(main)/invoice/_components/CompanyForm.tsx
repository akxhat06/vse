"use client";

import { useActionState } from "react";
import {
  type ActionResult,
  saveCompany,
} from "@/app/(main)/invoice/store-actions";
import type { Company } from "@/lib/store/types";

export function CompanyForm({
  initial,
  redirectTo,
}: {
  initial: Company | null;
  redirectTo: string;
}) {
  const [state, formAction, pending] = useActionState<
    ActionResult | undefined,
    FormData
  >(saveCompany, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={initial?.id ?? ""} />
      <input type="hidden" name="_redirect" value={redirectTo} />

      {state?.ok === false ? (
        <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}

      <div>
        <label className="text-sm font-medium text-zinc-300">
          Company name *
        </label>
        <input
          name="name"
          required
          defaultValue={initial?.name ?? ""}
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
            placeholder="10-digit mobile"
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-300">
          GST number * (15 chars)
        </label>
        <input
          name="gstNumber"
          required
          maxLength={15}
          defaultValue={initial?.gstNumber ?? ""}
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white uppercase"
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

      <div>
        <label className="text-sm font-medium text-zinc-300">Address</label>
        <textarea
          name="address"
          rows={3}
          defaultValue={initial?.address ?? ""}
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl border border-zinc-600 bg-zinc-900 py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {pending ? "Saving…" : initial ? "Update company" : "Create company"}
      </button>
    </form>
  );
}
