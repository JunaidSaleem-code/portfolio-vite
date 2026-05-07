// Cloudinary folder paths. Change ROOT to rename the parent folder for ALL uploads.

const ROOT = "portfolio";

export const FOLDERS = {
  projects: `${ROOT}/projects`,
  tech: `${ROOT}/tech`,
  experience: `${ROOT}/experience`,
  bento: `${ROOT}/bento`,
  social: `${ROOT}/social`,
  testimonials: `${ROOT}/testimonials`,
} as const;

export type FolderKey = keyof typeof FOLDERS;
