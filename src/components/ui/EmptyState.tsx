import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  iconElement?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  iconElement,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {iconElement ? (
        <div className="mb-4">{iconElement}</div>
      ) : Icon ? (
        <div className="w-16 h-16 rounded-full bg-night-100 flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-night-400" />
        </div>
      ) : null}
      <h3 className="font-heading text-lg font-bold text-night-900 mb-2">
        {title}
      </h3>
      <p className="text-night-400 text-sm max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
