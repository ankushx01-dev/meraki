"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Panel } from "@/components/dashboard/ui";
import { MerakiLogoImage } from "@/components/meraki-logo-image";

type Gender = "male" | "female";
type Activity = "sedentary" | "light" | "moderate" | "active";
type Goal = "loss" | "maintain" | "gain";

export default function OnboardingPage() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [activity, setActivity] = useState<Activity>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [step, setStep] = useState(0);
  const [welcomeName, setWelcomeName] = useState("Athlete");
  const [status, setStatus] = useState<"" | "saving">("");
  const [error, setError] = useState("");

  const userId = useMemo(
    () => (typeof window !== "undefined" ? window.localStorage.getItem("meraki_auth") ?? "" : ""),
    []
  );

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetch("/api/me", { headers: { "x-user-email": userId } })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const rawName = String(json?.user?.name ?? "").trim();
        if (!rawName) return;
        setWelcomeName(rawName.split(/\s+/)[0] ?? rawName);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function handleSubmit() {
    setError("");
    if (!userId) {
      router.replace("/login");
      return;
    }

    setStatus("saving");
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-email": userId,
      },
      body: JSON.stringify({
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        gender,
        activity,
        goal,
      }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("");
      setError(json?.message ?? "Failed to save onboarding.");
      return;
    }

    setStatus("");
    router.replace("/dashboard");
  }

  function nextStep() {
    setError("");
    if (step === 0 && (!age || Number(age) <= 0)) {
      setError("Please enter a valid age.");
      return;
    }
    if (step === 1 && (!weight || Number(weight) <= 0)) {
      setError("Please enter a valid weight.");
      return;
    }
    if (step === 2 && (!height || Number(height) <= 0)) {
      setError("Please enter a valid height.");
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  }

  function previousStep() {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  }

  const totalSteps = 6;
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  return (
    <div className="flex min-h-[74vh] items-center justify-center py-6">
      <Panel className="w-full max-w-2xl border border-white/10 bg-[#0b120f]/95 p-0 shadow-[0_30px_100px_rgba(0,0,0,0.42)]">
        <div className="border-b border-white/10 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <MerakiLogoImage width={34} height={42} priority />
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#8fb4ff]">Onboarding</p>
              <h1 className="font-serif-heading text-3xl font-semibold tracking-[-0.04em] text-white">
                Welcome to Meraki, {welcomeName}
              </h1>
            </div>
          </div>
          <p className="mt-2 text-sm text-white/60">
            We will ask a few quick questions one by one, then save everything once.
          </p>
          <div className="mt-4 h-2 rounded-full bg-white/[0.06]">
            <div
              className="h-2 rounded-full bg-[#ff4d4f] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/45">
            Step {step + 1} of {totalSteps}
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {step === 0 ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#8fb4ff]">Age</span>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="h-12 w-full rounded-2xl bg-white/[0.03] px-4 text-white outline-none ring-1 ring-white/10 focus:ring-[#ff4d4f]/60"
                placeholder="25"
                min={1}
              />
            </label>
          ) : null}

          {step === 1 ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#8fb4ff]">Weight (kg)</span>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="h-12 w-full rounded-2xl bg-white/[0.03] px-4 text-white outline-none ring-1 ring-white/10 focus:ring-[#ff4d4f]/60"
                placeholder="72"
                min={1}
              />
            </label>
          ) : null}

          {step === 2 ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#8fb4ff]">Height (cm)</span>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="h-12 w-full rounded-2xl bg-white/[0.03] px-4 text-white outline-none ring-1 ring-white/10 focus:ring-[#ff4d4f]/60"
                placeholder="178"
                min={1}
              />
            </label>
          ) : null}

          {step === 3 ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#8fb4ff]">Gender</span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="h-12 w-full rounded-2xl bg-[#0f1511] px-4 text-white outline-none ring-1 ring-white/10 focus:ring-[#ff4d4f]/60"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
          ) : null}

          {step === 4 ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#8fb4ff]">Activity level</span>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value as Activity)}
                className="h-12 w-full rounded-2xl bg-[#0f1511] px-4 text-white outline-none ring-1 ring-white/10 focus:ring-[#ff4d4f]/60"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
              </select>
            </label>
          ) : null}

          {step === 5 ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#8fb4ff]">Goal</span>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as Goal)}
                className="h-12 w-full rounded-2xl bg-[#0f1511] px-4 text-white outline-none ring-1 ring-white/10 focus:ring-[#ff4d4f]/60"
              >
                <option value="loss">Weight loss</option>
                <option value="maintain">Maintain</option>
                <option value="gain">Weight gain</option>
              </select>
            </label>
          ) : null}

          {error ? <p className="mt-4 text-sm text-[#ff6b6d]">{error}</p> : null}

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={previousStep}
              disabled={step === 0 || status === "saving"}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/12 px-4 text-sm font-medium text-white/80 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#ff4d4f] px-5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(255,77,79,0.3)] hover:bg-[#ff6061]"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === "saving"}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#ff4d4f] px-5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(255,77,79,0.3)] hover:bg-[#ff6061] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "saving" ? "Saving..." : "Save and Continue"}
              </button>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}

