"use client";                      

  import { useRouter } from "next/navigation";                                                                                                                                            
  import type { ActionResult } from "@/app/(main)/invoice/store-actions";
                                                                                                                                                                                          
  const RED = "rgb(248,113,113)";
  const MONO = "var(--font-mono)";
                                                                                                                                                                                          
  type Props = {
    id: string;                                                                                                                                                                           
    label?: string;
    confirmMessage?: string;
    onDelete: (id: string) => Promise<ActionResult>;
    iconOnly?: boolean;                                                                                                                                                                   
    /** Used inside row-of-actions on cards — sized to match sibling links */
    variant?: "default" | "card";                                                                                                                                                         
  };                                                                                                                                                                                      
                                                                                                                                                                                          
  export function DeleteEntityButton({                                                                                                                                                    
    id,           
    label = "Delete",
    confirmMessage = "Delete this record?",
    onDelete,
    iconOnly = false,
    variant = "default",                                                                                                                                                                  
  }: Props) {
    const router = useRouter();                                                                                                                                                           
                  
    const handleClick = async () => {
      if (!confirm(confirmMessage)) return;
      const r = await onDelete(id);
      if (!r.ok) alert(r.error);                                                                                                                                                          
      else router.refresh();
    };                                                                                                                                                                                    
                  
    /* ── iconOnly: tiny square (ledger rows) ── */                                                                                                                                       
    if (iconOnly) {
      return (                                                                                                                                                                            
        <button   
          type="button"
          aria-label={label}
          onClick={handleClick}
          className="flex size-8 shrink-0 items-center justify-center transition active:opacity-60"                                                                                       
          style={{
            background: "transparent",                                                                                                                                                    
            border: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.35)",                                                                                                                                              
          }}
          onMouseEnter={(e) => {                                                                                                                                                          
            const el = e.currentTarget as HTMLElement;
            el.style.color = RED;                                                                                                                                                         
            el.style.borderColor = "rgba(248,113,113,0.4)";
            el.style.background = "rgba(248,113,113,0.06)";                                                                                                                               
          }}      
          onMouseLeave={(e) => {                                                                                                                                                          
            const el = e.currentTarget as HTMLElement;
            el.style.color = "rgba(255,255,255,0.35)";                                                                                                                                    
            el.style.borderColor = "rgba(255,255,255,0.06)";
            el.style.background = "transparent";                                                                                                                                          
          }}                                                                                                                                                                              
        >
          <TrashIcon className="size-3.5" />                                                                                                                                              
        </button> 
      );
    }

    /* ── card: matches the Open link sizing on cards ── */                                                                                                                               
    if (variant === "card") {
      return (                                                                                                                                                                            
        <button   
          type="button"
          aria-label={label}
          onClick={handleClick}
          className="flex shrink-0 items-center justify-center px-3 py-2 transition active:opacity-70"
          style={{                                                                                                                                                                        
            background: "rgba(248,113,113,0.04)",
            border: "1px solid rgba(248,113,113,0.2)",                                                                                                                                    
            color: "rgba(248,113,113,0.7)",                                                                                                                                               
          }}
          onMouseEnter={(e) => {                                                                                                                                                          
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(248,113,113,0.12)";                                                                                                                               
            el.style.color = RED;
          }}                                                                                                                                                                              
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;                                                                                                                                    
            el.style.background = "rgba(248,113,113,0.04)";
            el.style.color = "rgba(248,113,113,0.7)";                                                                                                                                     
          }}                                                                                                                                                                              
        >
          <TrashIcon className="size-3.5" />                                                                                                                                              
        </button> 
      );
    }

    /* ── default: mono caps text button ── */                                                                                                                                            
    return (
      <button                                                                                                                                                                             
        type="button"
        onClick={handleClick}
        className="flex items-center gap-2 px-4 py-2.5 transition active:opacity-70"
        style={{                                                                                                                                                                          
          fontFamily: MONO,
          background: "rgba(248,113,113,0.06)",                                                                                                                                           
          border: "1px solid rgba(248,113,113,0.25)",
          color: "rgba(248,113,113,0.85)",                                                                                                                                                
        }}
        onMouseEnter={(e) => {                                                                                                                                                            
          (e.currentTarget as HTMLElement).style.background =
            "rgba(248,113,113,0.14)";                                                                                                                                                     
        }}
        onMouseLeave={(e) => {                                                                                                                                                            
          (e.currentTarget as HTMLElement).style.background =
            "rgba(248,113,113,0.06)";                                                                                                                                                     
        }}
      >                                                                                                                                                                                   
        <TrashIcon className="size-3" />
        <span className="text-[10px] uppercase tracking-[0.25em]">
          {label}                                                                                                                                                                         
        </span>
      </button>                                                                                                                                                                           
    );            
  }

  function TrashIcon({ className }: { className?: string }) {                                                                                                                             
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
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />                                                                                                                        
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />                                                                                                                               
      </svg>      
    );                                                                                                                                                                                    
  }  