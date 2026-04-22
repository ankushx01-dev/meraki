import type { Metadata } from "next";
import { CaloriePlanner } from "@/components/calculator/calorie-planner";
import { PageIntro } from "@/components/dashboard/ui";

export const metadata: Metadata = {
  title: "Calorie Calculator",
  description:
    "Calculate calories and macros for weight loss, maintenance, or weight gain inside Meraki.",
};

export default function CalculatorPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        title="Calorie Calculator"
        description="Set a realistic calorie and macro target based on your body metrics, activity level, and training goal."
      />

      <CaloriePlanner />
    </div>
  );
}
