import fs, { promises as fsp } from "fs";
import path from "path";
import { withAuth } from "@/lib/auth-helpers";

const RESUMES_DIR = path.join(process.cwd(), "public", "resumes");

async function ensureDir() {
  try {
    await fsp.mkdir(RESUMES_DIR, { recursive: true });
  } catch {}
}

export const GET = withAuth(async () => {
  await ensureDir();
  try {
    const files = await fsp.readdir(RESUMES_DIR);
    const pdfFiles = files
      .filter((f) => f.toLowerCase().endsWith(".pdf"))
      .map((f) => ({
        name: f,
        url: `/resumes/${f}`,
      }));

    // Check if root /public/resume.pdf exists too
    const rootResume = path.join(process.cwd(), "public", "resume.pdf");
    if (fs.existsSync(rootResume)) {
      pdfFiles.unshift({
        name: "Default (resume.pdf)",
        url: "/resume.pdf",
      });
    }

    return Response.json(pdfFiles);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});

export const POST = withAuth(async (req) => {
  await ensureDir();
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return Response.json({ error: "No PDF file provided" }, { status: 400 });
    }

    const fileName = file.name || "resume.pdf";
    if (!fileName.toLowerCase().endsWith(".pdf")) {
      return Response.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    // Sanitize file name: remove non-alphanumeric chars except dashes, underscores, dots
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = path.join(RESUMES_DIR, safeName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fsp.writeFile(filePath, buffer);

    const publicUrl = `/resumes/${safeName}`;

    return Response.json({
      success: true,
      name: safeName,
      url: publicUrl,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
