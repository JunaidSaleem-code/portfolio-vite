import PageHeader from "@/components/admin/PageHeader";
import { getAnalytics } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({ searchParams }) {
  const sp = await searchParams;
  const days = Math.min(Math.max(parseInt(sp?.days || "30", 10) || 30, 1), 90);
  const data = await getAnalytics({ days });

  return (
    <>
      <PageHeader
        title="Analytics"
        description={`Last ${days} days. Anonymous page-view metrics. No PII collected.`}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {[7, 14, 30, 60, 90].map((d) => (
          <a
            key={d}
            href={`?days=${d}`}
            className={
              "rounded-full border px-3 py-1 text-xs transition " +
              (days === d
                ? "border-purple-400 bg-purple-500/20 text-purple-200"
                : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white")
            }
          >
            {d}d
          </a>
        ))}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total visits" value={data.totalVisits} />
        <StatCard label="Unique sessions" value={data.uniqueSessions} />
        <StatCard
          label="Avg / day"
          value={data.days ? Math.round((data.totalVisits / data.days) * 10) / 10 : 0}
        />
      </div>

      <Section title="Visits per day">
        <DailyChart data={data.perDay} days={data.days} />
      </Section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Section title="Top pages">
          <BarList items={data.topPaths.map((p) => ({ label: p.path, value: p.count }))} />
        </Section>

        <Section title="Top referrers">
          <BarList
            items={data.topReferrers.map((r) => ({ label: r.referrer, value: r.count }))}
            empty="No external referrers yet."
          />
        </Section>

        <Section title="Devices">
          <BarList items={data.deviceSplit.map((d) => ({ label: d.device, value: d.count }))} />
        </Section>

        <Section title="Top countries">
          <BarList
            items={data.countrySplit.map((c) => ({ label: c.country, value: c.count }))}
            empty="Country data only available on Vercel/Cloudflare."
          />
        </Section>
      </div>
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <p className="text-xs uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-3 text-sm uppercase tracking-widest text-zinc-500">{title}</h2>
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">{children}</div>
    </section>
  );
}

function BarList({ items, empty = "No data yet." }) {
  if (!items.length) {
    return <p className="text-sm text-zinc-500">{empty}</p>;
  }
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.label} className="text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-zinc-300">{item.label || "(empty)"}</span>
            <span className="shrink-0 tabular-nums text-zinc-500">{item.value}</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-purple-500/70"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function DailyChart({ data, days }) {
  // Fill in missing days with zeros so the chart shows a continuous timeline
  const map = new Map(data.map((d) => [d.date, d.count]));
  const today = new Date();
  const filled = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    filled.push({ date: key, count: map.get(key) || 0 });
  }
  const max = Math.max(...filled.map((d) => d.count), 1);

  return (
    <div>
      <div className="flex h-32 items-end gap-[2px]">
        {filled.map((d) => (
          <div
            key={d.date}
            className="group relative flex-1 rounded-t bg-purple-500/40 transition hover:bg-purple-400"
            style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count ? "2px" : "0" }}
            title={`${d.date}: ${d.count}`}
          >
            <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
              {d.count}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-zinc-500">
        <span>{filled[0]?.date}</span>
        <span>{filled[filled.length - 1]?.date}</span>
      </div>
    </div>
  );
}
