"use client";

import { useState } from "react";
import { LuMail, LuCircleCheck, LuLoader, LuArrowRight } from "react-icons/lu";

export default function SubscribeForm({ source = "footer", compact = false }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Subscribe failed");
      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--st-line-2)] bg-[var(--st-paper)] px-3 py-1.5 text-[var(--st-ink)]">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--st-accent)] text-[var(--st-ink)]">
          <LuCircleCheck className="h-3 w-3" />
        </span>
        <span className="st-mono text-[11px] uppercase tracking-[0.2em]">
          You&apos;re in. Thanks for subscribing.
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        compact
          ? "flex w-full max-w-sm flex-col gap-2 sm:flex-row"
          : "flex w-full max-w-md flex-col gap-3"
      }
    >
      <div className="relative flex-1">
        <LuMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--st-muted)]" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full rounded-full border border-[var(--st-line-2)] bg-[var(--st-bg)] py-2.5 pl-10 pr-3 text-sm text-[var(--st-ink)] outline-none transition placeholder:text-[var(--st-muted-2)] focus:border-[var(--st-ink)] focus:ring-2 focus:ring-[var(--st-accent)]/40"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--st-ink)] px-4 py-2.5 text-sm font-semibold text-[var(--st-paper)] transition hover:bg-[var(--st-ink-2)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <LuLoader className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Subscribe
            <LuArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
      {error && (
        <p className="basis-full text-xs text-red-500">{error}</p>
      )}
    </form>
  );
}
