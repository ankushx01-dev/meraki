"use client";

import { useEffect, useState } from "react";

const meals = ["breakfast", "lunch", "snacks", "dinner"];

export function NutritionLogger() {
  const [data, setData] = useState<any>({});
  const [total, setTotal] = useState<any>({});
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [editingTotal, setEditingTotal] = useState(false);

  const userId =
    typeof window !== "undefined"
      ? (localStorage.getItem("meraki_auth") || "")
      : "";

  const today = new Date().toISOString().slice(0, 10);

  async function load() {
    const res = await fetch(`/api/intake?userId=${userId}`);
    const json = await res.json();

    setData(json.data || {});
    setTotal(json.total || {});
  }

  useEffect(() => {
    if (userId) load();
  }, [userId]);

  // ================= ADD =================
  async function add(meal: string) {
    const values = form?.[meal];
    const calories = Number(values?.calories || 0);
    const protein = Number(values?.protein || 0);
    const carbs = Number(values?.carbs || 0);
    const fat = Number(values?.fat || 0);

    if (!values || (calories <= 0 && protein <= 0 && carbs <= 0 && fat <= 0)) {
      alert("Enter at least one value");
      return;
    }

    if (!userId) {
      alert("Please login first");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userId,
        meal,
        date: today,
        calories,
        protein,
        carbs,
        fat,
      };
      console.log("Nutrition add payload:", payload);

      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add");
      }

      setForm((prev: any) => ({
        ...prev,
        [meal]: { calories: "", protein: "", carbs: "", fat: "" },
      }));

      await load();
      alert("Added successfully!");
    } catch (error) {
      console.error("Add meal error:", error);
      alert(error instanceof Error ? error.message : "Failed to add meal.");
    } finally {
      setLoading(false);
    }
  }

  // ================= EDIT TOTAL =================
  async function saveTotal() {
    if (!userId) {
      alert("Please login first");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/intake", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          date: today,
          calories: total.calories || 0,
          protein: total.protein || 0,
          carbs: total.carbs || 0,
          fat: total.fat || 0,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save");
      }

      setEditingTotal(false);
      await load();
      alert("Totals saved successfully!");
    } catch (error) {
      console.error("Save total error:", error);
      alert("Failed to save totals. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* 🔥 TOTAL */}
      <div className="rounded-2xl bg-[#0b0f0c] p-6 shadow-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Today Total</h2>

          {!editingTotal ? (
            <button
              onClick={() => setEditingTotal(true)}
              className="bg-blue-500 px-3 py-1 rounded text-white text-sm"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={saveTotal}
              className="bg-green-500 px-3 py-1 rounded text-white text-sm"
            >
              Save
            </button>
          )}
        </div>

        {/* DISPLAY */}
        {!editingTotal && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-white">
            <p>Calories: {total.calories || 0}</p>
            <p>Protein: {total.protein || 0}</p>
            <p>Carbs: {total.carbs || 0}</p>
            <p>Fat: {total.fat || 0}</p>
          </div>
        )}

        {/* EDIT INPUT */}
        {editingTotal && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["calories", "protein", "carbs", "fat"].map((field) => (
              <input
                key={field}
                type="number"
                value={total?.[field] || ""}
                onChange={(e) =>
                  setTotal((prev: any) => ({
                    ...prev,
                    [field]: Number(e.target.value),
                  }))
                }
                className="bg-black text-white p-2 rounded"
              />
            ))}
          </div>
        )}
      </div>

      {/* 🔥 MEALS */}
      {meals.map((meal) => {
        const m = {
          calories: data?.[meal]?.calories || 0,
          protein: data?.[meal]?.protein || 0,
          carbs: data?.[meal]?.carbs || 0,
          fat: data?.[meal]?.fat || 0,
        };

        return (
          <div key={meal} className="rounded-2xl bg-[#0b0f0c] p-6 shadow-xl">

            {/* HEADER */}
            <h2 className="text-lg font-semibold capitalize text-white">
              {meal} ({m.calories || 0} kcal)
            </h2>
            <p className="mt-1 text-xs capitalize text-[#8fb4ff]">Added from {meal}</p>

            {/* VALUES */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-white">
              <p>{m.calories} kcal</p>
              <p>{m.protein} g</p>
              <p>{m.carbs} g</p>
              <p>{m.fat} g</p>
            </div>

            {/* INPUT */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["calories", "protein", "carbs", "fat"].map((field) => (
                <input
                  key={field}
                  type="number"
                  placeholder={field}
                  value={form?.[meal]?.[field] ?? ""}
                  onChange={(e) =>
                    setForm((prev: any) => ({
                      ...prev,
                      [meal]: {
                        ...prev[meal],
                        [field]: e.target.value,
                      },
                    }))
                  }
                  className="bg-black text-white p-2 rounded"
                />
              ))}
            </div>

            {/* ADD BUTTON */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => add(meal)}
                disabled={loading}
                className="bg-green-500 px-4 py-2 rounded text-white"
              >
                Add
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}