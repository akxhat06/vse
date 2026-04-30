"use client";
                                                                                                                                                                                          
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
                                                                                                                                                                                        
const AMBER = "rgb(245,158,11)";                                                                                                                                                        
const MONO = "var(--font-mono)";
const DISPLAY = "var(--font-display)";                                                                                                                                                  
                
const SECTIONS = [                                                                                                                                                                      
  {             
    id: "parent",                                                                                                                                                                       
    index: "01",
    label: "Parent",
    full: "Company",
    desc: "Which company owns this retailer.",                                                                                                                                          
  },
  {                                                                                                                                                                                     
    id: "identity",
    index: "02",
    label: "Address",
    full: "Address",                                                                                                                                                                   
    desc: "Name, address, point of contact.",
  },                                                                                                                                                                                    
  {             
    id: "contact",
    index: "03",
    label: "Contact",
    full: "Contact",                                                                                                                                                                    
    desc: "Phone numbers to reach the retailer.",
  },                                                                                                                                                                                    
  {             
    id: "tax",
    index: "04",
    label: "Tax",                                                                                                                                                                       
    full: "Tax details",
    desc: "GST or PAN identification.",                                                                                                                                                 
  },            
];

/* ── Shared styles ── */                                                                                                                                                               
const underlineBase: React.CSSProperties = {
  borderBottom: "1px solid rgba(255,255,255,0.12)",                                                                                                                                     
};              
                                                                                                                                                                                        
const sweepStyle: React.CSSProperties = {                                                                                                                                               
  background: `linear-gradient(90deg, ${AMBER}, rgba(245,158,11,0))`,
};                                                                                                                                                                                      
                
const inputClass =                                                                                                                                                                      
  "peer w-full bg-transparent pb-2.5 pt-1 text-base " +
  "text-white outline-none placeholder:text-white/20 sm:text-sm";                                                                                                                       

const sweepClass =                                                                                                                                                                      
  "pointer-events-none absolute inset-x-0 -bottom-px h-px " +
  "origin-left scale-x-0 transition-transform duration-500 " +                                                                                                                          
  "ease-out peer-focus:scale-x-100";
                                                                                                                                                                                        
/* ── Field label ── */
function FieldLabel({                                                                                                                                                                   
  children,     
  required,                                                                                                                                                                             
  index,
}: {                                                                                                                                                                                    
  children: React.ReactNode;
  required?: boolean;
  index?: string;
}) {
  return (                                                                                                                                                                              
    <div className="mb-1.5 flex items-baseline justify-between">
      <label                                                                                                                                                                            
        className="text-[10px] uppercase tracking-[0.22em]"                                                                                                                             
        style={{ fontFamily: MONO, color: "rgba(255,255,255,0.5)" }}
      >                                                                                                                                                                                 
        {children}
        {required && (                                                                                                                                                                  
          <span className="ml-1" style={{ color: AMBER }}>
            *                                                                                                                                                                           
          </span>
        )}                                                                                                                                                                              
      </label>  
      {index && (
        <span
          className="text-[9px] tabular-nums"
          style={{                                                                                                                                                                      
            fontFamily: MONO,
            color: "rgba(255,255,255,0.22)",                                                                                                                                            
          }}                                                                                                                                                                            
        >
          {index}                                                                                                                                                                       
        </span> 
      )}
    </div>
  );
}

