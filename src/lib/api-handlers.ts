import type { Model } from "mongoose";
import type { ZodType } from "zod";
import { connectDB } from "./mongodb";
import { withAuth } from "./auth-helpers";
import { reorderSchema } from "./schemas";
import { logError } from "./logger";

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

function badRequest(error: unknown): Response {
  const details =
    typeof error === "object" && error !== null && "flatten" in error
      ? (error as { flatten: () => unknown }).flatten()
      : String(error);
  return Response.json({ error: "ValidationError", details }, { status: 400 });
}

type AnyRouteHandler = (req: Request, ctx: any, session?: unknown) => Promise<Response> | Response;

function withErrorLogging(handler: AnyRouteHandler): AnyRouteHandler {
  return async (req, ctx, session) => {
    try {
      return await handler(req, ctx, session);
    } catch (err) {
      await logError(err, { path: (req as any)?.url, method: (req as any)?.method });
      return Response.json(
        { error: (err as Error)?.message || "Server error" },
        { status: 500 }
      );
    }
  };
}

const protect = (h: AnyRouteHandler) => withAuth(withErrorLogging(h) as any);

export function listCreate<T = unknown>(M: Model<any>, schema: ZodType<T>) {
  return {
    GET: protect(async () => {
      await connectDB();
      const docs = await M.find().sort({ order: 1, createdAt: 1 }).lean();
      return Response.json(serialize(docs));
    }),
    POST: protect(async (req: Request) => {
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        return badRequest("Invalid JSON");
      }
      const parsed = schema.safeParse(body);
      if (!parsed.success) return badRequest(parsed.error);

      await connectDB();
      const last = await M.findOne().sort({ order: -1 }).select("order").lean<{ order?: number } | null>();
      const order = (last?.order ?? 0) + 1;
      const doc = await M.create({ ...(parsed.data as object), order });
      return Response.json(serialize(doc.toObject()), { status: 201 });
    }),
  };
}

export function detail<T = unknown>(M: Model<any>, schema: ZodType<T>) {
  return {
    PATCH: protect(async (req: Request, { params }: any) => {
      const { id } = await params;
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        return badRequest("Invalid JSON");
      }
      const parsed = (schema as any).partial().safeParse(body);
      if (!parsed.success) return badRequest(parsed.error);

      await connectDB();
      const doc = await M.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
      if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
      return Response.json(serialize(doc));
    }),
    DELETE: protect(async (_req: Request, { params }: any) => {
      const { id } = await params;
      await connectDB();
      const doc = await M.findByIdAndDelete(id).lean();
      if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
      return Response.json({ ok: true });
    }),
  };
}

export function reorder(M: Model<any>) {
  return {
    PATCH: protect(async (req: Request) => {
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        return badRequest("Invalid JSON");
      }
      const parsed = reorderSchema.safeParse(body);
      if (!parsed.success) return badRequest(parsed.error);

      await connectDB();
      const ops = parsed.data.ids.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { order: index + 1 } },
        },
      }));
      if (ops.length) await M.bulkWrite(ops);
      return Response.json({ ok: true });
    }),
  };
}
