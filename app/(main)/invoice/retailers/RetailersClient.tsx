"use client";

  import Link from "next/link";                                                                                                                                                           
  import { useState } from "react";
  import { RetailerCard } from "@/app/(main)/invoice/_components/RetailerCard";                                                                                                           
  import type { EnrichedRetailer } from "./page";                                                                                                                                         
   
  const AMBER = "rgb(245,158,11)";                                                                                                                                                        
  const MONO = "var(--font-mono)";
  const DISPLAY = "var(--font-display)";                                                                                                                                                  
                                                                                                                                                                                          
  const inr = new Intl.NumberFormat("en-IN", {
    style: "currency",                                                                                                                                                                    
    currency: "INR",
    minimumFractionDigits: 0,                                                                                                                                                             
    maximumFractionDigits: 0,
  });                                                                                                                                                                                     
                  
  export function RetailersClient({
    retailers,
    hasCompanies,
  }: {
    retailers: EnrichedRetailer[];                                                                                                                                                        
    hasCompanies: boolean;
  }) {                                                                                                                                                                                    
    const [query, setQuery] = useState("");

    const filtered = retailers.filter((r) => {                                                                                                                                            
      const q = query.toLowerCase().trim();
      if (!q) return true;                                                                                                                                                                
      return (    
        r.name.toLowerCase().includes(q) ||
        (r.companyName ?? "").toLowerCase().includes(q) ||                                                                                                                                
        r.taxId.toLowerCase().includes(q) ||
        r.phone.includes(q)                                                                                                                                                               
      );                                                                                                                                                                                  
    });
                                                                                                                                                                                          
    const totalBillsAll = filtered.reduce(
      (s, r) => s + r.invoiceCount,
      0,                                                                                                                                                                                  
    );
    const totalBilledAll = filtered.reduce(                                                                                                                                               
      (s, r) => s + r.totalBilled,
      0,
    );                                                                                                                                                                                    
   
    return (                                                                                                                                                                              
      <div className="mx-auto max-w-5xl space-y-6 pb-28 pt-1 lg:pb-6">
        {/* Header */}                                                                                                                                                                    
        <header className="flex items-baseline justify-between gap-4">
          <div>                                                                                                                                                                           
            <p    
              className="text-[10px] uppercase tracking-[0.3em]"                                                                                                                          
              style={{                                                                                                                                                                    
                fontFamily: MONO,
                color: "rgba(255,255,255,0.4)",                                                                                                                                           
              }}  
            >
              Register                                                                                                                                                                    
            </p>
            <h1                                                                                                                                                                           
              className="mt-1 text-[24px] leading-none text-white"
              style={{
                fontFamily: DISPLAY,                                                                                                                                                      
                fontWeight: 400,
                letterSpacing: "-0.01em",                                                                                                                                                 
              }}  
            >
              Retailers                                                                                                                                                                   
            </h1>
          </div>                                                                                                                                                                          
          <span   
            className="text-[10px] uppercase tracking-[0.25em] tabular-nums"
            style={{                                                                                                                                                                      
              fontFamily: MONO,
              color: "rgba(255,255,255,0.4)",                                                                                                                                             
            }}    
          >
            {String(retailers.length).padStart(2, "0")} entries
          </span>                                                                                                                                                                         
        </header>
                                                                                                                                                                                          
        {/* Search */}
        {retailers.length > 0 && (
          <div className="relative">                                                                                                                                                      
            <SearchIcon
              className="pointer-events-none absolute left-0 top-1/2 size-3.5 -translate-y-1/2"                                                                                           
              style={{ color: "rgba(255,255,255,0.35)" }}                                                                                                                                 
            />                                                                                                                                                                            
            <input                                                                                                                                                                        
              type="search"                                                                                                                                                               
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, parent, GST/PAN, phone…"
              className="w-full bg-transparent py-2.5 pl-7 pr-12 text-base text-white outline-none placeholder:text-white/25 sm:text-sm"                                                  
              style={{                                                                                                                                                                    
                borderBottom: "1px solid rgba(255,255,255,0.12)",                                                                                                                         
              }}                                                                                                                                                                          
            />    
            {query && (                                                                                                                                                                   
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] uppercase tracking-[0.2em]"                                                                    
                style={{                                                                                                                                                                  
                  fontFamily: MONO,                                                                                                                                                       
                  color: "rgba(255,255,255,0.45)",                                                                                                                                        
                }}
                aria-label="Clear"
              >                                                                                                                                                                           
                Clear
              </button>                                                                                                                                                                   
            )}    
          </div>
        )}

        {/* Search summary */}
        {query && (
          <div className="flex items-baseline justify-between">                                                                                                                           
            <span
              className="text-[10px] uppercase tracking-[0.25em]"                                                                                                                         
              style={{                                                                                                                                                                    
                fontFamily: MONO,
                color: "rgba(255,255,255,0.4)",                                                                                                                                           
              }}  
            >
              Match
            </span>                                                                                                                                                                       
            <span
              className="text-[10px] uppercase tracking-[0.25em] tabular-nums"                                                                                                            
              style={{ fontFamily: MONO, color: AMBER }}
            >                                                                                                                                                                             
              {filtered.length} / {retailers.length}
            </span>                                                                                                                                                                       
          </div>  
        )}

        {/* Empty register */}                                                                                                                                                            
        {retailers.length === 0 ? (
          <div                                                                                                                                                                            
            className="px-6 py-12 text-center"
            style={{ border: "1px dashed rgba(255,255,255,0.12)" }}                                                                                                                       
          >
            <p                                                                                                                                                                            
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ fontFamily: MONO, color: AMBER }}                                                                                                                                  
            >
              ∎ Empty register                                                                                                                                                            
            </p>                                                                                                                                                                          
            <p
              className="mt-3 text-[20px] leading-tight text-white"                                                                                                                       
              style={{ fontFamily: DISPLAY, fontWeight: 400 }}                                                                                                                            
            >
              No retailers yet.                                                                                                                                                           
            </p>                                                                                                                                                                          
            <p
              className="mt-2 text-[10px] uppercase tracking-[0.2em]"                                                                                                                     
              style={{
                fontFamily: MONO,
                color: "rgba(255,255,255,0.4)",                                                                                                                                           
              }}
            >                                                                                                                                                                             
              {hasCompanies
                ? "Register your first retailer to begin."
                : "Add a company first, then a retailer."}                                                                                                                                
            </p>                                                                                                                                                                          
            {hasCompanies && (                                                                                                                                                            
              <Link                                                                                                                                                                       
                href="/invoice/retailers/new?returnTo=%2Finvoice%2Fretailers"
                className="mt-6 inline-flex items-center gap-2 px-4 py-3 transition active:scale-[0.97]"                                                                                  
                style={{
                  background: AMBER,                                                                                                                                                      
                  color: "#0a0a0d",                                                                                                                                                       
                  fontFamily: MONO,
                }}                                                                                                                                                                        
              >   
                <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
                  Add retailer                                                                                                                                                            
                </span>
                <span className="text-[12px]">→</span>                                                                                                                                    
              </Link>
            )}
          </div>
        ) : filtered.length === 0 ? (
          /* No match */                                                                                                                                                                  
          <div
            className="px-4 py-8 text-center"                                                                                                                                             
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",                                                                                                                              
            }}
          >                                                                                                                                                                               
            <p    
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{                                                                                                                                                                    
                fontFamily: MONO,
                color: "rgba(255,255,255,0.4)",                                                                                                                                           
              }}  
            >
              No match for &ldquo;{query}&rdquo;
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
              <div className="flex items-baseline gap-4">                                                                                                                                 
                <span
                  className="text-[9px] uppercase tracking-[0.25em]"
                  style={{                                                                                                                                                                
                    fontFamily: MONO,
                    color: "rgba(255,255,255,0.35)",                                                                                                                                      
                  }}                                                                                                                                                                      
                >
                  Subtotal                                                                                                                                                                
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.2em] tabular-nums"
                  style={{                                                                                                                                                                
                    fontFamily: MONO,
                    color: "rgba(255,255,255,0.55)",                                                                                                                                      
                  }}
                >
                  {totalBillsAll} bills
                </span>                                                                                                                                                                   
              </div>
              <span                                                                                                                                                                       
                className="text-[13px] tabular-nums"
                style={{ fontFamily: MONO, color: AMBER }}
              >                                                                                                                                                                           
                {inr.format(totalBilledAll)}
              </span>                                                                                                                                                                     
            </div>

            {/* Grid */}                                                                                                                                                                  
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((r) => (                                                                                                                                                      
                <RetailerCard                                                                                                                                                             
                  key={r.id}
                  id={r.id}                                                                                                                                                               
                  name={r.name}
                  companyName={r.companyName}
                  taxIdType={r.taxIdType}
                  invoiceCount={r.invoiceCount}                                                                                                                                           
                  totalBilled={r.totalBilled}
                />                                                                                                                                                                        
              ))} 
            </div>

            {/* End stamp */}                                                                                                                                                             
            <p
              className="pt-2 text-center text-[9px] uppercase tracking-[0.3em]"                                                                                                          
              style={{
                fontFamily: MONO,                                                                                                                                                         
                color: "rgba(255,255,255,0.22)",
              }}                                                                                                                                                                          
            >     
              end of register · {filtered.length} of {retailers.length}
            </p>                                                                                                                                                                          
          </>
        )}                                                                                                                                                                                
                  
        {/* Mobile FAB */}
        {hasCompanies && (
          <Link
            href="/invoice/retailers/new?returnTo=%2Finvoice%2Fretailers"
            className="fixed bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-3 transition active:scale-[0.97] lg:hidden"                                                           
            style={{                                                                                                                                                                      
              background: AMBER,                                                                                                                                                          
              color: "#0a0a0d",                                                                                                                                                           
              fontFamily: MONO,
              boxShadow:                                                                                                                                                                  
                "0 14px 36px -12px rgba(245,158,11,0.55), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}                                                                                                                                                                            
            aria-label="Add retailer"
          >                                                                                                                                                                               
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
              New entry
            </span>
            <span className="text-[12px]">→</span>                                                                                                                                        
          </Link>
        )}                                                                                                                                                                                
                  
        {/* Desktop add */}
        {hasCompanies && (
          <Link
            href="/invoice/retailers/new?returnTo=%2Finvoice%2Fretailers"                                                                                                                 
            className="fixed bottom-6 right-6 z-40 hidden items-center gap-2 px-4 py-3 transition active:scale-[0.97] lg:inline-flex"
            style={{                                                                                                                                                                      
              background: AMBER,
              color: "#0a0a0d",                                                                                                                                                           
              fontFamily: MONO,                                                                                                                                                           
            }}
          >                                                                                                                                                                               
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
              New entry
            </span>                                                                                                                                                                       
            <span className="text-[12px]">→</span>
          </Link>                                                                                                                                                                         
        )}        
      </div>
    );
  }

  function SearchIcon({                                                                                                                                                                   
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
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"                                                                                                                                                            
        aria-hidden
      >                                                                                                                                                                                   
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />                                                                                                                                                     
      </svg>
    );                                                                                                                                                                                    
  }