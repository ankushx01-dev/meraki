import Image from "next/image";

type MerakiLogoImageProps = {
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export function MerakiLogoImage({
  width,
  height,
  className = "",
  priority,
}: MerakiLogoImageProps) {
  return (
    <Image
      src="/logo.png"
      alt="Meraki logo"
      width={width}
      height={height}
      priority={priority}
      className={`meraki-logo object-contain transition duration-300 hover:scale-110 hover:rotate-6 ${className}`}
    />
  );
}
