import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Authenticate into Meraki with a modern login and sign up experience.",
};

export default function SignupPage() {
  return <LoginForm initialTab="signup" />;
}
