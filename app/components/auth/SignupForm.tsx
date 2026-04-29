"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from "@/app/components/auth/icons";
import { createClient } from "@/lib/supabase/client";

const inputWrap: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "0.875rem",
};

const inputFocusWrap: React.CSSProperties = {
  border: "1px solid rgba(129,140,248,0.5)",
  boxShadow: "0 0 0 3px rgba(129,140,248,0.1)",
};

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
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

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirmPassword") ?? "");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: signError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { full_name: name },
        },
      });
      if (signError) { setError(signError.message); return; }
      if (data.session) { router.push("/home"); router.refresh(); return; }
      setInfo("Check your email for a confirmation link before signing in.");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const focus = (f: string) => () => setFocusedField(f);
  const blur = () => setFocusedField(null);
  const style = (f: string) => focusedField === f ? { ...inputWrap, ...inputFocusWrap } : inputWrap;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">

      {/* Error */}
      {error && (
        <div
          className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm"
          style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "rgba(252,165,165,0.9)" }}
        >
          <span className="mt-0.5 shrink-0">⚠</span>
          {error}
        </div>
      )}

      {/* Info */}
      {info && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", color: "rgba(110,231,183,0.9)" }}
        >
          {info}
        </div>
      )}

      {/* Full name */}
      <Field label="Full name" id="signup-name">
        <div className="flex items-center gap-3 px-3.5 py-3 transition-all" style={style("name")}>
          <UserIcon className="size-4 shrink-0" style={{ color: "rgba(129,140,248,0.6)" }} />
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Cooper"
            onFocus={focus("name")}
            onBlur={blur}
            className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
          />
        </div>
      </Field>

      {/* Email */}
      <Field label="Email address" id="signup-email">
        <div className="flex items-center gap-3 px-3.5 py-3 transition-all" style={style("email")}>
          <MailIcon className="size-4 shrink-0" style={{ color: "rgba(129,140,248,0.6)" }} />
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            onFocus={focus("email")}
            onBlur={blur}
            className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
          />
        </div>
      </Field>

      {/* Password */}
      <Field label="Password" id="signup-password">
        <div className="flex items-center gap-3 px-3.5 transition-all" style={style("password")}>
          <LockIcon className="size-4 shrink-0" style={{ color: "rgba(129,140,248,0.6)" }} />
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="min. 6 characters"
            onFocus={focus("password")}
            onBlur={blur}
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

      {/* Confirm password */}
      <Field label="Confirm password" id="signup-confirm">
        <div className="flex items-center gap-3 px-3.5 transition-all" style={style("confirm")}>
          <LockIcon className="size-4 shrink-0" style={{ color: "rgba(129,140,248,0.6)" }} />
          <input
            id="signup-confirm"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="repeat password"
            onFocus={focus("confirm")}
            onBlur={blur}
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/25"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg transition"
            style={{ color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)" }}
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </button>
        </div>
      </Field>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl py-3.5 text-sm font-bold text-white transition disabled:opacity-50"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.7) 0%, rgba(139,92,246,0.6) 100%)",
          border: "1px solid rgba(129,140,248,0.35)",
          boxShadow: "0 4px 24px rgba(99,102,241,0.25)",
          marginTop: "0.5rem",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 100 20v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
            </svg>
            Creating account…
          </span>
        ) : "Create account"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>or</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
      </div>

      {/* Sign in link */}
      <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-semibold" style={{ color: "#a5b4fc" }}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
