import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// Pi:n meddelar att WiFi-setup är klar
// Header: Authorization: Bearer <device_api_key>
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: deviceId } = await params;
  const authHeader = request.headers.get("authorization");
  const apiKey = authHeader?.replace("Bearer ", "");

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Verifiera API-nyckel
  const { data: device, error: deviceError } = await admin
    .from("devices")
    .select("id, api_key")
    .eq("id", deviceId)
    .single();

  if (deviceError || !device || device.api_key !== apiKey) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
  }

  // Rensa wifi_setup_requested flagga
  const { error: updateError } = await admin
    .from("device_settings")
    .update({ wifi_setup_requested: false })
    .eq("device_id", deviceId);

  if (updateError) {
    return NextResponse.json(
      { error: "Could not update settings" },
      { status: 500 }
    );
  }

  // Uppdatera last_seen_at
  await admin
    .from("devices")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", deviceId);

  return NextResponse.json({ ok: true });
}
