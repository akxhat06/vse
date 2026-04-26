"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type UpdateProfileState = { ok?: boolean; error?: string };

export async function updateProfile(
  _prev: UpdateProfileState | undefined,
  formData: FormData,
): Promise<UpdateProfileState> {
  const username = String(formData.get("username") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      username,
      phone,
      address,
    },
  });

  if (error) return { error: error.message };

  revalidatePath("/settings/profile");
  revalidatePath("/settings");
  revalidatePath("/home");
  return { ok: true };
}
