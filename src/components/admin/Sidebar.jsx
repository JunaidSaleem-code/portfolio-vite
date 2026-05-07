"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
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
  LuQuote,
  LuMenu,
  LuX,
} from "react-icons/lu";

const NAV = [
  { href: "/admin", label: "Overview", icon: LuHouse, exact: true, index: "01" },
  { href: "/admin/analytics", label: "Analytics", icon: LuChartLine, index: "02" },
  { href: "/admin/sections", label: "Sections", icon: LuLayoutDashboard, index: "03" },
  { href: "/admin/projects", label: "Projects", icon: LuFolderOpen, index: "04" },
  { href: "/admin/experience", label: "Experience", icon: LuBriefcase, index: "05" },
  { href: "/admin/achievements", label: "Education & Awards", icon: LuGraduationCap, index: "06" },
  { href: "/admin/testimonials", label: "Testimonials", icon: LuQuote, index: "07" },
  { href: "/admin/bento", label: "Bento Grid", icon: LuLayoutGrid, index: "08" },
  { href: "/admin/subscribers", label: "Subscribers", icon: LuMail, index: "09" },
  { href: "/admin/settings", label: "Settings", icon: LuSettings, index: "10" },
];

export default function Sidebar({ userEmail, userName }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const initial = (userName || userEmail || "?").trim().charAt(0).toUpperCase();
  const activeItem = NAV.find((n) =>
    n.exact ? pathname === n.href : pathname === n.href || pathname.startsWith(n.href + "/")
  );

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* MOBILE TOPBAR — visible below lg */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--st-line-2)] bg-[var(--st-paper)]/95 px-4 py-3 backdrop-blur-md lg:hidden"
      >
        <Link href="/admin" className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden
            className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--st-ink)]"
          >
            <span className="st-italic text-[15px] leading-none text-[var(--st-accent)]">
              j
            </span>
          </span>
          <span className="min-w-0">
            <span className="st-mono block text-[9px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
              Studio · Admin
            </span>
            <span className="st-italic block truncate text-[14px] leading-tight text-[var(--st-ink)]">
              {activeItem?.label?.toLowerCase() || "control room"}
            </span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--st-line-2)] bg-[var(--st-bg)] text-[var(--st-ink)] transition active:scale-95"
        >
          <LuMenu className="h-4 w-4" />
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="st-modal-backdrop absolute inset-0"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[86%] max-w-[320px] flex-col border-r border-[var(--st-line-2)] bg-[var(--st-paper)] shadow-2xl">
            <SidebarBody
              pathname={pathname}
              userEmail={userEmail}
              userName={userName}
              initial={initial}
              onClose={() => setOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR — lg and up */}
      <aside
        className="relative hidden shrink-0 border-[var(--st-line-2)] bg-[var(--st-paper)] lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:border-r"
        style={{ boxShadow: "inset -1px 0 0 rgba(15, 27, 34, 0.04)" }}
      >
        <SidebarBody
          pathname={pathname}
          userEmail={userEmail}
          userName={userName}
          initial={initial}
        />
      </aside>
    </>
  );
}

function SidebarBody({ pathname, userEmail, userName, initial, onClose }) {
  return (
    <div className="flex h-full w-full min-h-0 flex-col">
      {/* Brand */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--st-line)] px-5 py-5 lg:px-6 lg:py-6">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--st-ink)]"
          >
            <span className="st-italic text-[20px] leading-none text-[var(--st-accent)]">
              j
            </span>
            <span
              className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-[var(--st-accent)]"
              style={{ boxShadow: "0 0 14px var(--st-accent-glow)" }}
            />
          </span>
          <div className="min-w-0">
            <p className="st-mono text-[10px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
              Studio · Admin
            </p>
            <p className="st-italic mt-0.5 truncate text-[18px] leading-tight text-[var(--st-ink)]">
              control room
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--st-line-2)] text-[var(--st-ink)] transition active:scale-95"
          >
            <LuX className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Account chip */}
      {userEmail && (
        <div className="flex items-center gap-3 px-5 py-4 lg:px-6">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--st-ink)] text-[11px] font-semibold text-[var(--st-accent)]">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold leading-tight text-[var(--st-ink)]">
              {userName || "Admin"}
            </p>
            <p className="truncate text-[11px] text-[var(--st-muted)]">{userEmail}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-3 lg:px-5">
        <p className="px-1 pt-2">
          <span className="st-eyebrow">— navigate</span>
        </p>
        <div className="flex flex-col gap-0.5">
          {NAV.map(({ href, label, icon: Icon, exact, index }) => {
            const active = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={
                  "st-nav-link " + (active ? "st-nav-link--active" : "")
                }
              >
                <Icon className="h-[15px] w-[15px] shrink-0" />
                <span className="min-w-0 flex-1 truncate">{label}</span>
                <span
                  className={
                    "st-mono shrink-0 text-[9.5px] tracking-[0.2em] " +
                    (active ? "text-[var(--st-accent)]" : "text-[var(--st-muted-2)]")
                  }
                >
                  {index}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer actions */}
      <div className="flex flex-col gap-1 border-t border-[var(--st-line)] px-4 py-4 lg:px-5">
        <Link href="/" target="_blank" className="st-nav-link">
          <LuExternalLink className="h-[15px] w-[15px] shrink-0" />
          <span className="min-w-0 flex-1 truncate">View live site</span>
          <span className="st-mono shrink-0 text-[9.5px] tracking-[0.2em] text-[var(--st-muted-2)]">
            ↗
          </span>
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="st-nav-link w-full text-left"
        >
          <LuLogOut className="h-[15px] w-[15px] shrink-0" />
          <span className="min-w-0 flex-1 truncate">Sign out</span>
        </button>
        <p className="st-mono mt-3 px-1 text-[9.5px] uppercase tracking-[0.22em] text-[var(--st-muted-2)]">
          v1 · cream/lime/ink
        </p>
      </div>
    </div>
  );
}
