"use client";                                                                                                                                                                           
                                                                                                                                                                                          
  import Link from "next/link";                                                                                                                                                           
  import { useRouter } from "next/navigation";
  import { type FormEvent, useEffect, useState } from "react";                                                                                                                            
  import { createClient } from "@/lib/supabase/client";
                                                                                                                                                                                          
  const MONO = "var(--font-mono)";
  const AMBER = "rgb(245,158,11)";                                                                                                                                                        
                                                                                                                                                                                          
  function useKeyboardInset() {
    const [inset, setInset] = useState(0);                                                                                                                                                
    useEffect(() => {                                                                                                                                                                     
      if (typeof window === "undefined") return;
      if (!window.visualViewport) return;                                                                                                                                                 
      const vv = window.visualViewport;                                                                                                                                                   
      const update = () => {
        const gap = window.innerHeight - vv.height - vv.offsetTop;                                                                                                                        
        setInset(gap > 80 ? gap : 0);                                                                                                                                                     
      };
      update();                                                                                                                                                                           
      vv.addEventListener("resize", update);
      vv.addEventListener("scroll", update);                                                                                                                                              
      return () => {
        vv.removeEventListener("resize", update);                                                                                                                                         
        vv.removeEventListener("scroll", update);
      };                                                                                                                                                                                  
    }, []);
    return inset;                                                                                                                                                                         
  }               

  const labelStyle: React.CSSProperties = {
    fontFamily: MONO,
    color: "rgba(255,255,255,0.5)",
  };                                                                                                                                                                                      
   
  const indexStyle: React.CSSProperties = {                                                                                                                                               
    fontFamily: MONO,
    color: "rgba(255,255,255,0.22)",                                                                                                                                                      
  };              

  const underlineBase: React.CSSProperties = {                                                                                                                                            
    borderBottom: "1px solid rgba(255,255,255,0.12)",
  };                                                                                                                                                                                      
                  
  const underlineSweep: React.CSSProperties = {                                                                                                                                           
    background: `linear-gradient(90deg, ${AMBER}, rgba(245,158,11,0))`,
  };                                                                                                                                                                                      
                  
  const toggleStyle: React.CSSProperties = {                                                                                                                                              
    fontFamily: MONO,
    color: "rgba(255,255,255,0.45)",
  };                                                                                                                                                                                      
   
  function FieldLabel(props: { children: string; index: string }) {                                                                                                                       
    return (      
      <div className="mb-2.5 flex items-baseline justify-between">                                                                                                                        
        <label    
          className="text-[10px] uppercase tracking-[0.25em]"                                                                                                                             
          style={labelStyle}
        >                                                                                                                                                                                 
          {props.children}
        </label>
        <span className="text-[9px]" style={indexStyle}>
          {props.index}                                                                                                                                                                   
        </span>
      </div>                                                                                                                                                                              
    );            
  }

  const inputClass =                                                                                                                                                                      
    "peer w-full bg-transparent pb-3 text-base text-white " +
    "outline-none placeholder:text-white/15";                                                                                                                                             
                                                                                                                                                                                          
  const inputClassWithToggle =                                                                                                                                                            
    "peer w-full bg-transparent pb-3 pr-14 text-base text-white " +                                                                                                                       
    "outline-none placeholder:text-white/15";                                                                                                                                             
   
  const sweepClass =                                                                                                                                                                      
    "pointer-events-none absolute inset-x-0 -bottom-px h-px " +
    "origin-left scale-x-0 transition-transform duration-500 " +                                                                                                                          
    "ease-out peer-focus:scale-x-100";                                                                                                                                                    
                                                                                                                                                                                          
  const toggleClass =                                                                                                                                                                     
    "absolute bottom-3 right-0 px-1 text-[10px] uppercase " +                                                                                                                             
    "tracking-[0.2em] transition active:opacity-60";                                                                                                                                      
   
  export function SignupForm() {                                                                                                                                                          
    const router = useRouter();
    const keyboardInset = useKeyboardInset();                                                                                                                                             
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);                                                                                                                                
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);                                                                                                                                
    const [loading, setLoading] = useState(false);                                                                                                                                        
   
    function onFocusScroll(e: React.FocusEvent<HTMLInputElement>) {                                                                                                                       
      const el = e.currentTarget;
      window.setTimeout(() => {                                                                                                                                                           
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 250);                                                                                                                                                                            
    }             
                                                                                                                                                                                          
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setError(null);
      setInfo(null);
                                                                                                                                                                                          
      const form = new FormData(e.currentTarget);
      const name = String(form.get("name") ?? "").trim();                                                                                                                                 
      const email = String(form.get("email") ?? "").trim();                                                                                                                               
      const password = String(form.get("password") ?? "");
      const confirm = String(form.get("confirmPassword") ?? "");                                                                                                                          
                                                                                                                                                                                          
      if (password !== confirm) {
        setError("Passwords do not match.");                                                                                                                                              
        return;   
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");                                                                                                                              
        return;
      }                                                                                                                                                                                   
                  
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error: signError } = await supabase.auth.signUp({
          email,                                                                                                                                                                          
          password,
          options: {                                                                                                                                                                      
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: { full_name: name },                                                                                                                                                    
          },
        });                                                                                                                                                                               
        if (signError) {
          setError(signError.message);
          return;
        }
        if (data.session) {
          router.push("/home");                                                                                                                                                           
          router.refresh();
          return;                                                                                                                                                                         
        }         
        setInfo(
          "Check your email for a confirmation link before signing in.",
        );                                                                                                                                                                                
      } catch {
        setError("Something went wrong. Try again.");                                                                                                                                     
      } finally { 
        setLoading(false);                                                                                                                                                                
      }
    }                                                                                                                                                                                     
                  
    return (
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 transition-[padding] duration-200 ease-out"
        style={{                                                                                                                                                                          
          paddingBottom: keyboardInset
            ? `${keyboardInset + 16}px`                                                                                                                                                   
            : undefined,
        }}                                                                                                                                                                                
      >           
        {error && (
          <div
            className="flex items-start gap-3 px-4 py-3 text-[12px]"
            style={{                                                                                                                                                                      
              background: "rgba(248,113,113,0.06)",                                                                                                                                       
              borderLeft: "2px solid rgba(248,113,113,0.6)",                                                                                                                              
              color: "rgba(252,165,165,0.95)",                                                                                                                                            
              fontFamily: MONO,
              letterSpacing: "0.02em",                                                                                                                                                    
            }}    
          >                                                                                                                                                                               
            <span className="mt-0.5 shrink-0 font-bold">!</span>
            <span className="leading-relaxed uppercase tracking-wider">                                                                                                                   
              {error}                                                                                                                                                                     
            </span>                                                                                                                                                                       
          </div>                                                                                                                                                                          
        )}        

        {info && (
          <div
            className="flex items-start gap-3 px-4 py-3 text-[12px]"
            style={{
              background: "rgba(245,158,11,0.06)",                                                                                                                                        
              borderLeft: "2px solid rgba(245,158,11,0.7)",
              color: "rgba(252,211,77,0.95)",                                                                                                                                             
              fontFamily: MONO,                                                                                                                                                           
              letterSpacing: "0.02em",
            }}                                                                                                                                                                            
          >       
            <span className="mt-0.5 shrink-0 font-bold">✦</span>                                                                                                                          
            <span className="leading-relaxed uppercase tracking-wider">
              {info}                                                                                                                                                                      
            </span>                                                                                                                                                                       
          </div>
        )}                                                                                                                                                                                
                  
        {/* Full name */}
        <div>
          <FieldLabel index="01">Full name</FieldLabel>
          <div className="relative">                                                                                                                                                      
            <input
              id="signup-name"                                                                                                                                                            
              name="name"
              type="text"                                                                                                                                                                 
              autoComplete="name"
              autoCapitalize="words"                                                                                                                                                      
              placeholder="Jane Cooper"
              onFocus={onFocusScroll}                                                                                                                                                     
              className={inputClass}
              style={underlineBase}                                                                                                                                                       
            />    
            <span
              aria-hidden                                                                                                                                                                 
              className={sweepClass}
              style={underlineSweep}                                                                                                                                                      
            />    
          </div>
        </div>

        {/* Email */}                                                                                                                                                                     
        <div>
          <FieldLabel index="02">Email</FieldLabel>                                                                                                                                       
          <div className="relative">
            <input
              id="signup-email"
              name="email"
              type="email"
              inputMode="email"                                                                                                                                                           
              autoComplete="email"
              autoCapitalize="none"                                                                                                                                                       
              autoCorrect="off"
              spellCheck={false}
              required                                                                                                                                                                    
              placeholder="you@company.com"
              onFocus={onFocusScroll}                                                                                                                                                     
              className={inputClass}
              style={underlineBase}                                                                                                                                                       
            />
            <span                                                                                                                                                                         
              aria-hidden
              className={sweepClass}
              style={underlineSweep}
            />
          </div>
        </div>

        {/* Password */}                                                                                                                                                                  
        <div>
          <FieldLabel index="03">Password</FieldLabel>                                                                                                                                    
          <div className="relative">
            <input
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"                                                                                                                                                 
              autoCapitalize="none"
              autoCorrect="off"                                                                                                                                                           
              spellCheck={false}
              required                                                                                                                                                                    
              minLength={6}
              placeholder="min. 6 characters"                                                                                                                                             
              onFocus={onFocusScroll}
              className={inputClassWithToggle}
              style={underlineBase}                                                                                                                                                       
            />
            <button                                                                                                                                                                       
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={toggleClass}                                                                                                                                                     
              style={toggleStyle}
              aria-label={                                                                                                                                                                
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>                                                                                                                                                                     
            <span
              aria-hidden                                                                                                                                                                 
              className={sweepClass}
              style={underlineSweep}
            />
          </div>
        </div>                                                                                                                                                                            
   
        {/* Confirm password */}                                                                                                                                                          
        <div>     
          <FieldLabel index="04">Confirm</FieldLabel>
          <div className="relative">
            <input
              id="signup-confirm"
              name="confirmPassword"                                                                                                                                                      
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"                                                                                                                                                 
              autoCapitalize="none"
              autoCorrect="off"                                                                                                                                                           
              spellCheck={false}
              required                                                                                                                                                                    
              minLength={6}
              placeholder="repeat password"
              onFocus={onFocusScroll}
              className={inputClassWithToggle}                                                                                                                                            
              style={underlineBase}
            />                                                                                                                                                                            
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className={toggleClass}
              style={toggleStyle}                                                                                                                                                         
              aria-label={
                showConfirm ? "Hide password" : "Show password"                                                                                                                           
              }   
            >
              {showConfirm ? "Hide" : "Show"}
            </button>                                                                                                                                                                     
            <span
              aria-hidden                                                                                                                                                                 
              className={sweepClass}
              style={underlineSweep}
            />
          </div>
        </div>

        {/* Fine print */}                                                                                                                                                                
        <p
          className="text-[10px] leading-relaxed"                                                                                                                                         
          style={{
            fontFamily: MONO,
            color: "rgba(255,255,255,0.35)",                                                                                                                                              
            letterSpacing: "0.02em",
          }}                                                                                                                                                                              
        >         
          By creating an account you agree to the{" "}
          <Link                                                                                                                                                                           
            href="/terms"
            className="underline underline-offset-2"                                                                                                                                      
            style={{ color: "rgba(245,158,11,0.85)" }}                                                                                                                                    
          >
            terms                                                                                                                                                                         
          </Link>{" "}
          and{" "}
          <Link                                                                                                                                                                           
            href="/privacy"
            className="underline underline-offset-2"                                                                                                                                      
            style={{ color: "rgba(245,158,11,0.85)" }}
          >
            privacy policy
          </Link>                                                                                                                                                                         
          .
        </p>                                                                                                                                                                              
                  
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={
            "group relative mt-2 flex w-full items-center " +                                                                                                                             
            "justify-between overflow-hidden px-5 py-4 transition " +
            "active:scale-[0.99] disabled:opacity-50"                                                                                                                                     
          }       
          style={{                                                                                                                                                                        
            background: AMBER,
            color: "#0a0a0d",
            boxShadow:
              "0 14px 36px -12px rgba(245,158,11,0.55), " +                                                                                                                               
              "inset 0 1px 0 rgba(255,255,255,0.3)",
          }}                                                                                                                                                                              
        >         
          <span                                                                                                                                                                           
            className="text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ fontFamily: MONO }}
          >
            {loading ? "Creating" : "Open account"}                                                                                                                                       
          </span>
          <span className="text-base">                                                                                                                                                    
            {loading ? (
              <span className="inline-flex gap-1">
                <span                                                                                                                                                                     
                  className="size-1 animate-pulse rounded-full"
                  style={{ background: "#0a0a0d" }}                                                                                                                                       
                />
                <span
                  className="size-1 animate-pulse rounded-full"
                  style={{                                                                                                                                                                
                    background: "#0a0a0d",
                    animationDelay: "200ms",                                                                                                                                              
                  }}
                />
                <span
                  className="size-1 animate-pulse rounded-full"
                  style={{                                                                                                                                                                
                    background: "#0a0a0d",
                    animationDelay: "400ms",                                                                                                                                              
                  }}
                />
              </span>
            ) : (
              <span className="transition-transform group-hover:translate-x-1">
                →                                                                                                                                                                         
              </span>
            )}                                                                                                                                                                            
          </span> 
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 pt-2">
          <div                                                                                                                                                                            
            className="h-px flex-1"
            style={{ background: "rgba(255,255,255,0.08)" }}                                                                                                                              
          />      
          <span
            className="text-[9px] uppercase tracking-[0.3em]"                                                                                                                             
            style={{
              fontFamily: MONO,                                                                                                                                                           
              color: "rgba(255,255,255,0.3)",
            }}                                                                                                                                                                            
          >
            Have an account                                                                                                                                                               
          </span> 
          <div
            className="h-px flex-1"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
        </div>
                                                                                                                                                                                          
        {/* Sign in link */}
        <div className="text-center">                                                                                                                                                     
          <Link   
            href="/login"
            className={
              "inline-flex items-center gap-2 text-[11px] " +
              "uppercase tracking-[0.25em] transition active:opacity-70"                                                                                                                  
            }
            style={{                                                                                                                                                                      
              fontFamily: MONO,
              color: "rgba(255,255,255,0.75)",
            }}                                                                                                                                                                            
          >
            <span>Sign in</span>                                                                                                                                                          
            <span style={{ color: AMBER }}>→</span>
          </Link>
        </div>
      </form>                                                                                                                                                                             
    );
  }