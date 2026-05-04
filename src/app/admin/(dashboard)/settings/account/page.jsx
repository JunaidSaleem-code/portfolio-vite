"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import PasswordInput from "@/components/admin/forms/PasswordInput";
import {
  apiGetProfile,
  apiUpdateProfile,
  apiChangePassword,
} from "@/lib/api-client";

const inputCls =
  "w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none transition focus:border-purple-400 placeholder:text-zinc-600";

export default function AccountPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <ProfileSection />
      <hr className="border-white/10" />
      <PasswordSection />
    </div>
  );
}

function ProfileSection() {
  const qc = useQueryClient();
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: apiGetProfile,
  });

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (data) reset({ name: data.name || "" });
  }, [data, reset]);

  const mut = useMutation({
    mutationFn: (values) => apiUpdateProfile(values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-profile"] });
      setError("");
      setSavedAt(Date.now());
    },
    onError: (e) => setError(e.message),
  });

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold text-white">Profile</h2>
      <p className="mb-5 text-sm text-zinc-400">
        Your display name. Email is shown for reference and can't be changed here.
      </p>

      {isLoading ? (
        <p className="text-sm text-zinc-500">Loading…</p>
      ) : (
        <form
          onSubmit={handleSubmit((v) => mut.mutate(v))}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-zinc-300">Email (read-only)</span>
            <input
              type="email"
              value={data?.email || ""}
              readOnly
              className={inputCls + " cursor-not-allowed text-zinc-500"}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-zinc-300">Display name</span>
            <input
              type="text"
              {...register("name", { required: true })}
              className={inputCls}
            />
            {formState.errors.name && (
              <span className="text-xs text-red-400">Name is required.</span>
            )}
          </label>

          {error && (
            <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={mut.isPending}
              className="rounded-md bg-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mut.isPending ? "Saving…" : "Save profile"}
            </button>
            {savedAt && !mut.isPending && (
              <span className="text-xs text-emerald-400">Saved.</span>
            )}
          </div>
        </form>
      )}
    </section>
  );
}

function PasswordSection() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, watch, formState } = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const newPassword = watch("newPassword");

  const mut = useMutation({
    mutationFn: (values) => apiChangePassword(values),
    onSuccess: async () => {
      setError("");
      setSuccess(true);
      reset();
      setTimeout(() => signOut({ callbackUrl: "/admin/login" }), 1500);
    },
    onError: (e) => {
      setSuccess(false);
      setError(e.message);
    },
  });

  function onSubmit(values) {
    if (values.newPassword !== values.confirmPassword) {
      setError("New password and confirmation don't match");
      return;
    }
    mut.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  }

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold text-white">Change password</h2>
      <p className="mb-5 text-sm text-zinc-400">
        After changing, you'll be signed out and asked to sign in again.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-zinc-300">Current password</span>
          <PasswordInput
            autoComplete="current-password"
            {...register("currentPassword", { required: true })}
          />
          {formState.errors.currentPassword && (
            <span className="text-xs text-red-400">Required.</span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-zinc-300">New password</span>
          <PasswordInput
            autoComplete="new-password"
            {...register("newPassword", {
              required: true,
              minLength: { value: 8, message: "At least 8 characters" },
            })}
          />
          {formState.errors.newPassword && (
            <span className="text-xs text-red-400">
              {formState.errors.newPassword.message || "Required."}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-zinc-300">Confirm new password</span>
          <PasswordInput
            autoComplete="new-password"
            {...register("confirmPassword", {
              required: true,
              validate: (v) => v === newPassword || "Doesn't match",
            })}
          />
          {formState.errors.confirmPassword && (
            <span className="text-xs text-red-400">
              {formState.errors.confirmPassword.message || "Required."}
            </span>
          )}
        </label>

        {error && (
          <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-md border border-emerald-900/50 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">
            Password changed. Signing you out…
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={mut.isPending}
            className="rounded-md bg-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mut.isPending ? "Updating…" : "Change password"}
          </button>
        </div>
      </form>

      <div className="mt-8 rounded-md border border-white/10 bg-zinc-950 p-4 text-xs text-zinc-500">
        <p className="mb-1 font-semibold text-zinc-300">Locked out?</p>
        If you ever forget your password, set a new <code>ADMIN_PASSWORD</code> in{" "}
        <code>.env.local</code> and run <code>npm run seed</code> again. The seed script
        upserts your admin user so the new password takes effect immediately.
      </div>
    </section>
  );
}
