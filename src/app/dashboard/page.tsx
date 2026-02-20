import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, User, Wallet, TrendingUp, Clock, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { UgglyOwl } from "@/components/icons/UgglyOwl";
import { UgglyOwlAnimated } from "@/components/icons/UgglyOwlAnimated";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: devices } = await supabase
    .from("devices")
    .select(
      `
      *,
      device_settings (*),
      usage_logs (total_sek, date, interactions)
    `
    )
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mina Ugglys"
        action={
          <Link
            href="/dashboard/pair"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-glow-500 text-night-950 rounded-xl text-sm font-semibold font-heading hover:bg-glow-400 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Parkoppla ny Uggly
          </Link>
        }
      />

      {!devices || devices.length === 0 ? (
        <EmptyState
          iconElement={
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
          }
          title="Din uggla väntar på dig!"
          description="Parkoppla din första Uggly och börja äventyret."
          action={
            <Link
              href="/dashboard/pair"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-glow-500 text-night-950 rounded-xl text-sm font-semibold font-heading hover:bg-glow-400 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Parkoppla din första Uggly
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {devices.map((device) => {
            const settings = device.device_settings;
            const todayLog = device.usage_logs?.find(
              (l: { date: string }) =>
                l.date === new Date().toISOString().split("T")[0]
            );

            return (
              <Link
                key={device.id}
                href={`/dashboard/owl/${device.id}`}
                className="block group"
              >
                <Card hover padding="md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-night-50 flex items-center justify-center flex-shrink-0">
                        <UgglyOwl size={28} variant="color" />
                      </div>
                      <h2 className="font-heading text-xl font-bold text-night-900">
                        {device.device_name}
                      </h2>
                    </div>
                    <Badge
                      variant={device.is_active ? "success" : "neutral"}
                    >
                      {device.is_active ? "Aktiv" : "Inaktiv"}
                    </Badge>
                  </div>

                  {settings && (
                    <div className="text-sm text-night-600 space-y-1.5">
                      <p className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-night-400" />
                        {settings.child_name || "Ej angivet"},{" "}
                        {settings.child_age} år
                      </p>
                      <p className="flex items-center gap-2">
                        <Wallet className="h-3.5 w-3.5 text-night-400" />
                        {settings.daily_budget_sek} kr/dag
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-night-100 flex items-center justify-between">
                    <div className="text-sm text-night-400 space-y-1">
                      <p className="flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5" />
                        {todayLog
                          ? `${todayLog.total_sek.toFixed(2)} kr (${todayLog.interactions} samtal)`
                          : "Inga samtal idag"}
                      </p>
                      {device.last_seen_at && (
                        <p className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(device.last_seen_at).toLocaleString(
                            "sv-SE"
                          )}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-night-300 group-hover:text-night-500 transition-colors" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
