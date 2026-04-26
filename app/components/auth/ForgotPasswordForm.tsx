"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { MailIcon } from "@/app/components/auth/icons";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    setLoading(true);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/home`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo },
      );
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setInfo(
        "If an account exists for that email, you will receive a reset link shortly.",
      );
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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

      <form onSubmit={handleSubmit} noValidate>
        <label
          htmlFor="forgot-email"
          className="mb-2 block text-[11px] font-semibold tracking-[0.18em] text-[#8b86a8]"
        >
          EMAIL ADDRESS
        </label>
        <div className="mb-8 rounded-2xl bg-[#12121f] p-1.5 ring-1 ring-white/[0.06]">
          <div className="flex items-center gap-3 rounded-xl bg-[#2a2836] px-3.5 py-3">
            <MailIcon className="shrink-0 text-violet-300/45" />
            <input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="demo@email.com"
              className="w-full min-w-0 border-0 bg-transparent text-sm text-white outline-none placeholder:text-[#6d6a80]"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl border border-white/15 bg-[#12121c] py-4 text-center text-base font-bold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-colors hover:border-white/25 hover:bg-[#181824] disabled:opacity-50"
        >
          {loading ? "Sending…" : "Send link"}
        </button>
      </form>

      <p className="mt-10 text-center text-sm text-[#9d98b8]">
        <Link
          href="/login"
          className="font-semibold text-[#9d72ff] hover:text-[#b898ff]"
        >
          Back to sign in
        </Link>
      </p>
    </>
  );
}
