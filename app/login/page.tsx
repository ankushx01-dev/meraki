import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Authentication | Meraki",
  description: "Authenticate into Meraki with a modern login and sign up experience.",
};

export default function LoginPage() {
  return <LoginForm initialTab="login" />;
}