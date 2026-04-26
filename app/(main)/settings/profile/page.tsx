import { createClient } from "@/lib/supabase/server";
import { ProfileForm, type ProfileInitial } from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const meta = user?.user_metadata ?? {};
  const initial: ProfileInitial = {
    email: user?.email ?? null,
    username: String(meta.username ?? ""),
    phone: String(meta.phone ?? ""),
    address: String(meta.address ?? ""),
    avatarUrl: String(meta.avatar_url ?? ""),
    displayName: String(meta.full_name ?? meta.username ?? user?.email ?? ""),
  };

  return (
    <div className="min-h-full pb-28 pt-6 font-sans text-foreground">
      <ProfileForm initial={initial} />
    </div>
  );
}
