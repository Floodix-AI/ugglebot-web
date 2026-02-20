import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// Pi:n skickar daglig usage-data via API-nyckel.
// Header: Authorization: Bearer <device_api_key>
// Body: { date, whisper_cost, claude_cost, elevenlabs_cost, total_sek, interactions }
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
    .select("id, api_key, is_active")
    .eq("id", deviceId)
    .single();

  if (deviceError || !device || device.api_key !== apiKey) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
  }

  const body = await request.json();
  const { date, whisper_cost, claude_cost, elevenlabs_cost, total_sek, interactions } = body;

  if (!date) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  // Upsert — uppdatera om det redan finns en rad för denna dag
  const { error: upsertError } = await admin
    .from("usage_logs")
    .upsert(
      {
        device_id: deviceId,
        date,
        whisper_cost: whisper_cost || 0,
        claude_cost: claude_cost || 0,
        elevenlabs_cost: elevenlabs_cost || 0,
        total_sek: total_sek || 0,
        interactions: interactions || 0,
      },
      { onConflict: "device_id,date" }
    );

  if (upsertError) {
    return NextResponse.json(
      { error: "Kunde inte spara usage-data" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
