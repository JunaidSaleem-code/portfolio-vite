import { z } from "zod";

const orderingFields = {
  order: z.number().int().optional(),
  visible: z.boolean().optional(),
};

export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and dashes only"),
  description: z.string().min(1),
  image: z.string().min(1, "Image is required"),
  gallery: z.array(z.string()).default([]),
  techIcons: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  link: z.string().min(1),
  repoLink: z.string().default(""),
  body: z.string().default(""),
  ...orderingFields,
});

export const experienceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  ...orderingFields,
});

export const bentoItemSchema = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
  image: z.string().default(""),
  spareImage: z.string().default(""),
  className: z.string().default(""),
  imgClassName: z.string().default(""),
  spareImageClassName: z.string().default(""),
  titleClassName: z.string().default(""),
  cardType: z.enum(["default", "globe", "techStack", "emailCta"]).default("default"),
  techStackLeft: z.array(z.string()).default([]),
  techStackRight: z.array(z.string()).default([]),
  emailAddress: z.string().default(""),
  ...orderingFields,
});

export const navItemSchema = z.object({
  name: z.string().min(1),
  link: z.string().min(1),
  ...orderingFields,
});

export const socialLinkSchema = z.object({
  label: z.string().default(""),
  icon: z.string().min(1, "Icon is required"),
  link: z.string().min(1),
  ...orderingFields,
});

export const approachPhaseSchema = z.object({
  phaseLabel: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  backgroundClass: z.string().default("bg-emerald-900"),
  animationSpeed: z.coerce.number().default(3),
  colors: z.array(z.array(z.number())).optional(),
  dotSize: z.coerce.number().optional(),
  overlay: z.coerce.boolean().default(false),
  ...orderingFields,
});

export const sectionSchema = z.object({
  key: z.enum(["hero", "grid", "projects", "experience", "achievements", "approach", "footer"]),
  label: z.string().min(1),
  ...orderingFields,
});

export const achievementSchema = z.object({
  type: z.enum(["education", "recognition"]).default("recognition"),
  title: z.string().min(1),
  organization: z.string().default(""),
  period: z.string().default(""),
  description: z.string().default(""),
  icon: z.string().default(""),
  ...orderingFields,
});

export const testimonialSchema = z.object({
  quote: z.string().min(1, "Quote is required"),
  name: z.string().min(1, "Client name is required"),
  role: z.string().default(""),
  company: z.string().default(""),
  avatar: z.string().default(""),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  link: z.string().default(""),
  ...orderingFields,
});

export const heroSettingSchema = z.object({
  tagline: z.string().default(""),
  headline: z.string().default(""),
  subheadline: z.string().default(""),
  ctaText: z.string().default(""),
  ctaLink: z.string().default(""),
  resumeUrl: z.string().default(""),
  resumeButtonText: z.string().default("Download CV"),
});

export const footerSettingSchema = z.object({
  headline: z.string().default(""),
  paragraph: z.string().default(""),
  ctaText: z.string().default(""),
  contactEmail: z.string().default(""),
  copyright: z.string().default(""),
});

export const settingSchemas = {
  hero: heroSettingSchema,
  footer: footerSettingSchema,
} as const;

export type SettingKey = keyof typeof settingSchemas;

export const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export const subscribeSchema = z.object({
  email: z.string().email("Valid email required"),
  name: z.string().max(100).default(""),
  source: z.string().max(50).default("footer"),
});

export const profileSchema = z.object({
  name: z.string().min(1).max(100),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type BentoItemInput = z.infer<typeof bentoItemSchema>;
export type NavItemInput = z.infer<typeof navItemSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
export type ApproachPhaseInput = z.infer<typeof approachPhaseSchema>;
export type SectionInput = z.infer<typeof sectionSchema>;
export type AchievementInput = z.infer<typeof achievementSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type HeroSetting = z.infer<typeof heroSettingSchema>;
export type FooterSetting = z.infer<typeof footerSettingSchema>;
export type ReorderInput = z.infer<typeof reorderSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
