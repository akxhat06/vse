"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/(main)/actions";

/* ── Page title + optional action derived from pathname ── */
type PageMeta = { title: string; action?: { label: string; href: string } };

function getPageMeta(pathname: string): PageMeta {
  if (pathname === "/home")                           return { title: "Home" };
  if (pathname === "/invoice/companies/new")          return { title: "New Company",    action: undefined };
  if (pathname.startsWith("/invoice/companies/"))     return { title: "Edit Company",   action: undefined };
  if (pathname === "/invoice/companies")              return { title: "Companies",       action: { label: "+ New company",   href: "/invoice/companies/new?returnTo=%2Finvoice%2Fcompanies" } };
  if (pathname === "/invoice/retailers/new")          return { title: "New Retailer",   action: undefined };
  if (pathname.startsWith("/invoice/retailers/"))     return { title: "Edit Retailer",  action: undefined };
  if (pathname === "/invoice/retailers")              return { title: "Retailers",       action: { label: "+ New retailer",  href: "/invoice/retailers/new?returnTo=%2Finvoice%2Fretailers" } };
  if (pathname === "/invoice/invoices/new")           return { title: "New Invoice",    action: undefined };
  if (pathname.startsWith("/invoice/invoices/"))      return { title: "Edit Invoice",   action: undefined };
  if (pathname === "/invoice/invoices")               return { title: "Bills / Invoice", action: { label: "+ New invoice",  href: "/invoice/invoices/new?returnTo=%2Finvoice%2Finvoices" } };
  if (pathname === "/invoice/payments/new")           return { title: "Record Payment", action: undefined };
  if (pathname.startsWith("/invoice/payments/"))      return { title: "Edit Payment",   action: undefined };
  if (pathname === "/invoice/payments")               return { title: "Payments",        action: { label: "+ New payment",  href: "/invoice/payments/new?returnTo=%2Finvoice%2Fpayments" } };
  if (pathname === "/invoice/credit-notes/new")       return { title: "New Credit Note",action: undefined };
  if (pathname.startsWith("/invoice/credit-notes/"))  return { title: "Edit Credit Note",action: undefined };
  if (pathname === "/invoice/credit-notes")           return { title: "Credit Notes",    action: { label: "+ New credit note", href: "/invoice/credit-notes/new?returnTo=%2Finvoice%2Fcredit-notes" } };
  if (pathname === "/invoice")                        return { title: "Invoice Hub" };
  if (pathname.startsWith("/settings"))               return { title: "Settings" };
  return { title: "VSE" };
}

export function TopBar({ displayName, email, avatarUrl }: {
  displayName: string;
  email: string;
  avatarUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { title, action } = getPageMeta(pathname);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const showImage = !!avatarUrl && !imgError;

  return (
    <header
      className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      style={{
        background: "rgba(9,9,15,0.80)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Left — mobile logo OR desktop page title */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {/* Mobile: app logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/app_icon.svg"
          alt="Vishwa Shree Enterprises"
          className="lg:hidden shrink-0"
          style={{ height: 56, width: "auto", display: "block" }}
        />

        {/* Desktop: page title + action */}
        <div className="hidden lg:flex flex-1 items-center justify-between gap-4 min-w-0">
          <h1 className="truncate text-base font-bold text-white">{title}</h1>
          {action && (
            <Link
              href={action.href}
              className="shrink-0 rounded-xl px-3.5 py-2 text-sm font-semibold text-white transition-all"
              style={{
                background: "rgba(129,140,248,0.2)",
                border: "1px solid rgba(129,140,248,0.3)",
              }}
            >
              {action.label}
            </Link>
          )}
        </div>
      </div>

      {/* Right — profile */}
      <div className="relative shrink-0" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-sm transition"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <span
            className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold"
            style={showImage
              ? { border: "1px solid rgba(255,255,255,0.15)" }
              : { background: "rgba(129,140,248,0.25)", color: "#a5b4fc", border: "1px solid rgba(129,140,248,0.3)" }}
          >
            {showImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : initials}
          </span>
          <span className="hidden sm:block font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
            {displayName}
          </span>
          <ChevronDown className="size-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
        </button>

        {open && (
          <div
            className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl py-1"
            style={{
              background: "#141420",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center gap-2.5 px-3 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <span
                className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold"
                style={showImage
                  ? { border: "1px solid rgba(255,255,255,0.15)" }
                  : { background: "rgba(129,140,248,0.25)", color: "#a5b4fc", border: "1px solid rgba(129,140,248,0.3)" }}
              >
                {showImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" onError={() => setImgError(true)} />
                ) : initials}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                <p className="text-[11px] truncate mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{email}</p>
              </div>
            </div>
            <Link
              href="/settings/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm transition"
              style={{ color: "rgba(255,255,255,0.65)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}
            >
              <UserIcon className="size-4" style={{ color: "rgba(255,255,255,0.35)" }} />
              Profile
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition"
                style={{ color: "rgba(248,113,113,0.85)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.08)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <LogOutIcon className="size-4" style={{ color: "rgba(248,113,113,0.6)" }} />
                Log out
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}

function ChevronDown({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m6 9 6 6 6-6" /></svg>;
}
function UserIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function LogOutIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
}
