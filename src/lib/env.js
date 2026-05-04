import { z } from "zod";

// Required at runtime for the dashboard / DB / image uploads to work.
// Public-site visitors with the DB unreachable still get a graceful empty render.
const envSchema = z.object({
  MONGODB_URI: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);

const REQUIRED_FOR_DEV = [
  "MONGODB_URI",
  "AUTH_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
];

const missing = REQUIRED_FOR_DEV.filter((key) => !process.env[key]);

if (missing.length && process.env.NODE_ENV !== "production") {
  console.warn(
    `\n[env] Warning — missing variables in .env.local:\n  - ${missing.join("\n  - ")}\n` +
    `Some features will be unavailable until these are set.\n`
  );
}

export const env = parsed.success ? parsed.data : {};
export const envMissing = missing;
