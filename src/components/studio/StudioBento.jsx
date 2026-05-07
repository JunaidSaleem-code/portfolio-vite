"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  LuArrowUpRight,
  LuCopy,
  LuCheck,
  LuMapPin,
  LuClock3,
} from "react-icons/lu";

const EASE_OUT = [0.22, 1, 0.36, 1];

const DOSSIER = [
  {
    num: "01",
    label: "Role",
    value: "Full-stack engineer",
    note: "End-to-end product delivery — design, code, ship, monitor.",
  },
  {
    num: "02",
    label: "Focus",
    value: "AI · RAG · LLM pipelines",
    note: "Production retrieval, embeddings, streamed generations.",
  },
  {
    num: "03",
    label: "Stack",
    value: "Next · Node · Python · Postgres",
    note: "Typed APIs, vector stores, edge runtime.",
  },
  {
    num: "04",
    label: "Based",
    value: "Lahore — PK / GMT+5",
    note: "Comfortable across most working hours.",
  },
  {
    num: "05",
    label: "Status",
    value: "Open for new work",
    note: "Q3 capacity — taking briefs now.",
    live: true,
  },
  {
    num: "06",
    label: "Reply",
    value: "Within 24 hours",
    note: "Even on weekends. No silent drafts.",
  },
  {
    num: "07",
    label: "Format",
    value: "Remote · contract · full-time",
    note: "Brief-first engagements, async-friendly.",
  },
];

const MARQUEE = [
  "RAG pipelines",
  "LLM operations",
  "Vector search",
  "Streaming UI",
  "Embedding workflows",
  "Edge runtime",
  "Typed APIs",
  "Design systems",
  "Pixel-tight interfaces",
  "Hands-on delivery",
];

