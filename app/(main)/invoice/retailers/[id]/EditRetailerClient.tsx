"use client";                                                                                                                                                                           
                  
import Link from "next/link";
import { useState } from "react";
import { RetailerForm } from "@/app/(main)/invoice/_components/RetailerForm";
import type { Company, Retailer } from "@/lib/store/types";                                                                                                                             
                                                                                                                                                                                        
const AMBER = "rgb(245,158,11)";                                                                                                                                                        
const MONO = "var(--font-mono)";                                                                                                                                                        
const DISPLAY = "var(--font-display)";                                                                                                                                                  
                
const inr = new Intl.NumberFormat("en-IN", {                                                                                                                                            
  style: "currency",
  currency: "INR",                                                                                                                                                                      
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});                                                                                                                                                                                     
 
type AnyInvoice = {                                                                                                                                                                     
  id: string;   
  invoiceNumber?: string;
  date?: string;                                                                                                                                                                        
  invoiceAmount: number;
};                                                                                                                                                                                      
type AnyPayment = {
  id: string;
  date?: string;
  amount: number;
};                                                                                                                                                                                      
type AnyCreditNote = {
  id: string;                                                                                                                                                                           
  date?: string;
  amount: number;
  noteNumber?: string;
};                                                                                                                                                                                      
 
const TABS = [                                                                                                                                                                          
  { id: "retailer", label: "Retailer", index: "01" },
  { id: "invoices", label: "Invoices", index: "02" },                                                                                                                                   
  { id: "credit",   label: "Credit",   index: "03" },
  { id: "payments", label: "Payments", index: "04" },                                                                                                                                   
] as const;     
                                                                                                                                                                                        
type TabId = (typeof TABS)[number]["id"];

