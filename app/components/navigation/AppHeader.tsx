"use client";

import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { signOut } from "@/app/(main)/actions";

const shellNavClass =
  "rounded-2xl border border-white/10 bg-zinc-900/70 px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] shadow-black/40 ring-1 ring-white/5 backdrop-blur-xl";

export function AppHeader() {
  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2"
      aria-label="App header"
    >
      <div
        className={`mx-auto flex max-w-lg items-center justify-between gap-3 ${shellNavClass}`}
      >
        <span className="bg-gradient-to-r from-teal-200 via-cyan-200 to-sky-200 bg-clip-text pl-1 text-sm font-bold tracking-tight text-transparent">
          VSE
        </span>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full bg-white/10 text-zinc-200 outline-none ring-1 ring-white/10 transition hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-teal-400/50"
              aria-label="Open account menu"
            >
              <ProfileGlyph className="size-[22px]" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-48 border-white/10 bg-zinc-900/95 p-1 text-zinc-100 shadow-xl shadow-black/50 ring-1 ring-white/10 backdrop-blur-xl"
          >
            <nav className="flex flex-col">
              <Link
                href="/settings/profile"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-200 hover:bg-white/10"
              >
                Profile
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-200 hover:bg-white/10"
                >
                  Log out
                </button>
              </form>
            </nav>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}

function ProfileGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