/* ── Underline input ── */                                                                                                                                                             
function UnderlineInput({
  className,                                                                                                                                                                            
  style,        
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (                                                                                                                                                                              
    <div className="relative">
      <input                                                                                                                                                                            
        className={`${inputClass} ${className ?? ""}`}
        style={{ ...underlineBase, ...style }}                                                                                                                                          
        {...props}
      />                                                                                                                                                                                
      <span aria-hidden className={sweepClass} style={sweepStyle} />
    </div>                                                                                                                                                                              
  );
}                                                                                                                                                                                       
                
function UnderlineTextarea({
  className,
  style,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (                                                                                                                                                                              
    <div className="relative">
      <textarea                                                                                                                                                                         
        className={`${inputClass} ${className ?? ""} resize-none`}
        style={{ ...underlineBase, ...style }}                                                                                                                                          
        {...props}
      />                                                                                                                                                                                
      <span aria-hidden className={sweepClass} style={sweepStyle} />
    </div>
  );                                                                                                                                                                                    
}
                                                                                                                                                                                        
/* ── Phone field ── */
function PhoneField({
  name,
  defaultValue,
}: {
  name: string;                                                                                                                                                                         
  defaultValue?: string;
}) {                                                                                                                                                                                    
  return (      
    <div
      className="relative flex items-baseline"
      style={underlineBase}                                                                                                                                                             
    >
      <span                                                                                                                                                                             
        className="pb-2.5 pr-2 text-[12px]"
        style={{                                                                                                                                                                        
          fontFamily: MONO,
          color: "rgba(255,255,255,0.4)",                                                                                                                                               
          letterSpacing: "0.05em",
        }}                                                                                                                                                                              
      >
        +91 /                                                                                                                                                                           
      </span>   
      <input
        name={name}                                                                                                                                                                     
        inputMode="numeric"
        maxLength={10}                                                                                                                                                                  
        defaultValue={defaultValue ?? ""}
        placeholder="10-digit"                                                                                                                                                          
        className={
          "peer min-w-0 flex-1 bg-transparent pb-2.5 text-base " +                                                                                                                      
          "text-white outline-none placeholder:text-white/20 " +                                                                                                                        
          "sm:text-sm"                                                                                                                                                                  
        }                                                                                                                                                                               
      />                                                                                                                                                                                
      <span aria-hidden className={sweepClass} style={sweepStyle} />
    </div>                                                                                                                                                                              
  );
}                                                                                                                                                                                       
                
/* ── Custom select for parent company ── */
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
        className={
          "relative flex w-full items-baseline justify-between " +                                                                                                                      
          "bg-transparent pb-2.5 pt-1 text-left text-base " +
          "text-white sm:text-sm"                                                                                                                                                       
        }       
        style={underlineBase}                                                                                                                                                           
      >         
        <span
          style={{
            color: selected ? "white" : "rgba(255,255,255,0.2)",
          }}                                                                                                                                                                            
        >
          {selected?.name ?? placeholder}                                                                                                                                               
        </span>                                                                                                                                                                         
        <ChevronDown
          className={`ml-2 size-3.5 shrink-0 transition-transform ${                                                                                                                    
            open ? "rotate-180" : ""                                                                                                                                                    
          }`}
          style={{ color: AMBER, opacity: 0.6 }}                                                                                                                                        
        />                                                                                                                                                                              
      </button>
                                                                                                                                                                                        
      {open && (
        <div
          id={id}
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden"                                                                                                                         
          style={{
            background: "#0f0f14",                                                                                                                                                      
            border: "1px solid rgba(255,255,255,0.12)",                                                                                                                                 
            boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
          }}                                                                                                                                                                            
        >       
          <div                                                                                                                                                                          
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}                                                                                                                                                                          
          >
            <input                                                                                                                                                                      
              ref={inputRef}
              type="text"                                                                                                                                                               
              placeholder="search…"
              value={search}                                                                                                                                                            
              onChange={(e) => setSearch(e.target.value)}
              className={
                "w-full bg-transparent px-3 py-2.5 text-[13px] " +                                                                                                                      
                "text-white outline-none placeholder:text-white/25"
              }                                                                                                                                                                         
              style={{ fontFamily: MONO }}
            />                                                                                                                                                                          
          </div>
          <ul className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (                                                                                                                                                  
              <li
                className="px-3 py-2 text-[12px] uppercase tracking-[0.2em]"                                                                                                            
                style={{                                                                                                                                                                
                  fontFamily: MONO,
                  color: "rgba(255,255,255,0.3)",                                                                                                                                       
                }}                                                                                                                                                                      
              >
                no match                                                                                                                                                                
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
                  className="cursor-pointer px-3 py-2 text-[13px] transition-colors"
                  style={                                                                                                                                                               
                    value === c.id
                      ? {                                                                                                                                                               
                          color: AMBER,
                          background: "rgba(245,158,11,0.08)",
                          borderLeft: `2px solid ${AMBER}`,                                                                                                                             
                          paddingLeft: "calc(0.75rem - 2px)",
                        }                                                                                                                                                               
                      : { color: "rgba(255,255,255,0.7)" }
                  }                                                                                                                                                                     
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

/* ── Tax type toggle (pill) ── */                                                                                                                                                      
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
        className="grid grid-cols-2 gap-px"
        style={{                                                                                                                                                                        
          background: "rgba(255,255,255,0.08)",
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
              className="py-2.5 text-[11px] uppercase tracking-[0.28em] transition active:opacity-70"                                                                                   
              style={{                                                                                                                                                                  
                fontFamily: MONO,                                                                                                                                                       
                fontWeight: active ? 700 : 400,                                                                                                                                         
                color: active ? "#0a0a0d" : "rgba(255,255,255,0.5)",                                                                                                                    
                background: active ? AMBER : "#0a0a0d",                                                                                                                                 
              }}                                                                                                                                                                        
            >                                                                                                                                                                           
              {v}
            </button>
          );                                                                                                                                                                            
        })}
      </div>                                                                                                                                                                            
    </>         
  );
}

