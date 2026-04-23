import mongoose from "mongoose";

const WorkoutCalendarSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    dateKey: { type: String, required: true, index: true }, // YYYY-MM-DD
    workout: { type: String, required: true },
    focus: { type: String, default: "" },
    summary: { type: String, default: "" },
    exercises: { type: [String], default: [] },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

WorkoutCalendarSchema.index({ userId: 1, dateKey: 1 }, { unique: true });

export default mongoose.models.WorkoutCalendar ||
  mongoose.model("WorkoutCalendar", WorkoutCalendarSchema);
