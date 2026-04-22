const workoutRows = [
  { time: "7:12 am", active: true },
  { time: "7:44 am", active: false },
  { time: "7:48 am", active: true },
  { time: "7:52 am", active: false },
  { time: "7:56 am", active: true },
  { time: "7:57 am", active: false },
];

const statCards = [
  { label: "Total volume", value: "55", color: "bg-sky-500" },
  { label: "Sessions", value: "6.71K", color: "bg-violet-500" },
  { label: "Goal rate", value: "0.8%", color: "bg-emerald-500" },
  { label: "Avg. split", value: "51.8", color: "bg-orange-500" },
];

export function PhoneMockup() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[34rem]">
      <div className="absolute inset-x-6 top-10 h-44 rounded-full bg-brand/18 blur-[90px]" />
      <div className="absolute -right-6 top-0 h-32 w-32 rounded-full bg-brand/15 blur-[90px]" />

      <div className="relative rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(17,24,19,0.95),rgba(8,11,9,0.98))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-x-8 top-3 h-6 rounded-full bg-white/[0.03] blur-xl" />
        <div className="grid gap-5 rounded-[28px] border border-white/7 bg-[radial-gradient(circle_at_top,rgba(44,230,109,0.12),transparent_38%),linear-gradient(180deg,#0d1611_0%,#09110c_100%)] p-5 sm:grid-cols-[0.62fr_0.38fr]">
          <div className="rounded-[24px] border border-white/6 bg-black/20 p-4">
            <div className="mx-auto h-1.5 w-20 rounded-full bg-white/12" />
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.24em] text-brand">
                Today
              </span>
              <span className="text-[0.7rem] font-medium text-white/45">
                6 workouts
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {workoutRows.map((row) => (
                <div
                  key={row.time}
                  className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-3 py-2.5"
                >
                  <span className="font-brand text-2xl tracking-[-0.05em] text-white/88">
                    {row.time}
                  </span>
                  <span
                    className={`relative h-6 w-11 rounded-full border ${
                      row.active
                        ? "border-brand/40 bg-brand/30"
                        : "border-white/10 bg-white/[0.06]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-[18px] w-[18px] rounded-full ${
                        row.active
                          ? "left-[1.35rem] bg-brand shadow-[0_0_16px_rgba(44,230,109,0.5)]"
                          : "left-0.5 bg-white/75"
                      }`}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-[24px] border border-white/6 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                Weekly streak
              </p>
              <p className="mt-4 font-brand text-5xl tracking-[-0.06em] text-brand">
                12
              </p>
              <div className="mt-4 flex gap-2">
                {Array.from({ length: 7 }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-9 flex-1 rounded-full ${
                      index < 5 ? "bg-brand/75" : "bg-white/[0.08]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/6 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                Focus split
              </p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Strength", width: "78%" },
                  { label: "Cardio", width: "52%" },
                  { label: "Mobility", width: "33%" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/50">
                      <span>{item.label}</span>
                      <span>{item.width}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#2ce66d,#8dffb1)]"
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardMockup() {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(248,249,247,0.96),rgba(225,230,225,0.92))] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:p-6"
    >
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(5,8,5,0.72))]" />
      <div className="rounded-[28px] bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          {["Search type: Web", "Date: Last 3 months", "+ New"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
            >
              {item}
            </span>
          ))}
          <span className="ml-auto text-xs font-medium text-slate-400">
            Updated 5 hours ago
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`rounded-[22px] ${card.color} p-4 text-white shadow-lg`}
            >
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/80">
                {card.label}
              </p>
              <p className="mt-4 font-brand text-4xl tracking-[-0.05em]">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#f9faf9,#eef3ef)] p-4">
          <svg
            className="h-[17rem] w-full text-slate-300 sm:h-[24rem]"
            fill="none"
            viewBox="0 0 720 320"
          >
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
            </defs>
            {Array.from({ length: 5 }).map((_, index) => (
              <line
                key={index}
                x1="0"
                x2="720"
                y1={40 + index * 56}
                y2={40 + index * 56}
                stroke="currentColor"
                strokeDasharray="6 10"
              />
            ))}
            {Array.from({ length: 8 }).map((_, index) => (
              <line
                key={index}
                x1={48 + index * 86}
                x2={48 + index * 86}
                y1="10"
                y2="300"
                stroke="currentColor"
                strokeDasharray="6 10"
              />
            ))}
            <path
              d="M40 255C84 198 122 214 166 144C210 74 248 252 292 172C336 91 374 196 418 158C462 120 500 168 544 128C588 88 626 172 680 72"
              fill="none"
              stroke="#6d28d9"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
            <path
              d="M40 278C84 182 122 240 166 102C210 248 248 204 292 150C336 201 374 178 418 188C462 198 500 160 544 166C588 172 626 138 680 112"
              fill="none"
              stroke="#f97316"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
            <path
              d="M40 286C84 252 122 266 166 178C210 236 248 228 292 248C336 197 374 244 418 182C462 214 500 186 544 206C588 226 626 142 680 134"
              fill="none"
              stroke="#0ea5e9"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
            <path
              d="M40 294C84 286 122 276 166 232C210 248 248 256 292 214C336 204 374 198 418 212C462 178 500 184 544 166C588 148 626 124 680 86"
              fill="url(#area)"
              opacity="0.8"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