const StudioBento = ({ items = [] }) => {
  const reduced = useReducedMotion();
  const lead = items.find((i) => i?.description) || null;
  const portraitImage = items.find((i) => i?.image)?.image || null;
  const initials = "JS";
  const email =
    items.find((i) => i?.emailAddress)?.emailAddress || "junaid@example.com";

  const fade = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.85, delay, ease: EASE_OUT },
  });

  return (
    <section id="about" className="relative px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Eyebrow row with index + live updated */}
        <motion.div
          {...fade(0)}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <SectionEyebrow
            index="②"
            path="Profile · Specimen sheet"
            count={String(DOSSIER.length).padStart(2, "0")}
          />
          <span className="st-mono text-[10px] uppercase tracking-[0.28em] text-[var(--st-muted)]">
            Updated <Updated reduced={reduced} />
          </span>
        </motion.div>

        {/* HEADLINE */}
        <motion.h2
          {...fade(0.05)}
          className="st-display mt-7 max-w-5xl text-[clamp(2.5rem,7.5vw,6.25rem)] leading-[0.96] text-[var(--st-ink)]"
        >
          {lead?.title || "I design and engineer"}
          <br />
          <span className="st-italic font-normal">the interactive web</span>
          <br />
          for teams that{" "}
          <span className="relative inline-block">
            <span className="relative z-10">ship</span>
            <motion.span
              aria-hidden
              className="absolute -bottom-1 left-0 h-[10px] w-full -skew-x-3 rounded-sm bg-[var(--st-accent)]"
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: 0.45, ease: EASE_OUT }}
              style={{ originX: 0 }}
            />
          </span>
          .
        </motion.h2>

        {/* Lead paragraph */}
        <motion.p
          {...fade(0.15)}
          className="mt-9 max-w-2xl text-[17px] leading-[1.7] text-[var(--st-ink-2)] md:text-[18px]"
        >
          {lead?.description ||
            "Five years building production-grade web products end-to-end — from RAG and LLM pipelines to pixel-tight interfaces. I write the code, ship the release, and stay around to watch the metrics."}
        </motion.p>

        {/* Animated rule with corner ticks */}
        <motion.div {...fade(0.2)} className="relative mt-16">
          <CornerTick className="-left-1 -top-1" rotate={0} />
          <CornerTick className="-right-1 -top-1" rotate={90} />
          <Hairline reduced={reduced} delay={0.25} />
        </motion.div>

        {/* THE PLATE — main editorial card */}
        <motion.div
          {...fade(0.18)}
          className="relative mt-0 overflow-hidden border-x border-b border-[var(--st-ink)] bg-[var(--st-paper)]"
        >
          {/* Plate header bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--st-ink)] bg-[var(--st-bg-2)] px-5 py-3 md:px-7">
            <div className="flex items-center gap-3">
              <span className="st-mono text-[9.5px] uppercase tracking-[0.3em] text-[var(--st-ink)]">
                Profile
              </span>
              <span className="h-px w-6 bg-[var(--st-ink)]/40" />
              <span className="st-mono text-[9.5px] uppercase tracking-[0.3em] text-[var(--st-ink-2)]">
                Nº 0001 / 26
              </span>
            </div>

            <div className="flex items-center gap-4">
              <LiveClock reduced={reduced} />
              <span className="hidden h-3 w-px bg-[var(--st-line-2)] md:inline-block" />
              <StatusPulse reduced={reduced} />
            </div>
          </div>

          {/* Plate body */}
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* LEFT — monogram + meta */}
            <div className="relative border-b border-[var(--st-line-2)] p-7 md:col-span-5 md:border-b-0 md:border-r md:p-9">
              <Stamp />

              <div className="relative mt-2 flex items-end gap-3">
                {portraitImage ? (
                  <Image
                    src={portraitImage}
                    alt=""
                    width={120}
                    height={150}
                    className="h-32 w-24 rounded-sm object-cover ring-1 ring-[var(--st-line-2)] md:h-36 md:w-28"
                  />
                ) : null}

                <p className="st-mono pb-1 text-[10px] uppercase tracking-[0.28em] text-[var(--st-muted)]">
                  Specimen
                  <br />
                  Plate · 01
                </p>
              </div>

              {/* Monogram */}
              <div className="relative mt-8">
                <span className="st-italic block leading-[0.85] text-[clamp(7rem,18vw,12rem)] text-[var(--st-ink)]">
                  {initials}
                </span>
                {/* drawn underline */}
                <motion.span
                  aria-hidden
                  className="absolute -bottom-1 left-2 h-1 w-[58%] origin-left bg-[var(--st-accent)]"
                  initial={reduced ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 1.2, delay: 0.45, ease: EASE_OUT }}
                  style={{ originX: 0 }}
                />
                <span
                  aria-hidden
                  className="absolute right-3 top-2 h-2.5 w-2.5 rounded-full bg-[var(--st-accent)]"
                  style={{ boxShadow: "0 0 0 6px rgba(194,248,79,0.18)" }}
                />
              </div>

              <p className="mt-7 max-w-sm text-[14.5px] leading-relaxed text-[var(--st-ink-2)]">
                Junaid Saleem — engineer of choice for teams that need
                AI-native web products built like furniture, not flat-pack.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {["AI", "RAG", "Full-stack", "Web", "Mobile"].map((t, i) => (
                  <motion.span
                    key={t}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + i * 0.05,
                      ease: EASE_OUT,
                    }}
                    className="st-mono rounded-full border border-[var(--st-line-2)] bg-[var(--st-bg)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--st-ink)]"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>

              <div className="mt-9 flex items-baseline gap-3 text-[var(--st-muted)]">
                <LuMapPin className="h-3.5 w-3.5 text-[var(--st-ink)]" />
                <span className="st-mono text-[10.5px] uppercase tracking-[0.22em]">
                  Established 2021 · Lahore · PK
                </span>
              </div>
            </div>

            {/* RIGHT — INDEX */}
            <div className="p-7 md:col-span-7 md:p-9">
              <div className="flex items-baseline justify-between border-b border-[var(--st-ink)] pb-3">
                <span className="st-mono text-[10px] uppercase tracking-[0.3em] text-[var(--st-ink)]">
                  Index — vital records
                </span>
                <span className="st-mono text-[10px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
                  Hover for notes
                </span>
              </div>

              <ul className="mt-1">
                {DOSSIER.map((row, i) => (
                  <DossierRow
                    key={row.label}
                    row={row}
                    index={i}
                    reduced={reduced}
                  />
                ))}
              </ul>

              {/* Pull quote slot */}
              <motion.figure {...fade(0.4)} className="mt-9">
                <p className="st-italic text-[clamp(1.15rem,1.9vw,1.55rem)] leading-[1.3] text-[var(--st-ink)]">
                  &ldquo;Build the smallest thing that proves the idea.
                  Then make it durable.&rdquo;
                </p>
                <figcaption className="st-mono mt-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[var(--st-muted)]">
                  <span className="h-px w-10 bg-[var(--st-line-2)]" />
                  Working principle · 01
                </figcaption>
              </motion.figure>
            </div>
          </div>

          {/* MARQUEE FOOTER */}
          <div className="relative overflow-hidden border-t border-[var(--st-ink)] bg-[var(--st-ink)] py-3 text-[var(--st-accent)]">
            <Marquee items={MARQUEE} reduced={reduced} />
          </div>
        </motion.div>

        {/* Animated bottom rule */}
        <motion.div {...fade(0.18)} className="relative mt-14">
          <Hairline reduced={reduced} delay={0.18} />
          <CornerTick className="-left-1 -top-1" rotate={270} flip />
          <CornerTick className="-right-1 -top-1" rotate={180} flip />
        </motion.div>

        {/* Closing strip */}
        <motion.div
          {...fade(0.1)}
          className="mt-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"
        >
          <p className="st-italic max-w-xl text-[clamp(1.1rem,1.6vw,1.4rem)] leading-snug text-[var(--st-ink-2)]">
            Currently building production RAG &amp; LLM pipelines for
            enterprise.
          </p>

          <ContactPill email={email} reduced={reduced} />
        </motion.div>
      </div>
    </section>
  );
};

