"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/admin/forms/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Invalid email or password");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-8 shadow-xl">
        <h1 className="mb-2 text-2xl font-bold text-white">Admin Login</h1>
        <p className="mb-6 text-sm text-zinc-400">
          Sign in to manage your portfolio.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-zinc-300">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              autoFocus
              className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-purple-400"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-zinc-300">Password</span>
            <PasswordInput
              name="password"
              required
              autoComplete="current-password"
            />
          </label>

          {error && (
            <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-purple-500 px-4 py-2.5 font-medium text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
