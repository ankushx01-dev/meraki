type SectionHeadingProps = {
  title: string;
  accent: string;
  description: string;
  align?: "center" | "left";
};

export function SectionHeading({
  title,
  accent,
  description,
  align = "left",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-4 ${
        centered ? "items-center text-center" : "items-start text-left"
      }`}
    >
      <h2 className="font-brand text-4xl leading-[0.98] tracking-[-0.05em] text-balance text-foreground sm:text-5xl lg:text-6xl">
        <span className="block">{title}</span>
        <span className="block text-brand">{accent}</span>
      </h2>
      <p className="max-w-2xl text-pretty text-sm leading-7 text-muted sm:text-base">
        {description}
      </p>
    </div>
  );
}
