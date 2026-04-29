"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/home", label: "Home", icon: HomeIcon },
  { href: "/invoice/companies", label: "Companies", icon: BuildingIcon },
  { href: "/invoice/retailers", label: "Retailers", icon: StoreIcon },
  { href: "/invoice/invoices", label: "Bills / Invoice", icon: InvoiceIcon },
  { href: "/invoice/payments", label: "Payment", icon: PaymentIcon },
  { href: "/invoice/credit-notes", label: "Credit Note", icon: CreditIcon },
];

function isActive(href: string, pathname: string) {
  if (href === "/home") return pathname === "/home";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex lg:flex-col w-60 shrink-0 min-h-dvh"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Logo */}
      <div
        className="flex h-20 items-center px-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/app_icon.svg"
          alt="Vishwa Shree Enterprises"
          style={{ height: 52, width: "auto", display: "block" }}
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-4 space-y-0.5" aria-label="Main navigation">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href, pathname);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
              style={
                active
                  ? {
                      background: "rgba(129,140,248,0.15)",
                      color: "#a5b4fc",
                      border: "1px solid rgba(129,140,248,0.2)",
                    }
                  : {
                      color: "rgba(255,255,255,0.5)",
                      border: "1px solid transparent",
                    }
              }
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                }
              }}
            >
              <Icon
                className="size-4 shrink-0"
                style={{ color: active ? "#818cf8" : "rgba(255,255,255,0.35)" }}
              />
              {label}
              {active && (
                <span
                  className="ml-auto h-1.5 w-1.5 rounded-full"
                  style={{ background: "#818cf8" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        className="px-5 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          v1.0 · Local storage
        </p>
      </div>
    </aside>
  );
}

function HomeIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  );
}

function BuildingIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22V12h6v10" />
      <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01" />
    </svg>
  );
}

function StoreIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9l1-5h16l1 5" />
      <path d="M3 9a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2" />
      <path d="M5 22V11M19 11v11" /><path d="M9 22v-7h6v7" />
    </svg>
  );
}

function InvoiceIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 4h8a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z" />
      <path d="M9 9h6M9 12h6M9 15h4" />
    </svg>
  );
}

function PaymentIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function CreditIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M12 8v4M10 10h4" />
    </svg>
  );
}
