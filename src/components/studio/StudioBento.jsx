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
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-[var(--st-ink)] bg-[var(--st-bg-2)] px-4 py-2.5 sm:px-5 sm:py-3 md:px-7">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="st-mono text-[9px] uppercase tracking-[0.26em] text-[var(--st-ink)] sm:text-[9.5px] sm:tracking-[0.3em]">
                Profile
              </span>
              <span className="hidden h-px w-6 bg-[var(--st-ink)]/40 sm:inline-block" />
              <span className="st-mono text-[9px] uppercase tracking-[0.26em] text-[var(--st-ink-2)] sm:text-[9.5px] sm:tracking-[0.3em]">
                Nº 0001 / 26
              </span>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-4">
              <LiveClock reduced={reduced} />
              <span className="hidden h-3 w-px bg-[var(--st-line-2)] md:inline-block" />
              <StatusPulse reduced={reduced} />
            </div>
          </div>

          {/* Plate body */}
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* LEFT — specimen card */}
            <div className="relative border-b border-[var(--st-line-2)] p-5 sm:p-7 md:col-span-5 md:border-b-0 md:border-r md:p-9">
              {/* Specimen header band */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="st-mono text-[9.5px] uppercase tracking-[0.3em] text-[var(--st-ink)]">
                    Specimen
                  </span>
                  <span className="h-px w-6 bg-[var(--st-line-2)] sm:w-8" />
                  <span className="st-mono text-[9.5px] uppercase tracking-[0.3em] text-[var(--st-muted)]">
                    Plate 01 / 26
                  </span>
                </div>
                <InlineStamp />
              </div>

              {/* Portrait frame — typographic monogram with ruler ticks */}
              <div className="relative mt-7 mx-auto w-full max-w-[300px] md:mx-0">
                <CornerTick className="-left-[3px] -top-[3px]" rotate={0} />
                <CornerTick className="-right-[3px] -top-[3px]" rotate={90} />
                <CornerTick className="-left-[3px] -bottom-[3px]" rotate={270} />
                <CornerTick className="-right-[3px] -bottom-[3px]" rotate={180} />

                <div className="relative aspect-[4/5] w-full overflow-hidden border-[1.5px] border-[var(--st-ink)] bg-[var(--st-bg-2)]">
                  {/* ruler tick column */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex w-4 flex-col justify-between border-r border-[var(--st-line-2)] bg-[var(--st-paper)] py-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <span
                        key={i}
                        className={`block h-px ${
                          i % 2 === 0
                            ? "w-3 bg-[var(--st-ink)]/55"
                            : "w-1.5 bg-[var(--st-ink)]/30"
                        }`}
                      />
                    ))}
                  </div>

                  {/* portrait image, if any */}
                  {portraitImage ? (
                    <Image
                      src={portraitImage}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 80vw, 300px"
                      className="object-cover"
                    />
                  ) : null}

                  {/* monogram + underline — sits above the nameplate, clears the ruler */}
                  <div className="absolute inset-y-0 left-4 right-0 flex flex-col items-start justify-end pb-10 pl-3 pr-2">
                    <span
                      aria-hidden
                      className={`st-italic leading-[0.78] text-[clamp(6.5rem,20vw,11rem)] ${
                        portraitImage
                          ? "text-[var(--st-paper)] mix-blend-difference"
                          : "text-[var(--st-ink)]"
                      }`}
                    >
                      {initials}
                    </span>
                    <motion.span
                      aria-hidden
                      className="mt-2 h-[3px] w-[55%] origin-left bg-[var(--st-accent)]"
                      initial={reduced ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 1.2, delay: 0.45, ease: EASE_OUT }}
                      style={{ originX: 0 }}
                    />
                  </div>

                  {/* lime ink dot */}
                  <span
                    aria-hidden
                    className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[var(--st-accent)]"
                    style={{ boxShadow: "0 0 0 6px rgba(194,248,79,0.18)" }}
                  />

                  {/* nameplate band at bottom */}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 border-t border-[var(--st-ink)] bg-[var(--st-ink)] px-3 py-1.5 text-[var(--st-paper)]">
                    <span className="st-mono text-[8.5px] uppercase tracking-[0.26em]">
                      Junaid Saleem
                    </span>
                    <span className="st-mono text-[8.5px] uppercase tracking-[0.26em] text-[var(--st-accent)]">
                      Lhr · 2021 →
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-7 max-w-sm text-[14.5px] leading-relaxed text-[var(--st-ink-2)]">
                Engineer of choice for teams that need AI-native web products
                built like furniture, not flat-pack.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
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

              <div className="mt-7 flex items-center gap-3 text-[var(--st-muted)]">
                <LuMapPin className="h-3.5 w-3.5 text-[var(--st-ink)]" />
                <span className="st-mono text-[10.5px] uppercase tracking-[0.22em]">
                  Established 2021 · Lahore · PK
                </span>
              </div>
            </div>

            {/* RIGHT — INDEX */}
            <div className="p-5 sm:p-7 md:col-span-7 md:p-9">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-[var(--st-ink)] pb-3">
                <span className="st-mono text-[9.5px] uppercase tracking-[0.26em] text-[var(--st-ink)] sm:text-[10px] sm:tracking-[0.3em]">
                  Index — vital records
                </span>
                <span className="st-mono text-[9px] uppercase tracking-[0.2em] text-[var(--st-muted)] sm:text-[10px] sm:tracking-[0.22em]">
                  <span className="hidden md:inline">Hover for notes</span>
                  <span className="md:hidden">Tap a row</span>
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
    className="absolute right-3 top-3 z-10 -rotate-[8deg] select-none sm:right-5 sm:top-5 md:right-7 md:top-7"
  >
    <StampMark />
  </span>
);

