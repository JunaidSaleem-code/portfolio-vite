"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/settings/hero", label: "Hero", index: "01" },
  { href: "/admin/settings/footer", label: "Footer", index: "02" },
  { href: "/admin/settings/nav", label: "Navigation", index: "03" },
  { href: "/admin/settings/social", label: "Social", index: "04" },
  { href: "/admin/settings/approach", label: "Approach", index: "05" },
  { href: "/admin/settings/account", label: "Account", index: "06" },
];

export default function SettingsLayout({ children }) {
  const pathname = usePathname();
  const activeTab = TABS.find(
    (t) => pathname === t.href || pathname.startsWith(t.href + "/")
  );

  return (
    <div>
      <div className="mb-7 md:mb-8">
        <p className="st-mono text-[10px] uppercase tracking-[0.24em] text-[var(--st-muted)] sm:text-[10.5px]">
          — settings
        </p>
        <h1 className="st-display mt-2.5 break-words text-[clamp(1.75rem,7vw,3rem)] leading-[0.95] text-[var(--st-ink)] sm:mt-3 sm:text-[clamp(2rem,4vw,3rem)]">
          Site &{" "}
          <span className="st-italic font-normal">account</span>
        </h1>
      </div>

      {/* Scrollable tab strip on mobile */}
      <div className="-mx-4 mb-7 border-b border-[var(--st-line-2)] sm:mx-0 md:mb-8">
        <nav className="flex flex-nowrap items-end gap-x-1 overflow-x-auto px-4 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map(({ href, label, index }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={
                  "st-tab whitespace-nowrap " + (active ? "st-tab--active" : "")
                }
              >
                <span className="st-mono mr-1.5 text-[9.5px] tracking-[0.2em] text-[var(--st-muted-2)]">
                  {index}
                </span>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {activeTab && (
        <p className="st-eyebrow mb-5 sm:mb-6">— editing · {activeTab.label.toLowerCase()}</p>
      )}

      {children}
    </div>
  );
}
