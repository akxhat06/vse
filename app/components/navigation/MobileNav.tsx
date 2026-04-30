"use client";
                                                                                                                                                                                          
  import Link from "next/link";
  import { usePathname } from "next/navigation";
                                                                                                                                                                                          
  const AMBER = "rgb(245,158,11)";
  const MONO = "var(--font-mono)";                                                                                                                                                        
                  
  const NAV = [
    { href: "/home",              label: "Home",      icon: HomeIcon },
    { href: "/invoice/companies", label: "Companies",     icon: BuildingIcon },                                                                                                               
    { href: "/invoice/retailers", label: "Retailers",    icon: StoreIcon },
    { href: "/invoice/invoices",  label: "Bills",     icon: InvoiceIcon },                                                                                                                
  ];              
                                                                                                                                                                                          
  function isActive(href: string, pathname: string) {                                                                                                                                     
    if (href === "/home") return pathname === "/home";
    return pathname === href || pathname.startsWith(href + "/");                                                                                                                          
  }               

  export function MobileNav() {                                                                                                                                                           
    const pathname = usePathname();
                                                                                                                                                                                          
    return (      
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          background: "#0a0a0d",                                                                                                                                                          
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}                                                                                                                                                                                
        aria-label="Mobile navigation"                                                                                                                                                    
      >
        {/* Soft amber wash above the bar */}                                                                                                                                             
        <div                                                                                                                                                                              
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-8 h-8"                                                                                                                   
          style={{                                                                                                                                                                        
            background:
              "linear-gradient(180deg, transparent, rgba(245,158,11,0.06))",                                                                                                              
          }}                                                                                                                                                                              
        />
                                                                                                                                                                                          
        {/* Top hairline glow */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{                                                                                                                                                                        
            background: `linear-gradient(90deg, transparent, ${AMBER}, transparent)`,
            opacity: 0.5,                                                                                                                                                                 
          }}                                                                                                                                                                              
        />
                                                                                                                                                                                          
        <ul className="flex items-stretch">
          {NAV.map(({ href, label, icon: Icon }, i) => {
            const active = isActive(href, pathname);
            return (                                                                                                                                                                      
              <li key={href} className="relative flex-1">
                {/* Vertical hairline between tabs */}                                                                                                                                    
                {i > 0 && (
                  <span                                                                                                                                                                   
                    aria-hidden
                    className="pointer-events-none absolute inset-y-3 left-0 w-px"                                                                                                        
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  />                                                                                                                                                                      
                )}
                                                                                                                                                                                          
                <Link
                  href={href}
                  className="relative flex flex-col items-center justify-center gap-1.5 py-3 transition-opacity active:opacity-60"
                  style={{                                                                                                                                                                
                    color: active ? AMBER : "rgba(255,255,255,0.4)",
                  }}                                                                                                                                                                      
                  aria-current={active ? "page" : undefined}
                >                                                                                                                                                                         
                  {/* Active top marker */}
                  {active && (                                                                                                                                                            
                    <>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-5 top-0 h-px"
                        style={{                                                                                                                                                          
                          background: AMBER,
                          boxShadow: `0 0 8px ${AMBER}`,                                                                                                                                  
                        }}                                                                                                                                                                
                      />
                      <span                                                                                                                                                               
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 inset-y-0"
                        style={{
                          background:                                                                                                                                                     
                            "linear-gradient(180deg, rgba(245,158,11,0.07), transparent 70%)",
                        }}                                                                                                                                                                
                      />
                    </>
                  )}                                                                                                                                                                      
   
                  <span className="relative">                                                                                                                                             
                    <Icon active={active} />
                  </span>

                  <span
                    className="relative text-[9px] uppercase tracking-[0.22em]"
                    style={{ fontFamily: MONO }}                                                                                                                                          
                  >
                    {label}                                                                                                                                                               
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );                                                                                                                                                                                    
  }
                                                                                                                                                                                          
  /* ── Icons — minimal, single stroke, no fills ── */                                                                                                                                    
   
  function HomeIcon({ active }: { active: boolean }) {                                                                                                                                    
    return (      
      <svg
        className="size-[18px]"
        viewBox="0 0 24 24"                                                                                                                                                               
        fill="none"
        stroke="currentColor"                                                                                                                                                             
        strokeWidth={active ? 1.6 : 1.3}
        strokeLinecap="round"                                                                                                                                                             
        strokeLinejoin="round"
        aria-hidden                                                                                                                                                                       
      >           
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
      </svg>                                                                                                                                                                              
    );
  }                                                                                                                                                                                       
                  
  function BuildingIcon({ active }: { active: boolean }) {                                                                                                                                
    return (
      <svg                                                                                                                                                                                
        className="size-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 1.6 : 1.3}                                                                                                                                                  
        strokeLinecap="round"
        strokeLinejoin="round"                                                                                                                                                            
        aria-hidden
      >                                                                                                                                                                                   
        <rect x="4" y="2" width="16" height="20" />
        <path d="M9 22V14h6v8" />                                                                                                                                                         
        <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01" />                                                                                                              
      </svg>                                                                                                                                                                              
    );                                                                                                                                                                                    
  }                                                                                                                                                                                       
                  
  function StoreIcon({ active }: { active: boolean }) {                                                                                                                                   
    return (
      <svg                                                                                                                                                                                
        className="size-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 1.6 : 1.3}                                                                                                                                                  
        strokeLinecap="round"
        strokeLinejoin="round"                                                                                                                                                            
        aria-hidden
      >
        <path d="M3 9l1-5h16l1 5" />
        <path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />                                                                                                         
        <path d="M5 22V11M19 22V11M9 22v-7h6v7" />                                                                                                                                        
      </svg>                                                                                                                                                                              
    );                                                                                                                                                                                    
  }                                                                                                                                                                                       
                  
  function InvoiceIcon({ active }: { active: boolean }) {
    return (
      <svg
        className="size-[18px]"                                                                                                                                                           
        viewBox="0 0 24 24"
        fill="none"                                                                                                                                                                       
        stroke="currentColor"
        strokeWidth={active ? 1.6 : 1.3}
        strokeLinecap="round"                                                                                                                                                             
        strokeLinejoin="round"
        aria-hidden                                                                                                                                                                       
      >           
        <path d="M8 4h8a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z" />
        <path d="M9 9h6M9 12h6M9 15h4" />                                                                                                                                                 
      </svg>                                                                                                                                                                              
    );                                                                                                                                                                                    
  }      