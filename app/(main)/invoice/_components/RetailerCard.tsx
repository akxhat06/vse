"use client";                                                                                                                                                                           
                                                                                                                                                                                          
  import Link from "next/link";                                                                                                                                                           
  import { DeleteEntityButton } from "@/app/(main)/invoice/_components/DeleteEntityButton";
  import { deleteRetailer } from "@/app/(main)/invoice/store-actions";                                                                                                                    
                                                                                                                                                                                          
  type Props = {                                                                                                                                                                          
    id: string;                                                                                                                                                                           
    name: string; 
    companyName?: string | null;
    taxIdType: "GST" | "PAN";                                                                                                                                                             
    invoiceCount: number;                                                                                                                                                                 
    totalBilled: number;                                                                                                                                                                  
  };                                                                                                                                                                                      
                  
  const AMBER = "rgb(245,158,11)";                                                                                                                                                        
  const MONO = "var(--font-mono)";
                                                                                                                                                                                          
  const inr = new Intl.NumberFormat("en-IN", {
    style: "currency",                                                                                                                                                                    
    currency: "INR",                                                                                                                                                                      
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,                                                                                                                                                             
  });             

  export function RetailerCard({                                                                                                                                                          
    id,
    name,                                                                                                                                                                                 
    companyName,  
    taxIdType,
    invoiceCount,
    totalBilled,
  }: Props) {
    const initial = name.charAt(0).toUpperCase();
    const hasInvoices = invoiceCount > 0;                                                                                                                                                 
  
    return (                                                                                                                                                                              
      <article    
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
            background: `linear-gradient(90deg, ${AMBER}, rgba(245,158,11,0) 70%)`,
          }}                                                                                                                                                                              
        />        
                                                                                                                                                                                          
        <div className="flex items-center gap-3 p-3">
          {/* Initial */}
          <span                                                                                                                                                                           
            className="flex size-9 shrink-0 items-center justify-center text-[12px] font-medium"
            style={{                                                                                                                                                                      
              fontFamily: MONO,
              color: AMBER,                                                                                                                                                               
              background: "rgba(245,158,11,0.08)",
              border: `1px solid ${AMBER}40`,                                                                                                                                             
            }}
          >                                                                                                                                                                               
            {initial}
          </span>

          {/* Name + meta */}                                                                                                                                                             
          <Link
            href={`/invoice/retailers/${id}`}                                                                                                                                             
            className="min-w-0 flex-1 transition active:opacity-70"
          >                                                                                                                                                                               
            <div className="flex items-center gap-2">
              <p className="truncate text-[14px] font-medium leading-tight text-white">                                                                                                   
                {name}                                                                                                                                                                    
              </p>
              <span                                                                                                                                                                       
                className="shrink-0 px-1 py-0.5 text-[8px] uppercase tracking-[0.2em]"
                style={{                                                                                                                                                                  
                  fontFamily: MONO,
                  color: AMBER,                                                                                                                                                           
                  border: `1px solid ${AMBER}55`,
                }}                                                                                                                                                                        
              >
                {taxIdType}                                                                                                                                                               
              </span>
            </div>

            {companyName && (
              <p
                className="mt-1 truncate text-[10px] uppercase tracking-[0.18em]"
                style={{                                                                                                                                                                  
                  fontFamily: MONO,
                  color: "rgba(255,255,255,0.4)",                                                                                                                                         
                }}
              >                                                                                                                                                                           
                ↳ {companyName}
              </p>
            )}

            {/* Bill count + total — own line */}                                                                                                                                         
            <p
              className="mt-1 truncate text-[10px] uppercase tracking-[0.18em]"                                                                                                           
              style={{ fontFamily: MONO }}                                                                                                                                                
            >
              <span style={{ color: "rgba(255,255,255,0.6)" }}>                                                                                                                           
                {String(invoiceCount).padStart(2, "0")} bill                                                                                                                              
                {invoiceCount !== 1 ? "s" : ""}
              </span>                                                                                                                                                                     
              <span style={{ color: "rgba(255,255,255,0.2)" }}>
                {"  ·  "}                                                                                                                                                                 
              </span>                                                                                                                                                                     
              <span
                style={{                                                                                                                                                                  
                  color: hasInvoices
                    ? AMBER
                    : "rgba(255,255,255,0.3)",
                }}                                                                                                                                                                        
              >
                {hasInvoices ? inr.format(totalBilled) : "—"}                                                                                                                             
              </span>
            </p>
          </Link>                                                                                                                                                                         
  
          {/* Actions */}                                                                                                                                                                 
          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href={`/invoice/retailers/${id}/edit`}
              className="flex size-8 items-center justify-center transition active:opacity-70"                                                                                            
              style={{
                background: "rgba(255,255,255,0.03)",                                                                                                                                     
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.6)",                                                                                                                                           
              }}
              aria-label="Edit retailer"                                                                                                                                                  
            >     
              <PencilIcon className="size-3.5" />
            </Link>                                                                                                                                                                       
            <DeleteEntityButton
              id={id}                                                                                                                                                                     
              onDelete={deleteRetailer}
              confirmMessage="Delete retailer? Remove invoices first."
              iconOnly                                                                                                                                                                    
            />
          </div>                                                                                                                                                                          
        </div>    
      </article>
    );
  }

  function PencilIcon({ className }: { className?: string }) {                                                                                                                            
    return (
      <svg                                                                                                                                                                                
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"                                                                                                                                                             
        strokeLinejoin="round"
        aria-hidden                                                                                                                                                                       
      >           
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>                                                                                                                                                                              
    );
  }   