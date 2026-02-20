import { type ReactNode } from "react";

interface BadgeProps {
  variant?: "success" | "warning" | "error" | "neutral" | "info";
  children: ReactNode;
  className?: string;
}

const variantClasses = {
  success: "bg-success-light text-green-700",
  warning: "bg-warning-light text-amber-700",
  error: "bg-error-light text-red-700",
  neutral: "bg-night-100 text-night-600",
  info: "bg-glow-50 text-glow-700",
};

const dotClasses = {
  success: "bg-green-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  neutral: "bg-night-400",
  info: "bg-glow-500",
};

export function Badge({
  variant = "neutral",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${variantClasses[variant]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClasses[variant]}`} />
      {children}
    </span>
  );
}
