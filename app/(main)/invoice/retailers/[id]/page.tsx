import Link from "next/link";                                                                                                                                                           
  import { notFound } from "next/navigation";                                                                                                                                             
  import { RetailerForm } from "@/app/(main)/invoice/_components/RetailerForm";                                                                                                           
  import { safePostSaveRedirect } from "@/app/(main)/invoice/redirect-utils";                                                                                                             
  import { getStore } from "@/app/(main)/invoice/store-actions";                                                                                                                          
                                                                                                                                                                                          
  const AMBER = "rgb(245,158,11)";                                                                                                                                                        
  const MONO = "var(--font-mono)";                                                                                                                                                        
  const DISPLAY = "var(--font-display)";                                                                                                                                                  
                                                                                                                                                                                          
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
                                                                                                                                                                                          
    return (      
      <div className="mx-auto max-w-2xl space-y-6 pb-6">
        {/* Back */}                                                                                                                                                                      
        <Link
          href="/invoice/retailers"                                                                                                                                                       
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] transition active:opacity-70"                                                               
          style={{                                                                                                                                                                        
            fontFamily: MONO,                                                                                                                                                             
            color: "rgba(255,255,255,0.5)",                                                                                                                                               
          }}                                                                                                                                                                              
        >
          <span style={{ color: AMBER }}>←</span>                                                                                                                                         
          <span>Retailers</span>
        </Link>                                                                                                                                                                           
  
        {/* Heading */}                                                                                                                                                                   
        <header>  
          <p
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ fontFamily: MONO, color: AMBER }}                                                                                                                                    
          >
            Update entry                                                                                                                                                                  
          </p>                                                                                                                                                                            
          <h1
            className="mt-1 text-[28px] leading-none text-white"                                                                                                                          
            style={{                                                                                                                                                                      
              fontFamily: DISPLAY,
              fontWeight: 400,                                                                                                                                                            
              letterSpacing: "-0.01em",
            }}                                                                                                                                                                            
          >
            {retailer.name}                                                                                                                                                               
          </h1>   
          <p
            className="mt-2 text-[10px] uppercase tracking-[0.2em]"
            style={{                                                                                                                                                                      
              fontFamily: MONO,
              color: "rgba(255,255,255,0.4)",                                                                                                                                             
            }}    
          >
            Edit retailer details below.
          </p>                                                                                                                                                                            
        </header>
                                                                                                                                                                                          
        <RetailerForm
          companies={store.companies}
          initial={retailer}                                                                                                                                                              
          redirectTo={redirectTo}
        />                                                                                                                                                                                
      </div>      
    );
  }