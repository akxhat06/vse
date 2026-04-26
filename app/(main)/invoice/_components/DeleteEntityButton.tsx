"use client";

import { useRouter } from "next/navigation";
import type { ActionResult } from "@/app/(main)/invoice/store-actions";

type Props = {
  id: string;
  label?: string;
  confirmMessage?: string;
  onDelete: (id: string) => Promise<ActionResult>;
};

export function DeleteEntityButton({
  id,
  label = "Delete",
  confirmMessage = "Delete this record?",
  onDelete,
}: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-950/50"
      onClick={async () => {
        if (!confirm(confirmMessage)) return;
        const r = await onDelete(id);
        if (!r.ok) alert(r.error);
        else router.refresh();
      }}
    >
      {label}
    </button>
  );
}
