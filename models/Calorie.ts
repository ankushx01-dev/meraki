import mongoose from "mongoose";

const CalorieSchema = new mongoose.Schema(
  {
    userId: String, // later from JWT
    age: Number,
    weight: Number,
    height: Number,
    gender: String,
    activity: String,
    goal: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Calorie || mongoose.model("Calorie", CalorieSchema);

