import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: devices } = await supabase
    .from("devices")
    .select(`
      *,
      device_settings (*),
      usage_logs (total_sek, date, interactions)
    `)
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-amber-900">Mina ugglor</h1>
        <Link
          href="/dashboard/pair"
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
        >
          + Parkoppla ny uggla
        </Link>
      </div>

      {(!devices || devices.length === 0) ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <p className="text-gray-500 text-lg">
            Du har inga ugglor parkopplade an.
          </p>
          <Link
            href="/dashboard/pair"
            className="inline-block mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
          >
            Parkoppla din forsta uggla
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {devices.map((device) => {
            const settings = device.device_settings;
            const todayLog = device.usage_logs?.find(
              (l: { date: string }) => l.date === new Date().toISOString().split("T")[0]
            );

            return (
              <Link
                key={device.id}
                href={`/dashboard/owl/${device.id}`}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition block"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-amber-900">
                    {device.device_name}
                  </h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    device.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {device.is_active ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>

                {settings && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Barn: {settings.child_name || "Ej angivet"}, {settings.child_age} ar</p>
                    <p>Budget: {settings.daily_budget_sek} kr/dag</p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                  <p>Idag: {todayLog ? `${todayLog.total_sek.toFixed(2)} kr (${todayLog.interactions} samtal)` : "Inga samtal"}</p>
                  {device.last_seen_at && (
                    <p>Senast online: {new Date(device.last_seen_at).toLocaleString("sv-SE")}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
