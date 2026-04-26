import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name =
    (user?.user_metadata?.username as string | undefined)?.trim() ||
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <div className="px-5 pt-10">
      <p className="text-sm font-medium text-zinc-500">Welcome back</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
        Hi, {name}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        Here&apos;s your workspace. Use the bar below for invoices or your
        profile.
      </p>

      <div className="mt-8 grid gap-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Quick glance
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            Draft and send invoices, track payments, and manage your account
            from one place.
          </p>
        </div>
      </div>
    </div>
  );
}
