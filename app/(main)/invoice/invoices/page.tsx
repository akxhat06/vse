import Link from "next/link";                                                                                                                                                           
  import { AddInvoiceDialog } from "@/app/(main)/invoice/_components/AddInvoiceDialog";
  import { DeleteEntityButton } from "@/app/(main)/invoice/_components/DeleteEntityButton";                                                                                               
  import {             
    deleteInvoice,                                                                                                                                                                        
    getStore,     
  } from "@/app/(main)/invoice/store-actions";                                                                                                                                            
  import { round2 } from "@/lib/store/invoice-math";
                                                                                                                                                                                          
  const AMBER = "rgb(245,158,11)";                                                                                                                                                        
  const MONO = "var(--font-mono)";
  const DISPLAY = "var(--font-display)";                                                                                                                                                  
  const GREEN = "rgb(52,211,153)";
  const RED = "rgb(248,113,113)";
                                                                                                                                                                                          
  const inr = new Intl.NumberFormat("en-IN", {
    style: "currency",                                                                                                                                                                    
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,                                                                                                                                                             
  });
                                                                                                                                                                                          
  function formatDate(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d                                                                                                                                                                              
      .toLocaleDateString("en-GB", {
        day: "2-digit",                                                                                                                                                                   
        month: "short",
        year: "2-digit",
      })
      .toUpperCase();                                                                                                                                                                     
  }
                                                                                                                                                                                          
  const STATUS = {
    paid: { label: "Paid", color: GREEN },
    partial: { label: "Partial", color: AMBER },
    unpaid: { label: "Unpaid", color: RED },                                                                                                                                              
  } as const;
                                                                                                                                                                                          
  export default async function InvoicesListPage() {
    const store = await getStore();
    const companyById = new Map(
      store.companies.map((c) => [c.id, c]),                                                                                                                                              
    );
    const retailerById = new Map(                                                                                                                                                         
      store.retailers.map((r) => [r.id, r]),                                                                                                                                              
    );
    const paidByInvoiceId = new Map<string, number>();                                                                                                                                    
    const creditByInvoiceId = new Map<string, number>();                                                                                                                                  
  
    for (const p of store.payments) {                                                                                                                                                     
      paidByInvoiceId.set(
        p.invoiceId,                                                                                                                                                                      
        round2((paidByInvoiceId.get(p.invoiceId) ?? 0) + p.amount),
      );                                                                                                                                                                                  
    }
    for (const cn of store.creditNotes) {                                                                                                                                                 
      creditByInvoiceId.set(
        cn.invoiceId,                                                                                                                                                                     
        round2(
          (creditByInvoiceId.get(cn.invoiceId) ?? 0) +                                                                                                                                    
            cn.goodsReturnAmount,                                                                                                                                                         
        ),
      );                                                                                                                                                                                  
    }             

    const totalBilled = round2(
      store.invoices.reduce((s, i) => s + i.invoiceAmount, 0),
    );                                                                                                                                                                                    
    const totalPaid = round2(
      Array.from(paidByInvoiceId.values()).reduce((s, x) => s + x, 0),                                                                                                                    
    );                                                                                                                                                                                    
    const totalCredit = round2(
      Array.from(creditByInvoiceId.values()).reduce((s, x) => s + x, 0),                                                                                                                  
    );                                                                                                                                                                                    
    const totalOutstanding = Math.max(
      0,                                                                                                                                                                                  
      round2(totalBilled - totalPaid - totalCredit),
    );                                                                                                                                                                                    
  
    return (                                                                                                                                                                              
      <div className="mx-auto max-w-5xl space-y-6 pb-28 pt-1 lg:pb-6">
        {/* Back */}
        <Link                                                                                                                                                                             
          href="/invoice"
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] transition active:opacity-70"                                                               
          style={{
            fontFamily: MONO,                                                                                                                                                             
            color: "rgba(255,255,255,0.5)",
          }}                                                                                                                                                                              
        >         
          <span style={{ color: AMBER }}>←</span>                                                                                                                                         
          <span>Invoice hub</span>                                                                                                                                                        
        </Link>
                                                                                                                                                                                          
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
              className="mt-1 text-[28px] leading-none text-white"                                                                                                                        
              style={{
                fontFamily: DISPLAY,                                                                                                                                                      
                fontWeight: 400,                                                                                                                                                          
                letterSpacing: "-0.01em",
              }}                                                                                                                                                                          
            >     
              Invoices
            </h1>
          </div>
          <span className="entries-count">...</span>
          <AddInvoiceDialog                                                                                                                                                               
            companies={store.companies}
            retailers={store.retailers}                                                                                                                                                   
            redirectTo="/invoice/invoices"
          />                                                                                                                                                                              
        </header>
                                                                                                                                                                                          
        {store.invoices.length === 0 ? (
          /* Empty register */
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
              No invoices yet.                                                                                                                                                            
            </p>                                                                                                                                                                          
            <p    
              className="mt-2 text-[10px] uppercase tracking-[0.2em]"
              style={{
                fontFamily: MONO,                                                                                                                                                         
                color: "rgba(255,255,255,0.4)",
              }}                                                                                                                                                                          
            >     
              Issue your first invoice to begin.
            </p>
          </div>                                                                                                                                                                          
        ) : (
          <>                                                                                                                                                                              
            {/* Subtotal strip */}
            <div
              className="grid grid-cols-3 gap-px"
              style={{                                                                                                                                                                    
                background: "rgba(255,255,255,0.08)",
                borderTop: "1px solid rgba(255,255,255,0.08)",                                                                                                                            
                borderBottom: "1px solid rgba(255,255,255,0.08)",                                                                                                                         
              }}                                                                                                                                                                          
            >                                                                                                                                                                             
              <SubtotalCell                                                                                                                                                               
                label="Billed"
                value={inr.format(totalBilled)}
                count={`${store.invoices.length} inv`}                                                                                                                                    
              />
              <SubtotalCell                                                                                                                                                               
                label="Paid"
                value={inr.format(totalPaid)}
                tone="green"                                                                                                                                                              
                align="center"
              />                                                                                                                                                                          
              <SubtotalCell
                label="Outstanding"
                value={inr.format(totalOutstanding)}                                                                                                                                      
                tone="amber"
                align="right"                                                                                                                                                             
              />  
            </div>

            {/* Card grid */}                                                                                                                                                             
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {store.invoices.map((inv) => {                                                                                                                                              
                const co = companyById.get(inv.companyId);                                                                                                                                
                const ret = retailerById.get(inv.retailerId);
                const credit = creditByInvoiceId.get(inv.id) ?? 0;                                                                                                                        
                const paid = paidByInvoiceId.get(inv.id) ?? 0;                                                                                                                            
                const outstanding = Math.max(
                  0,                                                                                                                                                                      
                  round2(inv.invoiceAmount - credit - paid),
                );                                                                                                                                                                        
                const statusKey =
                  outstanding === 0                                                                                                                                                       
                    ? "paid"
                    : paid > 0                                                                                                                                                            
                      ? "partial"
                      : "unpaid";                                                                                                                                                         
                const st = STATUS[statusKey];
                                                                                                                                                                                          
                return (
                  <article
                    key={inv.id}
                    className="relative overflow-hidden"
                    style={{                                                                                                                                                              
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.08)",                                                                                                                         
                    }}                                                                                                                                                                    
                  >
                    <div                                                                                                                                                                  
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-px"
                      style={{                                                                                                                                                            
                        background: `linear-gradient(90deg, ${st.color}, transparent 70%)`,
                      }}                                                                                                                                                                  
                    />
                                                                                                                                                                                          
                    <div className="flex flex-col gap-2.5 p-3">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3">                                                                                                            
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">                                                                                                                       
                            <p
                              className="truncate text-[13px] font-medium leading-tight text-white"                                                                                       
                              style={{ fontFamily: MONO }}                                                                                                                                
                            >
                              {inv.invoiceNo}                                                                                                                                             
                            </p>
                            <span
                              className="flex shrink-0 items-center gap-1 px-1 py-0.5 text-[8px] uppercase tracking-[0.2em]"                                                              
                              style={{                                                                                                                                                    
                                fontFamily: MONO,                                                                                                                                         
                                color: st.color,                                                                                                                                          
                                border: `1px solid ${st.color}55`,
                              }}                                                                                                                                                          
                            >
                              <span                                                                                                                                                       
                                className="size-1 rounded-full"
                                style={{ background: st.color }}
                              />                                                                                                                                                          
                              {st.label}
                            </span>                                                                                                                                                       
                          </div>
                          <p
                            className="mt-1 truncate text-[10px] uppercase tracking-[0.18em]"
                            style={{                                                                                                                                                      
                              fontFamily: MONO,
                              color: "rgba(255,255,255,0.4)",                                                                                                                             
                            }}                                                                                                                                                            
                          >
                            {co?.name ?? "—"} · {ret?.name ?? "—"}                                                                                                                        
                          </p>
                          <p                                                                                                                                                              
                            className="mt-0.5 text-[9px] uppercase tracking-[0.2em] tabular-nums"
                            style={{                                                                                                                                                      
                              fontFamily: MONO,                                                                                                                                           
                              color: "rgba(255,255,255,0.3)",
                            }}                                                                                                                                                            
                          >
                            {formatDate(inv.invoiceDate)}
                          </p>                                                                                                                                                            
                        </div>
                                                                                                                                                                                          
                        {/* Amount */}
                        <p
                          className="shrink-0 text-[15px] tabular-nums"
                          style={{                                                                                                                                                        
                            fontFamily: MONO,
                            color: AMBER,                                                                                                                                                 
                          }}
                        >
                          {inr.format(inv.invoiceAmount)}
                        </p>                                                                                                                                                              
                      </div>
                                                                                                                                                                                          
                      {/* Inline meta */}
                      <div
                        className="flex items-baseline justify-between gap-3 py-2"                                                                                                        
                        style={{
                          borderTop:                                                                                                                                                      
                            "1px solid rgba(255,255,255,0.06)",                                                                                                                           
                          borderBottom:
                            "1px solid rgba(255,255,255,0.06)",                                                                                                                           
                        }}                                                                                                                                                                
                      >
                        <Meta                                                                                                                                                             
                          label="Paid"
                          value={paid > 0 ? inr.format(paid) : "—"}
                          active={paid > 0}                                                                                                                                               
                          color={GREEN}
                        />                                                                                                                                                                
                        <Meta                                                                                                                                                             
                          label="Credit"
                          value={                                                                                                                                                         
                            credit > 0 ? inr.format(credit) : "—"
                          }
                          active={credit > 0}
                          color="rgba(255,255,255,0.85)"
                        />                                                                                                                                                                
                        <Meta
                          label="Balance"                                                                                                                                                 
                          value={inr.format(outstanding)}
                          active={outstanding > 0}                                                                                                                                        
                          color={AMBER}
                          align="right"                                                                                                                                                   
                        />
                      </div>                                                                                                                                                              
   
                      {/* Actions */}                                                                                                                                                     
                      <div className="flex items-center gap-1">
                        <ActionLink
                          href={`/invoice/payments/new?invoiceId=${encodeURIComponent(inv.id)}&returnTo=${encodeURIComponent("/invoice/invoices")}`}
                          label="Pay"                                                                                                                                                     
                        />
                        <ActionLink                                                                                                                                                       
                          href={`/invoice/credit-notes/new?invoiceId=${encodeURIComponent(inv.id)}&returnTo=${encodeURIComponent("/invoice/invoices")}`}
                          label="Return"                                                                                                                                                  
                        />
                        <ActionLink                                                                                                                                                       
                          href={`/invoice/invoices/${inv.id}`}
                          label="Edit"
                          primary
                        />                                                                                                                                                                
                        <DeleteEntityButton
                          id={inv.id}                                                                                                                                                     
                          onDelete={deleteInvoice}
                          confirmMessage="Delete this invoice? Remove payments and credit notes first."                                                                                   
                          iconOnly                                                                                                                                                        
                        />                                                                                                                                                                
                      </div>                                                                                                                                                              
                    </div>
                  </article>
                );                                                                                                                                                                        
              })}
            </div>                                                                                                                                                                        
                  
            {/* End stamp */}
            <p
              className="pt-2 text-center text-[9px] uppercase tracking-[0.3em]"
              style={{                                                                                                                                                                    
                fontFamily: MONO,
                color: "rgba(255,255,255,0.22)",                                                                                                                                          
              }}                                                                                                                                                                          
            >
              end of register · {store.invoices.length}{" "}                                                                                                                              
              {store.invoices.length === 1 ? "entry" : "entries"}                                                                                                                         
            </p>
          </>                                                                                                                                                                             
        )}        
      </div>
    );
  }
                                                                                                                                                                                          
  /* ── Subtotal cell ── */
  function SubtotalCell({                                                                                                                                                                 
    label,        
    value,
    count,
    tone,                                                                                                                                                                                 
    align = "left",
  }: {                                                                                                                                                                                    
    label: string;
    value: string;
    count?: string;
    tone?: "green" | "amber";                                                                                                                                                             
    align?: "left" | "center" | "right";
  }) {                                                                                                                                                                                    
    const color = 
      tone === "green"
        ? GREEN                                                                                                                                                                           
        : tone === "amber"
          ? AMBER                                                                                                                                                                         
          : "rgba(255,255,255,0.95)";
    return (
      <div                                                                                                                                                                                
        className="px-3 py-2.5"
        style={{                                                                                                                                                                          
          background: "#0a0a0d",
          textAlign: align,
        }}                                                                                                                                                                                
      >
        <p                                                                                                                                                                                
          className="text-[9px] uppercase tracking-[0.22em]"
          style={{
            fontFamily: MONO,
            color: "rgba(255,255,255,0.4)",                                                                                                                                               
          }}
        >                                                                                                                                                                                 
          {label} 
          {count && (
            <>
              {" · "}                                                                                                                                                                     
              <span style={{ color: "rgba(255,255,255,0.55)" }}>
                {count}                                                                                                                                                                   
              </span>                                                                                                                                                                     
            </>
          )}                                                                                                                                                                              
        </p>      
        <p
          className="mt-1 text-[14px] tabular-nums"
          style={{ fontFamily: MONO, color }}
        >                                                                                                                                                                                 
          {value}
        </p>                                                                                                                                                                              
      </div>      
    );
  }

  /* ── Inline meta cell ── */                                                                                                                                                            
  function Meta({
    label,                                                                                                                                                                                
    value,        
    active,
    color,
    align = "left",
  }: {
    label: string;
    value: string;
    active: boolean;
    color: string;
    align?: "left" | "right";                                                                                                                                                             
  }) {
    return (                                                                                                                                                                              
      <div style={{ textAlign: align }}>
        <p
          className="text-[9px] uppercase tracking-[0.22em]"
          style={{                                                                                                                                                                        
            fontFamily: MONO,
            color: "rgba(255,255,255,0.4)",                                                                                                                                               
          }}      
        >
          {label}
        </p>
        <p                                                                                                                                                                                
          className="mt-0.5 text-[11px] tabular-nums"
          style={{                                                                                                                                                                        
            fontFamily: MONO,
            color: active ? color : "rgba(255,255,255,0.3)",
          }}                                                                                                                                                                              
        >
          {value}                                                                                                                                                                         
        </p>      
      </div>
    );
  }

  /* ── Action link ── */
  function ActionLink({
    href,                                                                                                                                                                                 
    label,
    primary,                                                                                                                                                                              
  }: {            
    href: string;
    label: string;
    primary?: boolean;
  }) {
    return (
      <Link
        href={href}
        className="flex flex-1 items-center justify-center px-2 py-2 transition active:opacity-70"                                                                                        
        style={{                                                                                                                                                                          
          background: primary                                                                                                                                                             
            ? "rgba(245,158,11,0.06)"                                                                                                                                                     
            : "rgba(255,255,255,0.03)",                                                                                                                                                   
          border: primary
            ? `1px solid ${AMBER}40`                                                                                                                                                      
            : "1px solid rgba(255,255,255,0.08)",
          fontFamily: MONO,                                                                                                                                                               
          color: primary ? AMBER : "rgba(255,255,255,0.7)",
        }}                                                                                                                                                                                
      >           
        <span className="text-[10px] uppercase tracking-[0.22em]">                                                                                                                        
          {label} 
        </span>
      </Link>
    );                                                                                                                                                                                    
  }