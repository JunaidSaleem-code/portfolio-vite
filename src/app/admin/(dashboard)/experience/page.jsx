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
        <div className="flex items-center gap-3 min-w-0">
          {item.thumbnail && (
            <img src={item.thumbnail} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-white">{item.title}</p>
            <p className="line-clamp-1 text-xs text-zinc-500">{item.description}</p>
          </div>
        </div>
      )}
    />
  );
}
