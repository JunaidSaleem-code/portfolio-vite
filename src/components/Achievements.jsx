"use client";

import { useRef, useState } from "react";
import { LuGraduationCap, LuAward, LuSparkles } from "react-icons/lu";
import ScrollPathLayer from "./ScrollPathLayer";

const TYPES = {
  education: {
    icon: LuGraduationCap,
    accent: "from-cyan-400 to-blue-500",
    spotlightColor: "rgba(34, 211, 238, 0.10)",
    glow: "dark:hover:shadow-cyan-500/10",
  },
  recognition: {
    icon: LuAward,
    accent: "from-purple-400 to-pink-500",
    spotlightColor: "rgba(168, 85, 247, 0.12)",
    glow: "dark:hover:shadow-purple-500/10",
  },
};

const Achievements = ({ items = [] }) => {
  const ref = useRef(null);
  const education = items.filter((i) => i.type === "education");
  const recognition = items.filter((i) => i.type === "recognition");

  if (!education.length && !recognition.length) return null;

  return (
    <section ref={ref} className="relative py-24 px-4" id="achievements">
      {/* Soft glow behind heading */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-72 max-w-3xl bg-purple-500/10 blur-3xl dark:bg-purple-500/20" />

      <ScrollPathLayer
        containerRef={ref}
        variant="achievements"
        className="absolute inset-0 h-full w-full -z-10"
        opacity={0.4}
        strokeWidth={3}
      />

      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-300/40 bg-purple-50 px-3 py-1 text-xs uppercase tracking-widest text-purple-700 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-300">
            <LuSparkles className="h-3 w-3" />
            Credentials
          </span>
          <h1 className="heading mt-4 text-zinc-900 dark:text-white">
            Education &{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Recognition
            </span>
          </h1>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {education.length > 0 && (
            <Group title="Education" type="education" items={education} />
          )}
          {recognition.length > 0 && (
            <Group title="Recognition" type="recognition" items={recognition} />
          )}
        </div>
      </div>
    </section>
  );
};

const Group = ({ title, type, items }) => {
  const config = TYPES[type];
  const Icon = config.icon;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${config.accent} text-white shadow-lg`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h2>
      </div>

      <div className="relative flex flex-col gap-4">
        {/* timeline line */}
        <div className="pointer-events-none absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-purple-300 via-zinc-200 to-transparent dark:from-purple-500/50 dark:via-white/10 dark:to-transparent" />

        {items.map((item, idx) => (
          <Card key={item._id || `${item.title}-${idx}`} item={item} type={type} />
        ))}
      </div>
    </div>
  );
};

const Card = ({ item, type }) => {
  const config = TYPES[type];
  const Icon = config.icon;
  const [coords, setCoords] = useState({ x: -200, y: -200 });

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  return (
    <div className="group relative pl-12">
      {/* Timeline dot */}
      <div
        className={`absolute left-3 top-6 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br ${config.accent} ring-4 ring-white shadow-md transition-transform group-hover:scale-125 dark:ring-black`}
      >
        <Icon className="h-2 w-2 text-white" />
      </div>

      {/* Card */}
      <div
        onMouseMove={handleMouseMove}
        className={`relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-zinc-950 ${config.glow}`}
      >
        {/* Gradient border on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div
            className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${config.accent} opacity-60`}
            style={{
              maskImage:
                "linear-gradient(black, black), linear-gradient(black, black)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: "1px",
            }}
          />
        </div>

        {/* Cursor-tracking spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${config.spotlightColor}, transparent 40%)`,
          }}
        />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold leading-tight text-zinc-900 dark:text-white">
              {item.title}
            </h3>
            {item.period && (
              <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
                {item.period}
              </span>
            )}
          </div>

          {item.organization && (
            <p
              className={`mt-1.5 bg-gradient-to-r ${config.accent} bg-clip-text text-sm font-medium text-transparent`}
            >
              {item.organization}
            </p>
          )}

          {item.description && (
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {item.description}
            </p>
          )}

          {/* Bottom accent line that grows on hover */}
          <div className="mt-4 h-px w-0 overflow-hidden transition-all duration-500 group-hover:w-full">
            <div className={`h-full w-full bg-gradient-to-r ${config.accent}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
