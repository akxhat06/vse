import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DarkAuthLayout } from "@/app/components/auth/DarkAuthLayout";
import { SignupForm } from "@/app/components/auth/SignupForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign up — VSE",
  description: "Create your VSE account",
};

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/home");

  return (
    <DarkAuthLayout kicker="JOIN VSE" title="Sign up">
      <SignupForm />
    </DarkAuthLayout>
  );
}
