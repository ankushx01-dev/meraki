"use client";

import {
  GoalIcon,
  SettingsIcon,
} from "@/components/dashboard/icons";
import { PageIntro, Panel, Toggle } from "@/components/dashboard/ui";
import { profileSummary } from "@/data/dashboard-content";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

function InputField({
  label,
  value,
  onChange,
  type = "text",
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "number";
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#8fb4ff]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-12 w-full rounded-xl bg-white/5 px-4 text-white outline-none ring-1 ring-white/10 focus:ring-red-500/60"
      />
    </label>
  );
}

export default function ProfilePage() {
  const email = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("meraki_auth") ?? "";
  }, []);

  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [status, setStatus] = useState<"" | "loading" | "saving">("loading");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const res = await fetch("/api/me", {
          headers: { "x-user-email": email },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message);

        if (!cancelled) {
          setName(data.user?.name || "");
          setWeight(data.user?.weight ? String(data.user.weight) : "");
          setHeight(data.user?.height ? String(data.user.height) : "");
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Error loading profile");
      } finally {
        if (!cancelled) setStatus("");
      }
    }

    if (email) loadProfile();
    else {
      setStatus("");
      setError("Please login again.");
    }

    return () => {
      cancelled = true;
    };
  }, [email]);

  async function handleSave() {
    setStatus("saving");
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": email,
        },
        body: JSON.stringify({ name, weight, height }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message);

      setSuccess("Saved ✅");
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setStatus("");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <PageIntro
        title="Profile"
        description="Manage your account and fitness goals."
      />

      {/* PROFILE CARD */}
      <Panel>
        <div className="flex flex-col items-center text-center">
          
          {/* ✅ MERAKI LOGO */}
          <div className="h-20 w-20 p-2 flex items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
            <Image
              src="/logo.svg"
              alt="Meraki Logo"
              width={70}
              height={70}
              className="object-contain drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
            />
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-white">
            {name || profileSummary.name}
          </h2>

          <p className="text-gray-400">{profileSummary.tier}</p>
        </div>
      </Panel>

      {/* PERSONAL INFO */}
      <Panel>
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon className="h-5 w-5 text-red-400" />
          <h2 className="text-xl text-white">Personal Information</h2>
        </div>

        <div className="space-y-4">
          <InputField label="Name" value={name} onChange={setName} />
          <InputField label="Email" value={email} onChange={() => {}} disabled />
        </div>
      </Panel>

      {/* FITNESS GOALS */}
      <Panel>
        <div className="flex items-center gap-3 mb-4">
          <GoalIcon className="h-5 w-5 text-red-400" />
          <h2 className="text-xl text-white">Fitness Goals</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Weight"
            type="number"
            value={weight}
            onChange={setWeight}
          />
          <InputField
            label="Height"
            type="number"
            value={height}
            onChange={setHeight}
          />
        </div>
      </Panel>

      {/* PREFERENCES */}
      <Panel>
        <h2 className="text-xl text-white mb-4">Preferences</h2>

        <div className="space-y-4">
          <Toggle
            enabled
            label="Email Notifications"
            description="Receive workout updates"
          />
          <Toggle
            enabled
            label="Push Notifications"
            description="Daily reminders"
          />
          <Toggle
            enabled={false}
            label="Weekly Summary"
            description="Weekly report"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          {error && <p className="text-red-400">{error}</p>}
          {success && <p className="text-green-400">{success}</p>}

          <button
            onClick={handleSave}
            className="h-12 px-6 bg-red-500 hover:bg-red-600 rounded-lg text-white"
          >
            {status === "saving" ? "Saving..." : "Save Changes"}
          </button>

          <button className="h-12 px-6 bg-white/5 rounded-lg text-white">
            Cancel
          </button>
        </div>
      </Panel>
    </div>
  );
}