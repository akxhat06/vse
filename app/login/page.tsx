import type { Metadata, Viewport } from "next";
  import { redirect } from "next/navigation";                                                                                          
  import { Suspense } from "react";
  import { DarkAuthLayout } from "@/app/components/auth/DarkAuthLayout";                                                               
  import { LoginForm } from "@/app/components/auth/LoginForm";                                                                         
  import { createClient } from "@/lib/supabase/server";
                                                                                                                                       
  export const metadata: Metadata = {                                                                                                  
    title: "Sign in — VSE",
    description: "Sign in to your invoice workspace",                                                                                  
  };              

  export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,                                                                                                                   
    viewportFit: "cover",
    interactiveWidget: "resizes-content",                                                                                              
  };              

  export default async function LoginPage() {
    const supabase = await createClient();
    const {                                                                                                                            
      data: { user },
    } = await supabase.auth.getUser();                                                                                                 
    if (user) redirect("/home");

    return (
      <DarkAuthLayout kicker="WELCOME BACK" title="Sign in">
        <Suspense                                                                                                                      
          fallback={
            <p className="text-center text-sm text-[#9d98b8]">Loading…</p>                                                             
          }                                                                                                                            
        >
          <LoginForm />                                                                                                                
        </Suspense>
      </DarkAuthLayout>
    );
  }
