import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

const parsed = envSchema.safeParse(process.env);

const REQUIRED_FOR_DEV = [
  "MONGODB_URI",
  "AUTH_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
] as const;

const missing = REQUIRED_FOR_DEV.filter((key) => !process.env[key]);

if (missing.length && process.env.NODE_ENV !== "production") {
  console.warn(
    `\n[env] Warning — missing variables in .env.local:\n  - ${missing.join("\n  - ")}\n` +
      `Some features will be unavailable until these are set.\n`
  );
}

export const env = parsed.success ? parsed.data : ({} as z.infer<typeof envSchema>);
export const envMissing = missing;
