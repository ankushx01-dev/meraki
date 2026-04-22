import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function iconClassName(className?: string) {
  return className ?? "h-5 w-5";
}

export function MerakiAppLogo({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path
        d="M5.25 12h3.2l1.45-4.1 3.2 8.2 1.9-5.1h3.75"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function DashboardIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function WorkoutsIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M7.5 8.5 10 11m4 4 2.5 2.5M6 6l2 2m8 8 2 2m-7.5-1.5 3-3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M4.5 9.5 8 6l3 3-3.5 3.5-3-3Zm9 9L17 15l3 3-3.5 3.5-3-3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function ProgressIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M4.5 16.5 9 12l3 3 7-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M14.5 8H19v4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function PlansIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <rect x="4" y="6" width="16" height="12" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 10.5h16" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function ProfileIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M6.5 19c.6-3.1 2.9-4.7 5.5-4.7s4.9 1.6 5.5 4.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function CalendarIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <rect x="5" y="6" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M8 4.5V8m8-3.5V8M5 10.5h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function TrendUpIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M5 15.5 10 10.5l3.2 3.2 5.8-6.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M14.5 7.5H19V12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function FlameIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M12 3.8c.3 2.7-1.6 4-2.8 5.5-1 1.3-1.7 2.5-1.7 4.3a4.5 4.5 0 0 0 9 0c0-2.4-1.1-3.8-2.2-5.2-1.2-1.6-2.3-2.8-2.3-4.6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function GoalIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="7.25" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function PlusIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

export function PlayIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M8.25 7.6c0-1 1.1-1.63 1.98-1.1l7.06 4.4a1.3 1.3 0 0 1 0 2.2l-7.06 4.4c-.89.54-1.98-.09-1.98-1.1Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function SaveIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M6 5.5h9.4L18.5 8v10.5a1.5 1.5 0 0 1-1.5 1.5h-11a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 6 5.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path d="M8 5.5v5h6v-5M8 18h8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

export function TrashIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M5.5 7.5h13M9.5 7.5V5.75h5V7.5m-7.5 0 .7 10.3A1.5 1.5 0 0 0 9.2 19h5.6a1.5 1.5 0 0 0 1.5-1.2L17 7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M10 10.5v5M14 10.5v5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

export function TrophyIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M8 4.5h8v2.25A4 4 0 0 1 12 10.75a4 4 0 0 1-4-4V4.5Zm4 6.25v4.25m-3 3h6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M8 6.5H5.75A1.75 1.75 0 0 0 4 8.25c0 1.7 1.3 3.25 3.75 3.25M16 6.5h2.25A1.75 1.75 0 0 1 20 8.25c0 1.7-1.3 3.25-3.75 3.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function SettingsIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="m12 4 1 2.1 2.3.3.8 2.1 2 1.2-.7 2.2.7 2.2-2 1.2-.8 2.1-2.3.3L12 20l-2.1-1-2.3-.3-.8-2.1-2-1.2.7-2.2-.7-2.2 2-1.2.8-2.1 2.3-.3L12 4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function CheckCircleIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path d="m8.5 12.5 2.3 2.4 4.8-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function HelpIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M9.85 9.3a2.44 2.44 0 1 1 3.7 2.1c-.93.56-1.55 1.08-1.55 2.35m0 2.4h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function CalculatorIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <rect
        x="5"
        y="3.75"
        width="14"
        height="16.5"
        rx="2.25"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <rect
        x="8"
        y="6.75"
        width="8"
        height="3"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M8.5 13h.01M12 13h.01m3.49 0h.01M8.5 16.5h.01M12 16.5h.01m3.49 0h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

export function MenuIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M3 12h18M3 6h18M3 18h18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
