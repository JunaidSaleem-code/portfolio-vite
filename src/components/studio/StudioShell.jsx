"use client";

import ScrollStroke from "./ScrollStroke";

const StudioShell = ({ children }) => {
  return (
    <main className="st-shell relative min-h-screen overflow-x-hidden">
      {/* Atmospheric backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        {/* Warm cream base */}
        <div className="absolute inset-0 bg-[var(--st-bg)]" />
        {/* Top-left warm wash */}
        <div
          className="absolute -left-[20%] -top-[10%] h-[60vh] w-[60vh] rounded-full opacity-[0.55]"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 220, 150, 0.5), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* Bottom-right cool counterpoint */}
        <div
          className="absolute -bottom-[15%] -right-[10%] h-[70vh] w-[70vh] rounded-full opacity-[0.45]"
          style={{
            background:
              "radial-gradient(circle, rgba(194, 248, 79, 0.35), transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(15, 27, 34, 0.08) 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        {/* Grain */}
        <div className="st-grain absolute inset-0" />
      </div>

      {/* Scroll stroke (signature) */}
      <ScrollStroke />

      {/* Content above stroke */}
      <div className="relative z-10">{children}</div>
    </main>
  );
};

export default StudioShell;
