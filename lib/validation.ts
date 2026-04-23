import { z } from "zod";

import type { ActivityLevel, Gender, Goal } from "@/lib/nutrition";

const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address.")
  .max(254, "Email is too long.")
  .transform((value) => value.toLowerCase());

const dateKeySchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format.");

const optionalPositiveNumber = (label: string, max: number) =>
  z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z
      .coerce
      .number()
      .positive(`${label} must be greater than 0.`)
      .max(max, `${label} is too large.`)
      .optional(),
  );

const nonNegativeNumber = (label: string, max: number) =>
  z.coerce
    .number()
    .min(0, `${label} cannot be negative.`)
    .max(max, `${label} is too large.`);

const textField = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} is too long.`);

const optionalTextField = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Text cannot be longer than ${max} characters.`)
    .optional()
    .default("");

const numericTextField = (label: string) =>
  z
    .string()
    .trim()
    .max(12, `${label} is too long.`)
    .refine(
      (value) => value === "" || (!Number.isNaN(Number(value)) && Number(value) >= 0),
      `${label} must be a valid number.`,
    );

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Password is required.")
    .max(72, "Password is too long."),
});

export const signupSchema = z.object({
  name: textField("Name", 80),
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password is too long."),
});

export const nutritionProfileSchema = z.object({
  age: z.coerce.number().int().min(10, "Age must be at least 10.").max(120, "Age is too high."),
  weight: z.coerce.number().positive("Weight must be greater than 0.").max(500, "Weight is too high."),
  height: z.coerce.number().positive("Height must be greater than 0.").max(300, "Height is too high."),
  gender: z.custom<Gender>((value) => value === "male" || value === "female", {
    message: "Select a valid gender.",
  }),
  activity: z.custom<ActivityLevel>(
    (value) =>
      value === "sedentary" ||
      value === "light" ||
      value === "moderate" ||
      value === "active",
    { message: "Select a valid activity level." },
  ),
  goal: z.custom<Goal>(
    (value) => value === "loss" || value === "maintain" || value === "gain",
    { message: "Select a valid goal." },
  ),
});

export const profileUpdateSchema = z.object({
  name: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(80, "Name is too long.")
      .optional(),
  ),
  weight: optionalPositiveNumber("Weight", 500),
  height: optionalPositiveNumber("Height", 300),
});

export const dateQuerySchema = z.object({
  date: dateKeySchema.optional(),
});

export const workoutCalendarQuerySchema = z.object({
  start: dateKeySchema,
});

export const workoutSessionQuerySchema = z.object({
  dateKey: dateKeySchema,
});

export const intakeCreateSchema = z.object({
  meal: z.enum(["breakfast", "lunch", "snacks", "dinner"], {
    message: "Select a valid meal.",
  }),
  date: dateKeySchema.optional(),
  calories: nonNegativeNumber("Calories", 20000),
  protein: nonNegativeNumber("Protein", 2000),
  carbs: nonNegativeNumber("Carbs", 2000),
  fat: nonNegativeNumber("Fat", 1000),
});

export const intakeUpdateSchema = z.object({
  meal: z.enum(["breakfast", "lunch", "snacks", "dinner"]).optional(),
  date: dateKeySchema.optional(),
  calories: nonNegativeNumber("Calories", 20000),
  protein: nonNegativeNumber("Protein", 2000),
  carbs: nonNegativeNumber("Carbs", 2000),
  fat: nonNegativeNumber("Fat", 1000),
});

export const workoutCalendarSaveSchema = z.object({
  dateKey: dateKeySchema,
  workout: textField("Workout", 80),
  focus: optionalTextField(180),
  summary: optionalTextField(280),
  completed: z.boolean().optional(),
  exercises: z
    .array(textField("Exercise", 80))
    .min(1, "Add at least one exercise.")
    .max(20, "Too many exercises."),
});

const workoutSetSchema = z.object({
  id: textField("Set id", 100),
  weight: numericTextField("Weight"),
  reps: numericTextField("Reps"),
  completed: z.boolean().optional().default(false),
  pr: z.boolean().optional().default(false),
});

const workoutExerciseSchema = z.object({
  id: textField("Exercise id", 100),
  name: textField("Exercise name", 80),
  sets: z.array(workoutSetSchema).max(20, "Too many sets."),
});

export const workoutSessionSaveSchema = z.object({
  dateKey: dateKeySchema,
  exercises: z
    .array(workoutExerciseSchema)
    .min(1, "Add at least one exercise.")
    .max(20, "Too many exercises."),
});

export const paymentCreateSchema = z.object({
  planId: z.string().trim().min(1, "Plan is required."),
});

export const paymentVerifySchema = z.object({
  planId: z.string().trim().min(1, "Plan is required."),
  razorpay_order_id: textField("Order id", 120),
  razorpay_payment_id: textField("Payment id", 120),
  razorpay_signature: textField("Signature", 180),
});

export const aiDoubtMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty.")
    .max(1500, "Message is too long."),
});

export const aiDoubtRequestSchema = z.object({
  messages: z.array(aiDoubtMessageSchema).min(1).max(16),
});
