import type { NextAuthConfig } from "next-auth";

const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const protectedPrefixes = ["/dashboard", "/calculator", "/ai-doubt"];
      const requiresAuth = protectedPrefixes.some((prefix) =>
        nextUrl.pathname.startsWith(prefix),
      );

      if (requiresAuth) {
        return isLoggedIn;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
