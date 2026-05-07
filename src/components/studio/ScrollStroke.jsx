"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Multiple tangled strings at the hero that unspool and follow scroll.
 *
 *   - One full-page SVG, three intertwined bezier paths.
 *   - Each path's first ~25% is a tangle in the hero region (y < 900).
 *   - Each path's remaining 75% descends down the page through every section.
 *   - pathLength is mapped from scrollYProgress[0..1] → [tangle%, 1.0]
 *     so on initial load you see only the tangle, and as you scroll the
 *     strings unwind and trail down past every section.
 *   - useSpring smooths the scroll value so the strings feel like
 *     yarn responding to a gentle pull, not a jagged scrub.
 */

const PATH_A = "M 720 80 \
C 580 220, 460 380, 700 460 \
C 940 540, 1080 400, 980 240 \
C 880 80, 720 260, 740 460 \
C 760 660, 1080 640, 1180 860 \
C 1260 1080, 1380 1340, 1280 1540 \
C 1080 1740, 720 1700, 480 1920 \
C 240 2140, 280 2480, 580 2660 \
C 880 2820, 1200 2860, 1340 3080 \
C 1480 3300, 1380 3540, 1080 3720 \
C 800 3880, 660 4170, 960 4340 \
C 1260 4500, 1500 4680, 1280 4900 \
C 1020 5080, 720 5060, 600 5300 \
C 480 5540, 720 5780, 1080 5940 \
C 1380 6080, 1480 6280, 1240 6460 \
C 980 6640, 720 6740, 740 6940 \
C 780 7120, 980 7220, 980 7320";

const PATH_B = "M 460 120 \
C 700 220, 880 340, 760 540 \
C 640 720, 480 600, 380 760 \
C 280 920, 480 1040, 380 1220 \
C 280 1380, 320 1560, 480 1700 \
C 620 1820, 800 1740, 660 1940 \
C 540 2160, 320 2400, 480 2620 \
C 700 2820, 920 2920, 760 3120 \
C 600 3320, 440 3520, 580 3720 \
C 720 3920, 920 4080, 720 4300 \
C 540 4500, 380 4720, 580 4920 \
C 780 5100, 920 5260, 740 5460 \
C 540 5660, 360 5860, 580 6060 \
C 800 6260, 940 6460, 700 6660 \
C 540 6840, 480 7080, 660 7280";

const PATH_C = "M 980 60 \
C 800 220, 700 380, 880 500 \
C 1060 620, 920 760, 760 700 \
C 600 640, 760 880, 880 1040 \
C 1000 1200, 920 1400, 820 1620 \
C 720 1820, 880 1980, 820 1820 \
C 720 2020, 600 2200, 740 2400 \
C 880 2620, 980 2820, 820 3020 \
C 660 3220, 540 3420, 700 3620 \
C 860 3820, 980 4020, 800 4220 \
C 620 4420, 540 4620, 760 4820 \
C 940 5020, 1020 5220, 840 5440 \
C 660 5660, 580 5860, 760 6060 \
C 940 6260, 1000 6460, 820 6660 \
C 660 6860, 740 7080, 720 7280";

const ScrollStroke = () => {
  const { scrollYProgress } = useScroll();

  // 1:1 with scroll. A small portion of each path is the hero crossing
  // (always visible); the rest unwinds in lockstep with scrollYProgress.
  const lengthA = useTransform(scrollYProgress, [0, 1], [0.20, 1]);
  const lengthB = useTransform(scrollYProgress, [0, 1], [0.18, 1]);
  const lengthC = useTransform(scrollYProgress, [0, 1], [0.22, 1]);

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox="0 0 1440 7320"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="st-strand-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C2F84F" stopOpacity="1" />
          <stop offset="55%" stopColor="#A8E03F" stopOpacity="1" />
          <stop offset="100%" stopColor="#7AAE26" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="st-strand-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C2F84F" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#9BD42A" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="st-strand-c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D6FF7A" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#A8E03F" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* PATH A — primary thick strand with a soft halo */}
      <motion.path
        d={PATH_A}
        stroke="url(#st-strand-a)"
        strokeWidth="14"
        opacity="0.22"
        fill="none"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: lengthA }}
      />
      <motion.path
        d={PATH_A}
        stroke="url(#st-strand-a)"
        strokeWidth="4"
        fill="none"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: lengthA }}
      />

      {/* PATH B — secondary medium strand */}
      <motion.path
        d={PATH_B}
        stroke="url(#st-strand-b)"
        strokeWidth="2.6"
        fill="none"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: lengthB }}
      />

      {/* PATH C — wisp strand */}
      <motion.path
        d={PATH_C}
        stroke="url(#st-strand-c)"
        strokeWidth="1.8"
        fill="none"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: lengthC }}
      />
    </svg>
  );
};

export default ScrollStroke;
