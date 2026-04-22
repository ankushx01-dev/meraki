import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      onboardingCompleted?: boolean;
      plan?: string;
    };
  }

  interface User {
    id: string;
    onboardingCompleted?: boolean;
    plan?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    onboardingCompleted?: boolean;
    plan?: string;
  }
}
