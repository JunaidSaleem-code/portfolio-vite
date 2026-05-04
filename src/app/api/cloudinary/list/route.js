import cloudinary from "@/lib/cloudinary";
import { withAuth } from "@/lib/auth-helpers";

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder") || "portfolio";
  const max = Math.min(parseInt(searchParams.get("max") || "60", 10), 100);

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return Response.json({ error: "Cloudinary not configured" }, { status: 500 });
  }

  try {
    const result = await cloudinary.search
      .expression(`folder:${folder}/* AND resource_type:image`)
      .sort_by("created_at", "desc")
      .max_results(max)
      .execute();

    const items = (result.resources || []).map((r) => ({
      url: r.secure_url,
      publicId: r.public_id,
      width: r.width,
      height: r.height,
      bytes: r.bytes,
      createdAt: r.created_at,
    }));

    return Response.json({ items });
  } catch (err) {
    return Response.json({ error: err.message || "Cloudinary list failed" }, { status: 500 });
  }
});
