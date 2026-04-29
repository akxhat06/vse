"use client";

import { useActionState, useRef, useState, useEffect, useId } from "react";
import { type ActionResult, saveCompany } from "@/app/(main)/invoice/store-actions";
import type { Company } from "@/lib/store/types";

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir",
  "Ladakh","Lakshadweep","Puducherry",
];

/* ── Custom Select ── */
function CustomSelect({ name, value, onChange, placeholder = "Select…", options }: {
  name: string; value: string; onChange: (v: string) => void;
  placeholder?: string; options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch(""); }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => { setOpen((p) => !p); setSearch(""); }}
        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-white transition"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span style={{ color: value ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)" }}>
          {value || placeholder}
        </span>
        <ChevronDown className={`ml-2 size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} style={{ color: "rgba(255,255,255,0.3)" }} />
      </button>

      {open && (
        <div
          id={id}
          role="listbox"
          className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl"
          style={{
            background: "#141420",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          <div className="p-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search state…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30 outline-none"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>No results</li>
            ) : filtered.map((opt) => (
              <li
                key={opt}
                role="option"
                aria-selected={value === opt}
                onClick={() => { onChange(opt); setOpen(false); setSearch(""); }}
                className="cursor-pointer px-3 py-2 text-sm transition-colors"
                style={value === opt
                  ? { color: "#a5b4fc", fontWeight: 600, background: "rgba(129,140,248,0.12)" }
                  : { color: "rgba(255,255,255,0.65)" }
                }
                onMouseEnter={(e) => { if (value !== opt) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={(e) => { if (value !== opt) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── Shared UI ── */
const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition";
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

function FocusInput({ className, style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`${inputCls} ${className ?? ""}`}
      style={{ ...inputStyle, ...style }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(129,140,248,0.45)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(129,140,248,0.1)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
      {...props}
    />
  );
}

function FocusTextarea({ className, style, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`${inputCls} ${className ?? ""}`}
      style={{ ...inputStyle, ...style }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(129,140,248,0.45)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(129,140,248,0.1)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
      {...props}
    />
  );
}

/* ── Phone field with +91 prefix ── */
function PhoneField({ name, defaultValue, placeholder }: { name: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div
      className="flex overflow-hidden rounded-xl transition"
      style={{ ...inputStyle }}
      onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(129,140,248,0.45)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(129,140,248,0.1)"; }}
      onBlurCapture={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      <span className="flex items-center px-3 text-xs font-medium" style={{ borderRight: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }}>+91</span>
      <input name={name} inputMode="numeric" maxLength={10} defaultValue={defaultValue ?? ""} placeholder={placeholder ?? "10-digit mobile"} className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none" />
    </div>
  );
}

/* ── Main Form ── */
export function CompanyForm({ initial, redirectTo }: { initial: Company | null; redirectTo: string }) {
  const [state, formAction, pending] = useActionState<ActionResult | undefined, FormData>(saveCompany, undefined);
  const [selectedState, setSelectedState] = useState(initial?.state ?? "");

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

      {/* Company info */}
      <Section>Company info</Section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field required>Company name</Field>
          <FocusInput name="name" required autoComplete="organization" defaultValue={initial?.name ?? ""} placeholder="e.g. Acme Pvt. Ltd." />
        </div>
        <div>
          <Field required>GST number</Field>
          <FocusInput name="gstNumber" required maxLength={15} defaultValue={initial?.gstNumber ?? ""} placeholder="15-character GSTIN" style={{ ...inputStyle, textTransform: "uppercase" }} />
        </div>
        <div>
          <Field>Email address</Field>
          <FocusInput name="email" type="email" defaultValue={initial?.email ?? ""} placeholder="company@example.com" />
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
          <FocusInput name="telephone" inputMode="numeric" defaultValue={initial?.telephone ?? ""} placeholder="STD / Landline" />
        </div>
        <div>
          <Field>Alternative no.</Field>
          <PhoneField name="altPhone" defaultValue={initial?.altPhone ?? ""} />
        </div>
      </div>

      {/* Address */}
      <Section>Address</Section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field>Street address</Field>
          <FocusTextarea name="address" rows={2} defaultValue={initial?.address ?? ""} placeholder="Building, street, area…" style={{ ...inputStyle, resize: "none" }} />
        </div>
        <div>
          <Field>City</Field>
          <FocusInput name="city" defaultValue={initial?.city ?? ""} placeholder="Mumbai" />
        </div>
        <div>
          <Field>State</Field>
          <CustomSelect name="state" value={selectedState} onChange={setSelectedState} placeholder="Select state…" options={INDIA_STATES} />
        </div>
        <div>
          <Field>PIN code</Field>
          <FocusInput name="pinCode" inputMode="numeric" maxLength={6} defaultValue={initial?.pinCode ?? ""} placeholder="6-digit PIN" />
        </div>
      </div>

      {/* Bank */}
      <Section>Bank details</Section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Field>Bank name</Field>
          <FocusInput name="bankName" defaultValue={initial?.bankName ?? ""} placeholder="e.g. State Bank of India" />
        </div>
        <div>
          <Field>Account no.</Field>
          <FocusInput name="acNo" inputMode="numeric" defaultValue={initial?.acNo ?? ""} placeholder="Account number" />
        </div>
        <div>
          <Field>IFSC code</Field>
          <FocusInput name="ifscCode" maxLength={11} defaultValue={initial?.ifscCode ?? ""} placeholder="e.g. SBIN0001234" style={{ ...inputStyle, textTransform: "uppercase" }} />
        </div>
        <div>
          <Field>Branch</Field>
          <FocusInput name="branch" defaultValue={initial?.branch ?? ""} placeholder="Branch name" />
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
          {pending ? "Saving…" : initial ? "Update company" : "Create company"}
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
