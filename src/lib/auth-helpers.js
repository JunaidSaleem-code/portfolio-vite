import { auth } from "./auth";

export function withAuth(handler) {
  return async (req, ctx) => {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(req, ctx, session);
  };
}
