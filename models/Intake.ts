import mongoose from "mongoose";

// 🔥 FIX: proper default structure
const MealSchema = new mongoose.Schema(
  {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
  },
  { _id: false } // cleaner subdoc
);

// 🔥 helper default meal
// Removed unused defaultMeal - using schema defaults

const IntakeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },

    // Meals
    breakfast: { type: MealSchema, default: () => ({ calories: 0, protein: 0, carbs: 0, fat: 0 }) },
    lunch: { type: MealSchema, default: () => ({ calories: 0, protein: 0, carbs: 0, fat: 0 }) },
    snacks: { type: MealSchema, default: () => ({ calories: 0, protein: 0, carbs: 0, fat: 0 }) },
    dinner: { type: MealSchema, default: () => ({ calories: 0, protein: 0, carbs: 0, fat: 0 }) },

    // ✅ NEW: Top-level totals for direct editing
    caloriesConsumed: { type: Number, default: 0 },
    proteinConsumed: { type: Number, default: 0 },
    carbsConsumed: { type: Number, default: 0 },
    fatConsumed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 🔥 unique per day per user
IntakeSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.Intake ||
  mongoose.model("Intake", IntakeSchema);