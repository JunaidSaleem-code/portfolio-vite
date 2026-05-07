import { connectDB } from "./mongodb";
import Visit from "@/models/Visit";

const DAY_MS = 24 * 60 * 60 * 1000;

export type AnalyticsResult = {
  totalVisits: number;
  uniqueSessions: number;
  perDay: { date: string; count: number }[];
  topPaths: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  deviceSplit: { device: string; count: number }[];
  countrySplit: { country: string; count: number }[];
  days: number;
};

export async function getAnalytics({ days = 30 }: { days?: number } = {}): Promise<AnalyticsResult> {
  await connectDB();
  const since = new Date(Date.now() - days * DAY_MS);

  const [
    totalsBy,
    perDay,
    topPaths,
    topReferrers,
    deviceSplit,
    countrySplit,
    uniqueSessions,
  ] = await Promise.all([
    Visit.aggregate([{ $match: { createdAt: { $gte: since } } }, { $count: "total" }]),
    Visit.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Visit.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$path", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Visit.aggregate([
      { $match: { createdAt: { $gte: since }, referrer: { $ne: "" } } },
      { $group: { _id: "$referrer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Visit.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Visit.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Visit.distinct("sessionId", { createdAt: { $gte: since }, sessionId: { $ne: "" } }),
  ]);

  return {
    totalVisits: totalsBy[0]?.total || 0,
    uniqueSessions: (uniqueSessions as unknown[]).length,
    perDay: (perDay as Array<{ _id: string; count: number }>).map((d) => ({
      date: d._id,
      count: d.count,
    })),
    topPaths: (topPaths as Array<{ _id: string; count: number }>).map((p) => ({
      path: p._id,
      count: p.count,
    })),
    topReferrers: (topReferrers as Array<{ _id: string; count: number }>).map((r) => ({
      referrer: r._id,
      count: r.count,
    })),
    deviceSplit: (deviceSplit as Array<{ _id: string; count: number }>).map((d) => ({
      device: d._id,
      count: d.count,
    })),
    countrySplit: (countrySplit as Array<{ _id: string; count: number }>).map((c) => ({
      country: c._id,
      count: c.count,
    })),
    days,
  };
}
