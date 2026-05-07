"use client";

import { useState } from "react";
import { LuQuote, LuStar, LuChevronLeft, LuChevronRight, LuExternalLink } from "react-icons/lu";

const StudioTestimonials = ({ items = [] }) => {
  const [active, setActive] = useState(0);

  if (!items.length) return null;

  const featured = items[active] || items[0];
  const initials = (featured.name || "")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function prev() {
    setActive((i) => (i - 1 + items.length) % items.length);
  }
  function next() {
    setActive((i) => (i + 1) % items.length);
  }

  return (
    <section id="testimonials" className="relative px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionEyebrow index="⑦" path="Testimonials" />

        <div className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <h2 className="st-display max-w-3xl text-[clamp(2.5rem,7vw,6rem)] text-[var(--st-ink)]">
            Kind <span className="st-italic font-normal">words.</span>
          </h2>
          <p className="st-mono text-[11px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
            ({String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")})
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Featured quote */}
          <article className="relative overflow-hidden rounded-3xl border border-[var(--st-line-2)] bg-[var(--st-paper)] p-8 md:p-12">
            <LuQuote
              aria-hidden
              className="absolute -right-4 -top-4 h-32 w-32 text-[var(--st-accent)]/20"
            />

            <div className="relative">
              <Stars rating={featured.rating || 5} />

              <blockquote className="st-italic mt-6 text-[clamp(1.25rem,2.4vw,2rem)] leading-snug text-[var(--st-ink)]">
                “{featured.quote}”
              </blockquote>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--st-line-2)] pt-6">
                <div className="flex items-center gap-4">
                  <Avatar src={featured.avatar} initials={initials} />
                  <div className="min-w-0">
                    <p className="font-semibold leading-tight text-[var(--st-ink)]">
                      {featured.name}
                    </p>
                    <p className="st-mono mt-1 text-[11px] uppercase tracking-[0.18em] text-[var(--st-muted)]">
                      {[featured.role, featured.company].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>

                {featured.link && (
                  <a
                    href={featured.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="st-mono inline-flex items-center gap-1.5 rounded-full border border-[var(--st-line-2)] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--st-ink)] transition hover:bg-[var(--st-ink)] hover:text-[var(--st-accent)]"
                  >
                    Source <LuExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </article>

          {/* Sidebar list */}
          <aside className="rounded-3xl border border-[var(--st-line-2)] bg-[var(--st-paper)] p-5">
            <div className="flex items-baseline justify-between border-b border-[var(--st-line-2)] pb-4">
              <h3 className="st-mono text-[11px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
                — all clients
              </h3>
              {items.length > 1 && (
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous testimonial"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--st-line-2)] text-[var(--st-ink)] transition hover:bg-[var(--st-ink)] hover:text-[var(--st-accent)]"
                  >
                    <LuChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next testimonial"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--st-line-2)] text-[var(--st-ink)] transition hover:bg-[var(--st-ink)] hover:text-[var(--st-accent)]"
                  >
                    <LuChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <ul className="mt-4 space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {items.map((item, i) => {
                const isActive = i === active;
                const itemInitials = (item.name || "")
                  .split(" ")
                  .map((s) => s[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                return (
                  <li key={item._id || `${item.name}-${i}`}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className={
                        "group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition " +
                        (isActive
                          ? "border-[var(--st-ink)] bg-[var(--st-ink)] text-[var(--st-accent)]"
                          : "border-transparent hover:border-[var(--st-line-2)]")
                      }
                    >
                      <Avatar src={item.avatar} initials={itemInitials} compact dark={isActive} />
                      <div className="min-w-0 flex-1">
                        <p
                          className={
                            "truncate text-sm font-semibold leading-tight " +
                            (isActive ? "text-[var(--st-accent)]" : "text-[var(--st-ink)]")
                          }
                        >
                          {item.name}
                        </p>
                        <p
                          className={
                            "st-mono truncate text-[10px] uppercase tracking-[0.18em] " +
                            (isActive ? "text-[var(--st-accent)]/70" : "text-[var(--st-muted)]")
                          }
                        >
                          {item.company || item.role || "—"}
                        </p>
                      </div>
                      <span
                        className={
                          "st-mono text-[10px] tracking-wider " +
                          (isActive ? "text-[var(--st-accent)]" : "text-[var(--st-muted-2)]")
                        }
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
};

const Avatar = ({ src, initials, compact = false, dark = false }) => {
  const size = compact ? "h-9 w-9 text-[11px]" : "h-12 w-12 text-[13px]";
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={`${size} shrink-0 rounded-full object-cover ring-1 ring-[var(--st-line-2)]`}
      />
    );
  }
  return (
    <span
      className={
        size +
        " flex shrink-0 items-center justify-center rounded-full font-semibold " +
        (dark
          ? "bg-[var(--st-accent)] text-[var(--st-ink)]"
          : "bg-[var(--st-ink)] text-[var(--st-accent)]")
      }
    >
      {initials || "·"}
    </span>
  );
};

const Stars = ({ rating = 5 }) => {
  const safe = Math.max(1, Math.min(5, rating));
  return (
    <div className="flex items-center gap-1" aria-label={`${safe} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <LuStar
          key={i}
          className={
            "h-4 w-4 " +
            (i < safe
              ? "fill-[var(--st-accent)] text-[var(--st-accent)]"
              : "text-[var(--st-line-2)]")
          }
        />
      ))}
    </div>
  );
};

const SectionEyebrow = ({ index, path }) => (
  <div className="flex items-center gap-3">
    <span className="st-mono text-[11px] uppercase tracking-[0.3em] text-[var(--st-ink)]">
      {index}
    </span>
    <span className="h-px w-8 bg-[var(--st-line-2)]" />
    <span className="st-mono text-[11px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
      {path}
    </span>
  </div>
);

export default StudioTestimonials;
