import StudioShell from "@/components/studio/StudioShell";
import StudioNav from "@/components/studio/StudioNav";
import StudioPageBodySkeleton from "@/components/studio/StudioPageBodySkeleton";

/**
 * Route-level loading UI shown by Next.js during navigations to `/`.
 * The same skeleton is also used as the inline Suspense fallback in
 * page.jsx, so the transition between loading → loaded never reflows.
 */
export default function Loading() {
  return (
    <StudioShell>
      <StudioNav />
      <div className="px-6 pt-28 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <span className="st-mono text-[10px] uppercase tracking-[0.3em] text-[var(--st-muted)]">
            Now setting type
          </span>
        </div>
      </div>
      <StudioPageBodySkeleton />
    </StudioShell>
  );
}
