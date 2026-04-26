import type { ReactNode } from "react";

/** Light blue-gray fill, rounded corners, teal bottom accent — matches mobile mock */
export function AuthInputShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[52px] items-center gap-3 rounded-xl border-0 border-b-[3px] border-teal-600 bg-sky-50/90 px-3.5 py-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] transition-[background-color,box-shadow] focus-within:bg-sky-50 focus-within:shadow-[0_2px_12px_rgba(13,148,136,0.15)]">
      {children}
    </div>
  );
}
