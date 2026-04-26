"use client";

import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "@/app/components/auth/icons";
import { createClient } from "@/lib/supabase/client";

function DarkField({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="mb-2 block text-[11px] font-semibold tracking-[0.18em] text-[#8b86a8]"
      >
        {label}
      </label>
      <div className="rounded-2xl bg-[#12121f] p-1.5 ring-1 ring-white/[0.06]">
        {children}
      </div>
    </div>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
      const origin = window.location.origin;
      const { data, error: signError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
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
      setInfo(
        "Check your email for a confirmation link before signing in.",
      );
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="font-sans" onSubmit={handleSubmit} noValidate>
      {error ? (
        <p
          className="mb-4 rounded-xl border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="mb-4 rounded-xl border border-teal-500/30 bg-teal-950/30 px-3 py-2 text-sm text-teal-100">
          {info}
        </p>
      ) : null}

      <DarkField label="FULL NAME" id="signup-name">
        <div className="flex items-center gap-3 rounded-xl bg-[#2a2836] px-3.5 py-3">
          <UserIcon className="shrink-0 text-violet-300/45" />
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Cooper"
            className="w-full min-w-0 border-0 bg-transparent text-sm text-white outline-none placeholder:text-[#6d6a80]"
          />
        </div>
      </DarkField>

      <DarkField label="EMAIL ADDRESS" id="signup-email">
        <div className="flex items-center gap-3 rounded-xl bg-[#2a2836] px-3.5 py-3">
          <MailIcon className="shrink-0 text-violet-300/45" />
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="demo@email.com"
            className="w-full min-w-0 border-0 bg-transparent text-sm text-white outline-none placeholder:text-[#6d6a80]"
          />
        </div>
      </DarkField>

      <DarkField label="PASSWORD" id="signup-password">
        <div className="flex items-stretch gap-2 rounded-xl bg-[#2a2836] py-1.5 pl-3.5">
          <LockIcon className="mt-2.5 shrink-0 self-start text-violet-300/45" />
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="create a password"
            className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#6d6a80]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="flex shrink-0 items-center justify-center rounded-lg bg-[#1c1b26] px-3 text-violet-200/70 transition-colors hover:bg-[#252432] hover:text-white"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
      </DarkField>

      <DarkField label="CONFIRM PASSWORD" id="signup-confirm">
        <div className="flex items-stretch gap-2 rounded-xl bg-[#2a2836] py-1.5 pl-3.5">
          <LockIcon className="mt-2.5 shrink-0 self-start text-violet-300/45" />
          <input
            id="signup-confirm"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="confirm your password"
            className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#6d6a80]"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="flex shrink-0 items-center justify-center rounded-lg bg-[#1c1b26] px-3 text-violet-200/70 transition-colors hover:bg-[#252432] hover:text-white"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
      </DarkField>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-2xl border border-white/15 bg-[#12121c] py-4 text-center text-base font-bold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-colors hover:border-white/25 hover:bg-[#181824] disabled:opacity-50"
      >
        {loading ? "Creating account…" : "Sign up"}
      </button>

      <p className="mt-10 text-center text-sm text-[#9d98b8]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#9d72ff] hover:text-[#b898ff]"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
