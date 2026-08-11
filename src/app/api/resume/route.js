import { connectDB } from "@/lib/mongodb";
import Setting from "@/models/Setting";
import fs from "fs";
import path from "path";

export async function GET(req) {
  let resumeUrl = "/resume.pdf";

  try {
    await connectDB();
    const doc = await Setting.findOne({ key: "hero" }).lean();
    if (doc?.data?.resumeUrl) {
      resumeUrl = doc.data.resumeUrl.trim();
    }
  } catch (err) {
    console.error("[/api/resume] MongoDB connection error:", err);
  }

  const filename = "Ch_Junaid_Saleem_Resume.pdf";

  function createPdfResponse(arrayBuffer) {
    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // 1. Hosted/Remote URL (Cloudinary, Google Drive, etc.)
  if (resumeUrl.startsWith("http://") || resumeUrl.startsWith("https://")) {
    const urlsToTry = [resumeUrl];

    if (resumeUrl.includes("res.cloudinary.com")) {
      if (resumeUrl.includes("/image/upload/")) {
        urlsToTry.push(resumeUrl.replace("/image/upload/", "/raw/upload/"));
      } else if (resumeUrl.includes("/raw/upload/")) {
        urlsToTry.push(resumeUrl.replace("/raw/upload/", "/image/upload/"));
      }
    }

    for (const targetUrl of urlsToTry) {
      try {
        const res = await fetch(targetUrl);
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          return createPdfResponse(buffer);
        }
      } catch (err) {
        console.error("[/api/resume] Remote fetch failed for:", targetUrl, err);
      }
    }
  }

  // 2. Relative URL in /public (e.g. /resume.pdf or /resumes/my-cv.pdf)
  const relativePath = resumeUrl.startsWith("/") ? resumeUrl : `/${resumeUrl}`;

  // Try fetching via Next.js internal URL (works natively on Vercel serverless)
  try {
    const internalUrl = new URL(relativePath, req.url).toString();
    const res = await fetch(internalUrl);
    if (res.ok) {
      const buffer = await res.arrayBuffer();
      return createPdfResponse(buffer);
    }
  } catch (err) {
    console.error("[/api/resume] Internal fetch failed:", err);
  }

  // Try reading local filesystem (works in local dev)
  try {
    const localPath = path.join(process.cwd(), "public", relativePath);
    if (fs.existsSync(localPath)) {
      const buffer = fs.readFileSync(localPath);
      return createPdfResponse(buffer);
    }
  } catch (err) {
    console.error("[/api/resume] Local fs read failed:", err);
  }

  // 3. Fallback to default /resume.pdf via internal fetch
  try {
    const fallbackUrl = new URL("/resume.pdf", req.url).toString();
    const res = await fetch(fallbackUrl);
    if (res.ok) {
      const buffer = await res.arrayBuffer();
      return createPdfResponse(buffer);
    }
  } catch {}

  // 4. Fallback to default /public/resume.pdf via filesystem
  try {
    const rootPath = path.join(process.cwd(), "public", "resume.pdf");
    if (fs.existsSync(rootPath)) {
      const buffer = fs.readFileSync(rootPath);
      return createPdfResponse(buffer);
    }
  } catch {}

  return Response.json({ error: "Resume PDF not found" }, { status: 404 });
}
