"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/home",
    label: "Home",
    Icon: HomeIcon,
    isActive: (p: string) => p === "/home",
  },
  {
    href: "/invoice",
    label: "Invoice",
    Icon: InvoiceIcon,
    isActive: (p: string) => p === "/invoice" || p.startsWith("/invoice/"),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-zinc-900/70 px-2 py-3 shadow-[0_-12px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/5 backdrop-blur-xl">
        <ul className="flex items-stretch justify-center gap-10">
          {items.map(({ href, label, Icon, isActive }) => {
            const active = isActive(pathname);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={`flex flex-col items-center gap-1 rounded-xl py-1 transition-colors ${
                    active
                      ? "text-teal-300"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Icon active={active} />
                  <span className="text-[11px] font-medium tracking-wide">
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={active ? "text-teal-300" : "text-zinc-500"}
      aria-hidden
    >
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InvoiceIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={active ? "text-teal-300" : "text-zinc-500"}
      aria-hidden
    >
      <path
        d="M8 4h8a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 9h6M9 12h6M9 15h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

