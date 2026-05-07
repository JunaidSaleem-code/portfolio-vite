"use client";

import { motion, useScroll, useTransform } from "framer-motion";

// A scroll-driven decorative SVG stroke that draws itself as the user
// scrolls past the wrapping section. Place it as an absolutely-positioned
// background element inside any section. The parent must be `relative`
// (or `position: relative`) and pass a ref tied to its own bounding box.

const PATHS = {
  // Long horizontal flowing curve — fits wide sections like Experience
  experience:
    "M 0 60 C 200 -40, 350 200, 520 80 S 820 -30, 1000 100 S 1300 230, 1480 80 S 1780 -20, 1960 110",
  // Diagonal s-curve — fits two-column credential layouts
  achievements:
    "M 40 40 C 200 200, 380 80, 520 240 S 820 360, 980 200 S 1280 120, 1440 280",
};

const VIEWBOXES = {
  experience: "0 0 1960 280",
  achievements: "0 0 1440 360",
};

export default function ScrollPathLayer({
  containerRef,
  variant = "experience",
  className = "",
  strokeWidth = 4,
  gradient = ["#a855f7", "#d946ef", "#3b82f6"],
  opacity = 0.5,
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const gradientId = `scroll-path-${variant}`;

  return (
    <svg
      viewBox={VIEWBOXES[variant]}
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          {gradient.map((c, i) => (
            <stop
              key={i}
              offset={`${(i / (gradient.length - 1)) * 100}%`}
              stopColor={c}
            />
          ))}
        </linearGradient>
      </defs>
      <motion.path
        d={PATHS[variant]}
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        style={{ pathLength }}
      />
    </svg>
  );
}
