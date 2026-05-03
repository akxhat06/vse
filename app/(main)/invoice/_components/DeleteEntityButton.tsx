"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/app/(main)/invoice/store-actions";

const ROSE = "rgb(248,113,113)";

type Props = {
  id: string;
  label?: string;
  confirmMessage?: string;
  onDelete: (id: string) => Promise<ActionResult>;
  iconOnly?: boolean;
  /** Used inside a row of actions on cards */
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
        onClick={handleClick}
        className="flex size-8 shrink-0 items-center justify-center rounded-lg transition active:scale-[0.92]"
        style={{
          background: "rgba(248,113,113,0.06)",
          border: "1px solid rgba(248,113,113,0.18)",
          color: "rgba(248,113,113,0.75)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "rgba(248,113,113,0.16)";
          el.style.color = ROSE;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "rgba(248,113,113,0.06)";
          el.style.color = "rgba(248,113,113,0.75)";
        }}
      >
        <Trash2 className="size-3.5" />
      </button>
    );
  }

  if (variant === "card") {
    return (
      <button
        type="button"
        aria-label={label}
        onClick={handleClick}
        className="flex shrink-0 items-center justify-center rounded-lg px-3 py-2 transition active:scale-[0.95]"
        style={{
          background: "rgba(248,113,113,0.08)",
          border: "1px solid rgba(248,113,113,0.22)",
          color: ROSE,
        }}
      >
        <Trash2 className="size-3.5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-semibold transition active:scale-[0.97]"
      style={{
        background: "rgba(248,113,113,0.1)",
        border: "1px solid rgba(248,113,113,0.28)",
        color: "#fda4af",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "rgba(248,113,113,0.18)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "rgba(248,113,113,0.1)";
      }}
    >
      <Trash2 className="size-3.5" />
      <span>{label}</span>
    </button>
  );
}
