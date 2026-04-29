"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "@/app/components/auth/icons";
import { createClient } from "@/lib/supabase/client";

/* ── shared input field wrapper ── */
function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: "rgba(165,180,252,0.65)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputWrap: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "0.875rem",
};

const inputFocusWrap: React.CSSProperties = {
  border: "1px solid rgba(129,140,248,0.5)",
  boxShadow: "0 0 0 3px rgba(129,140,248,0.1)",
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(() => {
    const q = searchParams.get("error");
    if (q === "auth") return "Session could not be established. Try again.";
    if (q === "config") return "App configuration error. Check environment variables.";
    return null;
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    try {
      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({ email, password });
      if (signError) { setError(signError.message); return; }
      router.push("/home");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      {/* Error */}
      {error && (
        <div
          className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm"
          style={{
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.25)",
            color: "rgba(252,165,165,0.9)",
          }}
        >
          <span className="mt-0.5 shrink-0">⚠</span>
          {error}
        </div>
      )}

      {/* Email */}
      <Field label="Email address" id="login-email">
        <div
          className="flex items-center gap-3 px-3.5 py-3 transition-all"
          style={focusedField === "email" ? { ...inputWrap, ...inputFocusWrap } : inputWrap}
        >
          <MailIcon className="size-4 shrink-0" style={{ color: "rgba(129,140,248,0.6)" }} />
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
          />
        </div>
      </Field>

      {/* Password */}
      <Field label="Password" id="login-password">
        <div
          className="flex items-center gap-3 px-3.5 transition-all"
          style={focusedField === "password" ? { ...inputWrap, ...inputFocusWrap } : inputWrap}
        >
          <LockIcon className="size-4 shrink-0" style={{ color: "rgba(129,140,248,0.6)" }} />
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="your password"
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/25"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg transition"
            style={{ color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)" }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </button>
        </div>
      </Field>

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <label className="flex cursor-pointer items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          <span
            className="relative flex size-4 shrink-0 items-center justify-center rounded"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <input type="checkbox" name="remember" className="peer sr-only" />
            <span className="absolute inset-0 hidden rounded peer-checked:flex items-center justify-center" style={{ background: "rgba(129,140,248,0.4)" }}>
              <svg className="size-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1.5 6 4.5 9 10.5 3" /></svg>
            </span>
          </span>
          Remember me
        </label>
        <Link
          href="/forgot-password"
          className="text-sm font-medium transition"
          style={{ color: "rgba(165,180,252,0.75)" }}
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="relative w-full overflow-hidden rounded-2xl py-3.5 text-sm font-bold text-white transition disabled:opacity-50"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.7) 0%, rgba(139,92,246,0.6) 100%)",
          border: "1px solid rgba(129,140,248,0.35)",
          boxShadow: "0 4px 24px rgba(99,102,241,0.25)",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 100 20v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
            </svg>
            Signing in…
          </span>
        ) : "Sign in"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>or</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold transition"
          style={{ color: "#a5b4fc" }}
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
