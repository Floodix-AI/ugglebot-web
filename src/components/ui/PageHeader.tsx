import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  backHref?: string;
  action?: ReactNode;
  badge?: ReactNode;
}

export function PageHeader({ title, backHref, action, badge }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-night-400 hover:text-night-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Tillbaka
        </Link>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-2xl font-bold text-night-900">
            {title}
          </h1>
          {badge}
        </div>
        {action}
      </div>
    </div>
  );
}
