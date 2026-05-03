"use client";

import { Building2, FileText, Home, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type IconType = React.ComponentType<{
  className?: string;
  strokeWidth?: number;
}>;

const NAV: Array<{
  href: string;
  label: string;
  icon: IconType;
  color: string;
}> = [
  {
    href: "/home",
    label: "Home",
    icon: Home,
    color: "#818cf8", // indigo
  },
  {
    href: "/invoice/companies",
    label: "Firms",
    icon: Building2,
    color: "#38bdf8", // sky
  },
  {
    href: "/invoice/retailers",
    label: "Stores",
    icon: Store,
    color: "#34d399", // emerald
  },
  {
    href: "/invoice/invoices",
    label: "Bills",
    icon: FileText,
    color: "#a78bfa", // violet
  },
];

function isActive(href: string, pathname: string) {
  if (href === "/home") return pathname === "/home";
  return pathname === href || pathname.startsWith(href + "/");
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "rgba(10,10,20,0.85)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
      }}
      aria-label="Mobile navigation"
    >
      <ul className="flex items-stretch px-2 py-2">
        {NAV.map(({ href, label, icon: Icon, color }) => {
          const active = isActive(href, pathname);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="relative flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-all active:scale-[0.95]"
                aria-current={active ? "page" : undefined}
                style={{
                  color: active ? color : "rgba(255,255,255,0.42)",
                }}
              >
                {active && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-1.5 inset-y-0 rounded-xl"
                    style={{
                      background: `linear-gradient(180deg, ${color}1f, ${color}0a)`,
                      border: `1px solid ${color}33`,
                      boxShadow: `0 4px 12px ${color}25`,
                    }}
                  />
                )}

                <Icon
                  className="relative size-[19px]"
                  strokeWidth={active ? 2.2 : 1.7}
                />
                <span className="relative text-[10px] font-semibold tracking-wide">
                  {label}
                </span>

                {active && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-2 left-1/2 size-1 -translate-x-1/2 rounded-full"
                    style={{
                      background: color,
                      boxShadow: `0 0 6px ${color}`,
                    }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
