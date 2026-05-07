import { getHomePageData } from "@/lib/data";
import StudioShell from "@/components/studio/StudioShell";
import StudioNav from "@/components/studio/StudioNav";
import StudioHero from "@/components/studio/StudioHero";
import StudioBento from "@/components/studio/StudioBento";
import StudioWork from "@/components/studio/StudioWork";
import StudioExperience from "@/components/studio/StudioExperience";
import StudioApproach from "@/components/studio/StudioApproach";
import StudioCredentials from "@/components/studio/StudioCredentials";
import StudioTestimonials from "@/components/studio/StudioTestimonials";
import StudioFooter from "@/components/studio/StudioFooter";

export const dynamic = "force-dynamic";

export default async function Home() {
  const {
    bentoItems,
    projects,
    experiences,
    achievements,
    testimonials,
    approachPhases,
    navItems,
    socialLinks,
    settings,
  } = await getHomePageData();

  return (
    <StudioShell>
      <StudioNav navItems={navItems} />
      <StudioHero content={settings?.hero} />
      <StudioBento items={bentoItems} />
      <StudioWork items={projects} />
      <StudioExperience items={experiences} />
      <StudioApproach phases={approachPhases} />
      <StudioCredentials items={achievements} />
      <StudioTestimonials items={testimonials} />
      <StudioFooter
        content={settings?.footer}
        socialLinks={socialLinks}
      />
    </StudioShell>
  );
}
