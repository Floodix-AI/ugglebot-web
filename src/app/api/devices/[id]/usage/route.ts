import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// Pi:n skickar usage-data efter varje interaktion
// Body: { date, total_sek, interactions }
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
  const { data: device } = await admin
    .from("devices")
    .select("id, api_key")
    .eq("id", deviceId)
    .single();

  if (!device || device.api_key !== apiKey) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
  }

  const body = await request.json();
  const today = body.date || new Date().toISOString().split("T")[0];

  // Hämta befintlig rad för idag
  const { data: existing } = await admin
    .from("usage_logs")
    .select("id, total_sek, interactions")
    .eq("device_id", deviceId)
    .eq("date", today)
    .single();

  if (existing) {
    // Pi skickar sin dagstotal — uppdatera, inkrementera interactions
    await admin
      .from("usage_logs")
      .update({
        total_sek: body.total_sek || existing.total_sek,
        interactions: existing.interactions + (body.interactions || 1),
      })
      .eq("id", existing.id);
  } else {
    await admin
      .from("usage_logs")
      .insert({
        device_id: deviceId,
        date: today,
        total_sek: body.total_sek || 0,
        interactions: body.interactions || 1,
      });
  }

  // Uppdatera last_seen_at
  await admin
    .from("devices")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", deviceId);

  return NextResponse.json({ ok: true });
}
