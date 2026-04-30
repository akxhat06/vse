"use client";
                                                                                                                                                                                          
import Link from "next/link";
import { useState } from "react";
import { DeleteEntityButton } from "@/app/(main)/invoice/_components/DeleteEntityButton";                                                                                               
import { deleteCompany } from "@/app/(main)/invoice/store-actions";                                                                                                                     
import type { CompanyWithStats } from "../page";                                                                                                                                        
                                                                                                                                                                                        
const AMBER = "rgb(245,158,11)";                                                                                                                                                        
const MONO = "var(--font-mono)";                                                                                                                                                        
const DISPLAY = "var(--font-display)";                                                                                                                                                  
                                                                                                                                                                                        
function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {                                                                                                                                               
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,                                                                                                                                                           
    maximumFractionDigits: 0,
  }).format(n);                                                                                                                                                                         
}               

export function CompaniesClient({                                                                                                                                                       
  companies,
}: {                                                                                                                                                                                    
  companies: CompanyWithStats[];
}) {
  const [query, setQuery] = useState("");
                                                                                                                                                                                        
  const filtered = companies.filter((c) => {
    const q = query.toLowerCase().trim();                                                                                                                                               
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.gstNumber.toLowerCase().includes(q) ||                                                                                                                                          
      c.phone.includes(q) ||
      (c.city ?? "").toLowerCase().includes(q) ||                                                                                                                                       
      (c.state ?? "").toLowerCase().includes(q) ||                                                                                                                                      
      (c.email ?? "").toLowerCase().includes(q)
    );                                                                                                                                                                                  
  });           
                                                                                                                                                                                        
  const totalBilledAll = filtered.reduce(                                                                                                                                               
    (s, c) => s + (c.totalBilled ?? 0),
    0,                                                                                                                                                                                  
  );            
  const totalBillsAll = filtered.reduce(
    (s, c) => s + (c.invoiceCount ?? 0),                                                                                                                                                
    0,
  );                                                                                                                                                                                    
                
  return (
    <div className="space-y-6 pb-28 pt-1 lg:pb-6">
      {/* ── Page heading ── */}                                                                                                                                                        
      <header className="flex items-baseline justify-between gap-4">
        <div>                                                                                                                                                                           
          <p    
            className="text-[10px] uppercase tracking-[0.3em]"                                                                                                                          
            style={{ fontFamily: MONO, color: "rgba(255,255,255,0.4)" }}                                                                                                                
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
            Companies
          </h1>
        </div>
        <span                                                                                                                                                                           
          className="text-[10px] uppercase tracking-[0.25em] tabular-nums"
          style={{ fontFamily: MONO, color: "rgba(255,255,255,0.4)" }}                                                                                                                  
        >                                                                                                                                                                               
          {String(companies.length).padStart(2, "0")} entries
        </span>                                                                                                                                                                         
      </header> 
                                                                                                                                                                                        
      {/* ── Search ── */}
      <div className="relative">
        <SearchIcon
          className="pointer-events-none absolute left-0 top-1/2 size-3.5 -translate-y-1/2"
          style={{ color: "rgba(255,255,255,0.35)" }}                                                                                                                                   
        />                                                                                                                                                                              
        <input                                                                                                                                                                          
          type="search"                                                                                                                                                                 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, GST, city…"
          className="w-full bg-transparent py-2.5 pl-7 pr-9 text-base text-white outline-none placeholder:text-white/25 sm:text-sm"                                                     
          style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}                                                                                                                  
        />                                                                                                                                                                              
        {query && (                                                                                                                                                                     
          <button
            type="button"                                                                                                                                                               
            onClick={() => setQuery("")}
            className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] uppercase tracking-[0.2em]"
            style={{ fontFamily: MONO, color: "rgba(255,255,255,0.45)" }}                                                                                                               
            aria-label="Clear"
          >                                                                                                                                                                             
            Clear
          </button>                                                                                                                                                                     
        )}      
      </div>

      {/* ── Search summary (only while filtering) ── */}                                                                                                                               
      {query && (
        <div                                                                                                                                                                            
          className="flex items-baseline justify-between"
          style={{
            paddingTop: "0.25rem",                                                                                                                                                      
          }}
        >                                                                                                                                                                               
          <span 
            className="text-[10px] uppercase tracking-[0.25em]"
            style={{ fontFamily: MONO, color: "rgba(255,255,255,0.4)" }}                                                                                                                
          >
            Match                                                                                                                                                                       
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.25em] tabular-nums"                                                                                                            
            style={{ fontFamily: MONO, color: AMBER }}
          >                                                                                                                                                                             
            {filtered.length} / {companies.length}
          </span>                                                                                                                                                                       
        </div>  
      )}

      {/* ── Empty state (no companies at all) ── */}                                                                                                                                   
      {companies.length === 0 ? (
        <EmptyStamp />                                                                                                                                                                  
      ) : filtered.length === 0 ? (                                                                                                                                                     
        <NoMatch query={query} />
      ) : (                                                                                                                                                                             
        <>                                                                                                                                                                              
          {/* ── Subtotal strip (mono) ── */}
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
                style={{ fontFamily: MONO, color: "rgba(255,255,255,0.35)" }}                                                                                                           
              >
                Subtotal                                                                                                                                                                
              </span>
              <span
                className="text-[10px] uppercase tracking-[0.2em] tabular-nums"
                style={{ fontFamily: MONO, color: "rgba(255,255,255,0.55)" }}                                                                                                           
              >                                                                                                                                                                         
                {totalBillsAll} bills                                                                                                                                                   
              </span>                                                                                                                                                                   
            </div>
            <span
              className="text-[13px] tabular-nums"
              style={{ fontFamily: MONO, color: AMBER }}                                                                                                                                
            >
              {formatInr(totalBilledAll)}                                                                                                                                               
            </span>
          </div>                                                                                                                                                                        
 
          {/* ── Register rows ── */}                                                                                                                                                   
          <ul>  
            {filtered.map((c, i) => (
              <li                                                                                                                                                                       
                key={c.id}
                className="relative flex items-stretch"                                                                                                                                 
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}                                                                                                                                                                      
              >
                <Link                                                                                                                                                                   
                  href={`/invoice/companies/${c.id}`}
                  className="group flex flex-1 min-w-0 items-start gap-3 py-3 pr-2 transition-opacity active:opacity-70"                                                                
                >                                                                                                                                                                       
                  {/* Index */}                                                                                                                                                         
                  <span                                                                                                                                                                 
                    className="w-6 shrink-0 pt-0.5 text-[10px] tabular-nums"
                    style={{                                                                                                                                                            
                      fontFamily: MONO,                                                                                                                                                 
                      color: "rgba(255,255,255,0.3)",
                    }}                                                                                                                                                                  
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>                                                                                                                                                               
 
                  {/* Initial */}                                                                                                                                                       
                  <span
                    className="flex size-7 shrink-0 items-center justify-center text-[11px] font-medium"
                    style={{                                                                                                                                                            
                      fontFamily: MONO,
                      color: AMBER,                                                                                                                                                     
                      background: "rgba(245,158,11,0.08)",
                      border: `1px solid ${AMBER}40`,                                                                                                                                   
                    }}
                  >                                                                                                                                                                     
                    {c.name.charAt(0).toUpperCase()}
                  </span>                                                                                                                                                               
                
                  {/* Name + meta */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] leading-tight text-white">                                                                                                       
                      {c.name}                                                                                                                                                          
                    </p>                                                                                                                                                                
                    <p                                                                                                                                                                  
                      className="mt-1 truncate text-[10px] uppercase tracking-[0.15em]"
                      style={{                                                                                                                                                          
                        fontFamily: MONO,
                        color: "rgba(255,255,255,0.4)",                                                                                                                                 
                      }}
                    >
                      <span>{c.gstNumber || "no gst"}</span>                                                                                                                            
                      {(c.city || c.state) && (
                        <>                                                                                                                                                              
                          {" · "}
                          <span>                                                                                                                                                        
                            {[c.city, c.state]
                              .filter(Boolean)
                              .join(", ")}                                                                                                                                              
                          </span>
                        </>                                                                                                                                                             
                      )}
                    </p>
                  </div>

                  {/* Amount + bills */}                                                                                                                                                
                  <div className="shrink-0 text-right">
                    <p                                                                                                                                                                  
                      className="text-[14px] tabular-nums leading-tight"
                      style={{                                                                                                                                                          
                        fontFamily: MONO,
                        color:                                                                                                                                                          
                          c.invoiceCount > 0
                            ? AMBER
                            : "rgba(255,255,255,0.3)",                                                                                                                                  
                      }}
                    >                                                                                                                                                                   
                      {c.invoiceCount > 0
                        ? formatInr(c.totalBilled)
                        : "—"}                                                                                                                                                          
                    </p>
                    <p                                                                                                                                                                  
                      className="mt-1 text-[9px] uppercase tracking-[0.2em] tabular-nums"
                      style={{                                                                                                                                                          
                        fontFamily: MONO,
                        color: "rgba(255,255,255,0.4)",                                                                                                                                 
                      }}
                    >
                      {c.invoiceCount} bill                                                                                                                                             
                      {c.invoiceCount !== 1 ? "s" : ""}
                    </p>                                                                                                                                                                
                  </div>
                </Link>
                                                                                                                                                                                        
                {/* Delete (separate from row link) */}
                <div className="flex items-center pl-1 pr-1">                                                                                                                           
                  <DeleteEntityButton                                                                                                                                                   
                    id={c.id}
                    onDelete={deleteCompany}                                                                                                                                            
                    confirmMessage="Delete this company? Retailers and invoices must be removed first."
                    iconOnly                                                                                                                                                            
                  />                                                                                                                                                                    
                </div>                                                                                                                                                                  
              </li>                                                                                                                                                                     
            ))} 
          </ul>

        </>                                                                                                                                                                             
      )}        

      {/* ── Mobile FAB ── */}                                                                                                                                                          
      <Link
        href="/invoice/companies/new?returnTo=%2Finvoice%2Fcompanies"                                                                                                                   
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-3 transition active:scale-[0.97] lg:hidden"                                                             
        style={{                                                                                                                                                                        
          background: AMBER,                                                                                                                                                            
          color: "#0a0a0d",                                                                                                                                                             
          fontFamily: MONO,                                                                                                                                                             
          boxShadow:
            "0 14px 36px -12px rgba(245,158,11,0.55), inset 0 1px 0 rgba(255,255,255,0.3)",                                                                                             
        }}                                                                                                                                                                              
        aria-label="Add company"
      >                                                                                                                                                                                 
        <PlusIcon className="size-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
          New entry                                                                                                                                                                     
        </span>
      </Link>                                                                                                                                                                           
                                                                                                                                                                                        
      {/* ── Desktop add button ── */}
      <Link                                                                                                                                                                             
        href="/invoice/companies/new?returnTo=%2Finvoice%2Fcompanies"
        className="hidden lg:inline-flex fixed bottom-6 right-6 items-center gap-2 px-4 py-3 transition active:scale-[0.97]"
        style={{                                                                                                                                                                        
          background: AMBER,
          color: "#0a0a0d",                                                                                                                                                             
          fontFamily: MONO,
        }}
      >
        <PlusIcon className="size-3.5" />                                                                                                                                               
        <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
          New entry                                                                                                                                                                     
        </span> 
      </Link>
    </div>                                                                                                                                                                              
  );
}                                                                                                                                                                                       
                
