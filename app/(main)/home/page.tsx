import Link from "next/link";                                                                                                                                                           
  import { getStore } from "@/app/(main)/invoice/store-actions";                                                                                                                          
  import { createClient } from "@/lib/supabase/server";                                                                                                                                   
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

  export default async function HomePage() {
    const supabase = await createClient();
    const {                                                                                                                                                                               
      data: { user },
    } = await supabase.auth.getUser();                                                                                                                                                    
                  
    const name =
      (user?.user_metadata?.full_name as string | undefined)?.trim() ||
      (user?.user_metadata?.username as string | undefined)?.trim() ||                                                                                                                    
      user?.email?.split("@")[0] ||                                                                                                                                                       
      "there";                                                                                                                                                                            
                                                                                                                                                                                          
    const store = await getStore();                                                                                                                                                       
    const totalBills = round2(
      store.invoices.reduce((s, inv) => s + inv.invoiceAmount, 0),                                                                                                                        
    );                                                                                                                                                                                    
    const totalCommission = round2(
      store.invoices.reduce((s, inv) => s + inv.commissionAmount, 0),                                                                                                                     
    );                                                                                                                                                                                    
    const totalPayments = round2(
      store.payments.reduce((s, p) => s + p.amount, 0),                                                                                                                                   
    );                                                                                                                                                                                    
    const outstanding = Math.max(0, round2(totalBills - totalPayments));
    const collectionRate =                                                                                                                                                                
      totalBills > 0 ? Math.round((totalPayments / totalBills) * 100) : 0;                                                                                                                
  
    const dateLabel = new Date()                                                                                                                                                          
      .toLocaleDateString("en-GB", {
        day: "2-digit",                                                                                                                                                                   
        month: "short",
        year: "numeric",
      })                                                                                                                                                                                  
      .toUpperCase();
                                                                                                                                                                                          
    const statusColor =
      collectionRate >= 80
        ? "#34d399"                                                                                                                                                                       
        : collectionRate >= 50
          ? AMBER                                                                                                                                                                         
          : "#f87171";

    return (
      <div className="mx-auto max-w-2xl space-y-8 px-1">
        {/* ── Header ── */}                                                                                                                                                              
        <header className="flex items-start justify-between gap-4">                                                                                                                       
          <div>                                                                                                                                                                           
            <p                                                                                                                                                                            
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{ fontFamily: MONO, color: "rgba(255,255,255,0.4)" }}                                                                                                                
            >
              Signed in                                                                                                                                                                   
            </p>  
            <h1
              className="mt-1.5 text-[24px] leading-none text-white"
              style={{                                                                                                                                                                    
                fontFamily: DISPLAY,
                fontWeight: 400,                                                                                                                                                          
                letterSpacing: "-0.01em",                                                                                                                                                 
              }}
            >                                                                                                                                                                             
              Welcome,{" "}
              <em
                style={{
                  color: AMBER,
                  fontStyle: "italic",                                                                                                                                                    
                  fontFamily: DISPLAY,
                }}                                                                                                                                                                        
              >   
                {name}
              </em>
            </h1>                                                                                                                                                                         
          </div>
                                                                                                                                                                                          
          <div className="flex flex-col items-end gap-1.5">
            <span
              className="text-[10px] uppercase tracking-[0.25em] tabular-nums"
              style={{ fontFamily: MONO, color: "rgba(255,255,255,0.4)" }}                                                                                                                
            >
              {dateLabel}                                                                                                                                                                 
            </span>
            <div className="flex items-center gap-1.5">                                                                                                                                   
              <span
                className="size-1.5 rounded-full"
                style={{
                  background: statusColor,
                  boxShadow: `0 0 6px ${statusColor}80`,                                                                                                                                  
                }}
              />                                                                                                                                                                          
              <span
                className="text-[10px] uppercase tracking-[0.2em] tabular-nums"
                style={{ fontFamily: MONO, color: "rgba(255,255,255,0.55)" }}                                                                                                             
              >
                {collectionRate}% collected                                                                                                                                               
              </span>
            </div>                                                                                                                                                                        
          </div>  
        </header>

        {/* ── Hero metric ── */}
        <section
          className="relative overflow-hidden p-5"
          style={{                                                                                                                                                                        
            border: "1px solid rgba(255,255,255,0.08)",
            background:                                                                                                                                                                   
              "linear-gradient(180deg, rgba(245,158,11,0.05), rgba(245,158,11,0.01))",
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
              style={{ fontFamily: MONO, color: "rgba(255,255,255,0.55)" }}
            >                                                                                                                                                                             
              Total billed
            </p>                                                                                                                                                                          
            <p    
              className="text-[9px] uppercase tracking-[0.25em]"
              style={{ fontFamily: MONO, color: "rgba(255,255,255,0.3)" }}                                                                                                                
            >                                                                                                                                                                             
              FY 25–26                                                                                                                                                                    
            </p>                                                                                                                                                                          
          </div>  

          <div className="mt-3 flex items-baseline gap-2">
            <span
              className="text-[24px] leading-none"
              style={{ color: AMBER, fontFamily: MONO, opacity: 0.55 }}                                                                                                                   
            >                                                                                                                                                                             
              ₹                                                                                                                                                                           
            </span>                                                                                                                                                                       
            <span 
              className="text-[42px] leading-none tabular-nums"
              style={{
                color: AMBER,                                                                                                                                                             
                fontFamily: DISPLAY,
                fontWeight: 400,                                                                                                                                                          
                letterSpacing: "-0.02em",
              }}
            >
              {formatNum(totalBills)}                                                                                                                                                     
            </span>
          </div>                                                                                                                                                                          
                  
          <p
            className="mt-2.5 text-[10px] uppercase tracking-[0.2em]"
            style={{ fontFamily: MONO, color: "rgba(255,255,255,0.4)" }}                                                                                                                  
          >
            {store.invoices.length} invoice                                                                                                                                               
            {store.invoices.length !== 1 ? "s" : ""} · across all clients                                                                                                                 
          </p>
                                                                                                                                                                                          
          {/* Collection bar */}
          <div className="mt-5">
            <div className="mb-2 flex items-baseline justify-between">                                                                                                                    
              <span
                className="text-[9px] uppercase tracking-[0.25em]"                                                                                                                        
                style={{ fontFamily: MONO, color: "rgba(255,255,255,0.4)" }}
              >                                                                                                                                                                           
                Collection
              </span>                                                                                                                                                                     
              <span
                className="text-[10px] uppercase tracking-[0.2em] tabular-nums"
                style={{ fontFamily: MONO, color: AMBER }}                                                                                                                                
              >
                {collectionRate}%                                                                                                                                                         
              </span>
            </div>                                                                                                                                                                        
            <div
              className="relative h-[3px] overflow-hidden"                                                                                                                                
              style={{ background: "rgba(255,255,255,0.06)" }}
            >                                                                                                                                                                             
              <div
                className="absolute inset-y-0 left-0"                                                                                                                                     
                style={{
                  width: `${collectionRate}%`,
                  background: AMBER,
                  boxShadow: `0 0 10px ${AMBER}`,                                                                                                                                         
                }}
              />                                                                                                                                                                          
            </div>
          </div>
        </section>

        {/* ── Statement ── */}
        <section>
          <div className="mb-3 flex items-baseline justify-between">                                                                                                                      
            <p
              className="text-[10px] uppercase tracking-[0.3em]"                                                                                                                          
              style={{ fontFamily: MONO, color: "rgba(255,255,255,0.5)" }}
            >                                                                                                                                                                             
              Statement
            </p>                                                                                                                                                                          
            <span 
              className="text-[9px] uppercase tracking-[0.25em]"
              style={{ fontFamily: MONO, color: "rgba(255,255,255,0.25)" }}                                                                                                               
            >
              03 lines                                                                                                                                                                    
            </span>
          </div>
                                                                                                                                                                                          
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {[                                                                                                                                                                            
              {   
                idx: "01",
                label: "Commission earned",                                                                                                                                               
                value: totalCommission,
                sub: "Fee total",                                                                                                                                                         
              },  
              {
                idx: "02",
                label: "Payments received",
                value: totalPayments,                                                                                                                                                     
                sub: `${store.payments.length} entr${
                  store.payments.length !== 1 ? "ies" : "y"                                                                                                                               
                }`,
              },
              {
                idx: "03",                                                                                                                                                                
                label: "Outstanding",
                value: outstanding,                                                                                                                                                       
                sub: "Pending recovery",
                warn: true,
              },
            ].map((row) => (
              <div
                key={row.idx}                                                                                                                                                             
                className="flex items-baseline justify-between gap-4 py-3.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}                                                                                                              
              >                                                                                                                                                                           
                <div className="flex items-baseline gap-3">
                  <span                                                                                                                                                                   
                    className="text-[9px] tabular-nums"
                    style={{                                                                                                                                                              
                      fontFamily: MONO,
                      color: "rgba(255,255,255,0.3)",                                                                                                                                     
                    }}
                  >
                    {row.idx}
                  </span>                                                                                                                                                                 
                  <div>
                    <p                                                                                                                                                                    
                      className="text-[13px] leading-tight text-white"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >                                                                                                                                                                     
                      {row.label}
                    </p>                                                                                                                                                                  
                    <p
                      className="mt-0.5 text-[9px] uppercase tracking-[0.2em]"
                      style={{                                                                                                                                                            
                        fontFamily: MONO,
                        color: "rgba(255,255,255,0.3)",                                                                                                                                   
                      }}                                                                                                                                                                  
                    >
                      {row.sub}                                                                                                                                                           
                    </p>
                  </div>
                </div>
                <p
                  className="text-[15px] tabular-nums"
                  style={{
                    fontFamily: MONO,                                                                                                                                                     
                    color: row.warn ? AMBER : "rgba(255,255,255,0.95)",
                  }}                                                                                                                                                                      
                > 
                  {formatInr(row.value)}
                </p>                                                                                                                                                                      
              </div>
            ))}                                                                                                                                                                           
          </div>  
        </section>

        {/* ── Actions: primary ── */}                                                                                                                                                    
        <section>
          <p                                                                                                                                                                              
            className="mb-3 text-[10px] uppercase tracking-[0.3em]"
            style={{ fontFamily: MONO, color: "rgba(255,255,255,0.5)" }}
          >                                                                                                                                                                               
            Actions
          </p>                                                                                                                                                                            
                  
          <div
            className="grid grid-cols-2 gap-px"
            style={{ background: "rgba(255,255,255,0.08)" }}                                                                                                                              
          >
            {[                                                                                                                                                                            
              {   
                href: "/invoice/invoices/new",
                label: "New invoice",
                desc: "Create & send",                                                                                                                                                    
                symbol: "+",
              },                                                                                                                                                                          
              {   
                href: "/invoice/payments/new",
                label: "Record payment",
                desc: "Log incoming",
                symbol: "₹",                                                                                                                                                              
              },
            ].map((l) => (                                                                                                                                                                
              <Link
                key={l.href}
                href={l.href}
                className="block p-4 transition-opacity active:opacity-70"
                style={{ background: "#0a0a0d" }}                                                                                                                                         
              >
                <div className="mb-3 flex items-center justify-between">                                                                                                                  
                  <span                                                                                                                                                                   
                    className="flex size-7 items-center justify-center text-[14px]"
                    style={{                                                                                                                                                              
                      background: "rgba(245,158,11,0.1)",
                      border: `1px solid ${AMBER}55`,                                                                                                                                     
                      color: AMBER,
                      fontFamily: MONO,                                                                                                                                                   
                    }}                                                                                                                                                                    
                  >
                    {l.symbol}                                                                                                                                                            
                  </span>
                  <span
                    className="text-[14px]"
                    style={{ color: AMBER, opacity: 0.6 }}
                  >                                                                                                                                                                       
                    →
                  </span>                                                                                                                                                                 
                </div>
                <p className="text-[13px] font-medium leading-tight text-white">
                  {l.label}                                                                                                                                                               
                </p>
                <p                                                                                                                                                                        
                  className="mt-1 text-[9px] uppercase tracking-[0.22em]"
                  style={{
                    fontFamily: MONO,
                    color: "rgba(255,255,255,0.4)",                                                                                                                                       
                  }}
                >                                                                                                                                                                         
                  {l.desc}
                </p>
              </Link>
            ))}
          </div>

          {/* ── Actions: secondary (ledger rows) ── */}                                                                                                                                  
          <div
            className="mt-4"                                                                                                                                                              
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}                                                                                                                      
          >
            {[                                                                                                                                                                            
              {   
                href: "/invoice/companies/new",
                label: "Add company",
                desc: "Register a new company",                                                                                                                                           
              },
              {                                                                                                                                                                           
                href: "/invoice/retailers/new",
                label: "Add retailer",
                desc: "Register a retailer",
              },                                                                                                                                                                          
              {
                href: "/invoice/credit-notes/new",                                                                                                                                        
                label: "Credit note",
                desc: "Log a goods return",
              },
            ].map((l) => (
              <Link                                                                                                                                                                       
                key={l.href}
                href={l.href}                                                                                                                                                             
                className="flex items-center justify-between gap-3 py-3 transition-opacity active:opacity-70"
                style={{                                                                                                                                                                  
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}                                                                                                                                                                        
              >   
                <div className="flex min-w-0 items-baseline gap-3">
                  <span                                                                                                                                                                   
                    className="text-[10px]"
                    style={{                                                                                                                                                              
                      fontFamily: MONO,
                      color: "rgba(255,255,255,0.3)",
                    }}                                                                                                                                                                    
                  >
                    ···                                                                                                                                                                   
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] text-white">
                      {l.label}                                                                                                                                                           
                    </p>
                    <p                                                                                                                                                                    
                      className="truncate text-[9px] uppercase tracking-[0.2em]"
                      style={{                                                                                                                                                            
                        fontFamily: MONO,
                        color: "rgba(255,255,255,0.3)",                                                                                                                                   
                      }}
                    >
                      {l.desc}
                    </p>                                                                                                                                                                  
                  </div>
                </div>                                                                                                                                                                    
                <span
                  className="text-[12px]"
                  style={{ color: AMBER, opacity: 0.5 }}
                >
                  →
                </span>                                                                                                                                                                   
              </Link>
            ))}                                                                                                                                                                           
          </div>  
        </section>

        {/* ── Footer mark ── */}
        <p
          className="pt-2 text-center text-[9px] uppercase tracking-[0.3em]"                                                                                                              
          style={{ fontFamily: MONO, color: "rgba(255,255,255,0.2)" }}
        >                                                                                                                                                                                 
          end of statement · {dateLabel}
        </p>                                                                                                                                                                              
      </div>      
    );                                                                                                                                                                                    
  }               