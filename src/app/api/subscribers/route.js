import { withAuth } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

function serialize(doc) {
  return JSON.parse(JSON.stringify(doc));
}

export const GET = withAuth(async () => {
  await connectDB();
  const docs = await Subscriber.find().sort({ createdAt: -1 }).lean();
  return Response.json(serialize(docs));
});
