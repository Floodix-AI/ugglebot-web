"use client";

import Link from "next/link";
import { AlertTriangle, XCircle } from "lucide-react";

interface SubscriptionBannerProps {
  status: string;
}

export function SubscriptionBanner({ status }: SubscriptionBannerProps) {
  if (status === "active") return null;

  const isPastDue = status === "past_due";
  const Icon = isPastDue ? AlertTriangle : XCircle;

  return (
    <div
      className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${
        isPastDue
          ? "bg-glow-50 border-glow-400/30"
          : "bg-red-50 border-red-300/30"
      }`}
    >
      <Icon
        className={`h-5 w-5 flex-shrink-0 ${
          isPastDue ? "text-glow-600" : "text-red-500"
        }`}
      />
      <p
        className={`text-sm font-medium flex-1 ${
          isPastDue ? "text-glow-700" : "text-red-600"
        }`}
      >
        {isPastDue
          ? "Din betalning har inte gått igenom. Uppdatera din betalningsmetod."
          : "Du har ingen aktiv prenumeration. Dina ugglor är inaktiva."}
      </p>
      <Link
        href="/dashboard/billing"
        className={`text-sm font-semibold whitespace-nowrap ${
          isPastDue
            ? "text-glow-700 hover:text-glow-500"
            : "text-red-600 hover:text-red-500"
        } transition-colors`}
      >
        {isPastDue ? "Uppdatera betalning" : "Prenumerera"}
      </Link>
    </div>
  );
}