/* ── Error banner ── */
function ErrorBanner({ error }: { error?: string }) {
  return (                                                                                                                                                                              
    <div
      className="flex items-start gap-3 px-4 py-3 text-[12px]"                                                                                                                          
      style={{                                                                                                                                                                          
        background: "rgba(248,113,113,0.06)",
        borderLeft: "2px solid rgba(248,113,113,0.6)",                                                                                                                                  
        color: "rgba(252,165,165,0.95)",                                                                                                                                                
        fontFamily: MONO,                                                                                                                                                               
        letterSpacing: "0.02em",                                                                                                                                                        
      }}                                                                                                                                                                                
    >           
      <span className="mt-0.5 shrink-0 font-bold">!</span>
      <span className="leading-relaxed uppercase tracking-wider">                                                                                                                       
        {error ?? "Something went wrong"}                                                                                                                                               
      </span>                                                                                                                                                                           
    </div>                                                                                                                                                                              
  );            
}
                                                                                                                                                                                        
/* ── Tab strip ── */
function TabStrip({                                                                                                                                                                     
  active,       
  onChange,
}: {
  active: number;
  onChange: (i: number) => void;                                                                                                                                                        
}) {
  return (                                                                                                                                                                              
    <div        
      className="grid grid-cols-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >                                                                                                                                                                                   
      {SECTIONS.map((s, i) => {
        const isActive = i === active;                                                                                                                                                  
        return (                                                                                                                                                                        
          <button
            key={s.id}                                                                                                                                                                  
            type="button"
            onClick={() => onChange(i)}
            className="relative flex flex-col items-center gap-1 py-3 transition-opacity active:opacity-60"
            aria-current={isActive ? "step" : undefined}                                                                                                                                
          >                                                                                                                                                                             
            <span                                                                                                                                                                       
              className="text-[18px] tabular-nums leading-none"                                                                                                                         
              style={{
                fontFamily: DISPLAY,                                                                                                                                                    
                fontWeight: 400,
                color: isActive ? AMBER : "rgba(255,255,255,0.4)",                                                                                                                      
              }}                                                                                                                                                                        
            >
              {s.index}                                                                                                                                                                 
            </span>
            <span
              className="text-[9px] uppercase tracking-[0.22em]"
              style={{                                                                                                                                                                  
                fontFamily: MONO,
                color: isActive ? AMBER : "rgba(255,255,255,0.4)",                                                                                                                      
              }}                                                                                                                                                                        
            >
              {s.label}                                                                                                                                                                 
            </span>
            {isActive && (
              <>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-3 -bottom-px h-px"                                                                                                    
                  style={{
                    background: AMBER,                                                                                                                                                  
                    boxShadow: `0 0 8px ${AMBER}`,                                                                                                                                      
                  }}
                />                                                                                                                                                                      
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 inset-y-0 -z-0"                                                                                                     
                  style={{                                                                                                                                                              
                    background:                                                                                                                                                         
                      "linear-gradient(180deg, rgba(245,158,11,0.06), transparent 75%)",                                                                                                
                  }}                                                                                                                                                                    
                />
              </>                                                                                                                                                                       
            )}  
          </button>
        );
      })}
    </div>
  );
}

