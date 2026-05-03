"use client";

import { AlertCircle, ArrowRight, ChevronDown } from "lucide-react";
import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  type ActionResult,
  saveCompany,
} from "@/app/(main)/invoice/store-actions";
import type { Company } from "@/lib/store/types";

const INDIGO = "#818cf8";
const VIOLET = "#a78bfa";
const ROSE = "#fb7185";

const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const inputCls =
  "w-full rounded-xl bg-white/[0.04] border border-white/10 " +
  "px-3.5 py-3 text-base text-white outline-none " +
  "placeholder:text-white/25 transition-all " +
  "focus:border-indigo-400/60 focus:bg-white/[0.06] " +
  "focus:shadow-[0_0_0_3px_rgba(129,140,248,0.18)] sm:text-sm";

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1.5 block text-[11px] font-semibold text-white/60">
      {children}
      {required && (
        <span className="ml-1" style={{ color: ROSE }}>
          *
        </span>
      )}
    </label>
  );
}

function SectionHeader({
  step,
  title,
  desc,
}: {
  step: number;
  title: string;
  desc?: string;
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white"
        style={{
          background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`,
          boxShadow: `0 4px 10px ${INDIGO}33`,
        }}
      >
        {step}
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-bold leading-tight text-white">
          {title}
        </p>
        {desc && <p className="text-[10px] text-white/40">{desc}</p>}
      </div>
    </div>
  );
}

function PhoneField({
  name,
  defaultValue,
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] transition-all focus-within:border-indigo-400/60 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_0_3px_rgba(129,140,248,0.18)]">
      <span
        className="flex items-center px-3 text-[12px] font-semibold text-white/55"
        style={{ background: "rgba(129,140,248,0.08)" }}
      >
        +91
      </span>
      <input
        name={name}
        inputMode="numeric"
        maxLength={10}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder ?? "10-digit"}
        className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-white outline-none placeholder:text-white/25 sm:text-sm"
      />
    </div>
  );
}

function StateSelect({
  name,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const filtered = INDIA_STATES.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setOpen((p) => !p);
          setSearch("");
        }}
        className={`${inputCls} flex items-center justify-between text-left`}
      >
        <span
          style={{
            color: value ? "white" : "rgba(255,255,255,0.25)",
          }}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          style={{ color: INDIGO }}
        />
      </button>

      {open && (
        <div
          id={id}
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl"
          style={{
            background: "#13131c",
            border: `1px solid ${INDIGO}33`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 30px ${INDIGO}15`,
          }}
        >
          <div className="border-b border-white/8 p-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-white/[0.04] px-3 py-2 text-[13px] text-white outline-none placeholder:text-white/30 focus:bg-white/[0.06]"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-[12px] text-white/35">
                No matching state
              </li>
            ) : (
              filtered.map((opt) => (
                <li
                  key={opt}
                  role="option"
                  aria-selected={value === opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="cursor-pointer rounded-lg px-3 py-2 text-[13px] transition-colors"
                  style={
                    value === opt
                      ? {
                          background: `linear-gradient(135deg, ${INDIGO}22, ${VIOLET}11)`,
                          color: "white",
                          fontWeight: 600,
                        }
                      : { color: "rgba(255,255,255,0.7)" }
                  }
                  onMouseEnter={(e) => {
                    if (value !== opt) {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.04)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== opt) {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                    }
                  }}
                >
                  {opt}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function ErrorBanner({ error }: { error?: string }) {
  return (
    <div
      className="flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-[12px] leading-relaxed"
      style={{
        background: `${ROSE}14`,
        border: `1px solid ${ROSE}33`,
        color: "#fda4af",
      }}
    >
      <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
      <span>{error ?? "Something went wrong"}</span>
    </div>
  );
}

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
  const [selectedState, setSelectedState] = useState(initial?.state ?? "");

  return (
    <form action={formAction} className="space-y-6 pb-6">
      <input type="hidden" name="id" value={initial?.id ?? ""} />
      <input type="hidden" name="_redirect" value={redirectTo} />

      {state?.ok === false && <ErrorBanner error={state.error} />}

      {/* 01 Company info */}
      <SectionHeader
        step={1}
        title="Company info"
        desc="Identify the entity"
      />
      <div className="space-y-4">
        <div>
          <FieldLabel required>Company name</FieldLabel>
          <input
            name="name"
            required
            autoComplete="organization"
            defaultValue={initial?.name ?? ""}
            placeholder="e.g. Acme Pvt. Ltd."
            className={inputCls}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel required>GST number</FieldLabel>
            <input
              name="gstNumber"
              required
              maxLength={15}
              defaultValue={initial?.gstNumber ?? ""}
              placeholder="15-character GSTIN"
              className={inputCls}
              style={{ textTransform: "uppercase" }}
            />
          </div>
          <div>
            <FieldLabel>Email address</FieldLabel>
            <input
              name="email"
              type="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              defaultValue={initial?.email ?? ""}
              placeholder="company@example.com"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* 02 Contact */}
      <SectionHeader
        step={2}
        title="Contact"
        desc="Phone numbers"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel required>Phone no.</FieldLabel>
          <PhoneField
            name="phone"
            defaultValue={initial?.phone ?? ""}
          />
        </div>
        <div>
          <FieldLabel>Telephone</FieldLabel>
          <input
            name="telephone"
            inputMode="numeric"
            defaultValue={initial?.telephone ?? ""}
            placeholder="STD / Landline"
            className={inputCls}
          />
        </div>
        <div>
          <FieldLabel>Alternative no.</FieldLabel>
          <PhoneField
            name="altPhone"
            defaultValue={initial?.altPhone ?? ""}
          />
        </div>
      </div>

      {/* 03 Address */}
      <SectionHeader
        step={3}
        title="Address"
        desc="Where the company is based"
      />
      <div className="space-y-4">
        <div>
          <FieldLabel>Street address</FieldLabel>
          <textarea
            name="address"
            rows={2}
            defaultValue={initial?.address ?? ""}
            placeholder="Building, street, area…"
            className={`${inputCls} resize-none`}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel>City</FieldLabel>
            <input
              name="city"
              defaultValue={initial?.city ?? ""}
              placeholder="Mumbai"
              className={inputCls}
            />
          </div>
          <div>
            <FieldLabel>State</FieldLabel>
            <StateSelect
              name="state"
              value={selectedState}
              onChange={setSelectedState}
              placeholder="Select state…"
            />
          </div>
          <div>
            <FieldLabel>PIN code</FieldLabel>
            <input
              name="pinCode"
              inputMode="numeric"
              maxLength={6}
              defaultValue={initial?.pinCode ?? ""}
              placeholder="6-digit PIN"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* 04 Bank */}
      <SectionHeader
        step={4}
        title="Bank details"
        desc="Where payments go"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Bank name</FieldLabel>
          <input
            name="bankName"
            defaultValue={initial?.bankName ?? ""}
            placeholder="e.g. State Bank of India"
            className={inputCls}
          />
        </div>
        <div>
          <FieldLabel>Account no.</FieldLabel>
          <input
            name="acNo"
            inputMode="numeric"
            defaultValue={initial?.acNo ?? ""}
            placeholder="Account number"
            className={inputCls}
          />
        </div>
        <div>
          <FieldLabel>IFSC code</FieldLabel>
          <input
            name="ifscCode"
            maxLength={11}
            defaultValue={initial?.ifscCode ?? ""}
            placeholder="e.g. SBIN0001234"
            className={inputCls}
            style={{ textTransform: "uppercase" }}
          />
        </div>
        <div>
          <FieldLabel>Branch</FieldLabel>
          <input
            name="branch"
            defaultValue={initial?.branch ?? ""}
            placeholder="Branch name"
            className={inputCls}
          />
        </div>
      </div>

      {/* Save */}
      <button
        type="submit"
        disabled={pending}
        className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-3.5 text-[14px] font-bold text-white transition active:scale-[0.98] disabled:opacity-50"
        style={{
          background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`,
          boxShadow: `0 10px 28px ${INDIGO}55`,
        }}
      >
        {pending ? (
          <>
            <span>Saving</span>
            <span className="inline-flex gap-1">
              <span
                className="size-1 animate-pulse rounded-full bg-white"
                style={{ animationDelay: "0ms" }}
              />
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
            <span>{initial ? "Update company" : "Save company"}</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
