import Link from "next/link";
import { auth } from "@/lib/auth";
import { getDashboardStats } from "@/lib/data";
import RagRebuildCard from "@/components/admin/RagRebuildCard";
import {
  LuFolderOpen,
  LuBriefcase,
  LuLayoutGrid,
  LuGraduationCap,
  LuQuote,
  LuEyeOff,
  LuExternalLink,
  LuPlus,
  LuArrowUpRight,
} from "react-icons/lu";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const session = await auth();
  const { counts, latestProject, latestExperience, ok, error } = await getDashboardStats();

  const cards = [
    { href: "/admin/projects", label: "Projects", value: counts.projects ?? 0, icon: LuFolderOpen, index: "01" },
    { href: "/admin/experience", label: "Experience", value: counts.experience ?? 0, icon: LuBriefcase, index: "02" },
    { href: "/admin/bento", label: "Bento cards", value: counts.bento ?? 0, icon: LuLayoutGrid, index: "03" },
    { href: "/admin/achievements", label: "Achievements", value: counts.achievements ?? 0, icon: LuGraduationCap, index: "04" },
    { href: "/admin/testimonials", label: "Testimonials", value: counts.testimonials ?? 0, icon: LuQuote, index: "05" },
  ];

  const firstName = session?.user?.name?.split(" ")[0] || "there";
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-10 md:mb-12">
        <p className="st-mono text-[10px] uppercase tracking-[0.24em] text-[var(--st-muted)] sm:text-[10.5px]">
          — {today}
        </p>
        <h1 className="st-display mt-2.5 break-words text-[clamp(2rem,8vw,3.5rem)] leading-[0.95] text-[var(--st-ink)] sm:mt-3 sm:text-[clamp(2.25rem,4.5vw,3.5rem)]">
          Welcome back,{" "}
          <span className="st-italic font-normal">{firstName}</span>.
        </h1>
        <p className="mt-3 max-w-xl break-words text-[13.5px] leading-relaxed text-[var(--st-ink-2)] sm:text-[14px]">
          {session?.user?.email} — manage your portfolio, content, and analytics
          from this single editorial cockpit.
        </p>
        <div className="st-rule mt-6 sm:mt-7" />
      </div>

      {!ok && (
        <p className="st-error-banner mb-6">Couldn&apos;t load stats: {error}</p>
      )}

      {/* Stat cards */}
      <div className="mb-10 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mb-12">
        {cards.map(({ href, label, value, icon: Icon, index }) => (
          <Link
            key={href}
            href={href}
            className="st-card group relative overflow-hidden p-4 transition hover:-translate-y-0.5 hover:shadow-[0_28px_56px_-30px_rgba(15,27,34,0.35)] sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="st-mono truncate text-[9px] uppercase tracking-[0.22em] text-[var(--st-muted)] sm:text-[9.5px] sm:tracking-[0.24em]">
                {index} · {label}
              </span>
              <Icon className="h-4 w-4 shrink-0 text-[var(--st-muted)] transition group-hover:text-[var(--st-ink)]" />
            </div>
            <p className="st-display mt-4 text-[2.5rem] leading-none text-[var(--st-ink)] sm:mt-5 sm:text-5xl">
              {value}
            </p>
            <span
              aria-hidden
              className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-[var(--st-accent)] opacity-0 blur-xl transition group-hover:opacity-50"
            />
            <span className="st-mono mt-3 inline-flex items-center gap-1 text-[11px] text-[var(--st-ink-2)]">
              Manage
              <LuArrowUpRight className="h-3 w-3 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        ))}
      </div>

      {/* Activity */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <ActivityCard
          eyebrow="Recent · projects"
          title="Latest project edit"
          item={latestProject}
          fallback="No projects yet."
          ctaHref="/admin/projects"
          ctaLabel="Manage projects"
        />
        <ActivityCard
          eyebrow="Recent · experience"
          title="Latest experience edit"
          item={latestExperience}
          fallback="No experience entries yet."
          ctaHref="/admin/experience"
          ctaLabel="Manage experience"
        />
      </div>

      {/* Ask Junaid · RAG index */}
      <div className="mt-3 sm:mt-4">
        <RagRebuildCard />
      </div>

      {/* Quick actions */}
      <div className="mt-10 md:mt-12">
        <p className="st-eyebrow mb-4">— quick actions</p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <QuickAction href="/admin/projects" icon={LuPlus} label="Add project" />
          <QuickAction href="/admin/sections" icon={LuLayoutGrid} label="Reorder sections" />
          <QuickAction href="/" icon={LuExternalLink} label="View live site" external />
        </div>
      </div>

      {counts.projectsHidden > 0 && (
        <p className="mt-10 inline-flex items-center gap-2 rounded-full border border-[var(--st-line-2)] bg-[var(--st-bg)] px-3.5 py-1.5">
          <LuEyeOff className="h-3.5 w-3.5 text-[var(--st-muted)]" />
          <span className="st-mono text-[11px] uppercase tracking-[0.18em] text-[var(--st-ink-2)]">
            {counts.projectsHidden} project
            {counts.projectsHidden === 1 ? "" : "s"} hidden from public site
          </span>
        </p>
      )}
    </div>
  );
}

function ActivityCard({ eyebrow, title, item, fallback, ctaHref, ctaLabel }) {
  return (
    <div className="st-card p-5 sm:p-6">
      <p className="st-mono text-[9.5px] uppercase tracking-[0.24em] text-[var(--st-muted)]">
        {eyebrow}
      </p>
      <h2 className="st-italic mt-2 text-[18px] text-[var(--st-ink)] sm:text-[20px]">
        {title}
      </h2>
      {item ? (
        <>
          <p className="mt-4 truncate text-[15px] font-medium text-[var(--st-ink)] sm:text-[16px]">
            {item.title}
          </p>
          <p className="st-mono mt-1 truncate text-[10.5px] uppercase tracking-[0.18em] text-[var(--st-muted)]">
            updated {new Date(item.updatedAt).toLocaleString()}
          </p>
        </>
      ) : (
        <p className="mt-4 text-[14px] text-[var(--st-muted)]">{fallback}</p>
      )}
      <Link
        href={ctaHref}
        className="st-link mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--st-ink)]"
      >
        {ctaLabel}
        <LuArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label, external }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className="group flex items-center justify-between rounded-2xl border border-[var(--st-line)] bg-[var(--st-paper)] px-5 py-4 transition hover:border-[var(--st-ink)] hover:bg-[var(--st-bg-2)]"
    >
      <span className="flex items-center gap-3 text-[14px] font-medium text-[var(--st-ink)]">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--st-accent)] text-[var(--st-ink)] transition group-hover:bg-[var(--st-ink)] group-hover:text-[var(--st-accent)]">
          <Icon className="h-4 w-4" />
        </span>
        {label}
      </span>
      <LuArrowUpRight className="h-4 w-4 text-[var(--st-muted)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--st-ink)]" />
    </Link>
  );
}
