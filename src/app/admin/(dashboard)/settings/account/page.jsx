"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { LuCheck, LuKey, LuUser } from "react-icons/lu";
import PasswordInput from "@/components/admin/forms/PasswordInput";
import {
  apiGetProfile,
  apiUpdateProfile,
  apiChangePassword,
} from "@/lib/api-client";

export default function AccountPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <ProfileSection />
      <PasswordSection />
      <FallbackBox />
    </div>
  );
}

function SectionHeader({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--st-line-2)] bg-[var(--st-bg)] text-[var(--st-ink)]">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="st-mono text-[10px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
            — {eyebrow}
          </p>
          <h2 className="st-italic text-[22px] leading-tight text-[var(--st-ink)]">
            {title}
          </h2>
        </div>
      </div>
      {description && (
        <p className="mt-3 text-[13.5px] text-[var(--st-ink-2)]">{description}</p>
      )}
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
    <section className="st-card p-5 sm:p-7 md:p-8">
      <SectionHeader
        icon={LuUser}
        eyebrow="profile"
        title="Display & identity"
        description="Your display name. Email is shown for reference and can't be changed here."
      />

      {isLoading ? (
        <p className="st-italic text-[14px] text-[var(--st-muted)]">Loading…</p>
      ) : (
        <form
          onSubmit={handleSubmit((v) => mut.mutate(v))}
          className="flex flex-col gap-5"
        >
          <label className="flex flex-col gap-2">
            <span className="st-label">Email · read-only</span>
            <input
              type="email"
              value={data?.email || ""}
              readOnly
              className="st-input st-input--readonly"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="st-label st-label--req">Display name</span>
            <input
              type="text"
              {...register("name", { required: true })}
              className="st-input"
            />
            {formState.errors.name && (
              <span className="st-error">Name is required.</span>
            )}
          </label>

          {error && <p className="st-error-banner">{error}</p>}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={mut.isPending}
              className="st-cta st-cta--sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mut.isPending ? "Saving…" : "Save profile"}
            </button>
            {savedAt && !mut.isPending && (
              <span className="inline-flex items-center gap-2 text-[12.5px] text-[var(--st-ink-2)]">
                <LuCheck className="h-3.5 w-3.5 text-[var(--st-ink)]" />
                <span className="st-italic">Saved.</span>
              </span>
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
    <section className="st-card p-5 sm:p-7 md:p-8">
      <SectionHeader
        icon={LuKey}
        eyebrow="security"
        title="Change password"
        description="After changing, you'll be signed out and asked to sign in again."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="st-label st-label--req">Current password</span>
          <PasswordInput
            autoComplete="current-password"
            {...register("currentPassword", { required: true })}
          />
          {formState.errors.currentPassword && (
            <span className="st-error">Required.</span>
          )}
        </label>

        <label className="flex flex-col gap-2">
          <span className="st-label st-label--req">New password</span>
          <PasswordInput
            autoComplete="new-password"
            {...register("newPassword", {
              required: true,
              minLength: { value: 8, message: "At least 8 characters" },
            })}
          />
          {formState.errors.newPassword && (
            <span className="st-error">
              {formState.errors.newPassword.message || "Required."}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-2">
          <span className="st-label st-label--req">Confirm new password</span>
          <PasswordInput
            autoComplete="new-password"
            {...register("confirmPassword", {
              required: true,
              validate: (v) => v === newPassword || "Doesn't match",
            })}
          />
          {formState.errors.confirmPassword && (
            <span className="st-error">
              {formState.errors.confirmPassword.message || "Required."}
            </span>
          )}
        </label>

        {error && <p className="st-error-banner">{error}</p>}
        {success && (
          <p className="st-success-banner">Password changed. Signing you out…</p>
        )}

        <div>
          <button
            type="submit"
            disabled={mut.isPending}
            className="st-cta st-cta--sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mut.isPending ? "Updating…" : "Change password"}
          </button>
        </div>
      </form>
    </section>
  );
}

function FallbackBox() {
  return (
    <div className="st-card--flat p-6">
      <p className="st-mono text-[10px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
        — locked out?
      </p>
      <p className="mt-3 text-[13px] leading-relaxed text-[var(--st-ink-2)]">
        If you ever forget your password, set a new{" "}
        <code className="st-mono rounded bg-[var(--st-bg-2)] px-1.5 py-0.5 text-[12px] text-[var(--st-ink)]">
          ADMIN_PASSWORD
        </code>{" "}
        in{" "}
        <code className="st-mono rounded bg-[var(--st-bg-2)] px-1.5 py-0.5 text-[12px] text-[var(--st-ink)]">
          .env.local
        </code>{" "}
        and run{" "}
        <code className="st-mono rounded bg-[var(--st-bg-2)] px-1.5 py-0.5 text-[12px] text-[var(--st-ink)]">
          npm run seed
        </code>{" "}
        again. The seed script upserts your admin user so the new password takes
        effect immediately.
      </p>
    </div>
  );
}
