import { connectDB } from "@/lib/mongodb";
import Setting from "@/models/Setting";
import fs from "fs";
import path from "path";

export async function GET() {
  let resumeUrl = "/resume.pdf";

  try {
    await connectDB();
    const doc = await Setting.findOne({ key: "hero" }).lean();
    if (doc?.data?.resumeUrl) {
      resumeUrl = doc.data.resumeUrl;
    }
  } catch {
    // Fall back to default
  }

  const filename = "Ch_Junaid_Saleem_Resume.pdf";

  // Case 1: Hosted/Remote URL (Cloudinary, etc.)
  if (resumeUrl.startsWith("http://") || resumeUrl.startsWith("https://")) {
    // Try fetching with raw/fl_attachment if Cloudinary
    let targetUrl = resumeUrl;
    if (targetUrl.includes("res.cloudinary.com")) {
      targetUrl = targetUrl
        .replace("/image/upload/", "/raw/upload/")
        .replace("/upload/fl_attachment/", "/upload/");
    }

    try {
      const res = await fetch(targetUrl);
      if (res.ok) {
        const blob = await res.arrayBuffer();
        return new Response(blob, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      }
    } catch (err) {
      console.error("[/api/resume] Remote fetch error:", err);
    }
  }

  // Case 2: Local file in /public directory
  try {
    const cleanPath = resumeUrl.startsWith("/") ? resumeUrl : `/${resumeUrl}`;
    const localPath = path.join(process.cwd(), "public", cleanPath);
    if (fs.existsSync(localPath)) {
      const buffer = fs.readFileSync(localPath);
      return new Response(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  } catch (err) {
    console.error("[/api/resume] Local file read error:", err);
  }

  // Case 3: Ultimate Fallback to /public/resume.pdf
  try {
    const rootPath = path.join(process.cwd(), "public", "resume.pdf");
    if (fs.existsSync(rootPath)) {
      const buffer = fs.readFileSync(rootPath);
      return new Response(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  } catch {}

  return Response.json({ error: "Resume PDF not found" }, { status: 404 });
}
