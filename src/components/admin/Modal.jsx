"use client";

import { useEffect } from "react";
import { LuX } from "react-icons/lu";

export default function Modal({ open, onClose, title, eyebrow, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="st-modal-backdrop fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="st-modal flex max-h-[94vh] w-full max-w-2xl flex-col rounded-b-none rounded-t-[22px] sm:rounded-[22px]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--st-line)] px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-6">
          <div className="min-w-0 flex-1">
            <p className="st-mono text-[10px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
              — {eyebrow || "Editor"}
            </p>
            <h2 className="st-display mt-1.5 break-words text-[20px] leading-tight text-[var(--st-ink)] sm:text-[24px] md:text-[26px]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="st-icon-btn shrink-0"
            aria-label="Close"
          >
            <LuX className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {children}
        </div>
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[var(--st-line)] bg-[var(--st-bg)] px-5 py-3 sm:gap-3 sm:px-7 sm:py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
