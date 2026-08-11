"use client";

import SettingForm from "@/components/admin/SettingForm";

const FIELDS = [
  { name: "tagline", label: "Tagline (small text above headline)", type: "text", placeholder: "JavaScript | React | Next" },
  { name: "headline", label: "Headline", type: "text", required: true },
  { name: "subheadline", label: "Subheadline", type: "textarea", rows: 2 },
  { name: "ctaText", label: "Primary CTA text", type: "text", placeholder: "Explore Projects" },
  { name: "ctaLink", label: "Primary CTA link", type: "text", placeholder: "#projects" },
  {
    name: "resumeUrl",
    label: "Resume / CV File",
    type: "resume",
    help: "Upload a PDF resume directly or select from your uploaded resumes.",
  },
  {
    name: "resumeButtonText",
    label: "Resume button text",
    type: "text",
    placeholder: "Download CV",
  },
];

const DEFAULTS = {
  tagline: "",
  headline: "",
  subheadline: "",
  ctaText: "",
  ctaLink: "",
  resumeUrl: "/resume.pdf",
  resumeButtonText: "Download CV",
};

export default function HeroSettings() {
  return (
    <div className="max-w-2xl">
      <p className="mb-6 max-w-xl text-[13.5px] leading-relaxed text-[var(--st-ink-2)]">
        Text shown in the hero (top) section of your homepage.
      </p>
      <SettingForm settingKey="hero" fields={FIELDS} defaultValues={DEFAULTS} />
    </div>
  );
}
