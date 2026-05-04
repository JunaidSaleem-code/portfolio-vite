import bcrypt from "bcryptjs";
import { withAuth } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { passwordChangeSchema } from "@/lib/schemas";

export const POST = withAuth(async (req, _ctx, session) => {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = passwordChangeSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "ValidationError", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { currentPassword, newPassword } = parsed.data;

  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return Response.json({ error: "Not found" }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return Response.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  return Response.json({ ok: true });
});
