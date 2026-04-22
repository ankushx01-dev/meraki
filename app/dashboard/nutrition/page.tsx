import type { Metadata } from "next";
import { PageIntro } from "@/components/dashboard/ui";
import { NutritionLogger } from "@/components/nutrition/nutrition-logger";

export const metadata = {
  title: "Nutrition",
};

export default function NutritionPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        title="Nutrition"
        description="Log what you eat and track progress against your targets."
      />
      <NutritionLogger />
    </div>
  );
}

