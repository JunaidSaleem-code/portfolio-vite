"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LuArrowUpRight, LuMenu, LuX } from "react-icons/lu";

const NAV_LINKS = [
  { name: "Work", link: "#projects" },
  { name: "Experience", link: "#experience" },
  { name: "Process", link: "#approach" },
  { name: "Awards", link: "#achievements" },
  { name: "Contact", link: "#contact" },
];

const EASE = [0.22, 1, 0.36, 1];

const StudioNav = () => {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const close = useCallback(() => setOpen(false), []);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Lock body scroll while the drawer is open so the page underneath
  // doesn't drift on iOS rubber-banding.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const goHome = (e) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState(null, "", "/");
    }
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-5 pt-4 md:px-8 md:pt-6">
        <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between rounded-full border border-[var(--st-line-2)] bg-[var(--st-paper)] px-4 py-2 shadow-[0_18px_40px_-22px_rgba(15,27,34,0.35),inset_0_1px_0_0_rgba(255,255,255,0.6)] backdrop-blur-md backdrop-saturate-100 supports-[backdrop-filter]:bg-[var(--st-paper)]/80 md:px-5 md:py-2.5 md:backdrop-blur-xl md:backdrop-saturate-150 md:supports-[backdrop-filter]:bg-[var(--st-paper)]/72">
          <a
            href="/"
            onClick={goHome}
            className="flex items-center gap-2.5 text-[var(--st-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--st-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--st-paper)] rounded-full"
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

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.link}
                href={item.link}
                className="st-link rounded-full px-3 py-1.5 text-[13px] font-medium text-[var(--st-ink-2)] hover:text-[var(--st-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--st-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--st-paper)]"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="#contact"
              className="hidden items-center gap-2 rounded-full border border-[var(--st-ink)] bg-[var(--st-ink)] px-4 py-2 text-[12px] font-semibold text-[var(--st-paper)] transition hover:bg-[var(--st-ink-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--st-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--st-paper)] sm:inline-flex"
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
              aria-expanded={open}
              aria-controls="studio-mobile-drawer"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--st-line-2)] text-[var(--st-ink)] transition hover:border-[var(--st-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--st-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--st-paper)] md:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              {open ? (
                <LuX className="h-4 w-4" aria-hidden />
              ) : (
                <LuMenu className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="studio-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-40 md:hidden"
            initial={reduced ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={close}
              className="absolute inset-0 cursor-default bg-[var(--st-bg)]/90 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />

            <motion.nav
              aria-label="Mobile primary"
              className="relative mx-auto mt-24 flex w-[88%] max-w-sm flex-col overflow-hidden rounded-3xl border border-[var(--st-line-2)] bg-[var(--st-paper)] shadow-[0_40px_80px_-30px_rgba(15,27,34,0.45)]"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.32, ease: EASE }}
            >
              <div className="flex items-center justify-between border-b border-[var(--st-line)] px-5 pt-4 pb-3">
                <span className="st-mono text-[10px] uppercase tracking-[0.32em] text-[var(--st-muted)]">
                  Menu
                </span>
                <span className="st-mono text-[10px] uppercase tracking-[0.32em] text-[var(--st-ink-2)]">
                  Esc to close
                </span>
              </div>

              <ul className="flex flex-col p-2">
                {NAV_LINKS.map((item, i) => (
                  <motion.li
                    key={item.link}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.32,
                      ease: EASE,
                      delay: 0.06 + i * 0.05,
                    }}
                  >
                    <a
                      href={item.link}
                      onClick={close}
                      className="st-display group flex items-center justify-between rounded-2xl px-5 py-4 text-[1.65rem] leading-none text-[var(--st-ink)] transition hover:bg-[var(--st-bg-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--st-accent)]"
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          aria-hidden
                          className="st-mono text-[10px] uppercase tracking-[0.32em] text-[var(--st-muted)] group-hover:text-[var(--st-ink)]"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item.name}
                      </span>
                      <LuArrowUpRight
                        className="h-4 w-4 -translate-x-0.5 text-[var(--st-muted)] transition group-hover:translate-x-0 group-hover:text-[var(--st-ink)]"
                        aria-hidden
                      />
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.a
                href="#contact"
                onClick={close}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.32,
                  ease: EASE,
                  delay: 0.06 + NAV_LINKS.length * 0.05,
                }}
                className="m-3 inline-flex items-center justify-between rounded-2xl border border-[var(--st-ink)] bg-[var(--st-ink)] px-5 py-4 text-[var(--st-paper)] transition hover:bg-[var(--st-ink-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--st-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--st-paper)]"
              >
                <span className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[var(--st-accent)] opacity-80" />
                    <span className="relative h-2 w-2 rounded-full bg-[var(--st-accent)]" />
                  </span>
                  <span className="st-mono text-[10px] uppercase tracking-[0.28em]">
                    Available — reach out
                  </span>
                </span>
                <LuArrowUpRight className="h-4 w-4" aria-hidden />
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudioNav;
