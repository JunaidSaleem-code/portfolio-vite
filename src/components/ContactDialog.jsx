"use client";

import { useEffect, useState } from "react";
import { LuX, LuSend, LuMail, LuLoader, LuCircleCheck } from "react-icons/lu";

const inputCls =
  "w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none transition focus:border-purple-400 placeholder:text-zinc-600";

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
      className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <LuMail className="h-5 w-5 text-purple-300" />
            Send a message
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <LuCircleCheck className="h-12 w-12 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Message sent</h3>
              <p className="text-sm text-zinc-400">I'll get back to you soon.</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 rounded-md bg-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-400"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-zinc-300">Your name</span>
                <input name="name" type="text" required minLength={1} maxLength={100} className={inputCls} />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-zinc-300">Email</span>
                <input name="email" type="email" required className={inputCls} />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-zinc-300">Message</span>
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
                <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-purple-500 px-4 py-2.5 font-medium text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
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
                <p className="text-center text-xs text-zinc-500">
                  Or email me directly at{" "}
                  <a href={`mailto:${fallbackEmail}`} className="text-purple-300 hover:underline">
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
