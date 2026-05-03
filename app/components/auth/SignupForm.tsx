"use client";

import { AlertCircle, ArrowRight, Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const INDIGO = "#818cf8";
const VIOLET = "#a78bfa";
const EMERALD = "#34d399";
const ROSE = "#fb7185";

function useKeyboardInset() {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const vv = window.visualViewport;
    const update = () => {
      const gap = window.innerHeight - vv.height - vv.offsetTop;
      setInset(gap > 80 ? gap : 0);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);
  return inset;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-semibold text-white/60">
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl bg-white/[0.04] border border-white/10 " +
  "px-3.5 py-3 text-base text-white outline-none " +
  "placeholder:text-white/25 transition-all " +
  "focus:border-indigo-400/60 focus:bg-white/[0.06] " +
  "focus:shadow-[0_0_0_3px_rgba(129,140,248,0.18)] sm:text-sm";

export function SignupForm() {
  const router = useRouter();
  const keyboardInset = useKeyboardInset();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onFocusScroll(e: React.FocusEvent<HTMLInputElement>) {
    const el = e.currentTarget;
    window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 250);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirmPassword") ?? "");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

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
      if (signError) {
        setError(signError.message);
        return;
      }
      if (data.session) {
        router.push("/home");
        router.refresh();
        return;
      }
      setInfo("Check your email for a confirmation link before signing in.");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 transition-[padding] duration-200 ease-out"
      style={{
        paddingBottom: keyboardInset
          ? `${keyboardInset + 16}px`
          : undefined,
      }}
    >
      {error && (
        <div
          className="flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-[12px] leading-relaxed"
          style={{
            background: `${ROSE}14`,
            border: `1px solid ${ROSE}33`,
            color: "#fda4af",
          }}
        >
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {info && (
        <div
          className="flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-[12px] leading-relaxed"
          style={{
            background: `${EMERALD}14`,
            border: `1px solid ${EMERALD}33`,
            color: "#a7f3d0",
          }}
        >
          <Mail className="mt-0.5 size-3.5 shrink-0" />
          <span>{info}</span>
        </div>
      )}

      <div>
        <FieldLabel>Full name</FieldLabel>
        <input
          id="signup-name"
          name="name"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          placeholder="Jane Cooper"
          onFocus={onFocusScroll}
          className={inputCls}
        />
      </div>

      <div>
        <FieldLabel>Email</FieldLabel>
        <input
          id="signup-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          placeholder="you@company.com"
          onFocus={onFocusScroll}
          className={inputCls}
        />
      </div>

      <div>
        <FieldLabel>Password</FieldLabel>
        <div className="relative">
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
            minLength={6}
            placeholder="min. 6 characters"
            onFocus={onFocusScroll}
            className={`${inputCls} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/55 transition hover:bg-white/5 hover:text-white"
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      <div>
        <FieldLabel>Confirm password</FieldLabel>
        <div className="relative">
          <input
            id="signup-confirm"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
            minLength={6}
            placeholder="repeat password"
            onFocus={onFocusScroll}
            className={`${inputCls} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/55 transition hover:bg-white/5 hover:text-white"
            aria-label={
              showConfirm ? "Hide password" : "Show password"
            }
          >
            {showConfirm ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-white/40">
        By creating an account you agree to the{" "}
        <Link
          href="/terms"
          className="font-medium underline underline-offset-2"
          style={{ color: INDIGO }}
        >
          terms
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="font-medium underline underline-offset-2"
          style={{ color: INDIGO }}
        >
          privacy policy
        </Link>
        .
      </p>

      <button
        type="submit"
        disabled={loading}
        className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-3.5 text-[14px] font-bold text-white transition active:scale-[0.98] disabled:opacity-50"
        style={{
          background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`,
          boxShadow: `0 10px 28px ${INDIGO}55`,
        }}
      >
        {loading ? (
          <>
            <span>Creating account</span>
            <span className="inline-flex gap-1">
              <span
                className="size-1 animate-pulse rounded-full bg-white"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="size-1 animate-pulse rounded-full bg-white"
                style={{ animationDelay: "200ms" }}
              />
              <span
                className="size-1 animate-pulse rounded-full bg-white"
                style={{ animationDelay: "400ms" }}
              />
            </span>
          </>
        ) : (
          <>
            <span>Create account</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
          have an account
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition active:opacity-70"
          style={{ color: VIOLET }}
        >
          <span>Sign in instead</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </form>
  );
}
