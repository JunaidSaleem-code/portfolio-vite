import { Suspense } from "react";
import StudioShell from "@/components/studio/StudioShell";
import StudioNav from "@/components/studio/StudioNav";
import StudioHero from "@/components/studio/StudioHero";
import StudioPageBody from "@/components/studio/StudioPageBody";
import StudioPageBodySkeleton from "@/components/studio/StudioPageBodySkeleton";

export const dynamic = "force-dynamic";

/**
 * The shell, nav, and hero render synchronously so first paint is
 * instantaneous — the user can read and interact with AskJunaid while
 * the rest of the page streams in. Data-driven sections live behind
 * <Suspense> and stream once MongoDB resolves; on cold start that
 * window is filled by the editorial blueprint skeleton instead of a
 * blank screen.
 *
 * Hero customization from /admin/settings/hero is intentionally not
 * awaited here — the defaults are the canonical brand copy and
 * blocking on a Setting fetch would re-introduce the cold-start stall.
 */
export default function Home() {
  return (
    <StudioShell>
      <StudioNav />
      <StudioHero />
      <Suspense fallback={<StudioPageBodySkeleton />}>
        <StudioPageBody />
      </Suspense>
    </StudioShell>
  );
}
