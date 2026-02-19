"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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
      const { data: { user } } = await supabase.auth.getUser();
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
    return <p className="text-gray-500">Laddar...</p>;
  }

  const isActive = status === "active";
  const isPastDue = status === "past_due";

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-amber-600 hover:text-amber-800">
          &larr; Tillbaka
        </Link>
        <h1 className="text-3xl font-bold text-amber-900">Prenumeration</h1>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
          Prenumerationen är aktiverad! Dina Ugglys är nu aktiva.
        </div>
      )}

      {canceled && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4">
          Checkout avbruten. Du kan försöka igen när du vill.
        </div>
      )}

      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-amber-900">Status</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isActive
              ? "bg-green-100 text-green-700"
              : isPastDue
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-500"
          }`}>
            {isActive ? "Aktiv" : isPastDue ? "Betalning krävs" : "Ingen prenumeration"}
          </span>
        </div>

        {isActive || isPastDue ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              {isActive
                ? "Din prenumeration är aktiv. Du kan hantera den via Stripe."
                : "Din senaste betalning misslyckades. Uppdatera betalningsmetod."}
            </p>
            <button
              onClick={handlePortal}
              disabled={actionLoading}
              className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 font-medium"
            >
              {actionLoading ? "Öppnar..." : "Hantera prenumeration"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-amber-900">99 kr<span className="text-lg font-normal text-gray-500">/mån</span></p>
              <p className="text-gray-500 mt-2">Obegränsat antal Ugglys. Avbryt när du vill.</p>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-600">&#10003;</span> AI-samtal anpassade efter barnets ålder
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">&#10003;</span> Fullständig föräldrakontroll
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">&#10003;</span> Kostnadsöversikt i realtid
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">&#10003;</span> Daglig budgetgräns
              </li>
            </ul>
            <button
              onClick={handleCheckout}
              disabled={actionLoading}
              className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 font-medium"
            >
              {actionLoading ? "Laddar..." : "Prenumerera nu"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
