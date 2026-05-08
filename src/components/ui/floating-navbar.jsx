"use client";

import ThemeToggle from "../ThemeToggle";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const FloatingNav = ({ navItems, className }) => {
  return (
    <div
      className={cn(
        "flex max-w-fit fixed top-10 inset-x-0 mx-auto border rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-6 py-3 items-center justify-center gap-4 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-black/30",
        "border-zinc-300 bg-white/80 dark:border-sky-100 dark:bg-black/[0.6]",
        className
      )}
    >
      {navItems.map((navItem, idx) => (
        <a
          key={`link-${idx}`}
          href={navItem.link}
          className="relative items-center flex space-x-1 text-neutral-600 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300"
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="!cursor-pointer text-sm">{navItem.name}</span>
        </a>
      ))}
      <ThemeToggle />
    </div>
  );
};
