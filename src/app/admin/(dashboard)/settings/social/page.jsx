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
        <div className="flex min-w-0 items-center gap-3">
          {item.icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.icon}
              alt=""
              className="h-9 w-9 shrink-0 rounded-full border border-[var(--st-line)] bg-[var(--st-paper)] p-1.5"
            />
          )}
          <div className="min-w-0">
            <p className="truncate text-[14.5px] font-medium text-[var(--st-ink)]">
              {item.label || "(unlabeled)"}
            </p>
            <p className="st-mono truncate text-[10.5px] uppercase tracking-[0.18em] text-[var(--st-muted)]">
              {item.link}
            </p>
          </div>
        </div>
      )}
    />
  );
}