/* ── Empty states ── */

function EmptyStamp() {
  return (
    <div
      className="relative px-6 py-12 text-center"                                                                                                                                       
      style={{
        border: "1px dashed rgba(255,255,255,0.12)",                                                                                                                                    
      }}                                                                                                                                                                                
    >
      <p                                                                                                                                                                                
        className="text-[10px] uppercase tracking-[0.3em]"
        style={{ fontFamily: MONO, color: AMBER }}
      >                                                                                                                                                                                 
        ∎ Empty register
      </p>                                                                                                                                                                              
      <p        
        className="mt-3 text-[20px] leading-tight text-white"                                                                                                                           
        style={{
          fontFamily: DISPLAY,                                                                                                                                                          
          fontWeight: 400,
        }}                                                                                                                                                                              
      >
        No entries yet.                                                                                                                                                                 
      </p>      
      <p
        className="mt-2 text-[10px] uppercase tracking-[0.2em]"
        style={{ fontFamily: MONO, color: "rgba(255,255,255,0.4)" }}                                                                                                                    
      >
        Add your first company to begin.                                                                                                                                                
      </p>      
      <Link                                                                                                                                                                             
        href="/invoice/companies/new?returnTo=%2Finvoice%2Fcompanies"
        className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 transition active:scale-[0.97]"                                                                                      
        style={{
          background: AMBER,                                                                                                                                                            
          color: "#0a0a0d",
          fontFamily: MONO,                                                                                                                                                             
        }}      
      >
        <PlusIcon className="size-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
          Open account                                                                                                                                                                  
        </span>
      </Link>                                                                                                                                                                           
    </div>      
  );
}

function NoMatch({ query }: { query: string }) {                                                                                                                                        
  return (
    <div                                                                                                                                                                                
      className="px-4 py-8 text-center"
      style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
    >                                                                                                                                                                                   
      <p
        className="text-[10px] uppercase tracking-[0.25em]"                                                                                                                             
        style={{ fontFamily: MONO, color: "rgba(255,255,255,0.4)" }}                                                                                                                    
      >
        No match for &ldquo;{query}&rdquo;                                                                                                                                              
      </p>                                                                                                                                                                              
    </div>
  );                                                                                                                                                                                    
}               

/* ── Icons ── */

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
                                                                                                                                                                                        
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"                                                                                                                                                                       
      stroke="currentColor"
      strokeWidth="2.5"                                                                                                                                                                 
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden                                                                                                                                                                       
    >
      <line x1="12" y1="5" x2="12" y2="19" />                                                                                                                                           
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>                                                                                                                                                                              
  );
}              