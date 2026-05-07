import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = pathname.startsWith("/admin");
      const isOnLogin = pathname.startsWith("/admin/login");

      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", request.nextUrl));
        }
        return true;
      }
      if (isOnAdmin) return isLoggedIn;
      return true;
    },
  },
  providers: [],
};
