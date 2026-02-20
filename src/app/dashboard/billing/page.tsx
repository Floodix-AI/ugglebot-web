"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Info, Check, ExternalLink, Lock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UgglyOwl } from "@/components/icons/UgglyOwl";
import { UgglyOwlAnimated } from "@/components/icons/UgglyOwlAnimated";

const FEATURES = [
  "AI-samtal anpassade efter barnets ålder",
  "Fullständig föräldrakontroll",
  "Kostnadsöversikt i realtid",
  "Daglig budgetgräns",
  "Obegränsat antal Ugglys",
  "Avbryt när som helst",
];

export default function BillingPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", user.id)
        .single();

      setStatus(profile?.subscription_status || "inactive");
      setLoading(false);
    }
    load();
  }, [supabase]);

  async function handleCheckout() {
    setActionLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setActionLoading(false);
  }

  async function handlePortal() {
    setActionLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setActionLoading(false);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full animate-pulse-glow"
            style={{
              background:
                "radial-gradient(circle, rgba(232,168,23,0.3) 0%, transparent 70%)",
            }}
          />
          <UgglyOwlAnimated size={80} />
        </div>
        <p className="text-night-400 text-sm">Laddar...</p>
      </div>
    );
  }

  const isActive = status === "active";
  const isPastDue = status === "past_due";

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <PageHeader title="Prenumeration" backHref="/dashboard" />

      {success && (
        <div className="bg-forest-50 border border-forest-400/30 text-forest-600 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            Prenumerationen är aktiverad! Dina Ugglys är nu aktiva.
          </p>
        </div>
      )}

      {canceled && (
        <div className="bg-glow-50 border border-glow-300/30 text-glow-700 rounded-xl p-4 flex items-center gap-3">
          <Info className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            Checkout avbruten. Du kan försöka igen när du vill.
          </p>
        </div>
      )}

      <Card padding="lg">
        {isActive || isPastDue ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-night-50 flex items-center justify-center">
                <UgglyOwl size={40} variant="color" />
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={isActive ? "success" : "warning"}
                >
                  {isActive ? "Aktiv" : "Betalning krävs"}
                </Badge>
              </div>
              <p className="text-night-600 text-sm">
                {isActive
                  ? "Din uggla är redo att prata! Du kan hantera prenumerationen via Stripe."
                  : "Din senaste betalning misslyckades. Uppdatera betalningsmetod."}
              </p>
            </div>
            <Button
              onClick={handlePortal}
              loading={actionLoading}
              variant="secondary"
              icon={ExternalLink}
              className="w-full"
              size="lg"
            >
              {actionLoading ? "Öppnar..." : "Hantera prenumeration"}
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full animate-pulse-glow"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(232,168,23,0.3) 0%, transparent 70%)",
                  }}
                />
                <UgglyOwlAnimated size={80} />
              </div>
              <h2 className="font-heading text-2xl font-bold text-night-900">
                Ge din uggla superkrafter!
              </h2>
            </div>

            <div className="text-center">
              <span className="font-heading font-extrabold text-5xl text-night-900">
                99 kr
              </span>
              <span className="text-night-400 text-xl">/mån</span>
              <p className="text-night-400 text-sm mt-2">
                Obegränsat antal Ugglys. Avbryt när du vill.
              </p>
            </div>

            <div className="gold-divider" />

            <ul className="space-y-3">
              {FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-night-600 text-sm"
                >
                  <span className="w-5 h-5 rounded-full bg-forest-50 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-forest-500" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              onClick={handleCheckout}
              loading={actionLoading}
              className="w-full"
              size="lg"
            >
              {actionLoading ? "Laddar..." : "Prenumerera nu"}
            </Button>

            <p className="text-center text-night-400 text-xs flex items-center justify-center gap-1.5">
              <Lock className="h-3 w-3" />
              Säkra betalningar via Stripe
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
