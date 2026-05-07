import { connectDB } from "./mongodb";
import ErrorLog from "@/models/ErrorLog";

export type ErrorContext = {
  path?: string;
  method?: string;
  userId?: string;
  meta?: Record<string, unknown>;
};

export async function logError(err: unknown, context: ErrorContext = {}): Promise<void> {
  const error = err as { message?: string; stack?: string } | undefined;
  const message = error?.message || String(err);
  const stack = error?.stack || "";

  console.error(
    `[error]${context.path ? ` ${context.method || ""} ${context.path}` : ""}: ${message}`
  );
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
