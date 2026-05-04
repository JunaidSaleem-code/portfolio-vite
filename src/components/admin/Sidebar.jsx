"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LuLayoutGrid,
  LuFolderOpen,
  LuBriefcase,
  LuLayoutDashboard,
  LuGraduationCap,
  LuSettings,
  LuLogOut,
  LuExternalLink,
  LuHouse,
  LuChartLine,
  LuMail,
} from "react-icons/lu";

const NAV = [
  { href: "/admin", label: "Overview", icon: LuHouse, exact: true },
  { href: "/admin/analytics", label: "Analytics", icon: LuChartLine },
  { href: "/admin/sections", label: "Sections", icon: LuLayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: LuFolderOpen },
  { href: "/admin/experience", label: "Experience", icon: LuBriefcase },
  { href: "/admin/achievements", label: "Education & Awards", icon: LuGraduationCap },
  { href: "/admin/bento", label: "Bento Grid", icon: LuLayoutGrid },
  { href: "/admin/subscribers", label: "Subscribers", icon: LuMail },
  { href: "/admin/settings", label: "Settings", icon: LuSettings },
];

export default function Sidebar({ userEmail }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-zinc-950 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
          <LuLayoutDashboard className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">Portfolio Admin</p>
          {userEmail && (
            <p className="truncate text-xs text-zinc-500">{userEmail}</p>
          )}
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-x-auto p-3 lg:overflow-x-visible">
        <div className="flex gap-0.5 lg:flex-col">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={
                  "flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm transition " +
                  (active
                    ? "bg-purple-500/15 text-purple-200"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white")
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="hidden flex-col gap-1 border-t border-white/10 p-3 lg:flex">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
        >
          <LuExternalLink className="h-4 w-4" />
          View site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
        >
          <LuLogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
