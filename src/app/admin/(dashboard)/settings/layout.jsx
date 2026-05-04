"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/settings/hero", label: "Hero" },
  { href: "/admin/settings/footer", label: "Footer" },
  { href: "/admin/settings/nav", label: "Navigation" },
  { href: "/admin/settings/social", label: "Social" },
  { href: "/admin/settings/approach", label: "Approach" },
  { href: "/admin/settings/account", label: "Account" },
];

export default function SettingsLayout({ children }) {
  const pathname = usePathname();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white md:text-3xl">Settings</h1>
      <nav className="mb-6 flex flex-wrap gap-1 border-b border-white/10">
        {TABS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={
                "border-b-2 px-4 py-2 text-sm transition -mb-px " +
                (active
                  ? "border-purple-400 text-white"
                  : "border-transparent text-zinc-400 hover:text-white")
              }
            >
              {label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
