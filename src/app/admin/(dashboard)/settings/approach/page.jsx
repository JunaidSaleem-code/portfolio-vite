"use client";

import EntityListPage from "@/components/admin/EntityListPage";

const FIELDS = [
  { name: "phaseLabel", label: "Phase label", type: "text", required: true, placeholder: "Phase 1" },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true, rows: 3 },
  {
    name: "backgroundClass",
    label: "Background Tailwind class",
    type: "text",
    placeholder: "bg-emerald-900",
    help: "Tailwind class for the hover background of this card.",
  },
  {
    name: "animationSpeed",
    label: "Animation speed",
    type: "number",
    placeholder: "3",
    help: "Higher = faster dots.",
  },
  {
    name: "overlay",
    label: "Add radial gradient overlay (use for light backgrounds)",
    type: "checkbox",
  },
];

const DEFAULTS = {
  phaseLabel: "",
  title: "",
  description: "",
  backgroundClass: "bg-emerald-900",
  animationSpeed: 3,
  overlay: false,
  visible: true,
};

export default function ApproachSettings() {
  return (
    <EntityListPage
      resource="approach"
      title="Approach phases"
      description="The phase cards in the “My Approach” section."
      fields={FIELDS}
      defaultValues={DEFAULTS}
      renderSummary={(item) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-white">
            {item.phaseLabel} — {item.title}
          </p>
          <p className="line-clamp-1 text-xs text-zinc-500">{item.description}</p>
        </div>
      )}
    />
  );
}
