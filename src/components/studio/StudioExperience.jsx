"use client";

import Image from "next/image";

const StudioExperience = ({ items = [] }) => {
  return (
    <section id="experience" className="relative px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionEyebrow index="④" path="Experience" />

        <div className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <h2 className="st-display max-w-3xl text-[clamp(2.5rem,7vw,6rem)] text-[var(--st-ink)]">
            Stations <span className="st-italic font-normal">visited.</span>
          </h2>
          <p className="st-mono max-w-xs text-[12px] uppercase tracking-[0.18em] text-[var(--st-muted)]">
            Where I&apos;ve been, what I&apos;ve been building.
          </p>
        </div>

        {!items.length && (
          <div className="mt-16 rounded-3xl border border-dashed border-[var(--st-line-2)] bg-[var(--st-paper)]/60 px-6 py-12 text-center">
            <p className="st-mono text-[11px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
              No experience entries yet
            </p>
            <p className="st-italic mt-3 text-xl text-[var(--st-ink-2)]">
              Add roles in <span className="st-mono not-italic">/admin/experience</span> or run{" "}
              <span className="st-mono not-italic">npm&nbsp;run&nbsp;seed</span>.
            </p>
          </div>
        )}

        <div className="mt-16 border-l border-[var(--st-line-2)] pl-8 md:pl-14">
          {items.map((card, i) => (
            <article
              key={card._id || card.id || i}
              className="relative pb-16 last:pb-0"
            >
              {/* Marker */}
              <span className="absolute -left-[33px] top-1 flex h-5 w-5 items-center justify-center md:-left-[57px]">
                <span
                  className="absolute inset-0 rounded-full bg-[var(--st-accent)]"
                  style={{ boxShadow: "0 0 0 6px rgba(194,248,79,0.18)" }}
                />
                <span className="relative h-2 w-2 rounded-full bg-[var(--st-ink)]" />
              </span>

              <div className="flex items-start gap-6 md:gap-8">
                {card.thumbnail && (
                  <div className="hidden shrink-0 rounded-2xl border border-[var(--st-line-2)] bg-[var(--st-paper)] p-3 md:block">
                    <Image
                      src={card.thumbnail}
                      alt=""
                      width={64}
                      height={64}
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="st-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
                    {i === 0 && (
                      <span className="rounded-full bg-[var(--st-ink)] px-2 py-0.5 text-[9px] tracking-[0.3em] text-[var(--st-accent)]">
                        Current
                      </span>
                    )}
                    {card.period && <span>{card.period}</span>}
                  </p>

                  <h3 className="st-display mt-3 text-[clamp(1.75rem,4vw,3rem)] leading-[1] text-[var(--st-ink)]">
                    {card.title}
                  </h3>

                  {card.organization && (
                    <p className="st-italic mt-2 text-xl text-[var(--st-ink-2)] md:text-2xl">
                      @ {card.organization}
                    </p>
                  )}

                  {card.description && (
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--st-ink-2)]">
                      {card.description}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
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

export default StudioExperience;
