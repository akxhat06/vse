import Link from "next/link";   
  import { notFound } from "next/navigation";
  import { DeleteEntityButton } from "@/app/(main)/invoice/_components/DeleteEntityButton";                                                                                               
  import { InvoiceForm } from "@/app/(main)/invoice/_components/InvoiceForm";
  import { safePostSaveRedirect } from "@/app/(main)/invoice/redirect-utils";                                                                                                             
  import {                                                                                                                                                                                
    deleteInvoice,                                                                                                                                                                        
    getStore,                                                                                                                                                                             
  } from "@/app/(main)/invoice/store-actions";

  const AMBER = "rgb(245,158,11)";                                                                                                                                                        
  const MONO = "var(--font-mono)";
  const DISPLAY = "var(--font-display)";                                                                                                                                                  
                                                                                                                                                                                          
  type Props = {
    params: Promise<{ id: string }>;                                                                                                                                                      
    searchParams?: Promise<{ returnTo?: string }>;
  };                                                                                                                                                                                      
   
  export default async function EditInvoicePage({                                                                                                                                         
    params,       
    searchParams,
  }: Props) {
    const { id } = await params;
    const sp = (await searchParams) ?? {};
    const redirectTo = safePostSaveRedirect(                                                                                                                                              
      typeof sp.returnTo === "string" ? sp.returnTo : undefined,
      "/invoice/invoices",                                                                                                                                                                
    );                                                                                                                                                                                    
    const store = await getStore();
    const invoice = store.invoices.find((i) => i.id === id);                                                                                                                              
    if (!invoice) notFound();

    return (
      <div className="mx-auto max-w-2xl space-y-6 pb-6">
        {/* Back */}                                                                                                                                                                      
        <Link
          href={redirectTo}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] transition active:opacity-70"                                                               
          style={{                                                                                                                                                                        
            fontFamily: MONO,                                                                                                                                                             
            color: "rgba(255,255,255,0.5)",                                                                                                                                               
          }}                                                                                                                                                                              
        >                                                                                                                                                                                 
          <span style={{ color: AMBER }}>←</span>
          <span>{redirectTo === "/invoice/invoices" ? "Invoices" : "Back"}</span>
        </Link>   
                                                                                                                                                                                          
        {/* Heading + Delete */}
        <header className="flex items-end justify-between gap-3">                                                                                                                         
          <div>   
            <p
              className="text-[10px] uppercase tracking-[0.3em]"                                                                                                                          
              style={{ fontFamily: MONO, color: AMBER }}
            >                                                                                                                                                                             
              Update entry
            </p>                                                                                                                                                                          
            <h1   
              className="mt-1 text-[26px] leading-none text-white"
              style={{                                                                                                                                                                    
                fontFamily: DISPLAY,
                fontWeight: 400,                                                                                                                                                          
                letterSpacing: "-0.01em",                                                                                                                                                 
              }}
            >                                                                                                                                                                             
              {invoice.invoiceNo}
            </h1>
          </div>
                                                                                                                                                                                          
          <DeleteEntityButton
            id={invoice.id}                                                                                                                                                               
            onDelete={deleteInvoice}
            confirmMessage="Delete this invoice? Remove payments and credit notes first."
          />                                                                                                                                                                              
        </header>
                                                                                                                                                                                          
        <InvoiceForm
          companies={store.companies}
          retailers={store.retailers}
          initial={invoice}
          redirectTo={redirectTo}
        />                                                                                                                                                                                
      </div>
    );                                                                                                                                                                                    
  } 