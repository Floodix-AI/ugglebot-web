import Image from "next/image";

interface UgglyOwlProps {
  size?: number;
  variant?: "color" | "light" | "dark";
  className?: string;
}

const filterMap = {
  color: undefined,
  light: "brightness(0) invert(1)",
  dark: "brightness(0) opacity(0.8)",
};

export function UgglyOwl({
  size = 48,
  variant = "color",
  className = "",
}: UgglyOwlProps) {
  const filter = filterMap[variant];

  return (
    <Image
      src="/uggly-icon-brown.svg"
      alt="Uggly"
      width={size}
      height={size}
      className={className}
      style={filter ? { filter } : undefined}
      priority
    />
  );
}
