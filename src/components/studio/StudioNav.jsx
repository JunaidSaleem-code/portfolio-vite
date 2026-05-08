"use client";

import { useState } from "react";
import { LuMenu, LuX } from "react-icons/lu";

const NAV_LINKS = [
  { name: "Work", link: "#projects" },
  { name: "Experience", link: "#experience" },
  { name: "Process", link: "#approach" },
  { name: "Awards", link: "#achievements" },
  { name: "Contact", link: "#contact" },
];

const StudioNav = () => {
  const [open, setOpen] = useState(false);
  const navItems = NAV_LINKS;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-5 pt-4 md:px-8 md:pt-6">
        <div
          className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between rounded-full border border-[var(--st-line-2)] bg-[var(--st-paper)] px-4 py-2 shadow-[0_18px_40px_-22px_rgba(15,27,34,0.35),inset_0_1px_0_0_rgba(255,255,255,0.6)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[var(--st-paper)]/72 md:px-5 md:py-2.5"
        >
          <a
            href="/"
            onClick={(e) => {
              if (
                typeof window !== "undefined" &&
                window.location.pathname === "/"
              ) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                history.replaceState(null, "", "/");
              }
            }}
            className="flex items-center gap-2.5 text-[var(--st-ink)]"
          >
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[var(--st-ink)]">
              <span className="st-italic text-[15px] leading-none text-[var(--st-accent)]">
                j
              </span>
            </span>
            <span className="st-mono text-[12px] font-semibold tracking-tight">
              junaid<span className="text-[var(--st-muted)]">.dev</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.link || item.name}
                href={item.link}
                className="st-link px-3 py-1.5 text-[13px] font-medium text-[var(--st-ink-2)] hover:text-[var(--st-ink)]"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="#contact"
              className="hidden items-center gap-2 rounded-full border border-[var(--st-ink)] bg-[var(--st-ink)] px-4 py-2 text-[12px] font-semibold text-[var(--st-paper)] transition hover:bg-[var(--st-ink-2)] sm:inline-flex"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[var(--st-accent)] opacity-80" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--st-accent)]" />
              </span>
              Available
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--st-line-2)] text-[var(--st-ink)] transition hover:border-[var(--st-ink)] md:hidden"
            >
              {open ? <LuX className="h-4 w-4" /> : <LuMenu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-[var(--st-bg)]/95 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          <nav className="relative mx-auto mt-24 w-[88%] max-w-sm rounded-3xl border border-[var(--st-line-2)] bg-[var(--st-paper)] p-3 shadow-2xl">
            {navItems.map((item) => (
              <a
                key={item.link || item.name}
                href={item.link}
                onClick={() => setOpen(false)}
                className="st-display flex items-center justify-between rounded-2xl px-5 py-4 text-2xl text-[var(--st-ink)] transition hover:bg-[var(--st-bg-2)]"
              >
                {item.name}
                <span className="st-mono text-xs text-[var(--st-muted)]">→</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default StudioNav;
