"use client";

import { useEffect, useState } from "react";
import { LuX, LuSend, LuMail, LuLoader, LuCircleCheck } from "react-icons/lu";

const inputCls =
  "w-full rounded-xl border border-[var(--st-line-2)] bg-[var(--st-bg)] px-3.5 py-2.5 text-[var(--st-ink)] outline-none transition placeholder:text-[var(--st-muted-2)] focus:border-[var(--st-ink)] focus:ring-2 focus:ring-[var(--st-accent)]/40";

export default function ContactDialog({ open, onClose, fallbackEmail }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setSuccess(false);
      setError("");
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Failed to send");
      setSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[6000] flex items-end justify-center bg-[var(--st-ink)]/55 px-3 py-3 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="st-up w-full max-w-lg overflow-hidden rounded-3xl border border-[var(--st-line-2)] bg-[var(--st-paper)] shadow-[0_40px_80px_-20px_rgba(15,27,34,0.4)]"
      >
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-[var(--st-line-2)] px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--st-ink)] text-[var(--st-accent)]">
              <LuMail className="h-4 w-4" />
            </span>
            <div className="flex flex-col">
              <span className="st-mono text-[10px] uppercase tracking-[0.28em] text-[var(--st-muted)]">
                ⑥ Contact
              </span>
              <h2 className="st-display text-lg leading-none text-[var(--st-ink)] sm:text-xl">
                Send a <span className="st-italic font-normal">message.</span>
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--st-line-2)] text-[var(--st-ink)] transition hover:border-[var(--st-ink)]"
            aria-label="Close"
          >
            <LuX className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 sm:px-7 sm:py-6">
          {success ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center sm:py-6">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--st-accent)] text-[var(--st-ink)]">
                <LuCircleCheck className="h-7 w-7" />
              </span>
              <h3 className="st-display text-2xl leading-tight text-[var(--st-ink)]">
                Message <span className="st-italic font-normal">sent.</span>
              </h3>
              <p className="text-sm text-[var(--st-ink-2)]">
                I&apos;ll get back to you soon.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="st-cta st-cta--dark mt-3"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="st-mono text-[11px] uppercase tracking-[0.18em] text-[var(--st-muted)]">
                  Your name
                </span>
                <input
                  name="name"
                  type="text"
                  required
                  minLength={1}
                  maxLength={100}
                  className={inputCls}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="st-mono text-[11px] uppercase tracking-[0.18em] text-[var(--st-muted)]">
                  Email
                </span>
                <input name="email" type="email" required className={inputCls} />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="st-mono text-[11px] uppercase tracking-[0.18em] text-[var(--st-muted)]">
                  Message
                </span>
                <textarea
                  name="message"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={5}
                  placeholder="What are you working on?"
                  className={inputCls}
                />
              </label>

              {error && (
                <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="st-cta st-cta--dark mt-1 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <LuLoader className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <LuSend className="h-4 w-4" /> Send message
                  </>
                )}
              </button>

              {fallbackEmail && (
                <p className="st-mono text-center text-[10px] uppercase tracking-[0.2em] text-[var(--st-muted)]">
                  Or email me directly at{" "}
                  <a
                    href={`mailto:${fallbackEmail}`}
                    className="st-link normal-case tracking-normal text-[var(--st-ink-2)] hover:text-[var(--st-ink)]"
                  >
                    {fallbackEmail}
                  </a>
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
