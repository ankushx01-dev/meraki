"use client";

import { useEffect, useState } from "react";
import { Panel } from "@/components/dashboard/ui";

const storageKey = "meraki-calorie-planner";

const activityFactors = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
} as const;

const goalAdjustments = {
  loss: -300,
  maintain: 0,
  gain: 300,
} as const;

type Gender = "male" | "female";
type ActivityLevel = keyof typeof activityFactors;
type Goal = keyof typeof goalAdjustments;

type CalculatorState = {
  age: string;
  weight: string;
  height: string;
  gender: Gender;
  activity: ActivityLevel;
  goal: Goal;
  result: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null;
};

const initialState: CalculatorState = {
  age: "",
  weight: "",
  height: "",
  gender: "male",
  activity: "moderate",
  goal: "maintain",
  result: null,
};

function loadCalculatorState() {
  if (typeof window === "undefined") {
    return initialState;
  }

  const saved = window.localStorage.getItem(storageKey);

  if (!saved) {
    return initialState;
  }

  try {
    return JSON.parse(saved) as CalculatorState;
  } catch {
    window.localStorage.removeItem(storageKey);
    return initialState;
  }
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#9eb8f0]">
        {label}
      </span>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl bg-white/[0.04] px-4 text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-white/30 focus:ring-2 focus:ring-[#22c55e]/60"
      />
    </label>
  );
}

