"use client";

import EntityListPage from "@/components/admin/EntityListPage";
import { FOLDERS } from "@/lib/folders";

const FIELDS = [
  { name: "title", label: "Role / Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true, rows: 4 },
  { name: "thumbnail", label: "Thumbnail", type: "image", folder: FOLDERS.experience, required: true },
];

const DEFAULT_VALUES = {
  title: "",
  description: "",
  thumbnail: "",
  visible: true,
};

export default function ExperiencePage() {
  return (
    <EntityListPage
      resource="experience"
      title="Work Experience"
      description="Manage roles displayed on your portfolio."
      fields={FIELDS}
      defaultValues={DEFAULT_VALUES}
      renderSummary={(item) => (
        <div className="flex min-w-0 items-center gap-3">
          {item.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.thumbnail}
              alt=""
              className="h-12 w-12 shrink-0 rounded-lg border border-[var(--st-line)] object-cover"
            />
          )}
          <div className="min-w-0">
            <p className="truncate text-[14.5px] font-medium text-[var(--st-ink)]">
              {item.title}
            </p>
            <p className="line-clamp-1 text-[12.5px] text-[var(--st-muted)]">
              {item.description}
            </p>
          </div>
        </div>
      )}
    />
  );
}
