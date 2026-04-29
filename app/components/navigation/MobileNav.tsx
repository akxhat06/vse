"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/home",                  label: "Home",      icon: HomeIcon      },
  { href: "/invoice/companies",     label: "Companies", icon: BuildingIcon  },
  { href: "/invoice/invoices",      label: "Bills",     icon: InvoiceIcon   },
  { href: "/invoice/payments",      label: "Payments",  icon: PaymentIcon   },
  { href: "/invoice/credit-notes",  label: "Credits",   icon: CreditIcon    },
];

function isActive(href: string, pathname: string) {
  if (href === "/home") return pathname === "/home";
  return pathname === href || pathname.startsWith(href + "/");
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "rgba(9,9,15,0.80)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
      }}
      aria-label="Mobile navigation"
    >
      <ul className="flex items-stretch px-2 py-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href, pathname);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="relative flex flex-col items-center justify-center gap-1 rounded-xl py-2.5 transition-all"
                style={{ color: active ? "#a5b4fc" : "rgba(255,255,255,0.32)" }}
              >
                {/* Active background pill */}
                {active && (
                  <span
                    className="absolute inset-x-1 inset-y-0.5 rounded-xl"
                    style={{
                      background: "rgba(129,140,248,0.14)",
                      border: "1px solid rgba(129,140,248,0.2)",
                    }}
                  />
                )}

                {/* Icon */}
                <span className="relative">
                  <Icon active={active} />
                  {/* Active dot indicator */}
                  {active && (
                    <span
                      className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full"
                      style={{
                        background: "#818cf8",
                        boxShadow: "0 0 6px #818cf8",
                      }}
                    />
                  )}
                </span>

                {/* Label */}
                <span
                  className="relative text-[10px] font-semibold tracking-wide"
                  style={{ color: active ? "#a5b4fc" : "rgba(255,255,255,0.32)" }}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ── Icons ── */
function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="size-[22px]"
      viewBox="0 0 24 24"
      fill={active ? "rgba(129,140,248,0.2)" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  );
}

function BuildingIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="size-[22px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="2" width="16" height="20" rx="2" fill={active ? "rgba(129,140,248,0.15)" : "none"} />
      <path d="M9 22V12h6v10" />
      <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01" />
    </svg>
  );
}

function InvoiceIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="size-[22px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path
        d="M8 4h8a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z"
        fill={active ? "rgba(129,140,248,0.15)" : "none"}
      />
      <path d="M9 9h6M9 12h6M9 15h4" />
    </svg>
  );
}

function PaymentIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="size-[22px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="5" width="20" height="14" rx="2" fill={active ? "rgba(129,140,248,0.15)" : "none"} />
      <path d="M2 10h20" />
    </svg>
  );
}

function CreditIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="size-[22px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        fill={active ? "rgba(129,140,248,0.15)" : "none"}
      />
    </svg>
  );
}
