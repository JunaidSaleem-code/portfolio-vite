import { withAuth } from "@/lib/auth-helpers";
import { rebuildIndex, indexStats } from "@/lib/rag";
import { logError } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withAuth(async () => {
  try {
    const report = await rebuildIndex();
    return Response.json({ ok: true, report });
  } catch (err) {
    await logError(err as Error, { path: "/api/admin/rag-rebuild" });
    return Response.json(
      { ok: false, error: (err as Error).message || "Rebuild failed" },
      { status: 500 }
    );
  }
});

export const GET = withAuth(async () => {
  const stats = await indexStats();
  return Response.json({ ok: true, ...stats });
});
