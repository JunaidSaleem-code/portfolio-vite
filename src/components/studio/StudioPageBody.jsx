import { getHomePageData } from "@/lib/data";
import StudioBento from "./StudioBento";
import StudioWork from "./StudioWork";
import StudioExperience from "./StudioExperience";
import StudioApproach from "./StudioApproach";
import StudioCredentials from "./StudioCredentials";
import StudioTestimonials from "./StudioTestimonials";
import StudioFooter from "./StudioFooter";

/**
 * Async server component holding the data-driven sections of the home
 * page. Wrapped in <Suspense> at the page level so the shell, nav, and
 * hero render immediately while this streams in once MongoDB resolves.
 *
 * Errors in the underlying fetch are already swallowed by getHomePageData
 * (returns EMPTY_HOME_DATA), so this component is render-safe even on a
 * cold or unreachable database.
 */
export default async function StudioPageBody() {
  const {
    bentoItems,
    projects,
    experiences,
    achievements,
    testimonials,
    approachPhases,
    settings,
    socialLinks,
  } = await getHomePageData();

  return (
    <>
      <StudioBento items={bentoItems} />
      <StudioWork items={projects} />
      <StudioExperience items={experiences} />
      <StudioApproach phases={approachPhases} />
      <StudioCredentials items={achievements} />
      <StudioTestimonials items={testimonials} />
      <StudioFooter content={settings?.footer} socialLinks={socialLinks} />
    </>
  );
}
