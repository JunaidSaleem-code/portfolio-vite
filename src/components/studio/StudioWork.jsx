"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";

const cldThumb = (url, w = 640) => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url;
  }
  return url.replace("/image/upload/", `/image/upload/c_fill,w_${w},q_auto,f_auto/`);
};

const StudioWork = ({ items = [] }) => {
  const [hovered, setHovered] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    items.forEach((p) => {
      if (!p?.image) return;
      const img = new window.Image();
      img.src = cldThumb(p.image, 640);
    });
  }, [items]);

  const allTags = useMemo(() => {
    const s = new Set();
    items.forEach((p) => (p.tags || []).forEach((t) => t && s.add(t)));
    return Array.from(s);
  }, [items]);

  const filtered = activeTag
    ? items.filter((p) => (p.tags || []).includes(activeTag))
    : items;

  const handleMouseMove = (e) => setPos({ x: e.clientX, y: e.clientY });

  return (
    <section id="projects" className="relative px-6 py-16 md:py-24">
      <span id="work" data-anchor className="block scroll-mt-24" />
      <div className="mx-auto max-w-6xl">
        <SectionEyebrow index="③" path="Selected Work" />

        <div className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <h2 className="st-display max-w-3xl text-[clamp(2.5rem,7vw,6rem)] text-[var(--st-ink)]">
            Recent <span className="st-italic font-normal">runs.</span>
          </h2>
          <p className="st-mono max-w-xs text-[12px] uppercase tracking-[0.18em] text-[var(--st-muted)]">
            A short reel of recent work across AI, web, and mobile.
          </p>
        </div>

        {allTags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <FilterPill active={activeTag === null} onClick={() => setActiveTag(null)}>
              All
            </FilterPill>
            {allTags.map((t) => (
              <FilterPill
                key={t}
                active={activeTag === t}
                onClick={() => setActiveTag(t)}
              >
                {t}
              </FilterPill>
            ))}
          </div>
        )}

        <ul
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered(null)}
          className="mt-12 border-t border-[var(--st-line-2)]"
        >
          {filtered.map((p, i) => {
            const detailHref = p.slug
              ? `/projects/${p.slug}`
              : p.link || "#";
            const isActive = hovered === i;
            const tags = (p.tags || []).slice(0, 3).join(" / ");
            return (
              <li
                key={p._id || p.id || i}
                className="border-b border-[var(--st-line-2)]"
              >
                <Link
                  href={detailHref}
                  onMouseEnter={() => setHovered(i)}
                  className="group relative flex items-center gap-5 py-7 transition-colors duration-300 md:py-9"
                >
                  <span className="st-mono w-9 shrink-0 text-[11px] tracking-wider text-[var(--st-muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3
                    className={
                      "st-display text-[clamp(1.75rem,4.5vw,3.75rem)] leading-none transition-all duration-500 " +
                      (isActive
                        ? "translate-x-2 text-[var(--st-ink)]"
                        : "text-[var(--st-ink)]")
                    }
                  >
                    {p.title}
                    {isActive && (
                      <span className="st-italic font-normal text-[var(--st-ink)]">
                        .
                      </span>
                    )}
                  </h3>

                  <span className="hidden flex-1 border-b border-dashed border-[var(--st-line-2)] md:block" />

                  {tags && (
                    <span className="st-mono hidden whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-[var(--st-muted)] md:inline">
                      {tags}
                    </span>
                  )}

                  <span
                    className={
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500 " +
                      (isActive
                        ? "-translate-y-1 translate-x-1 border-[var(--st-ink)] bg-[var(--st-accent)] text-[var(--st-ink)]"
                        : "border-[var(--st-line-2)] text-[var(--st-ink)]")
                    }
                  >
                    <LuArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            );
          })}

          {filtered.length === 0 && (
            <li className="py-12 text-center">
              <p className="st-mono text-[12px] uppercase tracking-wider text-[var(--st-muted)]">
                no results · try another filter
              </p>
            </li>
          )}
        </ul>

        {/* Cursor-tracked floating preview */}
        {hovered !== null && filtered[hovered]?.image && (
          <div
            aria-hidden
            className="st-fade pointer-events-none fixed z-40 hidden h-52 w-80 overflow-hidden rounded-2xl border border-[var(--st-ink)] shadow-[0_30px_60px_-15px_rgba(15,27,34,0.45)] md:block"
            style={{ left: pos.x + 28, top: pos.y - 110 }}
          >
            <Image
              src={cldThumb(filtered[hovered].image, 640)}
              alt=""
              fill
              sizes="320px"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 ring-2 ring-[var(--st-accent)]/0" />
          </div>
        )}
      </div>
    </section>
  );
};

const FilterPill = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={
      "st-mono rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em] transition " +
      (active
        ? "border-[var(--st-ink)] bg-[var(--st-ink)] text-[var(--st-paper)]"
        : "border-[var(--st-line-2)] text-[var(--st-ink-2)] hover:border-[var(--st-ink)] hover:text-[var(--st-ink)]")
    }
  >
    {children}
  </button>
);

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

export default StudioWork;
