import { redirect } from "next/navigation";

/** Legacy route — main app lives under `/home` with bottom navigation. */
export default function DashboardRedirectPage() {
  redirect("/home");
}
