import Section from "@/models/Section";
import { withAuth } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/mongodb";

function serialize(doc) {
  return JSON.parse(JSON.stringify(doc));
}

export const GET = withAuth(async () => {
  await connectDB();
  const docs = await Section.find().sort({ order: 1 }).lean();
  return Response.json(serialize(docs));
});
