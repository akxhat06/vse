"use client";

import { useActionState, useRef, useState } from "react";
import { signOut } from "@/app/(main)/actions";
import { createClient } from "@/lib/supabase/client";
import {
  type UpdateProfileState,
  updateProfile,
} from "@/app/(main)/settings/profile/actions";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml";
const MAX_BYTES = 3 * 1024 * 1024;

export type ProfileInitial = {
  email: string | null;
  username: string;
  phone: string;
  address: string;
  avatarUrl: string;
  displayName: string;
};

export function ProfileForm({ initial }: { initial: ProfileInitial }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formState, formAction, pending] = useActionState<
    UpdateProfileState | undefined,
    FormData
  >(updateProfile, undefined);

  async function handleAvatar(file: File) {
    setUploadError(null);
    if (!ACCEPT.split(",").some((t) => file.type === t)) {
      setUploadError("Use JPG, PNG, WEBP, GIF, or SVG.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError("Image must be 3MB or smaller.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setUploadError("Not signed in.");
        return;
      }

      const ext =
        file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
        "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (upErr) {
        setUploadError(
          upErr.message.includes("Bucket not found")
            ? "Create a public “avatars” bucket in Supabase Storage (see project docs)."
            : upErr.message,
        );
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      const { error: metaErr } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          avatar_url: publicUrl,
        },
      });

      if (metaErr) {
        setUploadError(metaErr.message);
        return;
      }

      setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
    } catch {
      setUploadError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  const initials = (initial.displayName || initial.email || "?")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-white">Profile</h1>

      {formState?.error ? (
        <p
          className="rounded-xl border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-200"
          role="alert"
        >
          {formState.error}
        </p>
      ) : null}
      {formState?.ok === true ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-100">
          Profile saved.
        </p>
      ) : null}
      {uploadError ? (
        <p
          className="rounded-xl border border-amber-500/35 bg-amber-950/40 px-3 py-2 text-sm text-amber-100"
          role="alert"
        >
          {uploadError}
        </p>
      ) : null}

      <div className="rounded-2xl border border-zinc-700/80 bg-zinc-900/40 p-4">
        <div className="flex gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-zinc-600 bg-zinc-800">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- user-uploaded dynamic URL
              <img
                src={avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-zinc-400">
                {initials}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">Profile image</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              JPG, PNG, WEBP, GIF, SVG · up to 3MB
            </p>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) void handleAvatar(f);
          }}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="mt-4 w-full rounded-xl border border-zinc-600 py-3 text-sm font-medium text-white transition-colors hover:border-zinc-500 hover:bg-zinc-800/60 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload profile image"}
        </button>
      </div>

      <form action={formAction} className="space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-white"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            defaultValue={initial.username}
            autoComplete="username"
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3.5 py-3 text-sm text-white outline-none ring-zinc-500 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-1"
            placeholder="your_username"
          />
          <p className="mt-1.5 text-xs text-zinc-500">
            Used on the dashboard and to sign in instead of email (must be
            unique).
          </p>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={initial.email ?? ""}
            readOnly
            tabIndex={-1}
            className="mt-2 w-full cursor-not-allowed rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-3 text-sm text-zinc-400 outline-none"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-white">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={initial.phone}
            autoComplete="tel"
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3.5 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-1"
            placeholder="Phone number"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-white"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={4}
            defaultValue={initial.address}
            placeholder="Street, city, state, PIN — anything you want on file"
            className="mt-2 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-900/60 px-3.5 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-1"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl border border-zinc-500 bg-zinc-950 py-3.5 text-sm font-semibold text-white transition-colors hover:border-zinc-400 hover:bg-zinc-900 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </form>

      <form action={signOut}>
        <button
          type="submit"
          className="mt-6 w-full rounded-xl border border-zinc-700 py-3.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-950"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
