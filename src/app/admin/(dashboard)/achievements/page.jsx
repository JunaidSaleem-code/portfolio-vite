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
          <p className="truncate font-medium text-white">
            <span className="mr-2 inline-block rounded bg-purple-500/20 px-2 py-0.5 text-xs uppercase text-purple-300">
              {item.type}
            </span>
            {item.title}
          </p>
          <p className="truncate text-xs text-zinc-500">
            {[item.organization, item.period].filter(Boolean).join(" · ")}
          </p>
        </div>
      )}
    />
  );
}
