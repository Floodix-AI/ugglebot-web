import { UgglyOwl } from "../icons/UgglyOwl";

interface UgglyLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "color" | "light" | "dark";
  onDark?: boolean;
  showWordmark?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 28, text: "text-lg" },
  md: { icon: 40, text: "text-2xl" },
  lg: { icon: 64, text: "text-4xl" },
};

export function UgglyLogo({
  size = "md",
  variant = "color",
  onDark = false,
  showWordmark = true,
  className = "",
}: UgglyLogoProps) {
  const { icon, text } = sizeMap[size];

  const textColor = onDark ? "text-white" : "text-night-900";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <UgglyOwl size={icon} variant={variant} />
      {showWordmark && (
        <span
          className={`font-heading font-extrabold tracking-tight ${text} ${textColor}`}
        >
          Uggly
        </span>
      )}
    </span>
  );
}
