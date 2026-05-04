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
          <p className="truncate font-medium text-white">{item.name}</p>
          <p className="truncate text-xs text-zinc-500">{item.link}</p>
        </div>
      )}
    />
  );
}
