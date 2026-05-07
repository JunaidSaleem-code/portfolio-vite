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
        eyebrow="analytics"
        title="Audience"
        description={`Last ${days} days. Anonymous page-view metrics — no PII collected.`}
      />

      {/* Range filter */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="st-eyebrow mr-2">— range</span>
        {[7, 14, 30, 60, 90].map((d) => (
          <a
            key={d}
            href={`?days=${d}`}
            className={"st-pill " + (days === d ? "st-pill--active" : "")}
          >
            {d}d
          </a>
        ))}
      </div>

      {/* Top stats */}
      <div className="mb-8 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:mb-10 lg:grid-cols-3">
        <StatCard label="Total visits" value={data.totalVisits} />
        <StatCard label="Unique sessions" value={data.uniqueSessions} />
        <StatCard
          label="Avg / day"
          value={
            data.days
              ? Math.round((data.totalVisits / data.days) * 10) / 10
              : 0
          }
        />
      </div>

      <Section title="Visits per day" eyebrow="01 · timeline">
        <DailyChart data={data.perDay} days={data.days} />
      </Section>

      <div className="mt-6 grid gap-4 sm:gap-6 lg:mt-8 lg:grid-cols-2">
        <Section title="Top pages" eyebrow="02 · paths">
          <BarList items={data.topPaths.map((p) => ({ label: p.path, value: p.count }))} />
        </Section>

        <Section title="Top referrers" eyebrow="03 · sources">
          <BarList
            items={data.topReferrers.map((r) => ({ label: r.referrer, value: r.count }))}
            empty="No external referrers yet."
          />
        </Section>

        <Section title="Devices" eyebrow="04 · clients">
          <BarList items={data.deviceSplit.map((d) => ({ label: d.device, value: d.count }))} />
        </Section>

        <Section title="Top countries" eyebrow="05 · regions">
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
    <div className="st-card relative overflow-hidden p-5 sm:p-6">
      <p className="st-mono text-[9.5px] uppercase tracking-[0.24em] text-[var(--st-muted)]">
        — {label}
      </p>
      <p className="st-display mt-4 text-[2.5rem] leading-none text-[var(--st-ink)] sm:mt-5 sm:text-5xl">
        {value}
      </p>
      <span
        aria-hidden
        className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-[var(--st-accent)] opacity-30 blur-2xl"
      />
    </div>
  );
}

function Section({ title, eyebrow, children }) {
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="st-eyebrow">— {eyebrow}</span>
        <h2 className="st-italic text-[16px] text-[var(--st-ink)] sm:text-[18px]">
          {title}
        </h2>
      </div>
      <div className="st-card p-4 sm:p-5 md:p-6">{children}</div>
    </section>
  );
}

function BarList({ items, empty = "No data yet." }) {
  if (!items.length) {
    return <p className="st-italic text-[14px] text-[var(--st-muted)]">{empty}</p>;
  }
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label} className="text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[13.5px] text-[var(--st-ink)]">
              {item.label || "(empty)"}
            </span>
            <span className="st-mono shrink-0 text-[11px] uppercase tracking-[0.16em] tabular-nums text-[var(--st-muted)]">
              {item.value}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--st-bg-2)]">
            <div
              className="h-full rounded-full bg-[var(--st-ink)] transition-all"
              style={{
                width: `${(item.value / max) * 100}%`,
                boxShadow: "0 0 12px rgba(15, 27, 34, 0.18)",
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function DailyChart({ data, days }) {
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
      <div className="flex h-28 items-end gap-[2px] sm:h-32 md:h-36">
        {filled.map((d) => (
          <div
            key={d.date}
            className="group relative flex-1 rounded-t-sm bg-[var(--st-ink)]/30 transition-colors hover:bg-[var(--st-ink)]"
            style={{
              height: `${(d.count / max) * 100}%`,
              minHeight: d.count ? "2px" : "0",
            }}
            title={`${d.date}: ${d.count}`}
          >
            <span className="st-mono pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--st-ink)] px-2 py-0.5 text-[9.5px] uppercase tracking-[0.18em] text-[var(--st-paper)] opacity-0 transition group-hover:opacity-100">
              {d.count}
            </span>
          </div>
        ))}
      </div>
      <div className="st-mono mt-3 flex flex-wrap justify-between gap-2 text-[9.5px] uppercase tracking-[0.18em] text-[var(--st-muted)] sm:text-[10px] sm:tracking-[0.2em]">
        <span>{filled[0]?.date}</span>
        <span className="text-[var(--st-ink-2)]">peak {max}</span>
        <span>{filled[filled.length - 1]?.date}</span>
      </div>
    </div>
  );
}
