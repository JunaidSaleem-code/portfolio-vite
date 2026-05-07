"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { LuSun, LuMoon } from "react-icons/lu";

export default function ThemeToggle({ className = "" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes mismatches SSR/CSR — wait for mount before rendering icon
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={
        "inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white " +
        className
      }
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {mounted ? (
        isDark ? <LuSun className="h-4 w-4" /> : <LuMoon className="h-4 w-4" />
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  );
}
