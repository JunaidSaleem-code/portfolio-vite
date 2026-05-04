import { withAuth } from "@/lib/auth-helpers";
import { signUpload } from "@/lib/cloudinary";

export const POST = withAuth(async (req) => {
  let body = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  try {
    const params = signUpload({ folder: body.folder || "portfolio" });
    return Response.json(params);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