/* ─────────────────────────────  PARTS  ───────────────────────────── */

const Stamp = () => (
  <span
    aria-hidden
    className="absolute right-5 top-5 z-10 -rotate-[8deg] select-none md:right-7 md:top-7"
  >
    <span
      className="st-mono flex flex-col items-center gap-1 rounded-sm border-[1.5px] border-[var(--st-ink)]/55 px-3 py-1.5 text-[8.5px] uppercase tracking-[0.25em] text-[var(--st-ink)]/70"
      style={{
        boxShadow:
          "inset 0 0 0 1.5px rgba(15,27,34,0.05), 0 0 0 1px rgba(15,27,34,0.05)",
      }}
    >
      <span className="font-semibold tracking-[0.32em]">Approved</span>
      <span className="h-px w-full bg-[var(--st-ink)]/35" />
      <span className="tracking-[0.3em]">2026 · Lhr</span>
    </span>
  </span>
);

const LiveClock = ({ reduced }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.span
      key="live-clock"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="st-mono inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.24em] text-[var(--st-ink-2)]"
    >
      <LuClock3 className="h-3 w-3 text-[var(--st-ink)]" />
      <span>Lahore</span>
      <span className="text-[var(--st-ink)]">{time || "––:––:––"}</span>
    </motion.span>
  );
};

const StatusPulse = ({ reduced }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--st-ink)] bg-[var(--st-ink)] px-3 py-1 text-[var(--st-paper)]">
    <motion.span
      className="h-1.5 w-1.5 rounded-full bg-[var(--st-accent)]"
      animate={
        reduced
          ? undefined
          : {
              boxShadow: [
                "0 0 0 0 rgba(194,248,79,0.6)",
                "0 0 0 7px rgba(194,248,79,0)",
              ],
            }
      }
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
    />
    <span className="st-mono text-[9.5px] uppercase tracking-[0.26em]">
      Available
    </span>
  </span>
);

