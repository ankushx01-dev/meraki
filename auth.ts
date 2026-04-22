import bcrypt from "bcryptjs";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import authConfig from "@/auth.config";
import { connectDB } from "@/lib/db";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation";
import User from "@/models/User";

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials";
}

class LoginRateLimitError extends CredentialsSignin {
  code = "rate_limited";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new InvalidCredentialsError();
        }

        const email = parsed.data.email;
        const ip = getClientIp(request);
        const rateLimit = consumeRateLimit({
          key: `login:${ip}:${email}`,
          limit: 10,
          windowMs: 10 * 60 * 1000,
        });

        if (!rateLimit.ok) {
          throw new LoginRateLimitError();
        }

        await connectDB();
        const user = await User.findOne({ email }).lean();
        if (!user?.password) {
          throw new InvalidCredentialsError();
        }

        const isPasswordValid = await bcrypt.compare(
          parsed.data.password,
          String(user.password),
        );

        if (!isPasswordValid) {
          throw new InvalidCredentialsError();
        }

        return {
          id: String(user._id),
          name: typeof user.name === "string" ? user.name : "",
          email,
          plan: typeof user.plan === "string" ? user.plan : "free",
          onboardingCompleted: Boolean(user.onboardingCompleted),
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.plan = user.plan;
        token.onboardingCompleted = user.onboardingCompleted;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.plan = typeof token.plan === "string" ? token.plan : "free";
        session.user.onboardingCompleted = Boolean(token.onboardingCompleted);
      }

      return session;
    },
  },
});
