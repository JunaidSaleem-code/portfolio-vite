export default function PageHeader({ title, description, eyebrow, action }) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <p className="st-mono text-[10px] uppercase tracking-[0.24em] text-[var(--st-muted)] sm:text-[10.5px]">
            — {eyebrow || "Studio admin"}
          </p>
          <h1 className="st-display mt-2.5 break-words text-[clamp(1.75rem,7vw,3rem)] leading-[0.95] text-[var(--st-ink)] sm:mt-3 sm:text-[clamp(2rem,4vw,3rem)]">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-[var(--st-ink-2)] sm:text-[14px]">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="st-rule mt-6 sm:mt-7" />
    </div>
  );
}
