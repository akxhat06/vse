import Link from "next/link";                                                                                                                                                           
  import { getStore } from "@/app/(main)/invoice/store-actions";
  import { round2 } from "@/lib/store/invoice-math";                                                                                                                                      
                                                                                                                                                                                          
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
                                                                                                                                                                                          
  function formatNum(n: number) {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,                                                                                                                                                           
    }).format(n);
  }                                                                                                                                                                                       
                  
  const SECTIONS = [
    {
      href: "/invoice/companies",
      label: "Companies",
      desc: "Parent firms",                                                                                                                                                               
    },
    {                                                                                                                                                                                     
      href: "/invoice/retailers",
      label: "Retailers",
      desc: "Sub-entities billed",                                                                                                                                                        
    },
    {                                                                                                                                                                                     
      href: "/invoice/invoices",
      label: "Invoices",
      desc: "Bills issued",                                                                                                                                                               
    },
    {                                                                                                                                                                                     
      href: "/invoice/payments",
      label: "Payments",
      desc: "Cash received",
    },                                                                                                                                                                                    
    {
      href: "/invoice/credit-notes",                                                                                                                                                      
      label: "Credit notes",
      desc: "Goods returned",
    },
  ];

  export default async function InvoiceHubPage() {                                                                                                                                        
    const store = await getStore();
    const totalBills = round2(                                                                                                                                                            
      store.invoices.reduce((s, inv) => s + inv.invoiceAmount, 0),
    );                                                                                                                                                                                    
    const totalPayments = round2(
      store.payments.reduce((s, p) => s + p.amount, 0),                                                                                                                                   
    );                                                                                                                                                                                    
    const outstanding = Math.max(
      0,                                                                                                                                                                                  
      round2(totalBills - totalPayments),
    );
    const collectionRate =                                                                                                                                                                
      totalBills > 0
        ? Math.round((totalPayments / totalBills) * 100)                                                                                                                                  
        : 0;      
                                                                                                                                                                                          
    const counts: Record<string, number> = {
      "/invoice/companies": store.companies.length,                                                                                                                                       
      "/invoice/retailers": store.retailers.length,
      "/invoice/invoices": store.invoices.length,                                                                                                                                         
      "/invoice/payments": store.payments.length,
      "/invoice/credit-notes": store.creditNotes.length,                                                                                                                                  
    };                                                                                                                                                                                    
  
    return (                                                                                                                                                                              
      <div className="mx-auto max-w-3xl space-y-8 pb-8">
        {/* ── Header ── */}                                                                                                                                                              
        <header>
          <p                                                                                                                                                                              
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ fontFamily: MONO, color: "rgba(255,255,255,0.4)" }}                                                                                                                  
          >                                                                                                                                                                               
            Workspace                                                                                                                                                                     
          </p>                                                                                                                                                                            
          <h1     
            className="mt-1 text-[28px] leading-none text-white"
            style={{                                                                                                                                                                      
              fontFamily: DISPLAY,
              fontWeight: 400,                                                                                                                                                            
              letterSpacing: "-0.01em",
            }}                                                                                                                                                                            
          >
            Invoice hub                                                                                                                                                                   
          </h1>   
          <p
            className="mt-2 text-[10px] uppercase tracking-[0.2em]"
            style={{                                                                                                                                                                      
              fontFamily: MONO,
              color: "rgba(255,255,255,0.4)",                                                                                                                                             
            }}    
          >
            All billing in one place.                                                                                                                                                     
          </p>
        </header>                                                                                                                                                                         
                  
        {/* ── Hero metric ── */}                                                                                                                                                         
        <section
          className="relative overflow-hidden p-5"                                                                                                                                        
          style={{
            background:
              "linear-gradient(180deg, rgba(245,158,11,0.05), rgba(245,158,11,0.01))",                                                                                                    
            border: "1px solid rgba(255,255,255,0.08)",
          }}                                                                                                                                                                              
        >         
          <div                                                                                                                                                                            
            aria-hidden
            className="absolute inset-x-0 top-0 h-px"
            style={{                                                                                                                                                                      
              background: `linear-gradient(90deg, transparent, ${AMBER}, transparent)`,
            }}                                                                                                                                                                            
          />      
                                                                                                                                                                                          
          <div className="flex items-baseline justify-between">
            <p
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{                                                                                                                                                                    
                fontFamily: MONO,
                color: "rgba(255,255,255,0.55)",                                                                                                                                          
              }}  
            >
              Total billed                                                                                                                                                                
            </p>
            <p                                                                                                                                                                            
              className="text-[9px] uppercase tracking-[0.25em] tabular-nums"
              style={{
                fontFamily: MONO,
                color: AMBER,                                                                                                                                                             
              }}
            >                                                                                                                                                                             
              {collectionRate}% collected
            </p>
          </div>

          <div className="mt-3 flex items-baseline gap-2">                                                                                                                                
            <span
              className="text-[24px] leading-none"                                                                                                                                        
              style={{
                fontFamily: MONO,
                color: AMBER,                                                                                                                                                             
                opacity: 0.55,
              }}                                                                                                                                                                          
            >     
              ₹
            </span>
            <span                                                                                                                                                                         
              className="text-[42px] leading-none tabular-nums"
              style={{                                                                                                                                                                    
                fontFamily: DISPLAY,
                fontWeight: 400,
                letterSpacing: "-0.02em",                                                                                                                                                 
                color: AMBER,
              }}                                                                                                                                                                          
            >     
              {formatNum(totalBills)}
            </span>
          </div>
                                                                                                                                                                                          
          {/* Inline secondary stats */}
          <div                                                                                                                                                                            
            className="mt-5 grid grid-cols-2 gap-px"
            style={{ background: "rgba(255,255,255,0.06)" }}                                                                                                                              
          >
            <div                                                                                                                                                                          
              className="px-3 py-2.5"
              style={{ background: "#0a0a0d" }}                                                                                                                                           
            >
              <p                                                                                                                                                                          
                className="text-[9px] uppercase tracking-[0.22em]"
                style={{                                                                                                                                                                  
                  fontFamily: MONO,
                  color: "rgba(255,255,255,0.4)",                                                                                                                                         
                }}                                                                                                                                                                        
              >
                Payments in                                                                                                                                                               
              </p>
              <p
                className="mt-1 text-[15px] tabular-nums"
                style={{
                  fontFamily: MONO,
                  color: "rgba(255,255,255,0.95)",                                                                                                                                        
                }}
              >                                                                                                                                                                           
                {formatInr(totalPayments)}
              </p>
            </div>
            <div                                                                                                                                                                          
              className="px-3 py-2.5 text-right"
              style={{ background: "#0a0a0d" }}                                                                                                                                           
            >     
              <p
                className="text-[9px] uppercase tracking-[0.22em]"
                style={{                                                                                                                                                                  
                  fontFamily: MONO,
                  color: "rgba(255,255,255,0.4)",                                                                                                                                         
                }}
              >
                Outstanding
              </p>                                                                                                                                                                        
              <p
                className="mt-1 text-[15px] tabular-nums"                                                                                                                                 
                style={{
                  fontFamily: MONO,
                  color:
                    outstanding > 0
                      ? AMBER                                                                                                                                                             
                      : "rgba(255,255,255,0.95)",
                }}                                                                                                                                                                        
              >   
                {formatInr(outstanding)}
              </p>                                                                                                                                                                        
            </div>
          </div>                                                                                                                                                                          
        </section>

        {/* ── Sections ── */}
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <p                                                                                                                                                                            
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{                                                                                                                                                                    
                fontFamily: MONO,
                color: "rgba(255,255,255,0.5)",                                                                                                                                           
              }}  
            >
              Sections
            </p>
            <span
              className="text-[9px] uppercase tracking-[0.25em]"                                                                                                                          
              style={{
                fontFamily: MONO,                                                                                                                                                         
                color: "rgba(255,255,255,0.25)",
              }}                                                                                                                                                                          
            >
              {String(SECTIONS.length).padStart(2, "0")} modules                                                                                                                          
            </span>
          </div>
                                                                                                                                                                                          
          <ul style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {SECTIONS.map((s, i) => {                                                                                                                                                     
              const count = counts[s.href] ?? 0;                                                                                                                                          
              return (
                <li                                                                                                                                                                       
                  key={s.href}
                  style={{
                    borderBottom:                                                                                                                                                         
                      "1px solid rgba(255,255,255,0.06)",
                  }}                                                                                                                                                                      
                >                                                                                                                                                                         
                  <Link
                    href={s.href}                                                                                                                                                         
                    className="flex items-center justify-between gap-3 py-3.5 transition-opacity active:opacity-70"
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
                        <p className="truncate text-[14px] leading-tight text-white">
                          {s.label}                                                                                                                                                       
                        </p>
                        <p                                                                                                                                                                
                          className="mt-0.5 text-[10px] uppercase tracking-[0.18em]"
                          style={{                                                                                                                                                        
                            fontFamily: MONO,
                            color: "rgba(255,255,255,0.35)",                                                                                                                              
                          }}                                                                                                                                                              
                        >
                          {s.desc}                                                                                                                                                        
                        </p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span                                                                                                                                                               
                        className="text-[13px] tabular-nums"
                        style={{                                                                                                                                                          
                          fontFamily: MONO,
                          color:
                            count > 0                                                                                                                                                     
                              ? "rgba(255,255,255,0.95)"
                              : "rgba(255,255,255,0.3)",                                                                                                                                  
                        }}
                      >
                        {String(count).padStart(2, "0")}
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
              );
            })}                                                                                                                                                                           
          </ul>   
        </section>
      </div>
    );
  }