/* ── Section heading ── */                                                                                                                                                             
function SectionHeading({ active }: { active: number }) {
  const s = SECTIONS[active];                                                                                                                                                           
  return (                                                                                                                                                                              
    <div className="space-y-1.5">
      <p                                                                                                                                                                                
        className="text-[10px] uppercase tracking-[0.3em]"
        style={{ fontFamily: MONO, color: AMBER }}                                                                                                                                      
      >
        Step {s.index} / {String(SECTIONS.length).padStart(2, "0")}                                                                                                                     
      </p>                                                                                                                                                                              
      <h2
        className="text-[26px] leading-tight text-white"                                                                                                                                
        style={{                                                                                                                                                                        
          fontFamily: DISPLAY,
          fontWeight: 400,                                                                                                                                                              
          letterSpacing: "-0.01em",                                                                                                                                                     
        }}
      >                                                                                                                                                                                 
        {s.full}
      </h2>
      <p
        className="text-[10px] uppercase tracking-[0.2em]"
        style={{                                                                                                                                                                        
          fontFamily: MONO,
          color: "rgba(255,255,255,0.4)",                                                                                                                                               
        }}      
      >
        {s.desc}
      </p>                                                                                                                                                                              
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
  const [companyId, setCompanyId] = useState(                                                                                                                                           
    initial?.companyId ?? companies[0]?.id ?? "",
  );                                                                                                                                                                                    
  const [taxType, setTaxType] = useState<"GST" | "PAN">(
    initial?.taxIdType ?? "GST",                                                                                                                                                        
  );            
  const [active, setActive] = useState(0);
  const [state, formAction, pending] = useActionState<                                                                                                                                  
    ActionResult | undefined,
    FormData                                                                                                                                                                            
  >(saveRetailer, undefined);
                                                                                                                                                                                        
  const isLast = active === SECTIONS.length - 1;
  const isFirst = active === 0;
                                                                                                                                                                                        
  const next = () =>
    setActive((a) => Math.min(SECTIONS.length - 1, a + 1));                                                                                                                             
  const prev = () => setActive((a) => Math.max(0, a - 1));
                                                                                                                                                                                        
  return (
    <form action={formAction} className="space-y-6 pb-6">                                                                                                                               
      <input type="hidden" name="id" value={initial?.id ?? ""} />
      <input type="hidden" name="_redirect" value={redirectTo} />                                                                                                                       
                                                                                                                                                                                        
      {state?.ok === false && <ErrorBanner error={state.error} />}                                                                                                                      
                                                                                                                                                                                        
      {/* Tab strip */}                                                                                                                                                                 
      <TabStrip active={active} onChange={setActive} />

      <SectionHeading active={active} />                                                                                                                                                

      {/* ── 01 / Parent ── */}                                                                                                                                                         
      <div hidden={active !== 0} className="space-y-6 pt-2">
        <div>                                                                                                                                                                           
          <FieldLabel required index="1.1">
            Company                                                                                                                                                              
          </FieldLabel>
          <CompanySelect                                                                                                                                                                
            name="companyId"                                                                                                                                                            
            value={companyId}
            onChange={setCompanyId}                                                                                                                                                     
            placeholder="Select company…"
            companies={companies}
          />                                                                                                                                                                            
        </div>
      </div>                                                                                                                                                                            
                
      {/* ── 02 / Identity ── */}
      <div hidden={active !== 1} className="space-y-6 pt-2">
        <div>                                                                                                                                                                           
          <FieldLabel index="2.1">Retailer name</FieldLabel>
          <UnderlineInput                                                                                                                                                               
            name="name"
            defaultValue={initial?.name ?? ""}                                                                                                                                          
            placeholder="Retailer / shop name"
          />                                                                                                                                                                            
        </div>  
        <div>                                                                                                                                                                           
          <FieldLabel index="2.2">Address</FieldLabel>
          <UnderlineTextarea                                                                                                                                                            
            name="address"
            rows={2}                                                                                                                                                                    
            defaultValue={initial?.address ?? ""}
            placeholder="Street, area, city…"                                                                                                                                           
          />    
        </div>                                                                                                                                                                          
        <div>
          <FieldLabel index="2.3">Contact person</FieldLabel>                                                                                                                           
          <UnderlineInput
            name="contactPersonName"
            defaultValue={initial?.contactPersonName ?? ""}                                                                                                                             
            placeholder="Person name"
          />                                                                                                                                                                            
        </div>  
      </div>

      {/* ── 03 / Contact ── */}                                                                                                                                                        
      <div hidden={active !== 2} className="space-y-6 pt-2">
        <div>                                                                                                                                                                           
          <FieldLabel required index="3.1">
            Phone no.                                                                                                                                                                   
          </FieldLabel>
          <PhoneField                                                                                                                                                                   
            name="phone"
            defaultValue={initial?.phone ?? ""}
          />
        </div>                                                                                                                                                                          
        <div>
          <FieldLabel index="3.2">Telephone</FieldLabel>                                                                                                                                
          <UnderlineInput
            name="telephone"                                                                                                                                                            
            inputMode="numeric"
            defaultValue={initial?.telephone ?? ""}                                                                                                                                     
            placeholder="Landline / STD"
          />                                                                                                                                                                            
        </div>
        <div>                                                                                                                                                                           
          <FieldLabel index="3.3">Alternative no.</FieldLabel>
          <PhoneField                                                                                                                                                                   
            name="altPhone"
            defaultValue={initial?.altPhone ?? ""}                                                                                                                                      
          />                                                                                                                                                                            
        </div>
      </div>                                                                                                                                                                            
                
      {/* ── 04 / Tax ── */}
      <div hidden={active !== 3} className="space-y-6 pt-2">
        <div>                                                                                                                                                                           
          <FieldLabel required index="4.1">
            Tax ID type                                                                                                                                                                 
          </FieldLabel>
          <TaxTypeToggle value={taxType} onChange={setTaxType} />
        </div>                                                                                                                                                                          
        <div>
          <FieldLabel required index="4.2">                                                                                                                                             
            {taxType === "GST" ? "GST number" : "PAN number"}
          </FieldLabel>                                                                                                                                                                 
          <UnderlineInput
            name="taxId"                                                                                                                                                                
            required
            maxLength={taxType === "GST" ? 15 : 10}
            defaultValue={initial?.taxId ?? ""}                                                                                                                                         
            placeholder={
              taxType === "GST"                                                                                                                                                         
                ? "15-character GSTIN"
                : "10-character PAN"                                                                                                                                                    
            }                                                                                                                                                                           
            style={{ textTransform: "uppercase" }}
          />                                                                                                                                                                            
        </div>  
      </div>
                                                                                                                                                                                        
      {/* Prev / Next */}
      <div                                                                                                                                                                              
        className="flex items-center justify-between pt-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}                                                                                                                       
      >
        <button                                                                                                                                                                         
          type="button"
          onClick={prev}
          disabled={isFirst}
          className="px-2 py-2 text-[10px] uppercase tracking-[0.25em] transition active:opacity-60 disabled:opacity-25"                                                                
          style={{                                                                                                                                                                      
            fontFamily: MONO,                                                                                                                                                           
            color: "rgba(255,255,255,0.6)",                                                                                                                                             
          }}                                                                                                                                                                            
        >
          ← Previous                                                                                                                                                                    
        </button>
        <span
          className="text-[10px] tabular-nums"
          style={{                                                                                                                                                                      
            fontFamily: MONO,
            color: "rgba(255,255,255,0.3)",                                                                                                                                             
          }}    
        >
          {SECTIONS[active].index} / 04                                                                                                                                                 
        </span>
        <button                                                                                                                                                                         
          type="button"
          onClick={next}
          disabled={isLast}                                                                                                                                                             
          className="px-2 py-2 text-[10px] uppercase tracking-[0.25em] transition active:opacity-60 disabled:opacity-25"
          style={{                                                                                                                                                                      
            fontFamily: MONO,                                                                                                                                                           
            color: isLast ? "rgba(255,255,255,0.3)" : AMBER,
          }}                                                                                                                                                                            
        >       
          Next →
        </button>                                                                                                                                                                       
      </div>
                                                                                                                                                                                        
      {/* Save */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}                                                                                                                                                            
          className={
            "group relative flex w-full items-center justify-between " +                                                                                                                
            "overflow-hidden px-5 py-4 transition active:scale-[0.99] " +                                                                                                               
            "disabled:opacity-50"                                                                                                                                                       
          }                                                                                                                                                                             
          style={{                                                                                                                                                                      
            background: AMBER,
            color: "#0a0a0d",
            boxShadow:                                                                                                                                                                  
              "0 14px 36px -12px rgba(245,158,11,0.55), " +
              "inset 0 1px 0 rgba(255,255,255,0.3)",                                                                                                                                    
          }}    
        >                                                                                                                                                                               
          <span 
            className="text-[11px] font-bold uppercase tracking-[0.28em]"                                                                                                               
            style={{ fontFamily: MONO }}
          >                                                                                                                                                                             
            {pending
              ? "Saving"                                                                                                                                                                
              : initial
                ? "Update entry"
                : "Save entry"}
          </span>                                                                                                                                                                       
          <span className="text-base">
            {pending ? (                                                                                                                                                                
              <span className="inline-flex gap-1">
                <span                                                                                                                                                                   
                  className="size-1 animate-pulse rounded-full"
                  style={{ background: "#0a0a0d" }}                                                                                                                                     
                />                                                                                                                                                                      
                <span
                  className="size-1 animate-pulse rounded-full"                                                                                                                         
                  style={{
                    background: "#0a0a0d",
                    animationDelay: "200ms",                                                                                                                                            
                  }}
                />                                                                                                                                                                      
                <span
                  className="size-1 animate-pulse rounded-full"
                  style={{
                    background: "#0a0a0d",                                                                                                                                              
                    animationDelay: "400ms",
                  }}                                                                                                                                                                    
                />
              </span>
            ) : (
              <span className="transition-transform group-hover:translate-x-1">
                →                                                                                                                                                                       
              </span>
            )}                                                                                                                                                                          
          </span>
        </button>
      </div>
    </form>
  );
}                                                                                                                                                                                       

function ChevronDown({                                                                                                                                                                  
  className,    
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg                                                                                                                                                                                
      className={className}
      style={style}                                                                                                                                                                     
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"                                                                                                                                                             
      strokeLinejoin="round"
      aria-hidden                                                                                                                                                                       
    >           
      <path d="m6 9 6 6 6-6" />
    </svg>                                                                                                                                                                              
  );
} 