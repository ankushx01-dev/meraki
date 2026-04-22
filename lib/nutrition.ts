export const activityFactors = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
} as const;

export const goalAdjustments = {
  loss: -300,
  maintain: 0,
  gain: 300,
} as const;

export type ActivityLevel = keyof typeof activityFactors;
export type Goal = keyof typeof goalAdjustments;
export type Gender = "male" | "female";

export function computeNutritionTargets({
  age,
  weight,
  height,
  gender,
  activity,
  goal,
}: {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activity: ActivityLevel;
  goal: Goal;
}) {
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = bmr * activityFactors[activity];
  const calories = Math.round(tdee + goalAdjustments[goal]);
  const protein = Math.round(weight * 2);
  const fat = Math.round(weight * 0.8);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

  return { calories, protein, carbs, fat };
}
