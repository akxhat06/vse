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
  {
    href: "/settings/profile",
    label: "Profile",
    Icon: ProfileIcon,
    isActive: (p: string) => p.startsWith("/settings"),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-lg rounded-[1.35rem] bg-white px-2 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.35),0_4px_20px_rgba(0,0,0,0.15)] ring-1 ring-zinc-200/90">
        <ul className="flex items-stretch justify-around gap-1">
          {items.map(({ href, label, Icon, isActive }) => {
            const active = isActive(pathname);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={`flex flex-col items-center gap-1 rounded-xl py-1 transition-colors ${
                    active
                      ? "text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-700"
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
      className={active ? "text-zinc-900" : "text-zinc-500"}
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
      className={active ? "text-zinc-900" : "text-zinc-500"}
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

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={active ? "text-zinc-900" : "text-zinc-500"}
      aria-hidden
    >
      <path
        d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="7"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
