import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// Pi:n hämtar sin config via API-nyckel
// Header: Authorization: Bearer <device_api_key>
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: deviceId } = await params;
  const authHeader = request.headers.get("authorization");
  const apiKey = authHeader?.replace("Bearer ", "");

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  // Admin-klient — Pi:n har ingen Supabase auth-session
  const admin = createAdminClient();

  // Verifiera att API-nyckeln matchar enheten
  const { data: device, error: deviceError } = await admin
    .from("devices")
    .select("id, api_key, is_active")
    .eq("id", deviceId)
    .single();

  if (deviceError || !device || device.api_key !== apiKey) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
  }

  if (!device.is_active) {
    return NextResponse.json({ error: "Device is inactive" }, { status: 403 });
  }

  // Hämta inställningar
  const { data: settings } = await admin
    .from("device_settings")
    .select("*")
    .eq("device_id", deviceId)
    .single();

  // Uppdatera last_seen_at
  await admin
    .from("devices")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", deviceId);

  return NextResponse.json({
    device_id: deviceId,
    settings: settings || {},
  });
}
