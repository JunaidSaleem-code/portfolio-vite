"use client";

import EntityListPage from "@/components/admin/EntityListPage";
import { FOLDERS } from "@/lib/folders";

const CARD_TYPE_OPTIONS = [
  { value: "default", label: "Default (image + title)" },
  { value: "globe", label: "Globe (3D earth)" },
  { value: "techStack", label: "Tech stack (two columns)" },
  { value: "emailCta", label: "Email CTA (copy email button)" },
];

const FIELDS = [
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textarea", rows: 2 },
  { name: "cardType", label: "Card type", type: "select", options: CARD_TYPE_OPTIONS },
  {
    name: "className",
    label: "Grid layout class",
    type: "text",
    placeholder: "lg:col-span-2 md:col-span-3 md:row-span-2",
    help: "Tailwind classes that control how this card sits in the grid.",
  },
  { name: "image", label: "Background image", type: "image", folder: FOLDERS.bento },
  {
    name: "imgClassName",
    label: "Image class",
    type: "text",
    placeholder: "absolute right-0 bottom-0 md:w-96 w-60",
  },
  { name: "spareImage", label: "Spare image", type: "image", folder: FOLDERS.bento },
  {
    name: "spareImageClassName",
    label: "Spare image class",
    type: "text",
    placeholder: "w-full opacity-80",
  },
  {
    name: "titleClassName",
    label: "Title class",
    type: "text",
    placeholder: "justify-center md:justify-start lg:justify-center",
  },
  {
    name: "techStackLeft",
    label: "Tech stack — left column",
    type: "stringList",
    placeholder: "Next.js",
    help: "Only used when card type is Tech stack.",
  },
  {
    name: "techStackRight",
    label: "Tech stack — right column",
    type: "stringList",
    placeholder: "MongoDB",
  },
  {
    name: "emailAddress",
    label: "Email address",
    type: "text",
    placeholder: "you@example.com",
    help: "Only used when card type is Email CTA.",
  },
];

const DEFAULT_VALUES = {
  title: "",
  description: "",
  cardType: "default",
  className: "lg:col-span-2 md:col-span-3 md:row-span-2",
  image: "",
  imgClassName: "",
  spareImage: "",
  spareImageClassName: "",
  titleClassName: "",
  techStackLeft: [],
  techStackRight: [],
  emailAddress: "",
  visible: true,
};

export default function BentoPage() {
  return (
    <EntityListPage
      resource="bento"
      title="Bento Grid"
      description="Cards that appear in the About section."
      fields={FIELDS}
      defaultValues={DEFAULT_VALUES}
      renderSummary={(item) => (
        <div className="flex items-center gap-3 min-w-0">
          {item.image ? (
            <img src={item.image} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-zinc-900 text-xs text-zinc-500">
              —
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-white">{item.title || "(untitled)"}</p>
            <p className="text-xs text-zinc-500">
              {CARD_TYPE_OPTIONS.find((o) => o.value === item.cardType)?.label || item.cardType}
            </p>
          </div>
        </div>
      )}
    />
  );
}
