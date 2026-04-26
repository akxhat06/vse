import { redirect } from "next/navigation";
import { AppHeader } from "@/app/components/navigation/AppHeader";
import { BottomNav } from "@/app/components/navigation/BottomNav";
import { createClient } from "@/lib/supabase/server";

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-dvh text-foreground">
      <AppHeader />
      <main className="mx-auto min-h-dvh w-full max-w-lg px-5 sm:px-6 pt-[calc(4.15rem+env(safe-area-inset-top))] pb-[calc(5.75rem+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
