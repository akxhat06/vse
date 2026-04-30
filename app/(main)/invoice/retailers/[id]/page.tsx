import { notFound } from "next/navigation";                                                                                                                                             
  import { safePostSaveRedirect } from "@/app/(main)/invoice/redirect-utils";
  import { getStore } from "@/app/(main)/invoice/store-actions";                                                                                                                          
  import { EditRetailerClient } from "./EditRetailerClient";
  import type { CreditNote } from "@/lib/store/types";

  type Props = {  
    params: Promise<{ id: string }>;                                                                                                                                                      
    searchParams?: Promise<{ returnTo?: string }>;
  };                                                                                                                                                                                      
   
  export default async function EditRetailerPage({                                                                                                                                        
    params,       
    searchParams,
  }: Props) {
    const { id } = await params;
    const sp = (await searchParams) ?? {};                                                                                                                                                
    const redirectTo = safePostSaveRedirect(
      typeof sp.returnTo === "string" ? sp.returnTo : undefined,                                                                                                                          
      "/invoice/retailers",                                                                                                                                                               
    );
                                                                                                                                                                                          
    const store = await getStore();
    const retailer = store.retailers.find((r) => r.id === id);
    if (!retailer) notFound();                                                                                                                                                            
   
    const myInvoices = store.invoices.filter(                                                                                                                                             
      (i) => i.retailerId === id,
    );
    const myInvoiceIds = new Set(myInvoices.map((i) => i.id));
                                                                                                                                                                                          
    const myPayments = (store.payments ?? []).filter(
      (p: { invoiceId?: string; retailerId?: string }) =>                                                                                                                                 
        (p.invoiceId && myInvoiceIds.has(p.invoiceId)) ||                                                                                                                                 
        p.retailerId === id,
    );                                                                                                                                                                                    
                  
    const allCreditNotes: CreditNote[] = store.creditNotes ?? [];                                                                                                                           
    const myCreditNotes = allCreditNotes
      .filter((cn) => {                                                                                                                                                                     
        // adjust the field names below to match your CreditNote shape
        const cnRetailerId = (cn as { retailerId?: string }).retailerId;                                                                                                                    
        const cnInvoiceId = (cn as { invoiceId?: string }).invoiceId;                                                                                                                       
        return (                                                                                                                                                                            
          cnRetailerId === id ||                                                                                                                                                            
          (cnInvoiceId !== undefined && myInvoiceIds.has(cnInvoiceId))                                                                                                                      
        );          
      })
      .map((cn) => ({                                                                                                                                                                       
        id: cn.id,
        // 👇 change `noteAmount` to whatever your real amount field is called                                                                                                              
        amount: (cn as { noteAmount?: number; total?: number; amount?: number }).noteAmount                                                                                                 
          ?? (cn as { total?: number }).total                                                                                                                                               
          ?? 0,                                                                                                                                                                             
        date: (cn as { date?: string }).date,                                                                                                                                               
        noteNumber: (cn as { noteNumber?: string; number?: string }).noteNumber,                                                                                                            
      }));                                                                                                                                                                                    
                  
    return (
      <EditRetailerClient
        retailer={retailer}                                                                                                                                                               
        companies={store.companies}
        redirectTo={redirectTo}                                                                                                                                                           
        invoices={myInvoices}
        payments={myPayments}                                                                                                                                                             
        creditNotes={myCreditNotes}
      />                                                                                                                                                                                  
    );            
  }