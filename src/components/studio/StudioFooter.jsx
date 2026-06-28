"use client";

import { useState } from "react";
import Image from "next/image";
import { LuArrowUpRight, LuMail } from "react-icons/lu";
import ContactDialog from "@/components/ContactDialog";
import SubscribeForm from "@/components/SubscribeForm";

const DEFAULTS = {
  paragraph:
    "Taking on selected freelance and full-time work. AI integrations, Next.js product builds, deep-dive consulting — drop a line.",
  contactEmail: "chmjunaidsaleem@gmail.com",
  copyright: `© ${new Date().getFullYear()} — handcrafted in Lahore`,
};

const StudioFooter = ({ content, socialLinks = [] }) => {
  const c = { ...DEFAULTS, ...(content || {}) };
  const [open, setOpen] = useState(false);

  return (
    <footer id="contact" className="relative px-6 pt-16 pb-6 md:pt-20 md:pb-8">
      <div className="mx-auto max-w-6xl">
        <SectionEyebrow index="⑧" path="Contact" />

        <h2 className="st-display mt-5 text-[clamp(2.75rem,10vw,8.5rem)] text-[var(--st-ink)]">
          Let&apos;s build
          <br />
          <span className="st-italic font-normal">something</span>{" "}
          <span className="relative inline-block">
            real
            <span className="absolute -bottom-3 left-0 h-[12px] w-full -skew-x-3 rounded-sm bg-[var(--st-accent)] opacity-90 -z-10" />
          </span>
          .
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <p className="max-w-md text-lg leading-relaxed text-[var(--st-ink-2)]">
              {c.paragraph}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="st-cta st-cta--dark"
              >
                <LuMail className="h-4 w-4" />
                Send a message
              </button>
              <a
                href={`mailto:${c.contactEmail}`}
                className="st-link st-mono inline-flex items-center text-[12px] uppercase tracking-[0.22em] text-[var(--st-ink-2)]"
              >
                {c.contactEmail}
              </a>
            </div>
          </div>

          <div className="md:col-span-5">
            <p className="st-mono text-[10px] uppercase tracking-[0.3em] text-[var(--st-muted)]">
              ↳ newsletter
            </p>
            <p className="st-italic mt-3 max-w-sm text-2xl leading-tight text-[var(--st-ink)]">
              Occasional notes on AI, full-stack, and what I&apos;m building.
            </p>
            <div className="mt-5">
              <SubscribeForm source="footer" compact />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--st-line-2)] py-5 md:flex-row">
          <p className="st-mono text-[10px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
            {c.copyright}
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map((p) => (
              <a
                key={p._id || p.id || p.link}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.label || "social"}
                title={p.label || ""}
                className="group flex h-11 w-11 items-center justify-center rounded-full bg-[var(--st-ink)] text-[var(--st-paper)] transition hover:-translate-y-0.5 hover:bg-[var(--st-ink-2)] hover:shadow-[0_8px_18px_-8px_rgba(15,27,34,0.45)]"
              >
                {p.icon ? (
                  <Image
                    src={p.icon}
                    alt=""
                    width={18}
                    height={18}
                    className="object-contain brightness-0 invert opacity-90 transition-opacity group-hover:opacity-100"
                  />
                ) : (
                  <LuArrowUpRight className="h-4 w-4 text-[var(--st-paper)]" />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      <ContactDialog
        open={open}
        onClose={() => setOpen(false)}
        fallbackEmail={c.contactEmail}
      />
    </footer>
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

export default StudioFooter;
