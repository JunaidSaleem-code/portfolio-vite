"use client";

import EntityListPage from "@/components/admin/EntityListPage";

const RATING_OPTIONS = [
  { value: 5, label: "★★★★★ (5)" },
  { value: 4, label: "★★★★☆ (4)" },
  { value: 3, label: "★★★☆☆ (3)" },
  { value: 2, label: "★★☆☆☆ (2)" },
  { value: 1, label: "★☆☆☆☆ (1)" },
];

const FIELDS = [
  { name: "name", label: "Client name", type: "text", required: true, placeholder: "Jane Doe" },
  { name: "role", label: "Role", type: "text", placeholder: "Product Manager" },
  { name: "company", label: "Company", type: "text", placeholder: "Acme Inc." },
  { name: "quote", label: "Quote", type: "textarea", required: true, rows: 5, placeholder: "What did they say about working with you?" },
  { name: "avatar", label: "Avatar", type: "image", folder: "testimonials", help: "Optional headshot or logo." },
  { name: "rating", label: "Rating", type: "select", options: RATING_OPTIONS },
  { name: "link", label: "Source link", type: "text", placeholder: "https://… (LinkedIn recommendation, tweet, etc.)" },
];

const DEFAULTS = {
  name: "",
  role: "",
  company: "",
  quote: "",
  avatar: "",
  rating: 5,
  link: "",
  visible: true,
};

export default function TestimonialsPage() {
  return (
    <EntityListPage
      resource="testimonials"
      title="Client Testimonials"
      description="Kind words from clients and collaborators. Drag to reorder, toggle visibility per item."
      fields={FIELDS}
      defaultValues={DEFAULTS}
      renderSummary={(item) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-[var(--st-ink)]">
            <span className="mr-2 inline-block rounded bg-[var(--st-accent)]/20 px-2 py-0.5 text-xs uppercase text-[var(--st-ink)]">
              {"★".repeat(item.rating || 5)}
            </span>
            {item.name}
            {item.company && (
              <span className="text-[var(--st-muted)]"> · {item.company}</span>
            )}
          </p>
          <p className="truncate text-xs text-[var(--st-muted)]">
            {item.quote}
          </p>
        </div>
      )}
    />
  );
}
