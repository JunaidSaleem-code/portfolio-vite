import Link from "next/link";
import { auth } from "@/lib/auth";
import { getDashboardStats } from "@/lib/data";
import {
  LuFolderOpen,
  LuBriefcase,
  LuLayoutGrid,
  LuGraduationCap,
  LuEyeOff,
  LuExternalLink,
  LuPlus,
} from "react-icons/lu";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const session = await auth();
  const { counts, latestProject, latestExperience, ok, error } = await getDashboardStats();

  const cards = [
    { href: "/admin/projects", label: "Projects", value: counts.projects ?? 0, icon: LuFolderOpen },
    { href: "/admin/experience", label: "Experience", value: counts.experience ?? 0, icon: LuBriefcase },
    { href: "/admin/bento", label: "Bento cards", value: counts.bento ?? 0, icon: LuLayoutGrid },
    { href: "/admin/achievements", label: "Achievements", value: counts.achievements ?? 0, icon: LuGraduationCap },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">{session?.user?.email}</p>
      </div>

      {!ok && (
        <p className="mb-6 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          Couldn't load stats: {error}
        </p>
      )}

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ href, label, value, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-white/10 bg-zinc-950 p-5 transition hover:border-purple-400/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-zinc-500">{label}</span>
              <Icon className="h-4 w-4 text-zinc-500 transition group-hover:text-purple-300" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ActivityCard
          title="Recent project edit"
          item={latestProject}
          fallback="No projects yet."
          ctaHref="/admin/projects"
          ctaLabel="Manage projects"
        />
        <ActivityCard
          title="Recent experience edit"
          item={latestExperience}
          fallback="No experience entries yet."
          ctaHref="/admin/experience"
          ctaLabel="Manage experience"
        />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <QuickAction href="/admin/projects" icon={LuPlus} label="Add project" />
        <QuickAction href="/admin/sections" icon={LuLayoutGrid} label="Reorder sections" />
        <QuickAction href="/" icon={LuExternalLink} label="View site" external />
      </div>

      {counts.projectsHidden > 0 && (
        <p className="mt-8 inline-flex items-center gap-2 text-xs text-zinc-500">
          <LuEyeOff className="h-3.5 w-3.5" />
          {counts.projectsHidden} project{counts.projectsHidden === 1 ? "" : "s"} hidden from public site.
        </p>
      )}
    </div>
  );
}

function ActivityCard({ title, item, fallback, ctaHref, ctaLabel }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <h2 className="text-xs uppercase tracking-widest text-zinc-500">{title}</h2>
      {item ? (
        <>
          <p className="mt-3 truncate font-medium text-white">{item.title}</p>
          <p className="mt-1 text-xs text-zinc-500">
            Updated {new Date(item.updatedAt).toLocaleString()}
          </p>
        </>
      ) : (
        <p className="mt-3 text-sm text-zinc-500">{fallback}</p>
      )}
      <Link
        href={ctaHref}
        className="mt-4 inline-block text-sm text-purple-300 hover:text-purple-200"
      >
        {ctaLabel} →
      </Link>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label, external }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 transition hover:border-purple-400/40 hover:bg-zinc-900"
    >
      <span className="flex items-center gap-3 text-sm text-white">
        <Icon className="h-4 w-4 text-purple-300" />
        {label}
      </span>
      <span className="text-zinc-500">→</span>
    </Link>
  );
}
