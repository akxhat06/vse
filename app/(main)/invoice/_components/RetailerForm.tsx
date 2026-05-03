"use client";

import { AlertCircle, ArrowRight, ChevronDown, Search } from "lucide-react";
import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  type ActionResult,
  saveRetailer,
} from "@/app/(main)/invoice/store-actions";
import type { Company, Retailer } from "@/lib/store/types";

const INDIGO = "#818cf8";
const VIOLET = "#a78bfa";
const ROSE = "#fb7185";

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
}: {
  name: string;
  defaultValue?: string;
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
        placeholder="10-digit"
        className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-white outline-none placeholder:text-white/25 sm:text-sm"
      />
    </div>
  );
}

function CompanySelect({
  name,
  value,
  onChange,
  placeholder,
  companies,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  companies: Company[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = companies.find((c) => c.id === value);

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
            color: selected ? "white" : "rgba(255,255,255,0.25)",
          }}
        >
          {selected?.name ?? placeholder}
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
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 size-3.5 text-white/35" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg bg-white/[0.04] px-3 py-2 pl-8 text-[13px] text-white outline-none placeholder:text-white/30 focus:bg-white/[0.06]"
              />
            </div>
          </div>
          <ul className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-[12px] text-white/35">
                No matching company
              </li>
            ) : (
              filtered.map((c) => (
                <li
                  key={c.id}
                  role="option"
                  aria-selected={value === c.id}
                  onClick={() => {
                    onChange(c.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="cursor-pointer rounded-lg px-3 py-2 text-[13px] transition-colors"
                  style={
                    value === c.id
                      ? {
                          background: `linear-gradient(135deg, ${INDIGO}22, ${VIOLET}11)`,
                          color: "white",
                          fontWeight: 600,
                        }
                      : { color: "rgba(255,255,255,0.7)" }
                  }
                  onMouseEnter={(e) => {
                    if (value !== c.id) {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.04)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== c.id) {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                    }
                  }}
                >
                  {c.name}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function TaxTypeToggle({
  value,
  onChange,
}: {
  value: "GST" | "PAN";
  onChange: (v: "GST" | "PAN") => void;
}) {
  return (
    <>
      <input type="hidden" name="taxIdType" value={value} />
      <div
        className="grid grid-cols-2 gap-1 rounded-xl p-1"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {(["GST", "PAN"] as const).map((v) => {
          const active = value === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className="rounded-lg py-2 text-[12px] font-bold transition active:scale-[0.97]"
              style={
                active
                  ? {
                      background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`,
                      color: "white",
                      boxShadow: `0 4px 12px ${INDIGO}40`,
                    }
                  : { color: "rgba(255,255,255,0.55)" }
              }
            >
              {v}
            </button>
          );
        })}
      </div>
    </>
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

export function RetailerForm({
  companies,
  initial,
  redirectTo,
}: {
  companies: Company[];
  initial: Retailer | null;
  redirectTo: string;
}) {
  const [companyId, setCompanyId] = useState(
    initial?.companyId ?? companies[0]?.id ?? "",
  );
  const [taxType, setTaxType] = useState<"GST" | "PAN">(
    initial?.taxIdType ?? "GST",
  );
  const [state, formAction, pending] = useActionState<
    ActionResult | undefined,
    FormData
  >(saveRetailer, undefined);

  return (
    <form action={formAction} className="space-y-6 pb-6">
      <input type="hidden" name="id" value={initial?.id ?? ""} />
      <input type="hidden" name="_redirect" value={redirectTo} />

      {state?.ok === false && <ErrorBanner error={state.error} />}

      {/* 01 Parent */}
      <SectionHeader
        step={1}
        title="Parent company"
        desc="Which company owns this retailer"
      />
      <div>
        <FieldLabel required>Company</FieldLabel>
        <CompanySelect
          name="companyId"
          value={companyId}
          onChange={setCompanyId}
          placeholder="Select company…"
          companies={companies}
        />
      </div>

      {/* 02 Identity */}
      <SectionHeader
        step={2}
        title="Identity"
        desc="Name and address details"
      />
      <div className="space-y-4">
        <div>
          <FieldLabel>Retailer name</FieldLabel>
          <input
            name="name"
            defaultValue={initial?.name ?? ""}
            placeholder="Retailer / shop name"
            className={inputCls}
          />
        </div>
        <div>
          <FieldLabel>Address</FieldLabel>
          <textarea
            name="address"
            rows={2}
            defaultValue={initial?.address ?? ""}
            placeholder="Street, area, city…"
            className={`${inputCls} resize-none`}
          />
        </div>
        <div>
          <FieldLabel>Contact person</FieldLabel>
          <input
            name="contactPersonName"
            defaultValue={initial?.contactPersonName ?? ""}
            placeholder="Person name"
            className={inputCls}
          />
        </div>
      </div>

      {/* 03 Contact */}
      <SectionHeader step={3} title="Contact" desc="Phone numbers" />
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
            placeholder="Landline / STD"
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

      {/* 04 Tax */}
      <SectionHeader
        step={4}
        title="Tax details"
        desc="GST or PAN identification"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel required>Tax ID type</FieldLabel>
          <TaxTypeToggle value={taxType} onChange={setTaxType} />
        </div>
        <div>
          <FieldLabel required>
            {taxType === "GST" ? "GST number" : "PAN number"}
          </FieldLabel>
          <input
            name="taxId"
            required
            maxLength={taxType === "GST" ? 15 : 10}
            defaultValue={initial?.taxId ?? ""}
            placeholder={
              taxType === "GST"
                ? "15-character GSTIN"
                : "10-character PAN"
            }
            className={inputCls}
            style={{ textTransform: "uppercase" }}
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
            <span>{initial ? "Update retailer" : "Save retailer"}</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