export function EditRetailerClient({                                                                                                                                                    
  retailer,
  companies,                                                                                                                                                                            
  redirectTo,   
  invoices,
  payments,
  creditNotes,
}: {
  retailer: Retailer;
  companies: Company[];
  redirectTo: string;                                                                                                                                                                   
  invoices: AnyInvoice[];
  payments: AnyPayment[];                                                                                                                                                               
  creditNotes: AnyCreditNote[];
}) {                                                                                                                                                                                    
  const [active, setActive] = useState<TabId>("retailer");
                                                                                                                                                                                        
  const counts: Record<TabId, number> = {
    retailer: 0,
    invoices: invoices.length,                                                                                                                                                          
    credit: creditNotes.length,
    payments: payments.length,                                                                                                                                                          
  };            

  return (                                                                                                                                                                              
    <div className="mx-auto max-w-3xl space-y-6 pb-6">
      {/* Back */}                                                                                                                                                                      
      <Link     
        href="/invoice/retailers"
        className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] transition active:opacity-70"                                                               
        style={{ fontFamily: MONO, color: "rgba(255,255,255,0.5)" }}
      >                                                                                                                                                                                 
        <span style={{ color: AMBER }}>←</span>
        <span>Retailers</span>                                                                                                                                                          
      </Link>                                                                                                                                                                           
 
      {/* Heading */}                                                                                                                                                                   
      <header>  
        <p
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{ fontFamily: MONO, color: AMBER }}
        >                                                                                                                                                                               
          Update entry
        </p>                                                                                                                                                                            
        <h1     
          className="mt-1 text-[28px] leading-none text-white"
          style={{
            fontFamily: DISPLAY,                                                                                                                                                        
            fontWeight: 400,
            letterSpacing: "-0.01em",                                                                                                                                                   
          }}    
        >
          {retailer.name}
        </h1>
      </header>                                                                                                                                                                         
 
     {/* Tab strip — single row */}                                                                                                                                                          
  <div                                                                                                                                                                                    
    className="grid grid-cols-4"                                                                                                                                                          
    style={{                                                                                                                                                                              
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    {TABS.map((t) => {                                                                                                                                                                    
      const isActive = active === t.id;
      const count = counts[t.id];                                                                                                                                                         
      const showCount = t.id !== "retailer";
      return (                                                                                                                                                                            
        <button
          key={t.id}                                                                                                                                                                      
          type="button"
          onClick={() => setActive(t.id)}
          className="relative flex items-baseline justify-center gap-1.5 py-3 transition-opacity active:opacity-60"                                                                       
          aria-current={isActive ? "page" : undefined}
          style={{                                                                                                                                                                        
            fontFamily: MONO,
            color: isActive ? AMBER : "rgba(255,255,255,0.45)",                                                                                                                           
          }}                                                                                                                                                                              
        >
          <span className="text-[10px] uppercase tracking-[0.22em]">                                                                                                                      
            {t.label}
          </span>
          {showCount && (
            <span
              className="text-[9px] tabular-nums"
              style={{                                                                                                                                                                    
                color: isActive
                  ? AMBER                                                                                                                                                                 
                  : "rgba(255,255,255,0.3)",
              }}                                                                                                                                                                          
            >
              {String(count).padStart(2, "0")}                                                                                                                                            
            </span>
          )}
          {isActive && (
            <>
              <span                                                                                                                                                                       
                aria-hidden
                className="pointer-events-none absolute inset-x-4 -bottom-px h-px"                                                                                                        
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

      {/* ── Tab content ── */}                                                                                                                                                         
      {active === "retailer" && (
        <RetailerForm                                                                                                                                                                   
          companies={companies}
          initial={retailer}
          redirectTo={redirectTo}
        />
      )}
                                                                                                                                                                                        
      {active === "invoices" && (
        <RelatedList                                                                                                                                                                    
          title="Invoices"
          items={invoices.map((i) => ({
            id: i.id,                                                                                                                                                                   
            label: i.invoiceNumber
              ? `Inv #${i.invoiceNumber}`                                                                                                                                               
              : `Invoice`,                                                                                                                                                              
            sub: i.date,
            amount: i.invoiceAmount,                                                                                                                                                    
          }))}  
          emptyText="No invoices for this retailer."
          openHref={(id) =>
            `/invoice/invoices/${id}?returnTo=${encodeURIComponent(`/invoice/retailers/${retailer.id}`)}`
          }
          newHref={`/invoice/invoices/new?retailerId=${retailer.id}&returnTo=${encodeURIComponent(`/invoice/retailers/${retailer.id}`)}`}                                               
          newLabel="New invoice"                                                                                                                                                        
        />                                                                                                                                                                              
      )}                                                                                                                                                                                
                
      {active === "credit" && (
        <RelatedList
          title="Credit notes"
          items={creditNotes.map((cn) => ({                                                                                                                                             
            id: cn.id,
            label: cn.noteNumber ? `CN #${cn.noteNumber}` : "Credit note",                                                                                                              
            sub: cn.date,                                                                                                                                                               
            amount: cn.amount,
          }))}                                                                                                                                                                          
          emptyText="No credit notes for this retailer."
          openHref={(id) => `/invoice/credit-notes/${id}`}                                                                                                                              
          newHref={`/invoice/credit-notes/new?retailerId=${retailer.id}&returnTo=${encodeURIComponent(`/invoice/retailers/${retailer.id}`)}`}
          newLabel="New credit note"                                                                                                                                                    
        />      
      )}                                                                                                                                                                                
                
      {active === "payments" && (                                                                                                                                                       
        <RelatedList
          title="Payments"                                                                                                                                                              
          items={payments.map((p) => ({
            id: p.id,
            label: "Payment",
            sub: p.date,
            amount: p.amount,
          }))}                                                                                                                                                                          
          emptyText="No payments recorded."
          openHref={(id) => `/invoice/payments/${id}`}                                                                                                                                  
          newHref={`/invoice/payments/new?retailerId=${retailer.id}&returnTo=${encodeURIComponent(`/invoice/retailers/${retailer.id}`)}`}
          newLabel="Record payment"                                                                                                                                                     
        />                                                                                                                                                                              
      )}                                                                                                                                                                                
    </div>                                                                                                                                                                              
  );            
}

/* ── Related list (used for invoices / credit notes / payments) ── */                                                                                                                  
type ListItem = {
  id: string;                                                                                                                                                                           
  label: string;
  sub?: string;
  amount: number;                                                                                                                                                                       
};
                                                                                                                                                                                        
function RelatedList({
  title,
  items,
  emptyText,
  openHref,
  newHref,
  newLabel,
}: {
  title: string;
  items: ListItem[];
  emptyText: string;                                                                                                                                                                    
  openHref: (id: string) => string;
  newHref: string;                                                                                                                                                                      
  newLabel: string;
}) {
  const total = items.reduce((s, x) => s + x.amount, 0);
                                                                                                                                                                                        
  return (
    <section className="space-y-4">                                                                                                                                                     
      {/* Header + add */}
      <div className="flex items-baseline justify-between">                                                                                                                             
        <p
          className="text-[10px] uppercase tracking-[0.3em]"                                                                                                                            
          style={{                                                                                                                                                                      
            fontFamily: MONO,
            color: "rgba(255,255,255,0.55)",                                                                                                                                            
          }}    
        >
          {title}                                                                                                                                                                       
        </p>
        <Link                                                                                                                                                                           
          href={newHref}
          className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-[0.22em] transition active:opacity-70"
          style={{ fontFamily: MONO, color: AMBER }}                                                                                                                                    
        >
          + {newLabel}                                                                                                                                                                  
        </Link> 
      </div>                                                                                                                                                                            
                
      {items.length === 0 ? (
        <div
          className="px-4 py-8 text-center"
          style={{ border: "1px dashed rgba(255,255,255,0.1)" }}                                                                                                                        
        >
          <p                                                                                                                                                                            
            className="text-[10px] uppercase tracking-[0.25em]"
            style={{                                                                                                                                                                    
              fontFamily: MONO,
              color: "rgba(255,255,255,0.4)",                                                                                                                                           
            }}  
          >
            {emptyText}
          </p>
        </div>                                                                                                                                                                          
      ) : (
        <>                                                                                                                                                                              
          {/* Subtotal */}
          <div
            className="flex items-baseline justify-between gap-4 py-2"
            style={{                                                                                                                                                                    
              borderTop: "1px solid rgba(255,255,255,0.08)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",                                                                                                                         
            }}  
          >                                                                                                                                                                             
            <span                                                                                                                                                                       
              className="text-[9px] uppercase tracking-[0.25em]"
              style={{                                                                                                                                                                  
                fontFamily: MONO,
                color: "rgba(255,255,255,0.4)",
              }}                                                                                                                                                                        
            >
              {String(items.length).padStart(2, "0")} {title.toLowerCase()}                                                                                                             
            </span>                                                                                                                                                                     
            <span
              className="text-[13px] tabular-nums"                                                                                                                                      
              style={{ fontFamily: MONO, color: AMBER }}
            >                                                                                                                                                                           
              {inr.format(total)}
            </span>                                                                                                                                                                     
          </div>

          {/* Rows */}
          <ul style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {items.map((item, i) => (                                                                                                                                                   
              <li
                key={item.id}                                                                                                                                                           
                style={{                                                                                                                                                                
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}                                                                                                                                                                      
              > 
                <Link
                  href={openHref(item.id)}
                  className="flex items-baseline justify-between gap-3 py-3 transition-opacity active:opacity-70"                                                                       
                >                                                                                                                                                                       
                  <div className="flex min-w-0 items-baseline gap-3">                                                                                                                   
                    <span                                                                                                                                                               
                      className="w-6 shrink-0 text-[10px] tabular-nums"
                      style={{                                                                                                                                                          
                        fontFamily: MONO,                                                                                                                                               
                        color: "rgba(255,255,255,0.3)",
                      }}                                                                                                                                                                
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>                                                                                                                                                             
                    <div className="min-w-0">
                      <p className="truncate text-[13px] text-white">                                                                                                                   
                        {item.label}                                                                                                                                                    
                      </p>
                      {item.sub && (                                                                                                                                                    
                        <p
                          className="mt-0.5 text-[10px] uppercase tracking-[0.18em]"
                          style={{                                                                                                                                                      
                            fontFamily: MONO,
                            color: "rgba(255,255,255,0.4)",                                                                                                                             
                          }}
                        >
                          {item.sub}
                        </p>                                                                                                                                                            
                      )}
                    </div>                                                                                                                                                              
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span
                      className="text-[13px] tabular-nums"                                                                                                                              
                      style={{ fontFamily: MONO, color: AMBER }}
                    >                                                                                                                                                                   
                      {inr.format(item.amount)}
                    </span>
                    <span                                                                                                                                                               
                      className="text-[12px]"
                      style={{ color: AMBER, opacity: 0.5 }}                                                                                                                            
                    >                                                                                                                                                                   
                      →
                    </span>                                                                                                                                                             
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>                                                                                                                                                                             
      )}
    </section>                                                                                                                                                                          
  );            
}