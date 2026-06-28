"use client";

import ScrollStroke from "./ScrollStroke";

/**
 * Atmospheric backdrop is expressed as classes (`st-shell-glow-*`) so
 * mobile-specific overrides in globals.css can dial down the heaviest
 * effects (large blur radii, grain blend) where they cost the most.
 */
const StudioShell = ({ children, hideStroke = false }) => {
  return (
    <main className="st-shell relative min-h-screen overflow-clip">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[var(--st-bg)]" />
        <div className="st-shell-glow st-shell-glow--warm" />
        <div className="st-shell-glow st-shell-glow--cool" />
        <div className="st-shell-dotgrid" />
        <div className="st-grain st-shell-grain absolute inset-0" />
      </div>

      {!hideStroke && <ScrollStroke />}

      <div className="relative z-10">{children}</div>
    </main>
  );
};

export default StudioShell;
