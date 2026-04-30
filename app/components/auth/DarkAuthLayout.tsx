import Image from "next/image";  
import app_icon from "@/public/app_icon.svg";

export function DarkAuthLayout({                                                                                                                                                        
  kicker,                                                                                                                                                                               
  title,                                                                                                                                                                                
  children,                                                                                                                                                                             
}: {                                                                                                                                                                                    
  kicker: string;
  title: string;                                                                                                                                                                        
  children: React.ReactNode;
}) {                                                                                                                                                                                    
  return (      
    <main
      className="relative min-h-dvh w-full overflow-hidden"
      style={{                                                                                                                                                                          
        background: "#0a0a0d",
        paddingTop: "max(1rem, env(safe-area-inset-top))",                                                                                                                              
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",                                                                                                                        
      }}
    >                                                                                                                                                                                   
      {/* Warm radial glow at top */}
      <div                                                                                                                                                                              
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh]"                                                                                                               
        style={{                                                                                                                                                                        
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,158,11,0.16), transparent 65%)",                                                                                       
        }}                                                                                                                                                                              
      />
                                                                                                                                                                                        
      {/* Top hairline accent */}                                                                                                                                                       
      <div
        aria-hidden                                                                                                                                                                     
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{                                                                                                                                                                        
          background:
            "linear-gradient(90deg, transparent, rgba(245,158,11,0.45), transparent)",                                                                                                  
        }}                                                                                                                                                                              
      />
                                                                                                                                                                                        
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[420px] flex-col px-6">                                                                                              
        <div className="flex flex-1 flex-col justify-center py-6">                                                                                                                      
          {/* Hero icon */}
          <div className="mb-9 flex justify-center">                                                                                                                                    
            <div className="relative">
              <div                                                                                                                                                                      
                aria-hidden
                className="absolute inset-0 -z-10 scale-[2.6] rounded-full opacity-70 blur-2xl"                                                                                         
                style={{                                                                                                                                                                
                  background:
                    "radial-gradient(circle, rgba(245,158,11,0.55) 0%, transparent 60%)",                                                                                               
                }}
              />                                                                                                                                                                        
              <div
                className="flex size-[72px] items-center justify-center rounded-2xl"                                                                                                    
                style={{
                  background:                                                                                                                                                           
                    "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
                  border: "1px solid rgba(255,255,255,0.1)",                                                                                                                            
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 48px -12px rgba(0,0,0,0.6)",                                                                                          
                }}                                                                                                                                                                      
              >
                <Image                                                                                                                                                                  
                  src={app_icon}
                  alt=""                                                                                                                                                                
                  width={40}
                  height={40}                                                                                                                                                           
                  priority
                />
              </div>
            </div>
          </div>                                                                                                                                                                        

          {/* Heading */}                                                                                                                                                               
          <div className="mb-10 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span                                                                                                                                                                     
                aria-hidden
                className="h-px w-7"                                                                                                                                                    
                style={{ background: "rgba(245,158,11,0.45)" }}                                                                                                                         
              />
              <p                                                                                                                                                                        
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{                                                                                                                                                                
                  fontFamily: "var(--font-mono)",
                  color: "rgba(245,158,11,0.78)",                                                                                                                                       
                }}                                                                                                                                                                      
              >
                {kicker}                                                                                                                                                                
              </p>
              <span
                aria-hidden
                className="h-px w-7"
                style={{ background: "rgba(245,158,11,0.45)" }}
              />                                                                                                                                                                        
            </div>
            <h1                                                                                                                                                                         
              className="text-[38px] leading-[1.05] tracking-tight text-white"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}                                                                                                            
            >
              {title}                                                                                                                                                                   
            </h1>
          </div>                                                                                                                                                                        

          {children}                                                                                                                                                                    
        </div>  

        <footer className="py-5 text-center">
          <p
            className="text-[9px] uppercase tracking-[0.3em]"
            style={{                                                                                                                                                                    
              fontFamily: "var(--font-mono)",
              color: "rgba(255,255,255,0.22)",                                                                                                                                          
            }}                                                                                                                                                                          
          >
            secured · encrypted · audited                                                                                                                                               
          </p>  
        </footer>
      </div>
    </main>
  );
}
