import Link from "next/link";
  import { RetailerCard } from "@/app/(main)/invoice/_components/RetailerCard";
  import { getStore } from "@/app/(main)/invoice/store-actions";                                                                                                                          
                                                                                                                                                                                          
  const AMBER = "rgb(245,158,11)";                                                                                                                                                        
  const MONO = "var(--font-mono)";                                                                                                                                                        
  const DISPLAY = "var(--font-display)";                                                                                                                                                  
                  
  const inr = new Intl.NumberFormat("en-IN", {                                                                                                                                            
    style: "currency",
    currency: "INR",                                                                                                                                                                      
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,                                                                                                                                                             
  });
                                                                                                                                                                                          
  export default async function RetailersListPage() {
    const store = await getStore();
    const companyById = new Map(store.companies.map((c) => [c.id, c]));
                                                                                                                                                                                          
    const statsByRetailer = new Map<
      string,                                                                                                                                                                             
      { count: number; total: number }
    >();                                                                                                                                                                                  
    for (const inv of store.invoices) {
      const cur = statsByRetailer.get(inv.retailerId) ?? {                                                                                                                                
        count: 0,                                                                                                                                                                         
        total: 0,
      };                                                                                                                                                                                  
      statsByRetailer.set(inv.retailerId, {
        count: cur.count + 1,
        total: Math.round((cur.total + inv.invoiceAmount) * 100) / 100,
      });                                                                                                                                                                                 
    }
                                                                                                                                                                                          
    const totalBillsAll = Array.from(statsByRetailer.values()).reduce(                                                                                                                    
      (s, x) => s + x.count,
      0,                                                                                                                                                                                  
    );            
    const totalBilledAll = Array.from(statsByRetailer.values()).reduce(                                                                                                                   
      (s, x) => s + x.total,
      0,                                                                                                                                                                                  
    );
                                                                                                                                                                                          
    return (      
      <div className="mx-auto max-w-5xl space-y-6 pb-28 pt-1 lg:pb-6">
        {/* ── Header ── */}                                                                                                                                                              
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
              Retailers                                                                                                                                                                   
            </h1> 
          </div>
          <span
            className="text-[10px] uppercase tracking-[0.25em] tabular-nums"
            style={{ fontFamily: MONO, color: "rgba(255,255,255,0.4)" }}                                                                                                                  
          >                                                                                                                                                                               
            {String(store.retailers.length).padStart(2, "0")} entries                                                                                                                     
          </span>                                                                                                                                                                         
        </header> 
                                                                                                                                                                                          
        {store.retailers.length === 0 ? (
          /* ── Empty state ── */                                                                                                                                                         
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
              {store.companies.length === 0
                ? "Add a company first, then a retailer."                                                                                                                                 
                : "Register your first retailer to begin."}
            </p>                                                                                                                                                                          
            {store.companies.length > 0 && (
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
        ) : (     
          <>
            {/* ── Subtotal strip ── */}
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
                                                                                                                                                                                          
            {/* ── Card grid ── */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {store.retailers.map((r) => {                                                                                                                                               
                const co = companyById.get(r.companyId);
                const stats = statsByRetailer.get(r.id);                                                                                                                                  
                return (                                                                                                                                                                  
                  <RetailerCard
                    key={r.id}                                                                                                                                                            
                    id={r.id}
                    name={r.name}
                    companyName={co?.name ?? null}
                    taxIdType={r.taxIdType}
                    invoiceCount={stats?.count ?? 0}                                                                                                                                      
                    totalBilled={stats?.total ?? 0}
                  />                                                                                                                                                                      
                );
              })}
            </div>                                                                                                                                                                        
   
            {/* End-of-register stamp */}                                                                                                                                                 
            <p    
              className="pt-2 text-center text-[9px] uppercase tracking-[0.3em]"
              style={{                                                                                                                                                                    
                fontFamily: MONO,
                color: "rgba(255,255,255,0.22)",                                                                                                                                          
              }}                                                                                                                                                                          
            >
              end of register · {store.retailers.length}{" "}                                                                                                                             
              {store.retailers.length === 1 ? "entry" : "entries"}
            </p>                                                                                                                                                                          
          </>
        )}                                                                                                                                                                                
                  
        {/* ── Mobile FAB ── */}
        {store.companies.length > 0 && (
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

        {/* ── Desktop add button ── */}                                                                                                                                                  
        {store.companies.length > 0 && (
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