"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuArrowRight, LuLock } from "react-icons/lu";
import PasswordInput from "@/components/admin/forms/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Invalid email or password");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="st-admin relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-5 sm:py-10">
      {/* Decorative diagonal lime stroke — subtle echo of the public ScrollStroke */}
      <div className="st-login-stroke" aria-hidden>
        <svg viewBox="0 0 1200 800" preserveAspectRatio="none">
          <path
            d="M -50 700 C 200 540, 420 600, 620 380 S 1050 180, 1280 60"
            fill="none"
            stroke="var(--st-accent)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M -50 740 C 240 600, 460 660, 660 440 S 1080 230, 1280 110"
            fill="none"
            stroke="var(--st-ink)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="2 6"
            opacity="0.45"
          />
        </svg>
      </div>

      <div className="relative w-full max-w-[440px]">
        {/* Eyebrow */}
        <div className="mb-7 flex items-center gap-3">
          <span className="st-mono text-[11px] uppercase tracking-[0.24em] text-[var(--st-muted)]">
            ① Studio · Admin
          </span>
          <span className="h-px flex-1 bg-[var(--st-line-2)]" />
          <span className="st-mono inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[var(--st-ink-2)]">
            <LuLock className="h-3 w-3" />
            Secure
          </span>
        </div>

        <div className="st-card relative overflow-hidden p-6 sm:p-8 md:p-10">
          {/* Lime corner accent */}
          <span
            aria-hidden
            className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--st-accent)] opacity-70 blur-xl"
          />

          <h1 className="st-display relative text-[clamp(2rem,9vw,2.75rem)] leading-[0.95] text-[var(--st-ink)]">
            Welcome
            <br />
            <span className="st-italic font-normal">back, friend</span>
          </h1>
          <p className="relative mt-4 text-[14px] leading-relaxed text-[var(--st-ink-2)]">
            Sign in to manage projects, content, and analytics.
          </p>

          <form onSubmit={handleSubmit} className="relative mt-8 flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="st-label">Email address</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                placeholder="you@studio.dev"
                className="st-input"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="st-label">Password</span>
              <PasswordInput
                name="password"
                required
                autoComplete="current-password"
              />
            </label>

            {error && <p className="st-error-banner">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="st-cta mt-2 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <LuArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-[11px] text-[var(--st-muted)]">
          <span className="st-mono uppercase tracking-[0.2em]">Trouble?</span>{" "}
          Reset <code className="text-[var(--st-ink)]">ADMIN_PASSWORD</code> in{" "}
          <code className="text-[var(--st-ink)]">.env.local</code> and re-run the seed.
        </p>
      </div>
    </div>
  );
}
