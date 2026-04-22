"use client";

import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { MerakiLogoImage } from "@/components/meraki-logo-image";

interface LoginFormProps {
  initialTab?: "login" | "signup";
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getLoginErrorMessage(code?: string, fallback?: string) {
  if (code === "invalid_credentials") {
    return "Incorrect email or password.";
  }

  if (code === "rate_limited") {
    return "Too many login attempts. Please wait a bit and try again.";
  }

  return fallback || "Login failed.";
}

export function LoginForm({ initialTab = "login" }: LoginFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);

  const [signupName, setSignupName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submittingMode, setSubmittingMode] = useState<"login" | "signup" | null>(null);

  useEffect(() => {
    let cancelled = false;

    void getSession()
      .then((session) => {
        if (cancelled || typeof window === "undefined") {
          return;
        }

        const email = session?.user?.email ? normalizeEmail(session.user.email) : "";
        if (email) {
          window.localStorage.setItem("meraki_auth", email);
          router.replace("/dashboard");
          return;
        }

        window.localStorage.removeItem("meraki_auth");
      })
      .catch(() => {
        if (!cancelled && typeof window !== "undefined") {
          window.localStorage.removeItem("meraki_auth");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setSubmittingMode("login");

    try {
      const email = normalizeEmail(loginEmail);
      const result = await signIn("credentials", {
        email,
        password: loginPassword,
        redirect: false,
        redirectTo: "/dashboard",
      });

      if (!result?.ok) {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("meraki_auth");
        }
        setError(getLoginErrorMessage(result?.code, result?.error));
        return;
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem("meraki_auth", email);
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmittingMode(null);
    }
  };

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!signupName || !signUpEmail || !signUpPassword) {
      setError("Please fill all fields.");
      return;
    }

    setSubmittingMode("signup");

    try {
      const email = normalizeEmail(signUpEmail);
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email,
          password: signUpPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Signup failed.");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password: signUpPassword,
        redirect: false,
        redirectTo: "/dashboard",
      });

      if (!result?.ok) {
        setLoginEmail(email);
        setLoginPassword(signUpPassword);
        setActiveTab("login");
        setError("Account created, but automatic login failed. Please log in once to continue.");
        return;
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem("meraki_auth", email);
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmittingMode(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b08] text-white">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-[#0a130f]/90 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl">

          <div className="text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              <MerakiLogoImage width={36} height={44} priority />
              <p className="font-serif-heading text-2xl font-semibold tracking-[-0.04em] text-white">
                Meraki
              </p>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-white">Authenticate</h1>
            <p className="mt-2 text-sm text-white/60">
              Login or create your account
            </p>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`w-1/2 rounded-xl p-2 text-sm font-medium transition ${
                activeTab === "login"
                  ? "bg-[#ff4d4f] text-white shadow-[0_10px_24px_rgba(255,77,79,0.28)]"
                  : "text-white/75 hover:text-white"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("signup")}
              className={`w-1/2 rounded-xl p-2 text-sm font-medium transition ${
                activeTab === "signup"
                  ? "bg-[#ff4d4f] text-white shadow-[0_10px_24px_rgba(255,77,79,0.28)]"
                  : "text-white/75 hover:text-white"
              }`}
            >
              Signup
            </button>
          </div>

          {/* LOGIN */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/25 p-3 text-white placeholder:text-white/40 focus:border-[#ff4d4f]/70 focus:outline-none"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/25 p-3 text-white placeholder:text-white/40 focus:border-[#ff4d4f]/70 focus:outline-none"
              />

              <label className="flex items-center gap-3 text-sm text-white/65">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(event) => setShowPassword(event.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-black/30 accent-[#ff4d4f]"
                />
                <span>Show password</span>
              </label>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                disabled={submittingMode === "login"}
                className="w-full rounded-xl bg-[#ff4d4f] p-3 font-semibold text-white shadow-[0_12px_30px_rgba(255,77,79,0.28)] transition hover:bg-[#ff6061] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submittingMode === "login" ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* SIGNUP */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignUp} className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/25 p-3 text-white placeholder:text-white/40 focus:border-[#ff4d4f]/70 focus:outline-none"
              />

              <input
                type="email"
                placeholder="Email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/25 p-3 text-white placeholder:text-white/40 focus:border-[#ff4d4f]/70 focus:outline-none"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/25 p-3 text-white placeholder:text-white/40 focus:border-[#ff4d4f]/70 focus:outline-none"
              />

              <label className="flex items-center gap-3 text-sm text-white/65">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(event) => setShowPassword(event.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-black/30 accent-[#ff4d4f]"
                />
                <span>Show password</span>
              </label>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                disabled={submittingMode === "signup"}
                className="w-full rounded-xl bg-[#ff4d4f] p-3 font-semibold text-white shadow-[0_12px_30px_rgba(255,77,79,0.28)] transition hover:bg-[#ff6061] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submittingMode === "signup" ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
