"use client";

import EntityListPage from "@/components/admin/EntityListPage";
import { FOLDERS } from "@/lib/folders";

const FIELDS = [
  { name: "label", label: "Label", type: "text", placeholder: "GitHub" },
  { name: "icon", label: "Icon", type: "image", folder: FOLDERS.social, required: true },
  { name: "link", label: "URL", type: "text", required: true, placeholder: "https://…" },
];

const DEFAULTS = { label: "", icon: "", link: "", visible: true };

export default function SocialSettings() {
  return (
    <EntityListPage
      resource="social"
      title="Social links"
      description="Icons displayed in the footer."
      fields={FIELDS}
      defaultValues={DEFAULTS}
      renderSummary={(item) => (
        <div className="flex items-center gap-3 min-w-0">
          {item.icon && (
            <img src={item.icon} alt="" className="h-8 w-8 shrink-0 rounded bg-zinc-900 p-1" />
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-white">{item.label || "(unlabeled)"}</p>
            <p className="truncate text-xs text-zinc-500">{item.link}</p>
          </div>
        </div>
      )}
    />
  );
}
