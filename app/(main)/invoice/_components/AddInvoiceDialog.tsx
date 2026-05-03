"use client";

import { AlertCircle, ArrowRight, Plus } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
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

const INDIGO = "#818cf8";
const VIOLET = "#a78bfa";
const ROSE = "#fb7185";
const EMERALD = "#34d399";

type Props = {
  companies: Company[];
  retailers: Retailer[];
  redirectTo: string;
};

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inputCls =
  "w-full rounded-xl bg-white/[0.04] border border-white/10 " +
  "px-3.5 py-2.5 text-base text-white outline-none " +
  "placeholder:text-white/25 transition-all " +
  "focus:border-indigo-400/60 focus:bg-white/[0.06] " +
  "focus:shadow-[0_0_0_3px_rgba(129,140,248,0.18)] sm:text-sm";

export function AddInvoiceDialog({
  companies,
  retailers,
  redirectTo,
}: Props) {
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
          className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full px-4 py-3 text-[12px] font-bold text-white shadow-xl transition active:scale-[0.95] disabled:opacity-40 lg:bottom-6 lg:right-6"
          style={{
            background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`,
            boxShadow: `0 8px 24px ${INDIGO}55`,
          }}
          aria-label="Add invoice"
        >
          <Plus className="size-3.5" />
          <span>New invoice</span>
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-w-2xl border-0 p-0"
        style={{
          background: "#0f0f1a",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          boxShadow: `0 30px 80px rgba(0,0,0,0.7), 0 0 60px ${INDIGO}20`,
        }}
      >
        <DialogHeader className="space-y-1.5 px-5 pt-6">
          <p
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: INDIGO }}
          >
            New entry
          </p>
          <DialogTitle className="text-xl font-bold text-white">
            Add invoice
          </DialogTitle>
          <DialogDescription className="text-[12px] text-white/45">
            Bill total computes from base · gst · discount.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-5 pb-5">
          {!canCreate ? (
            <div
              className="mt-4 flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-[12px] leading-relaxed"
              style={{
                background: `${ROSE}14`,
                border: `1px solid ${ROSE}33`,
                color: "#fda4af",
              }}
            >
              <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
              <span>Add a company and retailer first.</span>
            </div>
          ) : (
            <form action={formAction} className="space-y-5 pt-3">
              <input type="hidden" name="id" value="" />
              <input type="hidden" name="_redirect" value={redirectTo} />
              <input type="hidden" name="commissionPercent" value="0" />
              <input type="hidden" name="cashDiscountAmountInput" value="" />

              {state?.ok === false && (
                <div
                  className="flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-[12px]"
                  style={{
                    background: `${ROSE}14`,
                    border: `1px solid ${ROSE}33`,
                    color: "#fda4af",
                  }}
                >
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              {/* Parties */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FieldShell label="Company" required>
                  <FormSelectField
                    name="companyId"
                    label=""
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
                </FieldShell>
                <FieldShell label="Retailer" required>
                  <FormSelectField
                    name="retailerId"
                    label=""
                    placeholder={
                      !companyId
                        ? "Select company first"
                        : filteredRetailers.length === 0
                          ? "No retailers"
                          : "Select retailer"
                    }
                    value={retailerId}
                    onValueChange={setRetailerId}
                    options={filteredRetailers.map((r) => ({
                      value: r.id,
                      label: r.name,
                    }))}
                    disabled={
                      !companyId || filteredRetailers.length === 0
                    }
                  />
                </FieldShell>
              </div>

              {/* Invoice */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FieldShell label="Invoice date" required>
                  <FormDatePicker name="invoiceDate" label="" />
                </FieldShell>
                <FieldShell label="Invoice no." required>
                  <input
                    name="invoiceNo"
                    required
                    placeholder="e.g. INV-1042"
                    className={inputCls}
                  />
                </FieldShell>
                <FieldShell label="Quantity" required>
                  <input
                    name="quantity"
                    type="number"
                    min={1}
                    step={1}
                    required
                    placeholder="0"
                    className={inputCls}
                  />
                </FieldShell>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FieldShell label="Base amount" required>
                  <input
                    name="baseAmount"
                    type="number"
                    min={0}
                    step="0.01"
                    required
                    value={baseAmount}
                    onChange={(e) => setBaseAmount(e.target.value)}
                    placeholder="0.00"
                    className={inputCls}
                  />
                </FieldShell>
                <FieldShell label="GST (%)">
                  <input
                    name="gstPercent"
                    type="number"
                    min={0}
                    step="0.01"
                    value={gstPercent}
                    onChange={(e) => setGstPercent(e.target.value)}
                    className={inputCls}
                  />
                </FieldShell>
                <FieldShell label="Cash disc. (%)">
                  <input
                    name="cashDiscountPercent"
                    type="number"
                    min={0}
                    step="0.01"
                    value={cdPercent}
                    onChange={(e) => setCdPercent(e.target.value)}
                    className={inputCls}
                  />
                </FieldShell>
              </div>

              {/* Computed */}
              <div
                className="overflow-hidden rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <ReadRow
                  label="Cash discount"
                  value={inr.format(calc.cashDiscountApplied)}
                />
                <ReadRow
                  label="Taxable (base − cd)"
                  value={inr.format(calc.taxableAmount)}
                />
                <ReadRow
                  label="GST amount"
                  value={inr.format(calc.gstAmount)}
                />
                <ReadRow
                  label="Invoice total"
                  value={inr.format(calc.invoiceAmount)}
                  emphasised
                  isLast
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-[12px] font-semibold text-white/70 transition active:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="group flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[12px] font-bold text-white transition active:scale-[0.98] disabled:opacity-50"
                  style={{
                    background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`,
                    boxShadow: `0 8px 20px ${INDIGO}45`,
                  }}
                >
                  {pending ? (
                    <>
                      <span>Saving</span>
                      <span className="inline-flex gap-0.5">
                        <span className="size-1 animate-pulse rounded-full bg-white" />
                        <span
                          className="size-1 animate-pulse rounded-full bg-white"
                          style={{ animationDelay: "200ms" }}
                        />
                        <span
                          className="size-1 animate-pulse rounded-full bg-white"
                          style={{ animationDelay: "400ms" }}
                        />
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Save invoice</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FieldShell({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold text-white/60">
        {label}
        {required && (
          <span className="ml-1" style={{ color: ROSE }}>
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function ReadRow({
  label,
  value,
  emphasised,
  isLast,
}: {
  label: string;
  value: string;
  emphasised?: boolean;
  isLast?: boolean;
}) {
  return (
    <div
      className="flex items-baseline justify-between px-3.5 py-2.5"
      style={{
        borderBottom: isLast
          ? "none"
          : "1px solid rgba(255,255,255,0.05)",
        background: emphasised
          ? `linear-gradient(135deg, ${EMERALD}14, ${EMERALD}06)`
          : "transparent",
      }}
    >
      <span
        className="text-[11px] font-semibold"
        style={{
          color: emphasised ? EMERALD : "rgba(255,255,255,0.5)",
        }}
      >
        {label}
      </span>
      <span
        className={
          emphasised
            ? "text-[15px] font-bold tabular-nums"
            : "text-[13px] tabular-nums"
        }
        style={{
          color: emphasised ? EMERALD : "rgba(255,255,255,0.85)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
