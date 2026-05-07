"use client";

const DEFAULT_PHASES = [
  {
    phaseLabel: "Phase 01",
    title: "Plan & strategize",
    description:
      "Define the problem, scope the surface, set the runway. Clarity over speed.",
  },
  {
    phaseLabel: "Phase 02",
    title: "Build & iterate",
    description:
      "Ship in tight sprints with continuous review. Tests where they matter, no over-engineering.",
  },
  {
    phaseLabel: "Phase 03",
    title: "Deploy & monitor",
    description:
      "Roll to production carefully, watch the metrics, tune until it hums.",
  },
];

const VERBS = ["Plan", "Build", "Ship"];

const StudioApproach = ({ phases = [] }) => {
  const items = (phases.length ? phases : DEFAULT_PHASES).slice(0, 3);

  return (
    <section id="approach" className="relative px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionEyebrow index="⑤" path="Process" />

        <div className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <h2 className="st-display max-w-3xl text-[clamp(2.5rem,7vw,6rem)] text-[var(--st-ink)]">
            How <span className="st-italic font-normal">I&nbsp;work.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3 md:gap-6">
          {items.map((p, i) => (
            <article
              key={p._id || p.phaseLabel || i}
              className="group relative overflow-hidden rounded-3xl border border-[var(--st-line-2)] bg-[var(--st-paper)] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--st-ink)] hover:shadow-[0_22px_44px_-20px_rgba(15,27,34,0.25)]"
            >
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--st-accent)] opacity-0 transition-opacity duration-700 group-hover:opacity-30"
                style={{ filter: "blur(40px)" }}
              />

              <div className="flex items-center justify-between">
                <span className="st-mono text-[10px] uppercase tracking-[0.28em] text-[var(--st-muted)]">
                  {p.phaseLabel || `Phase 0${i + 1}`}
                </span>
                <span className="st-mono text-[10px] uppercase tracking-[0.28em] text-[var(--st-muted)]">
                  / 0{i + 1} of 03
                </span>
              </div>

              <div className="relative mt-6 flex items-baseline gap-2">
                <span className="st-italic text-7xl leading-none text-[var(--st-ink)] md:text-8xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="ml-1 h-3 w-3 rounded-full bg-[var(--st-accent)]"
                  style={{ boxShadow: "0 0 0 6px rgba(194,248,79,0.2)" }}
                />
              </div>

              <h3 className="st-display mt-7 text-3xl leading-[1] text-[var(--st-ink)] md:text-4xl">
                {VERBS[i] || p.title.split(" ")[0]}{" "}
                <span className="st-italic font-normal text-[var(--st-ink-2)]">
                  &amp;{" "}
                  {p.title.toLowerCase().includes("&")
                    ? p.title.split("&")[1]?.trim().toLowerCase()
                    : p.title.split(" ").slice(-1)[0].toLowerCase()}
                </span>
              </h3>

              <p className="mt-4 text-base leading-relaxed text-[var(--st-ink-2)]">
                {p.description}
              </p>

              <div className="mt-7 flex items-center gap-2">
                {Array.from({ length: 3 }).map((_, b) => (
                  <span
                    key={b}
                    className={
                      "h-px flex-1 transition-colors duration-500 " +
                      (b <= i
                        ? "bg-[var(--st-ink)]"
                        : "bg-[var(--st-line-2)]")
                    }
                  />
                ))}
                <span className="st-mono text-[10px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
                  step
                </span>
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

export default StudioApproach;
