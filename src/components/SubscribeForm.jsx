"use client";

import { useState } from "react";
import { LuMail, LuCircleCheck, LuLoader } from "react-icons/lu";

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
      <p className="inline-flex items-center gap-2 text-sm text-emerald-300">
        <LuCircleCheck className="h-4 w-4" />
        You're in. Thanks for subscribing!
      </p>
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
        <LuMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full rounded-md border border-white/10 bg-black py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-purple-400 placeholder:text-zinc-600"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? <LuLoader className="h-4 w-4 animate-spin" /> : "Subscribe"}
      </button>
      {error && (
        <p className="basis-full text-xs text-red-400">{error}</p>
      )}
    </form>
  );
}
