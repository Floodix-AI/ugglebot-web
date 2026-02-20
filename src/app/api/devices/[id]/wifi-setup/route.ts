import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// Dashboard triggar WiFi-setup på enheten
// Kräver inloggad användare som äger enheten
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: deviceId } = await params;

  // Verifiera användare
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Verifiera att användaren äger enheten
  const { data: device, error: deviceError } = await admin
    .from("devices")
    .select("id, owner_id")
    .eq("id", deviceId)
    .single();

  if (deviceError || !device || device.owner_id !== user.id) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 });
  }

  // Sätt wifi_setup_requested flagga
  const { error: updateError } = await admin
    .from("device_settings")
    .update({ wifi_setup_requested: true })
    .eq("device_id", deviceId);

  if (updateError) {
    return NextResponse.json(
      { error: "Could not update settings" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
