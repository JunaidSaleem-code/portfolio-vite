"use client";

import EntityListPage from "@/components/admin/EntityListPage";

const FIELDS = [
  { name: "name", label: "Name", type: "text", required: true, placeholder: "About" },
  { name: "link", label: "Link", type: "text", required: true, placeholder: "#about or https://…" },
];

const DEFAULTS = { name: "", link: "", visible: true };

export default function NavSettings() {
  return (
    <EntityListPage
      resource="nav"
      title="Navigation"
      description="Items in your floating navbar at the top of the page."
      fields={FIELDS}
      defaultValues={DEFAULTS}
      renderSummary={(item) => (
        <div className="min-w-0">
          <p className="truncate text-[14.5px] font-medium text-[var(--st-ink)]">
            {item.name}
          </p>
          <p className="st-mono truncate text-[10.5px] uppercase tracking-[0.18em] text-[var(--st-muted)]">
            {item.link}
          </p>
        </div>
      )}
    />
  );
}
