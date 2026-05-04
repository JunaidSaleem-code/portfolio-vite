import Setting from "@/models/Setting";
import { settingSchemas } from "@/lib/schemas";
import { withAuth } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/mongodb";

function serialize(doc) {
  return JSON.parse(JSON.stringify(doc));
}

export const GET = withAuth(async (_req, { params }) => {
  const { key } = await params;
  if (!settingSchemas[key]) {
    return Response.json({ error: "Unknown setting key" }, { status: 404 });
  }
  await connectDB();
  const doc = await Setting.findOne({ key }).lean();
  return Response.json(doc ? serialize(doc.data) : {});
});

export const PUT = withAuth(async (req, { params }) => {
  const { key } = await params;
  const schema = settingSchemas[key];
  if (!schema) {
    return Response.json({ error: "Unknown setting key" }, { status: 404 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "ValidationError", details: parsed.error.flatten() }, { status: 400 });
  }

  await connectDB();
  await Setting.updateOne(
    { key },
    { $set: { key, data: parsed.data } },
    { upsert: true }
  );
  return Response.json(parsed.data);
});
