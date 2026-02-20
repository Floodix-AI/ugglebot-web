import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Hämta profil
  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Hämta enheter
  const { data: devices } = await admin
    .from("devices")
    .select("id, device_name, pairing_code, paired_at, last_seen_at, is_active, created_at")
    .eq("owner_id", user.id);

  const deviceIds = (devices || []).map((d) => d.id);

  // Hämta device_settings
  let deviceSettings: Record<string, unknown>[] = [];
  if (deviceIds.length > 0) {
    const { data } = await admin
      .from("device_settings")
      .select("*")
      .in("device_id", deviceIds);
    deviceSettings = data || [];
  }

  // Hämta usage_logs
  let usageLogs: Record<string, unknown>[] = [];
  if (deviceIds.length > 0) {
    const { data } = await admin
      .from("usage_logs")
      .select("*")
      .in("device_id", deviceIds)
      .order("date", { ascending: false });
    usageLogs = data || [];
  }

  const exportData = {
    exported_at: new Date().toISOString(),
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    },
    profile,
    devices: (devices || []).map((device) => ({
      ...device,
      settings: deviceSettings.find(
        (s) => (s as { device_id: string }).device_id === device.id
      ),
      usage_logs: usageLogs.filter(
        (l) => (l as { device_id: string }).device_id === device.id
      ),
    })),
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="uggly-data-export-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
