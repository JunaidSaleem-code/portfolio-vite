import { withAuth } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { profileSchema } from "@/lib/schemas";

export const GET = withAuth(async (_req, _ctx, session) => {
  await connectDB();
  const user = await User.findOne({ email: session.user.email })
    .select("email name")
    .lean();
  if (!user) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ email: user.email, name: user.name });
});

export const PATCH = withAuth(async (req, _ctx, session) => {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "ValidationError", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectDB();
  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { $set: { name: parsed.data.name } },
    { new: true }
  )
    .select("email name")
    .lean();
  if (!user) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ email: user.email, name: user.name });
});
