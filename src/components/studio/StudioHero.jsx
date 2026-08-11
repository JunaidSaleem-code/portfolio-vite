"use client";

import { useEffect, useState } from "react";
import { LuArrowUpRight, LuDownload } from "react-icons/lu";
import AskJunaid from "./AskJunaid";

const DEFAULTS = {
  name: "Junaid Saleem",
  ctaText: "See my work",
  ctaLink: "#projects",
  resumeUrl: "/resume.pdf",
  resumeButtonText: "Download CV",
  subheadline:
    "I'm Junaid — a full-stack engineer shipping AI-powered web products end-to-end. RAG pipelines, LLM integration, and production-grade Next.js.",
};

const StudioHero = ({ content: initialContent }) => {
  const [heroContent, setHeroContent] = useState(initialContent || null);

  useEffect(() => {
    fetch("/api/settings/hero")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data === "object" && Object.keys(data).length > 0) {
          setHeroContent(data);
        }
      })
      .catch(() => {});
  }, []);

  const c = { ...DEFAULTS, ...(heroContent || initialContent || {}) };

  return (
    <section
      id="top"
      className="relative px-6 pt-28 pb-16 md:pt-32 md:pb-24"
    >
      <span id="home" data-anchor className="block scroll-mt-24" />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-12 md:items-start">
          <div className="md:col-span-9">
            <h1 className="st-up st-display text-[clamp(2.75rem,9.4vw,8rem)] leading-[0.86] text-[var(--st-ink)] [animation-delay:0.1s]">
              <span className="block">Engineering</span>
              <span className="st-italic block font-normal text-[var(--st-ink-2)]">
                AI products
              </span>
              <span className="block">
                that{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">ship</span>
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 right-0 z-0 h-[14px] -skew-x-3 rounded-sm bg-[var(--st-accent)] opacity-95"
                  />
                </span>
                <span className="text-[var(--st-muted-2)]">.</span>
              </span>
            </h1>

            <p className="st-up mt-10 max-w-xl text-base leading-relaxed text-[var(--st-ink-2)] md:text-lg [animation-delay:0.28s]">
              {c.subheadline}
            </p>

            <div className="st-up mt-8 flex flex-wrap items-center gap-3 [animation-delay:0.4s]">
              <a href={c.ctaLink} className="st-cta">
                {c.ctaText}
                <LuArrowUpRight className="h-4 w-4" />
              </a>
              {c.resumeUrl && (() => {
                let downloadUrl = c.resumeUrl;
                if (downloadUrl && downloadUrl.includes("res.cloudinary.com")) {
                  if (downloadUrl.includes("/image/upload/")) {
                    downloadUrl = downloadUrl.replace("/image/upload/", "/raw/upload/fl_attachment/");
                  } else if (downloadUrl.includes("/upload/") && !downloadUrl.includes("fl_attachment")) {
                    downloadUrl = downloadUrl.replace("/upload/", "/upload/fl_attachment/");
                  }
                }
                return (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="st-cta st-cta--ghost"
                  >
                    <LuDownload className="h-4 w-4" />
                    {c.resumeButtonText}
                  </a>
                );
              })()}
            </div>
          </div>

          <aside className="st-up md:col-span-3 md:mt-4 [animation-delay:0.5s]">
            <div className="flex items-center justify-center md:justify-end">
              <OrbitalBadge />
            </div>
          </aside>
        </div>

        {/* Ask Junaid — featured live RAG transcript */}
        <div className="st-up relative mt-20 [animation-delay:0.55s]">
          {/* Soft lime halo behind the chat */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -inset-y-10 -z-10 hidden md:block"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 40%, rgba(194,248,79,0.35), transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-3 -inset-y-6 -z-10 md:hidden"
            style={{
              background:
                "radial-gradient(70% 60% at 50% 30%, rgba(194,248,79,0.30), transparent 70%)",
              filter: "blur(28px)",
            }}
          />

          {/* Announcement header */}
          <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-2.5 sm:gap-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="st-mono inline-flex items-center gap-2 rounded-full border border-[var(--st-ink)] bg-[var(--st-ink)] px-2.5 py-1 text-[9.5px] uppercase tracking-[0.26em] text-[var(--st-accent)] sm:px-3 sm:text-[10px] sm:tracking-[0.28em]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[var(--st-accent)] opacity-70" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--st-accent)]" />
                  </span>
                  New · Interactive
                </span>
                <span className="st-mono text-[9.5px] uppercase tracking-[0.2em] text-[var(--st-muted)] sm:text-[10px] sm:tracking-[0.22em]">
                  Live RAG · grounded in my dossier
                </span>
              </div>

              <h3 className="st-display text-[clamp(1.5rem,6vw,2.75rem)] leading-[0.95] text-[var(--st-ink)]">
                Ask me{" "}
                <span className="relative inline-block">
                  <span className="st-italic relative z-10 font-normal">anything</span>
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 right-0 z-0 h-[10px] -skew-x-3 rounded-sm bg-[var(--st-accent)] opacity-95"
                  />
                </span>
                <span className="text-[var(--st-muted-2)]">.</span>
              </h3>
              <p className="max-w-md text-[13.5px] leading-relaxed text-[var(--st-ink-2)] sm:text-[14.5px]">
                A real RAG pipeline reading from my own projects, experience, and
                recognition — answers stream in, citations link straight to the work.
              </p>
            </div>

            <CalloutArrow />
          </div>

          {/* Chat with accent rail */}
          <div className="relative">
            <span
              aria-hidden
              className="absolute -left-[3px] top-3 bottom-3 hidden w-[3px] rounded-full bg-[var(--st-accent)] md:block"
              style={{ boxShadow: "0 0 18px var(--st-accent-glow)" }}
            />
            <AskJunaid className="shadow-[0_30px_60px_-30px_rgba(15,27,34,0.35),0_0_0_1px_var(--st-ink)]" />
          </div>
        </div>

        <dl className="st-up mt-16 grid gap-y-0 [animation-delay:0.65s]">
          <Row label="Currently" value="Production RAG & LLM pipelines · Vanar" />
          <Row
            label="Stack"
            value="Next.js · TypeScript · Python · RAG · LLM · Postgres"
          />
          <Row
            label="Based"
            value="Lahore, Pakistan — open to selected work"
            last
          />
        </dl>

        <div className="st-up mt-16 overflow-hidden border-y border-[var(--st-line-2)] py-3 [animation-delay:0.7s]">
          <div className="st-marquee gap-12 whitespace-nowrap">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center gap-12 pr-12">
                {[
                  "Available for selected work",
                  "AI · RAG · LLM",
                  "Next.js · Node · Postgres",
                  "Lahore, Pakistan",
                  "Shipping since 2021",
                ].map((t, k) => (
                  <span
                    key={`${dup}-${k}`}
                    className="st-mono flex items-center gap-12 text-[12px] uppercase tracking-[0.28em] text-[var(--st-ink-2)]"
                  >
                    {t}
                    <span
                      className="h-1 w-1 rounded-full bg-[var(--st-accent)]"
                      style={{ boxShadow: "0 0 10px var(--st-accent-glow)" }}
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CalloutArrow = () => (
  <div className="relative hidden shrink-0 items-end gap-3 self-end md:flex">
    <div className="-rotate-[6deg] text-right">
      <p className="st-italic text-[clamp(1.05rem,1.6vw,1.45rem)] leading-tight text-[var(--st-ink)]">
        try me — I&rsquo;m
        <br />
        actually live.
      </p>
      <p className="st-mono mt-1 text-[9.5px] uppercase tracking-[0.28em] text-[var(--st-muted)]">
        ↓ powered by RAG
      </p>
    </div>
    <svg
      aria-hidden
      width="62"
      height="84"
      viewBox="0 0 62 84"
      className="text-[var(--st-ink)]"
      fill="none"
    >
      <path
        className="st-arrow-curve"
        d="M 6 6 C 24 14, 44 22, 50 44 C 54 60, 42 70, 28 76"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        className="st-arrow-head"
        d="M 28 76 L 22 70 M 28 76 L 36 73"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
    <style jsx>{`
      .st-arrow-curve {
        stroke-dasharray: 180;
        stroke-dashoffset: 180;
        animation: st-arrow-draw 1.4s ease-out 0.6s forwards;
      }
      .st-arrow-head {
        opacity: 0;
        animation: st-arrow-head 0.4s ease-out 1.9s forwards;
      }
      @keyframes st-arrow-draw {
        to {
          stroke-dashoffset: 0;
        }
      }
      @keyframes st-arrow-head {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .st-arrow-curve {
          stroke-dashoffset: 0;
          animation: none;
        }
        .st-arrow-head {
          opacity: 1;
          animation: none;
        }
      }
    `}</style>
  </div>
);

const Row = ({ label, value, last }) => (
  <div
    className={`grid grid-cols-[6.5rem_1fr] items-baseline gap-6 py-4 md:grid-cols-[10rem_1fr] ${
      last ? "" : "border-b border-[var(--st-line)]"
    }`}
  >
    <dt className="st-mono text-[10px] uppercase tracking-[0.3em] text-[var(--st-muted)]">
      {label}
    </dt>
    <dd className="text-base text-[var(--st-ink)] md:text-lg">{value}</dd>
  </div>
);

const OrbitalBadge = () => (
  <div className="relative h-40 w-40 md:h-44 md:w-44">
    <svg
      viewBox="0 0 200 200"
      className="absolute inset-0 h-full w-full animate-[spin_22s_linear_infinite]"
    >
      <defs>
        <path
          id="orbit-circle"
          d="M 100 100 m -78 0 a 78 78 0 1 1 156 0 a 78 78 0 1 1 -156 0"
        />
      </defs>
      <text
        className="fill-[var(--st-ink)]"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10.5px",
          letterSpacing: "5px",
          textTransform: "uppercase",
        }}
      >
        <textPath href="#orbit-circle" startOffset="0">
          Available for work · Available for work · Available for work ·
        </textPath>
      </text>
    </svg>
    <span className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--st-ink)] text-[var(--st-paper)]">
      <span className="absolute h-full w-full animate-ping rounded-full bg-[var(--st-accent)] opacity-25" />
      <span className="st-italic relative text-2xl">JS</span>
    </span>
  </div>
);

export default StudioHero;
