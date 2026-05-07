"use client";

import EntityListPage from "@/components/admin/EntityListPage";

const FIELDS = [
  { name: "label", label: "Display label", type: "text", required: true },
];

export default function SectionsPage() {
  return (
    <EntityListPage
      resource="sections"
      title="Homepage Sections"
      description="Drag to reorder. Toggle the eye icon to hide a section from your live site."
      fields={FIELDS}
      allowAdd={false}
      allowDelete={false}
      renderSummary={(item) => (
        <div className="min-w-0">
          <p className="truncate text-[14.5px] font-medium text-[var(--st-ink)]">
            {item.label}
          </p>
          <p className="mt-1">
            <code className="st-mono rounded bg-[var(--st-bg-2)] px-2 py-0.5 text-[10.5px] uppercase tracking-[0.18em] text-[var(--st-ink-2)]">
              {item.key}
            </code>
          </p>
        </div>
      )}
    />
  );
}
