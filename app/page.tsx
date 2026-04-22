import Link from "next/link";
import { HomepageAnalyticsShowcase } from "@/components/home/homepage-analytics-showcase";
import { MerakiLogoImage } from "@/components/meraki-logo-image";
import {
  ArrowRightIcon,
  CheckIcon,
  GitHubIcon,
  LinkedInIcon,
} from "@/components/home/icons";
import { PlanCheckoutButton } from "@/components/payments/plan-checkout-button";
import {
  featureCards,
  pricingTiers,
  statItems,
} from "@/data/homepage-content";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/ankushx01-dev",
    icon: GitHubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ankush-rana-x01",
    icon: LinkedInIcon,
  },
];

export default function Home() {
  const primaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_48px_rgba(239,68,68,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-[0_0_24px_rgba(248,113,113,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950";
  const secondaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-6 py-3.5 text-sm font-semibold text-white/85 shadow-[0_0_0_rgba(239,68,68,0)] transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/40 hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950";
  const sectionLabelClass =
    "text-sm font-medium uppercase tracking-[0.3em] text-red-300";

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-50 border-b border-red-500/10 bg-neutral-950/90 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-4 px-6 py-4 lg:grid-cols-[auto_1fr_auto]">
          <Link
            href="/"
            className="inline-flex items-center gap-3 self-start transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 md:self-center"
          >
            <MerakiLogoImage width={50} height={62} priority />
            <span className="font-serif-heading text-xl font-semibold tracking-[-0.03em] text-white">
              Meraki
            </span>
          </Link>

          <nav className="hidden items-center justify-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-serif-heading text-white/70 transition-all duration-300 hover:text-red-300"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-serif-heading text-white/70 transition-all duration-300 hover:text-red-300"
            >
              Pricing
            </a>
            <a
              href="#resources"
              className="text-sm font-serif-heading text-white/70 transition-all duration-300 hover:text-red-300"
            >
              Resources
            </a>
          </nav>

          <div className="flex items-center justify-end gap-3 self-start md:self-center">
            <Link
              href="/login?tab=login"
              className="text-sm font-serif-heading text-white/70 transition-all duration-300 hover:text-red-300"
            >
              Log in
            </Link>
            <Link
              href="/signup?tab=signup"
              className={`${primaryButtonClass} font-serif-heading`}
            >
              Start for free
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-screen overflow-hidden border-b border-red-500/10">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          >
            <source src="/demo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.16),_transparent_42%)]" />

          <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20">
            <div className="w-full max-w-3xl">
              <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-red-200 shadow-[0_12px_30px_rgba(239,68,68,0.12)]">
                Trusted by athletes worldwide
              </span>
              <h1 className="mt-8 text-5xl font-bold tracking-[-0.06em] text-white sm:text-6xl">
                Train with focus.
                <span className="block text-red-500">Track with precision.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
                Meraki brings your workouts, progress, nutrition, and AI-guided
                coaching into one polished system built to keep serious
                athletes consistent.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/dashboard" className={primaryButtonClass}>
                  Explore the dashboard
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link href="/login?tab=login" className={secondaryButtonClass}>
                  Log in
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {statItems.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[24px] border border-red-500/10 bg-neutral-900/75 px-5 py-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.12)]"
                  >
                    <p className="text-3xl font-semibold text-white">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="border-b border-red-500/10 bg-neutral-950 py-24 sm:py-28"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className={sectionLabelClass}>Everything you need to succeed</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
                Premium tools built for your strongest season.
              </h2>
              <p className="mt-4 text-base leading-8 text-white/60">
                From polished logging to AI guidance, every touchpoint is
                tuned to feel fast, focused, and motivating.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featureCards.map((feature) => (
                <article
                  key={feature.title}
                  className="group rounded-[28px] border border-red-500/10 bg-neutral-900/80 p-6 shadow-[0_18px_52px_rgba(0,0,0,0.22)] transition-all duration-300 hover:scale-105 hover:border-red-500/40 hover:bg-[linear-gradient(180deg,rgba(23,23,23,0.95),rgba(127,29,29,0.18))] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-red-500/10 bg-red-500/10 text-red-400 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.12)] transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-red-500/15">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-red-500/10 bg-neutral-950 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className={sectionLabelClass}>Performance Analytics</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
                Progress and coaching, in one clean view.
              </h2>
              <p className="mt-4 text-base leading-8 text-white/70">
                Preview how Meraki combines visual training trends with
                structured AI feedback in a focused, modern layout.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-6xl">
              <HomepageAnalyticsShowcase />
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="border-b border-red-500/10 bg-neutral-950 py-24 sm:py-28"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className={sectionLabelClass}>Simple, transparent pricing</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
                Choose the plan that matches your ambition.
              </h2>
              <p className="mt-4 text-base leading-8 text-white/70">
                Start free, upgrade when you want deeper insights, smarter
                coaching, and a more tailored performance experience.
              </p>
            </div>

            <div className="mx-auto mt-16 grid w-full max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pricingTiers.map((tier) => (
                <article
                  key={tier.name}
                  className={`relative flex h-full flex-col rounded-[32px] border px-7 py-8 shadow-[0_20px_80px_rgba(0,0,0,0.24)] transition-all duration-300 hover:scale-105 hover:border-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] ${
                    tier.featured
                      ? "premium-pulse border-red-500 bg-neutral-900 shadow-[0_0_25px_rgba(239,68,68,0.3)] lg:-translate-y-2"
                      : "border-red-500/10 bg-neutral-900/75"
                  }`}
                >
                  {tier.featured ? (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-white shadow-[0_10px_30px_rgba(239,68,68,0.35)]">
                      Most Popular
                    </span>
                  ) : null}

                  <div className="flex min-h-[8.5rem] flex-col">
                    <h3 className="font-brand text-3xl tracking-[-0.04em] text-white">
                      {tier.name}
                    </h3>
                    <p className="mt-2 text-sm text-white/60">
                      {tier.description}
                    </p>
                    <div className="mt-6 flex items-end gap-1">
                      <span className="font-brand text-6xl tracking-[-0.06em] text-white">
                        {tier.price}
                      </span>
                      <span className="pb-2 text-sm text-white/40">/month</span>
                    </div>
                  </div>

                  <ul className="mt-8 space-y-3 text-sm text-white/70">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                          <CheckIcon className="h-3.5 w-3.5" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <PlanCheckoutButton
                    planId={tier.name}
                    className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                      tier.featured
                        ? "bg-red-500 text-white shadow-[0_16px_36px_rgba(239,68,68,0.28)] hover:bg-red-700"
                        : "border border-red-500/20 bg-red-500/5 text-white/90 hover:bg-red-500/10"
                    }`}
                  >
                    {tier.featured
                      ? "Start Pro Trial"
                      : tier.name === "Free"
                        ? "Start Free"
                        : "Go Elite"}
                  </PlanCheckoutButton>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="resources" className="bg-neutral-950 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-[32px] border border-red-500/10 bg-neutral-900/80 px-8 py-12 shadow-[0_24px_90px_rgba(0,0,0,0.24)] sm:px-12 sm:py-16">
              <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:gap-0">
                <div className="max-w-2xl text-center lg:text-left">
                  <p className={sectionLabelClass}>Start your fitness journey today</p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                    Build a stronger system for your workouts, nutrition, and
                    consistency.
                  </h2>
                </div>
                <Link href="/signup" className={primaryButtonClass}>
                  Get started for free
                </Link>
              </div>
              <p className="mt-6 text-center text-sm text-white/50 lg:text-left">
                No credit card required · Free forever plan available.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-red-500/10 bg-neutral-950 py-10 text-white/70">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col gap-8 rounded-[28px] border border-red-500/10 bg-neutral-900/70 px-6 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.2)] lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 text-white transition-all duration-300 hover:text-red-200"
                >
                  <span className="rounded-[1.25rem] border border-red-500/15 bg-neutral-900/80 p-2 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                    <MerakiLogoImage width={40} height={50} />
                  </span>
                  <span>
                    <span className="block text-lg font-semibold">Meraki</span>
                    <span className="block text-sm text-white/50">
                      Premium fitness guidance for consistent performance.
                    </span>
                  </span>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-neutral-900/80 px-4 py-2 text-sm font-medium text-white/70 shadow-[0_0_0_rgba(239,68,68,0)] transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/40 hover:text-red-300 hover:shadow-[0_0_18px_rgba(239,68,68,0.18)]"
                  >
                    <social.icon className="h-5 w-5" />
                    <span>{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-red-500/10 pt-6 text-sm text-neutral-400">
              <span>Crafted with ❤️ by</span>
              <span className="inline-flex rounded-full px-3 py-1 font-medium text-white transition-all duration-300 hover:text-red-400 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                Ankush Rana
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
