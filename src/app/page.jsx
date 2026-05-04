import Achievements from "@/components/Achievements";
import Approach from "@/components/Approach";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import RecentProjects from "@/components/RecentProjects";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { getHomePageData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const {
    sections,
    bentoItems,
    projects,
    experiences,
    achievements,
    approachPhases,
    navItems,
    socialLinks,
    settings,
  } = await getHomePageData();

  const renderers = {
    hero: () => <Hero content={settings.hero} />,
    grid: () => <Grid items={bentoItems} />,
    projects: () => <RecentProjects items={projects} />,
    experience: () => <Experience items={experiences} />,
    achievements: () => <Achievements items={achievements} />,
    approach: () => <Approach phases={approachPhases} />,
    footer: () => <Footer content={settings.footer} socialLinks={socialLinks} />,
  };

  const ordered = sections.length
    ? sections
    : Object.keys(renderers).map((key, i) => ({ key, order: i + 1 }));

  return (
    <main>
      <div className="overflow-hidden bg-black">
        <FloatingNav navItems={navItems} />
        {ordered.map((section) => {
          const render = renderers[section.key];
          if (!render) return null;
          return <div key={section.key}>{render()}</div>;
        })}
      </div>
    </main>
  );
}
