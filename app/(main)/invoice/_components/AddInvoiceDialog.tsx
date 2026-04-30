"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useActionState } from "react";
import { FormDatePicker } from "@/app/(main)/invoice/_components/FormDatePicker";
import { FormSelectField } from "@/app/(main)/invoice/_components/FormSelectField";
import {
  type ActionResult,
  saveInvoice,
} from "@/app/(main)/invoice/store-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { computeInvoiceAmounts } from "@/lib/store/invoice-math";
import type { Company, Retailer } from "@/lib/store/types";

type Props = {
  companies: Company[];
  retailers: Retailer[];
  /** Used so the server action redirects back here after save */
  redirectTo: string;
};

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function AddInvoiceDialog({ companies, retailers, redirectTo }: Props) {
  const [open, setOpen] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [retailerId, setRetailerId] = useState("");
  const [baseAmount, setBaseAmount] = useState("");
  const [gstPercent, setGstPercent] = useState("0");
  const [cdPercent, setCdPercent] = useState("0");

  const filteredRetailers = useMemo(
    () => retailers.filter((r) => r.companyId === companyId),
    [retailers, companyId],
  );

  const calc = useMemo(() => {
    const base = Number.parseFloat(baseAmount) || 0;
    return computeInvoiceAmounts({
      baseAmount: base,
      gstPercent: Number.parseFloat(gstPercent) || 0,
      cashDiscountPercent: Number.parseFloat(cdPercent) || 0,
      cashDiscountAmountInput: null,
      commissionPercent: 0,
    });
  }, [baseAmount, gstPercent, cdPercent]);

  const [state, formAction, pending] = useActionState<
    ActionResult | undefined,
    FormData
  >(saveInvoice, undefined);

  const canCreate = companies.length > 0 && retailers.length > 0;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setCompanyId("");
      setRetailerId("");
      setBaseAmount("");
      setGstPercent("0");
      setCdPercent("0");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          disabled={!canCreate}
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-base font-semibold text-foreground backdrop-blur transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="size-4" />
          Add invoice
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add invoice</DialogTitle>
          <DialogDescription>
            Enter bill details — taxable amount, GST and invoice total are
            calculated for you.
          </DialogDescription>
        </DialogHeader>

        {!canCreate ? (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
            You need at least one company and one retailer before you can add
            an invoice.
          </p>
        ) : (
          <form action={formAction} className="space-y-5">
            <input type="hidden" name="id" value="" />
            <input type="hidden" name="_redirect" value={redirectTo} />
            <input type="hidden" name="commissionPercent" value="0" />
            <input type="hidden" name="cashDiscountAmountInput" value="" />

            {state?.ok === false ? (
              <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                {state.error}
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormSelectField
                name="companyId"
                label="Company *"
                placeholder="Select company"
                value={companyId}
                onValueChange={(v) => {
                  setCompanyId(v);
                  setRetailerId("");
                }}
                options={companies.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
              />

              <FormSelectField
                name="retailerId"
                label="Retailer *"
                placeholder={
                  !companyId
                    ? "Select company first"
                    : filteredRetailers.length === 0
                      ? "No retailers for this company"
                      : "Select retailer"
                }
                value={retailerId}
                onValueChange={setRetailerId}
                options={filteredRetailers.map((r) => ({
                  value: r.id,
                  label: r.name,
                }))}
                disabled={!companyId || filteredRetailers.length === 0}
              />

              <FormDatePicker name="invoiceDate" label="Invoice date *" />

              <TextField
                name="invoiceNo"
                label="Invoice no. *"
                required
                placeholder="e.g. INV-1042"
              />

              <NumberField
                name="quantity"
                label="Quantity *"
                min={1}
                step={1}
                required
                placeholder="0"
              />

              <NumberField
                name="baseAmount"
                label="Base amount *"
                min={0}
                step="0.01"
                required
                value={baseAmount}
                onChange={(v) => setBaseAmount(v)}
                placeholder="0.00"
              />

              <NumberField
                name="gstPercent"
                label="GST (%)"
                min={0}
                step="0.01"
                value={gstPercent}
                onChange={(v) => setGstPercent(v)}
              />

              <NumberField
                name="cashDiscountPercent"
                label="Cash discount (%)"
                min={0}
                step="0.01"
                value={cdPercent}
                onChange={(v) => setCdPercent(v)}
              />

              <ReadOnlyField
                label="Cash discount amount"
                value={formatInr(calc.cashDiscountApplied)}
              />

              <ReadOnlyField
                label="Taxable amount (Base − CD)"
                value={formatInr(calc.taxableAmount)}
              />

              <ReadOnlyField
                label="GST amount"
                value={formatInr(calc.gstAmount)}
              />

              <ReadOnlyField
                label="Invoice amount (bill amount)"
                value={formatInr(calc.invoiceAmount)}
                emphasised
              />
            </div>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="rounded-xl border border-zinc-700 bg-transparent px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-xl border border-zinc-600 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200 disabled:opacity-50"
              >
                {pending ? "Saving…" : "Save invoice"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function TextField({
  name,
  label,
  required,
  placeholder,
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-1 h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-sm text-white placeholder:text-zinc-500 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-500/30 focus-visible:outline-none"
      />
    </div>
  );
}

function NumberField({
  name,
  label,
  min,
  step,
  required,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  label: string;
  min?: number;
  step?: number | string;
  required?: boolean;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  const controlled = value !== undefined && onChange !== undefined;
  return (
    <div>
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      <input
        name={name}
        type="number"
        min={min}
        step={step}
        required={required}
        placeholder={placeholder}
        {...(controlled
          ? { value, onChange: (e) => onChange!(e.target.value) }
          : {})}
        className="mt-1 h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-sm text-white placeholder:text-zinc-500 focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-500/30 focus-visible:outline-none"
      />
    </div>
  );
}

function ReadOnlyField({
  label,
  value,
  emphasised,
}: {
  label: string;
  value: string;
  emphasised?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-400">{label}</label>
      <div
        className={
          emphasised
            ? "mt-1 flex h-11 items-center rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 text-sm font-semibold tabular-nums text-emerald-200"
            : "mt-1 flex h-11 items-center rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 text-sm font-medium tabular-nums text-zinc-200"
        }
      >
        {value}
      </div>
    </div>
  );
}
