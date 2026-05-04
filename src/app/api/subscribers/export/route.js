import { withAuth } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

function escapeCsv(field) {
  const s = String(field ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export const GET = withAuth(async () => {
  await connectDB();
  const subs = await Subscriber.find({ unsubscribed: false })
    .sort({ createdAt: -1 })
    .lean();

  const header = "email,name,source,subscribed_at\n";
  const rows = subs
    .map((s) =>
      [
        escapeCsv(s.email),
        escapeCsv(s.name),
        escapeCsv(s.source),
        new Date(s.createdAt).toISOString(),
      ].join(",")
    )
    .join("\n");

  const filename = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  return new Response(header + rows + "\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
});
