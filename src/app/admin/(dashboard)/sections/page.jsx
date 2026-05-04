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
          <p className="truncate font-medium text-white">{item.label}</p>
          <p className="text-xs text-zinc-500">
            <code className="rounded bg-white/5 px-1 py-0.5">{item.key}</code>
          </p>
        </div>
      )}
    />
  );
}
