import type { Session } from "next-auth";
import { auth } from "./auth";

type RouteHandler = (
  req: Request,
  ctx: any,
  session: Session
) => Promise<Response> | Response;

type WrappedHandler = (req: Request, ctx: any) => Promise<Response>;

export function withAuth(handler: RouteHandler): WrappedHandler {
  return async (req, ctx) => {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(req, ctx, session);
  };
}
