"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
} from "@/app/components/auth/icons";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
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
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) {
        setError(signError.message);
        return;
      }
      router.push("/home");
      router.refresh();
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

      <div className="mb-6">
        <label
          htmlFor="login-email"
          className="mb-2 block text-[11px] font-semibold tracking-[0.18em] text-[#8b86a8]"
        >
          EMAIL ADDRESS
        </label>
        <div className="rounded-2xl bg-[#12121f] p-1.5 ring-1 ring-white/[0.06]">
          <div className="flex items-center gap-3 rounded-xl bg-[#2a2836] px-3.5 py-3">
            <MailIcon className="shrink-0 text-violet-300/45" />
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="demo@email.com"
              className="w-full min-w-0 border-0 bg-transparent text-sm text-white outline-none placeholder:text-[#6d6a80]"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="login-password"
          className="mb-2 block text-[11px] font-semibold tracking-[0.18em] text-[#8b86a8]"
        >
          PASSWORD
        </label>
        <div className="rounded-2xl bg-[#12121f] p-1.5 ring-1 ring-white/[0.06]">
          <div className="flex items-stretch gap-2 rounded-xl bg-[#2a2836] py-1.5 pl-3.5">
            <LockIcon className="mt-2.5 shrink-0 self-start text-violet-300/45" />
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="enter your password"
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
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#9d98b8]">
          <input type="checkbox" name="remember" className="peer sr-only" />
          <span className="flex h-5 w-5 items-center justify-center rounded-md border border-violet-400/35 bg-gradient-to-b from-[#5c3d9e] to-[#4a3290] shadow-inner shadow-black/20 transition-colors peer-checked:border-[#9d72ff]/60 peer-checked:from-[#7b52c9] peer-checked:to-[#6b46c1] peer-focus-visible:ring-2 peer-focus-visible:ring-[#9d72ff]/40 peer-checked:[&>.dot]:opacity-100">
            <span className="dot h-2 w-2 rounded-full bg-white opacity-0 shadow" />
          </span>
          Remember me
        </label>
        <Link
          href="/forgot-password"
          className="rounded-xl border border-white/15 bg-[#0e0e16] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/25 hover:bg-[#14141f]"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl border border-white/15 bg-[#12121c] py-4 text-center text-base font-bold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-colors hover:border-white/25 hover:bg-[#181824] disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Login"}
      </button>

      <p className="mt-10 text-center text-sm text-[#9d98b8]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#9d72ff] hover:text-[#b898ff]"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
