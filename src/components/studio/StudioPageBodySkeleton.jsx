import { Fragment } from "react";

/**
 * Editorial blueprint skeleton — Suspense fallback while the home-page
 * data streams in. Pure server component: zero JS to the client, no
 * framer-motion, no inline styles. All animations live in globals.css
 * under the `st-bp-*` namespace.
 *
 * Aesthetic: a typesetter's blueprint. Cream paper, a single lime
 * progress rule, mono labels, dotted-box wireframes where each section
 * will land. Designed so the user feels something deliberate is
 * happening — never a blank screen, never a generic spinner.
 */

const SECTIONS = [
  { idx: "①", label: "Dossier", h: "h-[260px]" },
  { idx: "②", label: "Selected Work", h: "h-[420px]" },
  { idx: "③", label: "Experience", h: "h-[300px]" },
  { idx: "④", label: "Process", h: "h-[280px]" },
  { idx: "⑤", label: "Recognition", h: "h-[240px]" },
  { idx: "⑥", label: "Field Notes", h: "h-[260px]" },
];

export default function StudioPageBodySkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Composing the page"
      className="st-bp px-6 py-16 md:py-24"
    >
      <span className="sr-only">Composing the page — content streaming in.</span>

      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="st-mono text-[10px] uppercase tracking-[0.28em] text-[var(--st-muted)]"
          >
            Composing
          </span>
          <span
            aria-hidden
            className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-[var(--st-line)]"
          >
            <span className="st-bp-rule absolute inset-y-0 left-0 rounded-full bg-[var(--st-accent)]" />
          </span>
          <span
            aria-hidden
            className="st-mono text-[10px] uppercase tracking-[0.28em] text-[var(--st-ink-2)]"
          >
            <span className="st-bp-counter" />
            <span> / 09</span>
          </span>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-6xl space-y-12 md:space-y-20">
        {SECTIONS.map((s, i) => (
          <SectionSkeleton key={s.label} {...s} delay={i * 80} />
        ))}
      </div>
    </div>
  );
}

function SectionSkeleton({ idx, label, h, delay }) {
  return (
    <section className="st-bp-section" style={{ "--st-bp-delay": `${delay}ms` }}>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span
            aria-hidden
            className="st-mono text-[11px] tracking-[0.32em] text-[var(--st-ink-2)]"
          >
            {idx}
          </span>
          <span
            aria-hidden
            className="st-mono text-[10px] uppercase tracking-[0.32em] text-[var(--st-muted)]"
          >
            {label} <span className="hidden sm:inline">· setting type</span>
          </span>
        </div>
        <span
          aria-hidden
          className="st-mono text-[9.5px] uppercase tracking-[0.28em] text-[var(--st-muted-2)]"
        >
          ░░░░ ░░ ░░░
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <ShimmerBar w="70%" mdW="58%" tall delay={delay} />
        <ShimmerBar w="42%" mdW="34%" tall delay={delay + 80} />
      </div>

      <div className={`st-bp-frame mt-8 ${h}`}>
        <CornerTick pos="tl" />
        <CornerTick pos="tr" />
        <CornerTick pos="br" />
        <CornerTick pos="bl" />

        <div className="absolute inset-0 grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5 md:grid-cols-3 md:gap-4 md:p-6">
          {Array.from({ length: 3 }).map((_, j) => (
            <Fragment key={j}>
              <div className="flex flex-col gap-2.5 rounded-[2px] border border-[var(--st-line)] bg-[var(--st-bg)]/50 p-3">
                <ShimmerBar w="3rem" delay={delay + j * 50} />
                <ShimmerBar w="85%" delay={delay + 50 + j * 50} />
                <ShimmerBar w="60%" delay={delay + 100 + j * 50} />
              </div>
            </Fragment>
          ))}
        </div>

        <span aria-hidden className="st-bp-hatch" />
      </div>
    </section>
  );
}

function ShimmerBar({ w, mdW, tall, delay = 0 }) {
  return (
    <span
      aria-hidden
      className={`st-bp-bar ${tall ? "st-bp-bar--tall" : ""}`}
      style={{
        "--st-bp-w": w,
        "--st-bp-w-md": mdW || w,
        "--st-bp-delay": `${delay}ms`,
      }}
    />
  );
}

function CornerTick({ pos }) {
  return <span aria-hidden className={`st-bp-tick st-bp-tick--${pos}`} />;
}
