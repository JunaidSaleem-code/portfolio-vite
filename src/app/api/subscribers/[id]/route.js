import { withAuth } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

export const DELETE = withAuth(async (_req, { params }) => {
  const { id } = await params;
  await connectDB();
  const doc = await Subscriber.findByIdAndDelete(id).lean();
  if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ok: true });
});
