"use client";

import { cn } from "@/lib/utils";

// CSS-only stand-in for the original WebGL canvas-reveal effect.
// Renders an animated dot grid with a radial gradient that fades from the
// containerClassName color towards transparent. Lightweight, no three.js.

function rgbArrayToCss(arr, alpha = 0.9) {
  if (!Array.isArray(arr) || arr.length < 3) return null;
  const [r, g, b] = arr;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const CanvasRevealEffect = ({
  animationSpeed = 3,
  containerClassName,
  colors,
  dotSize,
}) => {
  const palette = Array.isArray(colors) && colors.length > 0
    ? colors.map((c) => rgbArrayToCss(c, 0.85)).filter(Boolean)
    : ["rgba(56, 189, 248, 0.6)"];

  const accent = palette[0];
  const accent2 = palette[1] || palette[0];
  const size = dotSize ? `${Math.max(2, dotSize) * 2}px` : "8px";
  const speed = `${Math.max(2, 16 / animationSpeed)}s`;

  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full overflow-hidden rounded-3xl",
        containerClassName
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`,
          backgroundSize: `${size} ${size}`,
          opacity: 0.6,
          animation: `cre-pan ${speed} linear infinite`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${accent2}, transparent 60%)`,
          mixBlendMode: "screen",
          opacity: 0.7,
        }}
      />
      <style jsx>{`
        @keyframes cre-pan {
          from { background-position: 0 0; }
          to { background-position: 100px 100px; }
        }
      `}</style>
    </div>
  );
};
