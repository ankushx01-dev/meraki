import {
  BoltIcon,
  CalendarIcon,
  PaletteIcon,
  PulseIcon,
  SparkIcon,
  TargetIcon,
  TrendIcon,
} from "@/components/home/icons";

export type FeatureCard = {
  title: string;
  description: string;
  icon: typeof PulseIcon;
};

export type StatItem = {
  value: string;
  label: string;
};

export type PricingTier = {
  name: string;
  description: string;
  price: string;
  featured?: boolean;
  features: string[];
};

export type BenefitCard = {
  title: string;
  description: string;
  icon: typeof BoltIcon;
};

export type FooterLinkGroup = {
  title: string;
  links: Array<{
    label: string;
    href: string | null;
  }>;
};

export const navigationLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export const featureCards: FeatureCard[] = [
  {
    title: "Workout Tracking",
    description:
      "Log exercises, sets, reps, and weight with a calm interface that keeps your flow intact from warm-up to final set.",
    icon: PulseIcon,
  },
  {
    title: "Progress Analytics",
    description:
      "Visualize strength gains and trends over time with dashboards that are quick to scan and easy to act on.",
    icon: TrendIcon,
  },
  {
    title: "Smart Suggestions",
    description:
      "See useful recommendations shaped by your training history, recovery rhythm, and the habits you want to keep building.",
    icon: SparkIcon,
  },
  {
    title: "Goal Setting",
    description:
      "Set milestones, track streaks, and keep your next target visible so your plan always feels within reach.",
    icon: TargetIcon,
  },
];

export const statItems: StatItem[] = [
  { value: "10K+", label: "Active users" },
  { value: "500K+", label: "Workouts logged" },
  { value: "4.9/5", label: "User rating" },
];

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    description: "Get users hooked with core tracking",
    price: "₹0",
    features: [
      "5 workouts per month",
      "Basic dashboard (Today view)",
      "Simple progress with numbers only",
      "Manual workout logging",
      "No charts or history insights",
    ],
  },
  {
    name: "Pro",
    description: "Main revenue plan for committed users",
    price: "₹199",
    featured: true,
    features: [
      "Unlimited workout tracking",
      "Full progress dashboard with charts and trends",
      "Calendar-based workout planning",
      "Smart workout suggestions",
      "Workout history with filter and search",
      "Streak tracking",
    ],
  },
  {
    name: "Elite",
    description: "Premium coaching-style experience",
    price: "₹499",
    features: [
      "Everything in Pro",
      "Nutrition tracking with calories and macros",
      "AI insights and consistency feedback",
      "Advanced analytics and muscle-group tracking",
      "Weekly performance score",
      "Personalized plans",
      "Priority support",
    ],
  },
];

export const benefitCards: BenefitCard[] = [
  {
    title: "Easy to use",
    description:
      "An intuitive experience that lets anyone get started in minutes. No learning curve, just momentum.",
    icon: BoltIcon,
  },
  {
    title: "Clean design",
    description:
      "A focused interface with room to breathe, so your data supports your goals instead of overwhelming them.",
    icon: PaletteIcon,
  },
  {
    title: "Build consistency",
    description:
      "Smart reminders, visible streaks, and gentle accountability to help fitness become part of your routine.",
    icon: CalendarIcon,
  },
];

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Start for Free", href: "/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: null },
      { label: "Blog", href: null },
      { label: "Careers", href: null },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: null },
      { label: "Terms", href: null },
      { label: "Cookies", href: null },
    ],
  },
];
