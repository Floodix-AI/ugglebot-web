"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { type LucideIcon, Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: LucideIcon;
  children: ReactNode;
}

const variantClasses = {
  primary:
    "bg-glow-500 text-night-950 font-semibold hover:bg-glow-400 active:bg-glow-600 shadow-sm",
  secondary:
    "bg-night-100 text-night-700 font-semibold hover:bg-night-200 active:bg-night-300",
  ghost:
    "text-night-600 hover:text-night-900 hover:bg-night-100 active:bg-night-200",
  danger:
    "bg-error text-white font-semibold hover:bg-red-600 active:bg-red-700",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-8 py-3.5 text-base rounded-xl gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-heading transition-colors focus:outline-none focus:ring-2 focus:ring-glow-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className="h-4 w-4" />
      ) : null}
      {children}
    </button>
  );
}