const DossierRow = ({ row, index, reduced }) => {
  const [hover, setHover] = useState(false);
  return (
    <motion.li
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.55,
        delay: 0.32 + index * 0.05,
        ease: EASE_OUT,
      }}
      className="group relative grid grid-cols-12 items-baseline gap-3 border-b border-[var(--st-line-2)] py-3.5 outline-none transition-colors duration-300 hover:border-[var(--st-ink)] focus-visible:border-[var(--st-ink)]"
    >
      {/* Leading accent rail */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 h-[60%] w-[3px] -translate-y-1/2 origin-left bg-[var(--st-accent)]"
        initial={false}
        animate={{ scaleX: hover ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      />

      <span className="st-mono col-span-2 pl-2 text-[11px] tracking-wider text-[var(--st-muted)] md:col-span-1">
        {row.num}
      </span>
      <span className="st-mono col-span-3 text-[11px] uppercase tracking-[0.18em] text-[var(--st-ink-2)] md:col-span-3">
        {row.label}
      </span>

      <div className="col-span-7 md:col-span-8">
        <span className="flex items-center gap-2 text-[clamp(1rem,1.4vw,1.15rem)] text-[var(--st-ink)]">
          {row.live && (
            <motion.span
              className="h-2 w-2 rounded-full bg-[var(--st-accent)]"
              animate={
                reduced
                  ? undefined
                  : {
                      boxShadow: [
                        "0 0 0 0 rgba(194,248,79,0.55)",
                        "0 0 0 8px rgba(194,248,79,0)",
                      ],
                    }
              }
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <span className="st-italic">{row.value}</span>
          <motion.span
            aria-hidden
            className="ml-auto text-[var(--st-muted)]"
            animate={{ x: hover ? 0 : -4, opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <LuArrowUpRight className="h-3.5 w-3.5" />
          </motion.span>
        </span>

        {/* Hover-revealed note */}
        <motion.p
          initial={false}
          animate={{
            opacity: hover ? 1 : 0,
            height: hover ? "auto" : 0,
          }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="overflow-hidden text-[12.5px] leading-relaxed text-[var(--st-muted)]"
        >
          <span className="mt-1 block">↳ {row.note}</span>
        </motion.p>
      </div>
    </motion.li>
  );
};

const Marquee = ({ items, reduced }) => {
  // Render the strip twice for a seamless loop
  const strip = items.concat(items);
  return (
    <div className="relative flex w-full overflow-hidden">
      <div
        className={
          "flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 " +
          (reduced ? "" : "st-marquee-track")
        }
      >
        {strip.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="st-mono inline-flex items-center gap-3 text-[10.5px] uppercase tracking-[0.32em]"
          >
            <span
              aria-hidden
              className="inline-block h-1 w-1 rounded-full bg-[var(--st-accent)]"
            />
            {label}
          </span>
        ))}
      </div>
      <style jsx>{`
        .st-marquee-track {
          animation: st-marquee 38s linear infinite;
        }
        @keyframes st-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

const CornerTick = ({ className = "", rotate = 0, flip = false }) => (
  <span
    aria-hidden
    className={`pointer-events-none absolute z-10 h-3 w-3 ${className}`}
    style={{ transform: `rotate(${rotate}deg) ${flip ? "scaleY(-1)" : ""}` }}
  >
    <span className="absolute left-0 top-0 h-px w-3 bg-[var(--st-ink)]" />
    <span className="absolute left-0 top-0 h-3 w-px bg-[var(--st-ink)]" />
  </span>
);

const Hairline = ({ delay = 0, reduced, className = "" }) => (
  <motion.div
    initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 1, delay, ease: EASE_OUT }}
    style={{ originX: 0 }}
    className={`h-px w-full bg-[var(--st-ink)] ${className}`}
  />
);

const Updated = ({ reduced }) => {
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(
      new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );
  }, []);
  return (
    <motion.span
      key={date}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="text-[var(--st-ink)]"
    >
      {date || "—"}
    </motion.span>
  );
};

const ContactPill = ({ email, reduced }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard?.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleCopy}
        className="group inline-flex items-center gap-2 rounded-full border border-[var(--st-line-2)] bg-[var(--st-paper)] px-3.5 py-1.5 text-[var(--st-ink-2)] transition-colors duration-300 hover:border-[var(--st-ink)] hover:text-[var(--st-ink)]"
      >
        {copied ? (
          <LuCheck className="h-3 w-3" />
        ) : (
          <LuCopy className="h-3 w-3" />
        )}
        <span className="st-mono text-[11px] tracking-wider">
          {copied ? "Copied" : email}
        </span>
      </button>
      <motion.a
        href={`mailto:${email}`}
        whileHover={reduced ? undefined : { x: 2 }}
        transition={{ duration: 0.3 }}
        className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[var(--st-ink)] bg-[var(--st-ink)] px-4 py-2 text-[var(--st-paper)] transition-colors duration-300 hover:bg-[var(--st-paper)] hover:text-[var(--st-ink)]"
      >
        <span className="st-mono text-[11px] uppercase tracking-[0.2em]">
          Start a brief
        </span>
        <LuArrowUpRight className="h-3.5 w-3.5" />
      </motion.a>
    </div>
  );
};

const SectionEyebrow = ({ index, path, count }) => (
  <div className="flex items-center gap-3">
    <span className="st-mono text-[11px] uppercase tracking-[0.3em] text-[var(--st-ink)]">
      {index}
    </span>
    <span className="h-px w-8 bg-[var(--st-line-2)]" />
    <span className="st-mono text-[11px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
      {path}
    </span>
    {count && (
      <>
        <span className="h-px w-6 bg-[var(--st-line-2)]" />
        <span className="st-mono text-[11px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
          {count} entries
        </span>
      </>
    )}
  </div>
);

export default StudioBento;
