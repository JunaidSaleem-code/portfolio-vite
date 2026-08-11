import fs from "fs";
import path from "path";
import { withAuth } from "@/lib/auth-helpers";
import cloudinary from "@/lib/cloudinary";

export const GET = withAuth(async () => {
  const list = [
    {
      name: "Default (/resume.pdf)",
      url: "/resume.pdf",
    },
  ];

  // 1. Try reading local public/resumes directory safely (works in local dev)
  try {
    const resumesDir = path.join(process.cwd(), "public", "resumes");
    if (fs.existsSync(resumesDir)) {
      const files = fs.readdirSync(resumesDir);
      files
        .filter((f) => f.toLowerCase().endsWith(".pdf"))
        .forEach((f) => {
          list.push({
            name: f,
            url: `/resumes/${f}`,
          });
        });
    }
  } catch {
    // Ignore read-only / serverless fs errors
  }

  // 2. Fetch resumes from Cloudinary if configured
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    try {
      const result = await cloudinary.search
        .expression("folder:resumes/*")
        .sort_by("created_at", "desc")
        .max_results(30)
        .execute();

      (result.resources || []).forEach((r) => {
        const url = r.secure_url;
        const name = r.public_id.replace(/^resumes\//, "") + "." + (r.format || "pdf");
        if (!list.some((item) => item.url === url)) {
          list.push({ name: `Cloudinary: ${name}`, url });
        }
      });
    } catch {
      // Ignore Cloudinary search errors if folder is empty or not found
    }
  }

  return Response.json(list);
});
