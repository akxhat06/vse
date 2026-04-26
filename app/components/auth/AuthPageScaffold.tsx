import type { ReactNode } from "react";

/** Dark outer frame + centered white “device” column */
export function AuthPageScaffold({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-800">
      <div className="mx-auto min-h-screen w-full max-w-[460px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_25px_50px_-12px_rgba(0,0,0,0.45)]">
        {children}
      </div>
    </div>
  );
}
