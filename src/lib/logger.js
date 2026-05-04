import { connectDB } from "./mongodb";
import ErrorLog from "@/models/ErrorLog";

export async function logError(err, context = {}) {
  const message = err?.message || String(err);
  const stack = err?.stack || "";

  console.error(`[error]${context.path ? ` ${context.method || ""} ${context.path}` : ""}: ${message}`);
  if (stack) console.error(stack);

  // Best-effort persist; never let logging crash the request handler.
  try {
    await connectDB();
    await ErrorLog.create({
      message,
      stack,
      path: context.path || "",
      method: context.method || "",
      userId: context.userId || "",
      meta: context.meta || {},
    });
  } catch {
    // swallow — logging failures must not propagate
  }
}
