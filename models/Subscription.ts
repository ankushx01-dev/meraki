import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    planId: { type: String, required: true },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    razorpayOrderId: { type: String, index: true, sparse: true },
    razorpayPaymentId: { type: String, index: true, sparse: true },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ userId: 1, planId: 1, createdAt: -1 });

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);

