"use client";

import EntityListPage from "@/components/admin/EntityListPage";

const TYPE_OPTIONS = [
  { value: "education", label: "Education" },
  { value: "recognition", label: "Recognition / Award" },
];

const FIELDS = [
  { name: "type", label: "Type", type: "select", options: TYPE_OPTIONS },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "organization", label: "Organization", type: "text", placeholder: "University, company, conference…" },
  { name: "period", label: "Period", type: "text", placeholder: "2021 – 2025" },
  { name: "description", label: "Description", type: "textarea", rows: 3 },
];

const DEFAULTS = {
  type: "recognition",
  title: "",
  organization: "",
  period: "",
  description: "",
  visible: true,
};

export default function AchievementsPage() {
  return (
    <EntityListPage
      resource="achievements"
      title="Education & Recognition"
      description="Degrees, mentorships, hackathons, awards — anything to build credibility."
      fields={FIELDS}
      defaultValues={DEFAULTS}
      renderSummary={(item) => (
        <div className="min-w-0">
          <p className="flex min-w-0 items-center gap-2">
            <span className="st-pill st-pill--accent shrink-0">{item.type}</span>
            <span className="truncate text-[14.5px] font-medium text-[var(--st-ink)]">
              {item.title}
            </span>
          </p>
          <p className="st-mono mt-1 truncate text-[10.5px] uppercase tracking-[0.18em] text-[var(--st-muted)]">
            {[item.organization, item.period].filter(Boolean).join(" · ")}
          </p>
        </div>
      )}
    />
  );
}
