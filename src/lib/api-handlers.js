import { connectDB } from "./mongodb";
import { withAuth } from "./auth-helpers";
import { reorderSchema } from "./schemas";
import { logError } from "./logger";

function serialize(doc) {
  return JSON.parse(JSON.stringify(doc));
}

function badRequest(error) {
  return Response.json(
    { error: "ValidationError", details: error.flatten?.() ?? String(error) },
    { status: 400 }
  );
}

function withErrorLogging(handler) {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      await logError(err, { path: req?.url, method: req?.method });
      return Response.json({ error: err?.message || "Server error" }, { status: 500 });
    }
  };
}

const protect = (h) => withAuth(withErrorLogging(h));

export function listCreate(Model, schema) {
  return {
    GET: protect(async () => {
      await connectDB();
      const docs = await Model.find().sort({ order: 1, createdAt: 1 }).lean();
      return Response.json(serialize(docs));
    }),
    POST: protect(async (req) => {
      let body;
      try {
        body = await req.json();
      } catch {
        return badRequest("Invalid JSON");
      }
      const parsed = schema.safeParse(body);
      if (!parsed.success) return badRequest(parsed.error);

      await connectDB();
      const last = await Model.findOne().sort({ order: -1 }).select("order").lean();
      const order = (last?.order ?? 0) + 1;
      const doc = await Model.create({ ...parsed.data, order });
      return Response.json(serialize(doc.toObject()), { status: 201 });
    }),
  };
}

export function detail(Model, schema) {
  return {
    PATCH: protect(async (req, { params }) => {
      const { id } = await params;
      let body;
      try {
        body = await req.json();
      } catch {
        return badRequest("Invalid JSON");
      }
      const parsed = schema.partial().safeParse(body);
      if (!parsed.success) return badRequest(parsed.error);

      await connectDB();
      const doc = await Model.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
      if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
      return Response.json(serialize(doc));
    }),
    DELETE: protect(async (_req, { params }) => {
      const { id } = await params;
      await connectDB();
      const doc = await Model.findByIdAndDelete(id).lean();
      if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
      return Response.json({ ok: true });
    }),
  };
}

export function reorder(Model) {
  return {
    PATCH: protect(async (req) => {
      let body;
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
      if (ops.length) await Model.bulkWrite(ops);
      return Response.json({ ok: true });
    }),
  };
}