const InlineStamp = () => (
  <span aria-hidden className="-rotate-[6deg] select-none">
    <StampMark />
  </span>
);

const StampMark = () => (
  <span
    className="st-mono flex flex-col items-center gap-0.5 rounded-sm border-[1.5px] border-[var(--st-ink)]/55 px-2 py-1 text-[7.5px] uppercase tracking-[0.22em] text-[var(--st-ink)]/70 sm:gap-1 sm:px-3 sm:py-1.5 sm:text-[8.5px] sm:tracking-[0.25em]"
    style={{
      boxShadow:
        "inset 0 0 0 1.5px rgba(15,27,34,0.05), 0 0 0 1px rgba(15,27,34,0.05)",
    }}
  >
    <span className="font-semibold tracking-[0.28em] sm:tracking-[0.32em]">
      Approved
    </span>
    <span className="h-px w-full bg-[var(--st-ink)]/35" />
    <span className="tracking-[0.26em] sm:tracking-[0.3em]">2026 · Lhr</span>
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

  // Drop seconds on tiny widths — keeps the header band single-row.
  const compact = time.length === 8 ? time.slice(0, 5) : time;

  return (
    <motion.span
      key="live-clock"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="st-mono inline-flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.2em] text-[var(--st-ink-2)] sm:gap-2 sm:text-[10.5px] sm:tracking-[0.24em]"
    >
      <LuClock3 className="h-3 w-3 text-[var(--st-ink)]" />
      <span className="hidden sm:inline">Lahore</span>
      <span className="text-[var(--st-ink)] tabular-nums">
        <span className="sm:hidden">{compact || "––:––"}</span>
        <span className="hidden sm:inline">{time || "––:––:––"}</span>
      </span>
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
  // `open` is the persistent (click/focus) state; `hover` adds desktop polish.
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const active = open || hover;

  return (
    <motion.li
      onClick={() => setOpen((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((v) => !v);
        }
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      role="button"
      aria-expanded={open}
      tabIndex={0}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.55,
        delay: 0.32 + index * 0.05,
        ease: EASE_OUT,
      }}
      className="group relative grid cursor-pointer grid-cols-12 items-baseline gap-2 border-b border-[var(--st-line-2)] py-3 outline-none transition-colors duration-300 hover:border-[var(--st-ink)] focus-visible:border-[var(--st-ink)] sm:gap-3 sm:py-3.5"
    >
      {/* Leading accent rail */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 h-[60%] w-[3px] -translate-y-1/2 origin-left bg-[var(--st-accent)]"
        initial={false}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      />

      <span className="st-display col-span-2 pl-2 text-[18px] leading-none tracking-tight text-[var(--st-ink)] tabular-nums sm:text-[22px] md:col-span-2">
        {row.num}
      </span>
      <span className="st-mono col-span-3 self-center text-[9.5px] uppercase tracking-[0.22em] text-[var(--st-muted)] sm:text-[10px] sm:tracking-[0.26em] md:col-span-3">
        {row.label}
      </span>

      <div className="col-span-7 min-w-0 md:col-span-7">
        <span className="flex items-center gap-2 text-[clamp(0.98rem,1.45vw,1.18rem)] text-[var(--st-ink)]">
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
          <span className="break-words">{row.value}</span>
          <motion.span
            aria-hidden
            className="ml-auto shrink-0 text-[var(--st-muted)]"
            animate={{ x: active ? 0 : -4, opacity: active ? 1 : 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <LuArrowUpRight className="h-3.5 w-3.5" />
          </motion.span>
        </span>

        {/* Tap/hover-revealed note */}
        <motion.p
          initial={false}
          animate={{
            opacity: active ? 1 : 0,
            height: active ? "auto" : 0,
          }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="overflow-hidden text-[12px] leading-relaxed text-[var(--st-muted)] sm:text-[12.5px]"
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
