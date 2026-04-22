import type { SVGProps } from "react";

function iconClassName(className?: string) {
  return className ? className : "h-5 w-5";
}

type IconProps = SVGProps<SVGSVGElement>;

export function MerakiLogoMark({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M6.5 8.5h5.5v7H6.5zM12 8.5h5.5V12H12zM12 12h5.5v3.5H12z"
        fill="currentColor"
        opacity="0.28"
      />
      <path
        d="M6.5 6.75h11a1.75 1.75 0 0 1 1.75 1.75v7a1.75 1.75 0 0 1-1.75 1.75h-11a1.75 1.75 0 0 1-1.75-1.75v-7A1.75 1.75 0 0 1 6.5 6.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="m8.4 12 1.5 1.75 2.1-3.2 1.7 2.2 1.9-2.65"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function ArrowRightIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M5 12h14m-5.5-5.5L19 12l-5.5 5.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
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

export function CheckIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="m5.5 12.5 4 4L18.5 7.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function PulseIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M3.5 12h4.2l2.05-4 4.1 8 2.1-4h4.55"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function TrendIcon({ className, ...props }: IconProps) {
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

export function SparkIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="m18.75 14.25.75 2.25 2.25.75-2.25.75-.75 2.25-.75-2.25-2.25-.75 2.25-.75.75-2.25ZM5.25 14.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TargetIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="7.25" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function BoltIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M12.8 3.5 6.75 12H11l-.8 8.5L17.25 12H13l-.2-8.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function PaletteIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M12 4.5c-4.42 0-8 3.13-8 7 0 1.95 1.82 3.5 4.08 3.5h1.28c.75 0 1.36.53 1.36 1.18v.57c0 1.52 1.42 2.75 3.17 2.75 3.37 0 6.11-2.38 6.11-5.32 0-5.41-3.58-9.68-8-9.68Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <circle cx="8.5" cy="10" r="1.05" fill="currentColor" />
      <circle cx="12" cy="8.5" r="1.05" fill="currentColor" />
      <circle cx="15.5" cy="10.25" r="1.05" fill="currentColor" />
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
      <rect
        width="14"
        height="13"
        x="5"
        y="6"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
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

export function GitHubIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M9 19.25c-3.75 1.1-3.75-2.1-5.25-2.45m10.5 4.9v-2.85c0-.82.08-1.43-.35-2.1 1.42-.16 2.92-.7 2.92-3.18 0-.72-.24-1.32-.67-1.8.11-.28.31-1.04-.07-2.17 0 0-.57-.18-1.88.69a6.35 6.35 0 0 0-3.5 0c-1.31-.87-1.88-.69-1.88-.69-.38 1.13-.18 1.89-.07 2.17-.43.48-.67 1.08-.67 1.8 0 2.46 1.49 3.03 2.91 3.19-.35.55-.43 1.08-.43 1.75v3.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M12 3.75a8.25 8.25 0 0 0-2.61 16.08"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M12 3.75a8.25 8.25 0 0 1 2.61 16.08"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function LinkedInIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <rect
        x="4.5"
        y="4.5"
        width="15"
        height="15"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8.5 10.25v5.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M8.5 8.35a.85.85 0 1 1 0 1.7.85.85 0 0 1 0-1.7Z"
        fill="currentColor"
      />
      <path
        d="M12.5 15.5v-3.25c0-1 .8-1.75 1.8-1.75s1.7.75 1.7 1.75v3.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M12.5 10.25v5.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function TwitterIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={iconClassName(className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="m6 5.5 12 13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="m18 5.5-12 13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M7.35 5.5H11l5.65 13H13z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}
