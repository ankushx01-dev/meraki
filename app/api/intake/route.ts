import { connectDB } from "@/lib/db";
import Intake from "@/models/Intake";
import { NextResponse } from "next/server";

const allowedMeals = ["breakfast", "lunch", "snacks", "dinner"] as const;
type AllowedMeal = (typeof allowedMeals)[number];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// 🔥 helper: ensure meal structure
function normalizeMeals(doc: any) {
  const fallback = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const safeMeal = (m: any) => ({
    calories: Number(m?.calories ?? 0) || 0,
    protein: Number(m?.protein ?? 0) || 0,
    carbs: Number(m?.carbs ?? 0) || 0,
    fat: Number(m?.fat ?? 0) || 0,
  });

  return {
    breakfast: doc?.breakfast ? safeMeal(doc.breakfast) : fallback,
    lunch: doc?.lunch ? safeMeal(doc.lunch) : fallback,
    snacks: doc?.snacks ? safeMeal(doc.snacks) : fallback,
    dinner: doc?.dinner ? safeMeal(doc.dinner) : fallback,
  };
}

// ================= GET =================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") ?? "";
    const date = searchParams.get("date") ?? todayKey();

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    await connectDB();

    const doc = await Intake.findOne({ userId, date }).lean();

    const meals = normalizeMeals(doc);

    // Always compute totals from meals so Nutrition + Dashboard stay in sync.
    const total = {
      calories:
        meals.breakfast.calories +
        meals.lunch.calories +
        meals.snacks.calories +
        meals.dinner.calories,
      protein:
        meals.breakfast.protein +
        meals.lunch.protein +
        meals.snacks.protein +
        meals.dinner.protein,
      carbs:
        meals.breakfast.carbs +
        meals.lunch.carbs +
        meals.snacks.carbs +
        meals.dinner.carbs,
      fat:
        meals.breakfast.fat +
        meals.lunch.fat +
        meals.snacks.fat +
        meals.dinner.fat,
    };

    return NextResponse.json({
      data: meals,
      total,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching intake" },
      { status: 500 }
    );
  }
}

// ================= POST (ADD TO MEAL) =================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userId = body?.userId || "";
    const date = body?.date || todayKey();
    const mealRaw = String(body?.meal ?? "").toLowerCase();
    const meal = (mealRaw as AllowedMeal) || undefined;

    const calories = Math.max(0, Number(body?.calories || 0));
    const protein = Math.max(0, Number(body?.protein || 0));
    const carbs = Math.max(0, Number(body?.carbs || 0));
    const fat = Math.max(0, Number(body?.fat || 0));

    if (!userId || !meal) {
      return NextResponse.json({ message: "Missing userId/meal" }, { status: 400 });
    }
    if (!allowedMeals.includes(meal)) {
      return NextResponse.json({ message: "Invalid meal type" }, { status: 400 });
    }
    if (
      !Number.isFinite(calories) ||
      !Number.isFinite(protein) ||
      !Number.isFinite(carbs) ||
      !Number.isFinite(fat)
    ) {
      return NextResponse.json({ message: "Invalid values" }, { status: 400 });
    }

    if (calories === 0 && protein === 0 && carbs === 0 && fat === 0) {
      return NextResponse.json(
        { message: "Enter a value to add" },
        { status: 400 }
      );
    }

    await connectDB();

    // 🔧 Self-heal for older documents where meal fields were not objects.
    // Example: breakfast: 123 (number) would conflict with breakfast.calories updates.
    const existing = await Intake.findOne({ userId, date }).select(meal).lean();
    const currentMealVal = existing ? (existing as any)[meal] : undefined;
    const isPlainObject =
      currentMealVal != null &&
      typeof currentMealVal === "object" &&
      !Array.isArray(currentMealVal);

    if (existing && !isPlainObject) {
      await Intake.updateOne(
        { userId, date },
        {
          $set: {
            [meal]: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          },
        }
      ).exec();
    }

    const updated = await Intake.findOneAndUpdate(
      { userId, date },
      {
        $inc: {
          [`${meal}.calories`]: calories,
          [`${meal}.protein`]: protein,
          [`${meal}.carbs`]: carbs,
          [`${meal}.fat`]: fat,
        },
        $setOnInsert: {
          userId,
          date,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    const meals = normalizeMeals(updated);
    const total = {
      calories: meals.breakfast.calories + meals.lunch.calories + meals.snacks.calories + meals.dinner.calories,
      protein: meals.breakfast.protein + meals.lunch.protein + meals.snacks.protein + meals.dinner.protein,
      carbs: meals.breakfast.carbs + meals.lunch.carbs + meals.snacks.carbs + meals.dinner.carbs,
      fat: meals.breakfast.fat + meals.lunch.fat + meals.snacks.fat + meals.dinner.fat,
    };

    return NextResponse.json({ message: "Saved", data: meals, total });
  } catch (error) {
    console.error("POST intake error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

// ================= PUT (EDIT MEAL OR TOTALS) =================
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const userId = body?.userId;
    const date = body?.date || todayKey();
    const meal = body?.meal;

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    // Parse values
    const calories = Math.max(0, Number(body?.calories || 0));
    const protein = Math.max(0, Number(body?.protein || 0));
    const carbs = Math.max(0, Number(body?.carbs || 0));
    const fat = Math.max(0, Number(body?.fat || 0));

    await connectDB();

    let updateObj: any = { userId, date };

    if (meal) {
      // Meal edit: set exact meal values
      updateObj[`${meal}.calories`] = calories;
      updateObj[`${meal}.protein`] = protein;
      updateObj[`${meal}.carbs`] = carbs;
      updateObj[`${meal}.fat`] = fat;
    } else {
      // Totals edit: set top-level totals
      updateObj.caloriesConsumed = calories;
      updateObj.proteinConsumed = protein;
      updateObj.carbsConsumed = carbs;
      updateObj.fatConsumed = fat;
    }

    const updated = await Intake.findOneAndUpdate(
      { userId, date },
      { $set: updateObj },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({
      message: "Updated",
      data: updated,
    });
  } catch (error) {
    console.error("PUT intake error:", error);
    return NextResponse.json(
      { message: "Error updating intake" },
      { status: 500 }
    );
  }
}
