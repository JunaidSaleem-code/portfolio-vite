import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { connectDB } from "./mongodb";
import { rateLimit, resetRateLimit } from "./rate-limit";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().toLowerCase().trim();
        const password = credentials?.password?.toString();
        if (!email || !password) return null;

        const limitKey = `login:${email}`;
        const limit = rateLimit({ key: limitKey, limit: 5, windowMs: 15 * 60 * 1000 });
        if (!limit.allowed) {
          const minutesLeft = Math.ceil((limit.resetAt - Date.now()) / 60000);
          throw new Error(`Too many login attempts. Try again in ${minutesLeft} minute(s).`);
        }

        try {
          await connectDB();
          const user = await User.findOne({ email }).lean<{
            _id: { toString(): string };
            email: string;
            name?: string;
            passwordHash: string;
          } | null>();
          if (!user) return null;
          const valid = await bcrypt.compare(password, user.passwordHash);
          if (!valid) return null;
          resetRateLimit(limitKey);
          return { id: user._id.toString(), email: user.email, name: user.name };
        } catch (err) {
          console.error("[auth] authorize failed:", (err as Error).message);
          return null;
        }
      },
    }),
  ],
});
