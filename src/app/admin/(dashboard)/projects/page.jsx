"use client";

import EntityListPage from "@/components/admin/EntityListPage";
import { FOLDERS } from "@/lib/folders";

const FIELDS = [
  { name: "title", label: "Title", type: "text", required: true },
  {
    name: "slug",
    label: "URL slug",
    type: "text",
    required: true,
    placeholder: "my-project",
    help: "Lowercase letters, numbers, and dashes only. Used in /projects/[slug].",
  },
  { name: "description", label: "Short description (card)", type: "textarea", required: true, rows: 3 },
  { name: "image", label: "Cover image", type: "image", folder: FOLDERS.projects, required: true },
  {
    name: "techIcons",
    label: "Tech stack icons",
    type: "imageList",
    folder: FOLDERS.tech,
    help: "Order matters — icons are shown left-to-right.",
  },
  {
    name: "techStack",
    label: "Tech stack labels (text)",
    type: "stringList",
    placeholder: "Next.js",
    help: "Plain-text tech names shown on the case-study page.",
  },
  {
    name: "tags",
    label: "Tags",
    type: "stringList",
    placeholder: "AI, full-stack, mobile…",
    help: "Used as filter pills on the public projects grid.",
  },
  { name: "link", label: "Live URL", type: "text", required: true, placeholder: "https://…" },
  { name: "repoLink", label: "Repository URL", type: "text", placeholder: "https://github.com/…" },
  {
    name: "gallery",
    label: "Additional screenshots",
    type: "imageList",
    folder: FOLDERS.projects,
    help: "Shown on the project detail page in order.",
  },
  {
    name: "body",
    label: "Case study (Markdown)",
    type: "markdown",
    rows: 14,
    placeholder: "## Problem\n…\n\n## Solution\n…\n\n## Tech decisions\n…\n\n## What I learned\n…",
    help: "Long-form write-up. Use the Preview tab to see how it'll render.",
  },
];

const DEFAULT_VALUES = {
  title: "",
  slug: "",
  description: "",
  image: "",
  techIcons: [],
  techStack: [],
  tags: [],
  link: "",
  repoLink: "",
  gallery: [],
  body: "",
  visible: true,
};

export default function ProjectsPage() {
  return (
    <EntityListPage
      resource="projects"
      title="Projects"
      description="Add, edit, reorder, or hide your portfolio projects. Each one gets its own case-study page."
      fields={FIELDS}
      defaultValues={DEFAULT_VALUES}
      renderSummary={(item) => (
        <div className="flex items-center gap-3 min-w-0">
          {item.image && (
            <img src={item.image} alt="" className="h-12 w-16 shrink-0 rounded object-cover" />
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-white">{item.title}</p>
            <p className="truncate text-xs text-zinc-500">/projects/{item.slug || "?"}</p>
          </div>
        </div>
      )}
    />
  );
}
