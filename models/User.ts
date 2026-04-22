import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  age: Number,
  weight: Number,
  height: Number,
  gender: String,
  activity: String,
  goal: String,
  onboardingCompleted: { type: Boolean, default: false },
  onboardingCompletedAt: Date,
  plan: { type: String, default: "free" }, // free | pro | elite
  subscriptionStatus: { type: String, default: "inactive" },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);

