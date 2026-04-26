import { redirect } from "next/navigation";

/** Settings hub removed — bottom nav opens Profile directly. */
export default function SettingsIndexPage() {
  redirect("/settings/profile");
}
