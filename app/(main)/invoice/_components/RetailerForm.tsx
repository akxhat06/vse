"use client";

import { useActionState, useRef, useState, useEffect, useId } from "react";
import { type ActionResult, saveRetailer } from "@/app/(main)/invoice/store-actions";
import type { Company, Retailer } from "@/lib/store/types";

/* ── Reusable custom select ── */
function CustomSelect<T extends string>({
  name,
  value,
  onChange,
  placeholder,
  options,
}: {
  name: string;
  value: T;
  onChange: (v: T) => void;
  placeholder: string;
  options: { value: T; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-white transition"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(129,140,248,0.45)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(129,140,248,0.1)"; }}
        onBlur={(e) => { if (!open) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; } }}
      >
        <span style={{ color: selected ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.3)" }}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} style={{ color: "rgba(255,255,255,0.3)" }} />
      </button>
      {open && (
        <div
          id={id}
          role="listbox"
          className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl py-1"
          style={{ background: "#141420", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 16px 48px rgba(0,0,0,0.6)" }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="cursor-pointer px-3 py-2.5 text-sm transition"
              style={value === opt.value
                ? { background: "rgba(129,140,248,0.15)", color: "#a5b4fc", fontWeight: 600 }
                : { color: "rgba(255,255,255,0.7)" }
              }
              onMouseEnter={(e) => { if (value !== opt.value) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { if (value !== opt.value) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Shared UI pieces ── */
const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
};

function Field({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
      {children}{required && <span className="ml-0.5" style={{ color: "rgba(248,113,113,0.85)" }}>*</span>}
    </label>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(129,140,248,0.7)" }}>{children}</span>
      <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
    </div>
  );
}

const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none transition";

function FInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`${inputCls} ${props.className ?? ""}`}
      style={{ ...inputStyle, ...props.style }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(129,140,248,0.45)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(129,140,248,0.1)"; props.onFocus?.(e); }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; props.onBlur?.(e); }}
    />
  );
}

function FTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${inputCls} resize-none ${props.className ?? ""}`}
      style={{ ...inputStyle, ...props.style }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(129,140,248,0.45)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(129,140,248,0.1)"; props.onFocus?.(e); }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; props.onBlur?.(e); }}
    />
  );
}

function PhoneField({ name, defaultValue, placeholder }: { name: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div
      className="flex overflow-hidden rounded-xl transition"
      style={inputStyle}
      onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(129,140,248,0.45)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(129,140,248,0.1)"; }}
      onBlurCapture={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      <span className="flex items-center px-3 text-xs font-medium" style={{ borderRight: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }}>+91</span>
      <input name={name} inputMode="numeric" maxLength={10} defaultValue={defaultValue ?? ""} placeholder={placeholder ?? "10-digit mobile"} className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none" />
    </div>
  );
}

/* ── Main Form ── */
export function RetailerForm({
  companies,
  initial,
  redirectTo,
}: {
  companies: Company[];
  initial: Retailer | null;
  redirectTo: string;
}) {
  const [companyId, setCompanyId] = useState(initial?.companyId ?? (companies[0]?.id ?? ""));
  const [taxType, setTaxType] = useState<"GST" | "PAN">(initial?.taxIdType ?? "GST");

  const [state, formAction, pending] = useActionState<ActionResult | undefined, FormData>(saveRetailer, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={initial?.id ?? ""} />
      <input type="hidden" name="_redirect" value={redirectTo} />

      {state?.ok === false && (
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "rgba(248,113,113,0.9)" }}>
          <AlertIcon className="size-4 shrink-0" />
          {state.error}
        </div>
      )}

      {/* Company */}
      <Section>Company</Section>
      <div>
        <Field required>Company</Field>
        <CustomSelect
          name="companyId"
          value={companyId}
          onChange={setCompanyId}
          placeholder="Select company…"
          options={companies.map((c) => ({ value: c.id, label: c.name }))}
        />
      </div>

      {/* Basic info */}
      <Section>Retailer info</Section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field>Name</Field>
          <FInput name="name" defaultValue={initial?.name ?? ""} placeholder="Retailer / shop name" />
        </div>
        <div className="sm:col-span-2">
          <Field>Address</Field>
          <FTextarea name="address" rows={2} defaultValue={initial?.address ?? ""} placeholder="Street, area, city…" />
        </div>
        <div>
          <Field>Contact person</Field>
          <FInput name="contactPersonName" defaultValue={initial?.contactPersonName ?? ""} placeholder="Person name" />
        </div>
      </div>

      {/* Contact */}
      <Section>Contact numbers</Section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Field required>Phone no.</Field>
          <PhoneField name="phone" defaultValue={initial?.phone ?? ""} />
        </div>
        <div>
          <Field>Telephone</Field>
          <FInput name="telephone" inputMode="numeric" defaultValue={initial?.telephone ?? ""} placeholder="Landline / STD" />
        </div>
        <div>
          <Field>Alternative no.</Field>
          <PhoneField name="altPhone" defaultValue={initial?.altPhone ?? ""} />
        </div>
      </div>

      {/* Tax */}
      <Section>Tax details</Section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Field required>Tax ID type</Field>
          <CustomSelect
            name="taxIdType"
            value={taxType}
            onChange={setTaxType}
            placeholder="Select type…"
            options={[
              { value: "GST", label: "GST" },
              { value: "PAN", label: "PAN" },
            ]}
          />
        </div>
        <div>
          <Field required>{taxType === "GST" ? "GST no." : "PAN no."}</Field>
          <FInput
            name="taxId"
            required
            maxLength={taxType === "GST" ? 15 : 10}
            defaultValue={initial?.taxId ?? ""}
            placeholder={taxType === "GST" ? "15-char GSTIN" : "10-char PAN"}
            style={{ ...inputStyle, textTransform: "uppercase" }}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "rgba(129,140,248,0.25)", border: "1px solid rgba(129,140,248,0.35)" }}
          onMouseEnter={(e) => { if (!pending) (e.currentTarget as HTMLElement).style.background = "rgba(129,140,248,0.35)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(129,140,248,0.25)"; }}
        >
          {pending ? "Saving…" : initial ? "Update retailer" : "Save retailer"}
        </button>
      </div>
    </form>
  );
}

function ChevronDown({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m6 9 6 6 6-6" /></svg>;
}
function AlertIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
}
