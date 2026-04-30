"use client";

import { useRouter } from "next/navigation";
import type { ActionResult } from "@/app/(main)/invoice/store-actions";

type Props = {
  id: string;
  label?: string;
  confirmMessage?: string;
  onDelete: (id: string) => Promise<ActionResult>;
  iconOnly?: boolean;
  /** Full-width row with trash icon — used on retailer cards */
  variant?: "default" | "card";
};

export function DeleteEntityButton({
  id,
  label = "Delete",
  confirmMessage = "Delete this record?",
  onDelete,
  iconOnly = false,
  variant = "default",
}: Props) {
  const router = useRouter();

  const handleClick = async () => {
    if (!confirm(confirmMessage)) return;
    const r = await onDelete(id);
    if (!r.ok) alert(r.error);
    else router.refresh();
  };

  if (iconOnly) {
    return (
      <button
        type="button"
        aria-label={label}
        className="flex size-7 items-center justify-center rounded-lg transition"
        style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "rgba(248,113,113,0.6)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.16)"; (e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.9)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.6)"; }}
        onClick={handleClick}
      >
        <TrashIcon className="size-3.5" />
      </button>
    );
  }

  if (variant === "card") {
    return (
      <button
        type="button"
        className="flex min-h-[44px] min-w-0 flex-1 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition hover:brightness-95"
        style={{ background: "#FEE2E2", color: "#991B1B" }}
        onClick={handleClick}
      >
        <TrashIcon className="size-4 shrink-0" />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-400/20"
      style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "rgba(248,113,113,0.75)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.15)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.08)"; }}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
