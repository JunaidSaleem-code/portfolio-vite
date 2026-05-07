"use client";

const StudioCredentials = ({ items = [] }) => {
  if (!items.length) return null;

  const education = items.filter((i) => i.type === "education");
  const recognition = items.filter((i) => i.type === "recognition");

  return (
    <section
      id="achievements"
      className="relative px-6 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <SectionEyebrow index="⑥" path="Credentials" />

        <div className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <h2 className="st-display max-w-3xl text-[clamp(2.5rem,7vw,6rem)] text-[var(--st-ink)]">
            Receipts <span className="st-italic font-normal">&amp; honors.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {education.length > 0 && (
            <Board label="Education" items={education} kind="ed" />
          )}
          {recognition.length > 0 && (
            <Board label="Recognition" items={recognition} kind="rc" />
          )}
        </div>
      </div>
    </section>
  );
};

const Board = ({ label, items, kind }) => (
  <div className="rounded-3xl border border-[var(--st-line-2)] bg-[var(--st-paper)] p-7 md:p-9">
    <div className="flex items-baseline justify-between border-b border-[var(--st-line-2)] pb-5">
      <h3 className="st-display text-3xl text-[var(--st-ink)]">{label}</h3>
      <span className="st-mono text-[11px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
        ({String(items.length).padStart(2, "0")})
      </span>
    </div>

    <ul className="mt-6 space-y-7">
      {items.map((item, i) => (
        <li key={item._id || `${item.title}-${i}`} className="group">
          <div className="flex items-baseline justify-between gap-4">
            <span className="st-mono text-[11px] tracking-wider text-[var(--st-muted)]">
              {kind}-{String(i + 1).padStart(2, "0")}
            </span>
            {item.period && (
              <span className="st-mono text-[10px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
                {item.period}
              </span>
            )}
          </div>

          <h4 className="st-italic mt-2 text-2xl leading-tight text-[var(--st-ink)]">
            {item.title}
          </h4>

          {item.organization && (
            <p className="st-mono mt-1.5 text-[12px] uppercase tracking-[0.18em] text-[var(--st-ink-2)]">
              {item.organization}
            </p>
          )}

          {item.description && (
            <p className="mt-3 text-sm leading-relaxed text-[var(--st-ink-2)]">
              {item.description}
            </p>
          )}

          <div className="mt-5 h-px w-full bg-gradient-to-r from-[var(--st-line-2)] via-[var(--st-line-2)] to-transparent" />
        </li>
      ))}
    </ul>
  </div>
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

export default StudioCredentials;
