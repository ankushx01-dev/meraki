import { CheckCircleIcon } from "@/components/dashboard/icons";
import { PageIntro, Panel, cx } from "@/components/dashboard/ui";
import { PlanCheckoutButton } from "@/components/payments/plan-checkout-button";
import { planTiers } from "@/data/dashboard-content";

export default function PlansPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        title="Plans"
        description="Choose a plan that matches your training goals and unlock more insights."
      />

      <Panel className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-medium uppercase tracking-[0.18em] text-[#8fb4ff]">
          Current plan: Free Plan
        </p>
      </Panel>

      <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-3">
        {planTiers.map((tier) => (
          <Panel
            key={tier.name}
            className={cx(
              "flex h-full flex-col p-7",
              tier.featured &&
                "bg-[linear-gradient(180deg,rgba(255,77,79,0.12),rgba(17,22,18,1))] ring-[#ff4d4f]/30 xl:-translate-y-1",
            )}
          >
            {tier.featured ? (
              <span className="inline-flex w-fit rounded-full bg-[#ff4d4f] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                Most Popular
              </span>
            ) : null}
            <h2 className="mt-4 font-brand text-3xl tracking-[-0.04em] text-white">
              {tier.name}
            </h2>
            <p className="mt-2 text-sm text-[#8fb4ff]">{tier.detail}</p>
            <div className="mt-5 flex items-end gap-1">
              <span className="font-brand text-6xl tracking-[-0.06em] text-white">
                {tier.price}
              </span>
              <span className="pb-2 text-sm text-[#7f8c83]">/month</span>
            </div>

            <ul className="mt-6 space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-[#c5d1e8]">
                  <span className="mt-0.5 text-[#29d16d]">
                    <CheckCircleIcon className="h-4 w-4" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <PlanCheckoutButton
              planId={tier.name}
              className={cx(
                "mt-8 inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold",
                tier.featured
                  ? "bg-[#ff4345] text-white shadow-[0_18px_34px_rgba(255,67,69,0.28)] hover:bg-[#ff595b]"
                  : "bg-white/[0.03] text-white ring-1 ring-white/10 hover:bg-white/[0.06]",
              )}
            >
              {tier.featured ? "Upgrade Now" : "Select Plan"}
            </PlanCheckoutButton>
          </Panel>
        ))}
      </div>
    </div>
  );
}