export function CaloriePlanner() {
  const [form, setForm] = useState<CalculatorState>(initialState);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState<"" | "saving" | "saved" | "error">("");
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setForm(loadCalculatorState());
      setHasHydrated(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydrated) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(form));
  }, [form, hasHydrated]);

  function updateField<K extends keyof CalculatorState>(
    key: K,
    value: CalculatorState[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function calculatePlan() {
    if (!form.age || !form.weight || !form.height) {
      setError("Please fill in age, weight, and height.");
      return null;
    }

    const age = Number(form.age);
    const weight = Number(form.weight);
    const height = Number(form.height);

    if (
      Number.isNaN(age) ||
      Number.isNaN(weight) ||
      Number.isNaN(height) ||
      age <= 0 ||
      weight <= 0 ||
      height <= 0
    ) {
      setError("Please enter valid positive numbers.");
      return null;
    }

    const bmr =
      form.gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const tdee = bmr * activityFactors[form.activity];
    const adjustedCalories = Math.round(tdee + goalAdjustments[form.goal]);

    const protein = Math.round(weight * 2);
    const fat = Math.round(weight * 0.8);
    const remainingCalories = adjustedCalories - protein * 4 - fat * 9;
    const carbs = Math.max(0, Math.round(remainingCalories / 4));

    const computed = {
      calories: adjustedCalories,
      protein,
      carbs,
      fat,
    };

    setForm((current) => ({
      ...current,
      result: computed,
    }));
    setError("");
    setSaveStatus("");
    return computed;
  }

  async function handleSubmit(resultOverride?: CalculatorState["result"]) {
    setError("");
    setSaveStatus("");

    const result = resultOverride ?? form.result;
    if (!result) {
      setError("Please calculate your targets first.");
      return;
    }

    const payload = {
      userId:
        typeof window !== "undefined" ? window.localStorage.getItem("meraki_auth") : null,
      age: Number(form.age),
      weight: Number(form.weight),
      height: Number(form.height),
      gender: form.gender,
      activity: form.activity,
      goal: form.goal,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
    };

    setSaveStatus("saving");
    const res = await fetch("/api/calorie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => ({}))) as { message?: string };
    if (!res.ok) {
      setSaveStatus("error");
      setError(data.message ?? "Error saving ❌");
      return;
    }

    setSaveStatus("saved");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Panel className="bg-[#0b0f0c] p-6 shadow-[0_24px_65px_rgba(0,0,0,0.32)] ring-0">
        <div>
          <h2 className="font-brand text-3xl tracking-[-0.04em] text-white">
            Calorie Calculator
          </h2>
          <p className="mt-2 text-sm text-[#8fb4ff]">
            Build a simple nutrition target based on your body metrics, activity
            level, and current goal.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <InputField
            label="Age"
            value={form.age}
            onChange={(value) => updateField("age", value)}
            placeholder="28"
          />
          <InputField
            label="Weight (kg)"
            value={form.weight}
            onChange={(value) => updateField("weight", value)}
            placeholder="72"
          />
          <InputField
            label="Height (cm)"
            value={form.height}
            onChange={(value) => updateField("height", value)}
            placeholder="178"
          />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-medium text-[#9eb8f0]">Gender</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["male", "female"] as Gender[]).map((option) => (
                <label
                  key={option}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${
                    form.gender === option
                      ? "bg-[#143523] text-[#7ff0a6]"
                      : "bg-white/[0.03] text-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={form.gender === option}
                    onChange={() => updateField("gender", option)}
                    className="h-4 w-4 border-0 bg-white/20 text-[#22c55e] focus:ring-[#22c55e]/50"
                  />
                  <span className="capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-3 block text-sm font-medium text-[#9eb8f0]">
              Activity level
            </span>
            <select
              value={form.activity}
              onChange={(event) =>
                updateField("activity", event.target.value as ActivityLevel)
              }
              className="h-12 w-full rounded-2xl bg-[#0b0f0c] px-4 text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus:ring-2 focus:ring-[#22c55e]/60"
            >
              <option className="bg-[#0b0f0c] text-white" value="sedentary">Sedentary</option>
              <option className="bg-[#0b0f0c] text-white" value="light">Light</option>
              <option className="bg-[#0b0f0c] text-white" value="moderate">Moderate</option>
              <option className="bg-[#0b0f0c] text-white" value="active">Active</option>
            </select>
          </label>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-sm font-medium text-[#9eb8f0]">Goal</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { key: "loss", label: "Weight loss" },
              { key: "maintain", label: "Maintain" },
              { key: "gain", label: "Weight gain" },
            ].map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => updateField("goal", option.key as Goal)}
                className={`rounded-2xl px-4 py-3 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${
                  form.goal === option.key
                    ? "bg-[#143523] text-[#7ff0a6]"
                    : "bg-white/[0.03] text-white hover:bg-white/[0.06]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              const computed = calculatePlan();
              if (computed) void handleSubmit(computed);
            }}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#22c55e] px-6 text-base font-semibold text-[#041108] shadow-[0_18px_36px_rgba(34,197,94,0.28)] hover:-translate-y-0.5 hover:bg-[#16a34a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]/60"
          >
            {saveStatus === "saving" ? "Saving..." : "Calculate Calories"}
          </button>

          {error ? (
            <p className="text-sm font-medium text-[#ff6b6d]">{error}</p>
          ) : saveStatus === "saved" ? (
            <p className="text-sm font-medium text-[#7ff0a6]">Saved successfully ✅</p>
          ) : (
            <p className="text-sm text-[#6f8877]">
              Targets are saved locally in your browser.
            </p>
          )}
        </div>
      </Panel>

      <Panel className="bg-[#0b0f0c] p-6 shadow-[0_24px_65px_rgba(0,0,0,0.32)] ring-0">
        <div>
          <h2 className="font-brand text-3xl tracking-[-0.04em] text-white">
            Your Daily Targets
          </h2>
          <p className="mt-2 text-sm text-[#8fb4ff]">
            Calories and macro targets update after calculation.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[22px] bg-[#111612] px-5 py-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)]">
            <p className="text-sm text-[#8fb4ff]">Calories</p>
            <p className="mt-2 font-brand text-5xl tracking-[-0.05em] text-[#22c55e]">
              {form.result ? `${form.result.calories}` : "----"}
            </p>
            <p className="mt-1 text-sm text-[#6f8877]">kcal / day</p>
          </div>

          {[
            { label: "Protein", value: form.result?.protein, unit: "g" },
            { label: "Carbs", value: form.result?.carbs, unit: "g" },
            { label: "Fat", value: form.result?.fat, unit: "g" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[22px] bg-[#111612] px-5 py-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)]"
            >
              <p className="text-sm text-[#8fb4ff]">{item.label}</p>
              <p className="mt-2 font-brand text-4xl tracking-[-0.05em] text-white">
                {item.value ?? "----"}
              </p>
              <p className="mt-1 text-sm text-[#6f8877]">{item.unit}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[22px] bg-white/[0.03] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <p className="text-sm font-medium text-[#9eb8f0]">Macro logic</p>
          <ul className="mt-3 space-y-2 text-sm text-[#c8d3ca]">
            <li>Protein = body weight × 2g</li>
            <li>Fat = body weight × 0.8g</li>
            <li>Carbs = remaining calories after protein and fat</li>
          </ul>
        </div>
      </Panel>
    </div>
  );
}
