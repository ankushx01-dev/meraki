import mongoose from "mongoose";

const SetSchema = new mongoose.Schema(
  {
    id: String,
    weight: String,
    reps: String,
    completed: Boolean,
    tag: String,
    pr: Boolean,
  },
  { _id: false }
);

const ExerciseSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    sets: { type: [SetSchema], default: [] },
  },
  { _id: false }
);

const WorkoutSessionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    dateKey: { type: String, required: true, index: true },
    exercises: { type: [ExerciseSchema], default: [] },
  },
  { timestamps: true }
);

WorkoutSessionSchema.index({ userId: 1, dateKey: 1 }, { unique: true });

export default mongoose.models.WorkoutSession ||
  mongoose.model("WorkoutSession", WorkoutSessionSchema);

