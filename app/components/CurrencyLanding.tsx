"use client";

import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** Currencies + invoice-field tokens */
const INVOICE_PARTICLES = [
  "₹",
  "$",
  "€",
  "£",
  "¥",
  "INV",
  "TAX",
  "NET",
  "SUB",
  "DUE",
  "PO",
  "QTY",
  "%",
  "GST",
  "PDF",
  "PAID",
  "BAL",
  "INV-1024",
  "1/3",
  "n/30",
  "✓",
  "§",
  "FW",
  "REM",
  "CN",
  "DR",
  "CR",
  "₩",
  "¢",
];

type Particle = {
  label: string;
  left: string;
  top: string;
  fontSize: string;
  animationDelay: string;
  burstMs: number;
  driftMs: number;
  rot: string;
  peak: string;
  rest: string;
  dx: string;
  dy: string;
  compact: boolean;
};

/** [0, 1) — 32-bit mix only; identical on server and client (unlike Math.sin). */
function unit01(i: number, salt: number): number {
  let h = Math.imul(i ^ salt, 0x9e3779b1);
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const r = unit01(i, 0x51ed);
    const r2 = unit01(i, 0xa11ce);
    const r3 = unit01(i, 0xbeef);
    const label = INVOICE_PARTICLES[i % INVOICE_PARTICLES.length];
    const compact = label.length > 1;
    const baseSize = compact ? 0.55 + r3 * 0.55 : 1 + r3 * 1.85;
    const burstMs = 880 + Math.floor(r * 420);
    const delayMs = i * 26; // was i * 0.026s
    return {
      label,
      left: `${(5 + r * 90).toFixed(4)}%`,
      top: `${(5 + r2 * 88).toFixed(4)}%`,
      fontSize: `${baseSize.toFixed(4)}rem`,
      animationDelay: `${delayMs}ms, ${delayMs + burstMs}ms`,
      burstMs,
      driftMs: 4800 + Math.floor(r2 * 2200),
      rot: `${-22 + Math.floor(r3 * 44)}deg`,
      peak: (0.3 + r * 0.32).toFixed(4),
      rest: (0.1 + r2 * 0.16).toFixed(4),
      dx: `${5 + Math.floor(r * 16)}px`,
      dy: `${-8 - Math.floor(r2 * 18)}px`,
      compact,
    };
  });
}

const SPLASH_PARTICLES = buildParticles(46);

const SPLASH_MS = 3200;

type CurrencyLandingProps = {
  children: React.ReactNode;
  /** When set, navigates here after the splash finishes (e.g. `/login`). */
  redirectTo?: string;
};

export function CurrencyLanding({
  children,
  redirectTo,
}: CurrencyLandingProps) {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setExiting(true), SPLASH_MS - 700);
    const t2 = window.setTimeout(() => {
      setShowSplash(false);
      if (redirectTo) router.replace(redirectTo);
    }, SPLASH_MS);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [redirectTo, router]);

  return (
    <>
      {showSplash && (
        <div
          className={`currency-splash-layer fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-zinc-950 transition-opacity duration-700 ease-out ${
            exiting ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-hidden
        >
          {/* Soft mesh lights — dashboard / fintech, not paper */}
          <div className="pointer-events-none absolute -left-[20%] top-[-25%] h-[70vmin] w-[70vmin] rounded-full bg-violet-600/25 blur-[100px]" />
          <div className="pointer-events-none absolute -right-[15%] bottom-[-20%] h-[65vmin] w-[65vmin] rounded-full bg-teal-500/20 blur-[95px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-[45vmin] w-[80vmin] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[80px]" />
          {/* Subtle dot grid — digital texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, rgba(255,255,255,0.07) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-transparent to-zinc-950/90" />

          <div className="relative h-full w-full">
            {SPLASH_PARTICLES.map((p, i) => {
              const style: CSSProperties & Record<string, string> = {
                left: p.left,
                top: p.top,
                fontSize: p.fontSize,
                animationName: "currency-burst, currency-drift",
                animationDuration: `${p.burstMs}ms, ${p.driftMs}ms`,
                animationTimingFunction:
                  "cubic-bezier(0.34, 1.56, 0.64, 1), ease-in-out",
                animationDelay: p.animationDelay,
                animationIterationCount: "1, infinite",
                animationFillMode: "forwards, none",
                "--rot": p.rot,
                "--peak": p.peak,
                "--rest": p.rest,
                "--dx": p.dx,
                "--dy": p.dy,
              };
              return (
                <span
                  key={i}
                  className={`invoice-particle pointer-events-none absolute select-none font-medium tracking-tight tabular-nums ${p.compact ? "font-mono uppercase text-teal-200/75" : "font-sans text-white/80"}`}
                  style={style}
                >
                  {p.label}
                </span>
              );
            })}
          </div>

          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
            <div className="w-full max-w-[min(92vw,30rem)] text-center">
              <p className="text-sm font-medium tracking-[0.28em] text-teal-300/90 uppercase">
                Invoice management
              </p>
              <p className="mt-2 font-sans text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Create, send, and track invoices—without the spreadsheet chaos
              </p>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
