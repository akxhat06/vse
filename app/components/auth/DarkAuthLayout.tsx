import type { ReactNode } from "react";

type DarkAuthLayoutProps = {
  kicker: string;
  title: string;
  children: ReactNode;
};

export function DarkAuthLayout({ kicker, title, children }: DarkAuthLayoutProps) {
  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden overflow-y-auto bg-[#0b0b1a] font-sans text-white">
      <DarkBackdrop />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-lg flex-col sm:py-8">
        <div className="min-h-[24vh] shrink-0 sm:min-h-[20vh]" aria-hidden />

        <div className="flex flex-1 flex-col rounded-t-[1.75rem] bg-[#06060d] px-5 pb-10 pt-7 shadow-[0_-12px_48px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.06] sm:rounded-2xl sm:shadow-2xl">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-[#8b86a8]">
            {kicker}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-[2rem]">
            {title}
          </h1>
          <div className="mt-8 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

function DarkBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-violet-600/25 blur-[100px]" />
      <div className="absolute -right-32 top-8 h-[22rem] w-[22rem] rounded-full bg-[#5b3cce]/30 blur-[110px]" />
      <div className="absolute left-1/4 top-36 h-56 w-56 rounded-full border border-violet-400/10" />
      <div className="absolute right-10 top-48 h-40 w-40 rounded-full border border-indigo-400/10" />
      <div className="absolute bottom-1/3 left-[-10%] h-72 w-72 rounded-full bg-indigo-900/20 blur-[90px]" />
    </div>
  );
}
