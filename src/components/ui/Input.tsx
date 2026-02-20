import { type InputHTMLAttributes } from "react";
import { type LucideIcon, AlertCircle } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export function Input({
  label,
  error,
  icon: Icon,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-night-700 font-heading"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-night-400" />
        )}
        <input
          id={inputId}
          className={`w-full px-4 py-2.5 bg-white border border-night-200 rounded-xl text-night-900 placeholder:text-night-400 focus:outline-none focus:ring-2 focus:ring-glow-500/50 focus:border-glow-500 transition-colors ${
            Icon ? "pl-10" : ""
          } ${error ? "border-error focus:ring-error/50 focus:border-error" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
