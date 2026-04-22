export function FitnessVisual() {
  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-[#0d1313] lg:flex lg:items-center lg:justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(34,197,94,0.18),transparent_25%),radial-gradient(circle_at_82%_16%,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_50%_78%,rgba(34,197,94,0.12),transparent_28%),linear-gradient(180deg,#131b18_0%,#0d1313_100%)]" />
      <div className="absolute -left-24 top-18 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-brand/12 blur-3xl" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative z-10 flex h-full w-full max-w-[48rem] items-center justify-center px-10 py-12 xl:px-14">
        <div className="relative w-full overflow-hidden rounded-[40px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-8 py-10 shadow-[0_30px_100px_rgba(0,0,0,0.38)]">
          <div className="absolute left-1/2 top-12 h-56 w-56 -translate-x-1/2 rounded-full border border-white/10 bg-brand/12 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <span className="rounded-full bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
              Meraki Performance
            </span>
            <div className="rounded-full bg-white/8 px-4 py-2 text-xs font-semibold text-white/75">
              Stronger every session
            </div>
          </div>

          <div className="relative mt-8">
            <svg
              aria-hidden="true"
              className="mx-auto h-[36rem] w-full max-w-[34rem]"
              fill="none"
              viewBox="0 0 560 760"
            >
              <defs>
                <linearGradient id="runnerAccent" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
                <linearGradient id="runnerShade" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#eef2f1" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#d1d8d6" stopOpacity="0.35" />
                </linearGradient>
              </defs>

              <ellipse
                cx="280"
                cy="352"
                rx="170"
                ry="248"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="2"
              />
              <ellipse
                cx="280"
                cy="352"
                rx="214"
                ry="308"
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="12 20"
                strokeWidth="2"
              />

              <path
                d="M114 576C164 525 190 476 218 384"
                stroke="rgba(255,255,255,0.24)"
                strokeLinecap="round"
                strokeWidth="12"
              />
              <path
                d="M444 214C385 232 340 226 284 194"
                stroke="rgba(255,255,255,0.18)"
                strokeLinecap="round"
                strokeWidth="10"
              />
              <path
                d="M228 240C254 216 290 206 328 214"
                stroke="url(#runnerAccent)"
                strokeLinecap="round"
                strokeWidth="8"
              />
              <path
                d="M250 194c20-20 57-25 82-3"
                stroke="rgba(255,255,255,0.18)"
                strokeLinecap="round"
                strokeWidth="8"
              />

              <circle cx="304" cy="140" r="42" fill="#0a0f0e" />
              <circle
                cx="304"
                cy="140"
                r="42"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="2"
              />

              <path
                d="M285 188c25-20 64-10 77 18l16 38c8 19-2 41-22 48l-52 19c-21 8-45-3-53-24l-15-39c-8-19 0-40 18-52l31-10Z"
                fill="url(#runnerAccent)"
              />
              <path
                d="M236 250c12-15 29-26 47-31l26 68-40 15c-21 8-45-3-53-24l-8-21c5-2 14-4 28-7Z"
                fill="#ef4444"
                opacity="0.88"
              />

              <path
                d="M360 248 468 210"
                stroke="#101716"
                strokeLinecap="round"
                strokeWidth="24"
              />
              <path
                d="M468 210 520 178"
                stroke="#101716"
                strokeLinecap="round"
                strokeWidth="22"
              />
              <path
                d="M352 246 452 236"
                stroke="url(#runnerShade)"
                strokeLinecap="round"
                strokeOpacity="0.2"
                strokeWidth="2"
              />
              <path
                d="M254 272 168 354"
                stroke="#101716"
                strokeLinecap="round"
                strokeWidth="22"
              />
              <path
                d="M172 352 148 432"
                stroke="#101716"
                strokeLinecap="round"
                strokeWidth="20"
              />

              <path
                d="M297 312 238 436"
                stroke="#060b0a"
                strokeLinecap="round"
                strokeWidth="30"
              />
              <path
                d="M238 436 204 610"
                stroke="#060b0a"
                strokeLinecap="round"
                strokeWidth="30"
              />
              <path
                d="M308 314 364 452"
                stroke="#060b0a"
                strokeLinecap="round"
                strokeWidth="28"
              />
              <path
                d="M364 452 456 590"
                stroke="#060b0a"
                strokeLinecap="round"
                strokeWidth="28"
              />

              <path
                d="M176 604c18-20 53-28 82-18 24 8 39 28 42 46-30 18-89 22-130 6 0-12 1-22 6-34Z"
                fill="#f8fafc"
              />
              <path
                d="M432 586c25-10 57-7 78 9 15 11 24 28 22 44-34 11-86 3-124-20 3-12 11-23 24-33Z"
                fill="#f8fafc"
              />

              <path
                d="M176 618c28 11 76 13 118 1"
                stroke="#101716"
                strokeLinecap="round"
                strokeWidth="7"
              />
              <path
                d="M438 602c24 13 58 20 88 16"
                stroke="#101716"
                strokeLinecap="round"
                strokeWidth="7"
              />

              <path
                d="M197 609c12-5 29-6 40-2"
                stroke="#22c55e"
                strokeLinecap="round"
                strokeWidth="6"
              />
              <path
                d="M474 590c12-6 25-8 36-6"
                stroke="#ef4444"
                strokeLinecap="round"
                strokeWidth="6"
              />

              <path
                d="M106 664c68 18 271 28 360 0"
                stroke="rgba(255,255,255,0.14)"
                strokeLinecap="round"
                strokeWidth="4"
              />
            </svg>
          </div>

          <div className="relative mt-2 grid gap-4 sm:grid-cols-3">
            {[
              { value: "+18%", label: "Workout consistency" },
              { value: "4.9/5", label: "Member satisfaction" },
              { value: "24/7", label: "Progress visibility" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] bg-white/6 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              >
                <p className="font-brand text-3xl tracking-[-0.05em] text-white">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-white/65">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
