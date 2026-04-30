import { getStore } from "@/app/(main)/invoice/store-actions";                                                                                                                          
  import { RetailersClient } from "./RetailersClient";                                                                                                                                    
   
  export type EnrichedRetailer = {                                                                                                                                                        
    id: string;   
    name: string;
    companyName: string | null;
    taxIdType: "GST" | "PAN";                                                                                                                                                             
    taxId: string;
    phone: string;                                                                                                                                                                        
    invoiceCount: number;
    totalBilled: number;                                                                                                                                                                  
  };
                                                                                                                                                                                          
  export default async function RetailersListPage() {
    const store = await getStore();
    const companyById = new Map(
      store.companies.map((c) => [c.id, c]),
    );                                                                                                                                                                                    
   
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
        total:                                                                                                                                                                            
          Math.round((cur.total + inv.invoiceAmount) * 100) / 100,
      });                                                                                                                                                                                 
    }
                                                                                                                                                                                          
    const enriched: EnrichedRetailer[] = store.retailers.map((r) => {
      const co = companyById.get(r.companyId);
      const stats = statsByRetailer.get(r.id);                                                                                                                                            
      return {
        id: r.id,                                                                                                                                                                         
        name: r.name,
        companyName: co?.name ?? null,
        taxIdType: r.taxIdType,
        taxId: r.taxId ?? "",                                                                                                                                                             
        phone: r.phone ?? "",
        invoiceCount: stats?.count ?? 0,                                                                                                                                                  
        totalBilled: stats?.total ?? 0,                                                                                                                                                   
      };
    });                                                                                                                                                                                   
                  
    return (
      <RetailersClient
        retailers={enriched}
        hasCompanies={store.companies.length > 0}
      />                                                                                                                                                                                  
    );
  }  