import type { ReactNode } from "react";
import { AuthBubbles } from "@/app/components/auth/AuthBubbles";

type Props = {
  kicker: string;
  title: string;
  children: ReactNode;
};

export function DarkAuthLayout({ kicker, title, children }: Props) {
  return (
    <div
      className="relative min-h-dvh w-full overflow-x-hidden overflow-y-auto font-sans"
      style={{
        background: "#09090f",
        backgroundImage:
          "radial-gradient(ellipse 90% 60% at 15% -5%, rgba(99,102,241,0.22) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 85% 90%, rgba(139,92,246,0.16) 0%, transparent 55%)",
      }}
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-600/20 blur-[90px]" />
        <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-violet-600/15 blur-[110px]" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-indigo-900/20 blur-[80px]" />
      </div>

      {/* Rising bubbles */}
      <AuthBubbles />

      {/* Page */}
      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 py-10 sm:px-6">

        {/* Logo */}
        <div className="mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/app_icon.svg"
            alt="Vishwa Shree Enterprises"
            style={{ height: 140, width: "auto", display: "block" }}
          />
        </div>

        {/* Card */}
        <div
          className="w-full max-w-sm rounded-3xl px-6 py-8 sm:px-8"
          style={{
            background: "rgba(255,255,255,0.045)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Heading */}
          <div className="mb-7">
            <p
              className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: "rgba(165,180,252,0.6)" }}
            >
              {kicker}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {title}
            </h1>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
