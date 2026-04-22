import type { ReactNode } from "react";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-[28px] bg-[linear-gradient(180deg,#121814_0%,#0d120f_100%)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.26)] ring-1 ring-white/8 backdrop-blur-sm sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageIntro({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <h1 className="font-brand text-4xl tracking-[-0.05em] text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[#8fb4ff] sm:text-base">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export function MetricCard({
  icon,
  label,
  value,
  detail,
  accent = "red",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  accent?: "red" | "green";
}) {
  const accentClasses =
    accent === "green"
      ? "bg-[#143523] text-[#2ad16f]"
      : "bg-[#2d1817] text-[#ff595b]";

  return (
    <Panel className="min-h-[8.75rem]">
      <div className={cx("inline-flex rounded-2xl p-3", accentClasses)}>{icon}</div>
      <p className="mt-5 text-sm text-[#8fb4ff]">{label}</p>
      <p className="mt-1 font-brand text-3xl tracking-[-0.04em] text-white">
        {value}
      </p>
      <p className="mt-1 text-sm text-[#7f8c83]">{detail}</p>
    </Panel>
  );
}

export function Toggle({
  enabled,
  label,
  description,
}: {
  enabled: boolean;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] bg-white/[0.025] px-4 py-4">
      <div className="min-w-0">
        <p className="font-semibold text-white">{label}</p>
        <p className="mt-1 text-sm text-[#8aa0cf]">{description}</p>
      </div>
      <button
        type="button"
        aria-pressed={enabled}
        className={cx(
          "relative inline-flex h-5 w-11 shrink-0 items-center rounded-full transition-transform",
          enabled ? "bg-[#ff4d4f]" : "bg-white/20",
        )}
      >
        <span
          className={cx(
            "inline-block h-4 w-4 rounded-full bg-white transition-transform",
            enabled ? "translate-x-6" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}
