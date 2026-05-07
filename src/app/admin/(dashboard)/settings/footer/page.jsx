"use client";

import SettingForm from "@/components/admin/SettingForm";

const FIELDS = [
  { name: "headline", label: "Headline", type: "text", required: true },
  { name: "paragraph", label: "Paragraph", type: "textarea", rows: 3 },
  { name: "ctaText", label: "CTA button text", type: "text", placeholder: "Let's get in touch" },
  { name: "contactEmail", label: "Contact email", type: "text", placeholder: "you@example.com" },
  { name: "copyright", label: "Copyright line", type: "text", placeholder: "© 2024 Your Name" },
];

const DEFAULTS = {
  headline: "",
  paragraph: "",
  ctaText: "",
  contactEmail: "",
  copyright: "",
};

export default function FooterSettings() {
  return (
    <div className="max-w-2xl">
      <p className="mb-6 max-w-xl text-[13.5px] leading-relaxed text-[var(--st-ink-2)]">
        Text shown in the footer / contact section.
      </p>
      <SettingForm settingKey="footer" fields={FIELDS} defaultValues={DEFAULTS} />
    </div>
  );
}
