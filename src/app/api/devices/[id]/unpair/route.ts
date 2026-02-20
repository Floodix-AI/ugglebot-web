import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: deviceId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Verifiera att användaren äger enheten
  const { data: device } = await admin
    .from("devices")
    .select("id, owner_id")
    .eq("id", deviceId)
    .single();

  if (!device || device.owner_id !== user.id) {
    return NextResponse.json({ error: "Enheten hittades inte" }, { status: 404 });
  }

  // Radera usage_logs
  await admin.from("usage_logs").delete().eq("device_id", deviceId);

  // Radera device_settings
  await admin.from("device_settings").delete().eq("device_id", deviceId);

  // Nollställ enheten (avkoppla men behåll i systemet så den kan parkopplas igen)
  const { error: updateError } = await admin
    .from("devices")
    .update({
      owner_id: null,
      device_name: "Min Uggly",
      paired_at: null,
    })
    .eq("id", deviceId);

  if (updateError) {
    console.error("Unpair error:", updateError);
    return NextResponse.json(
      { error: "Kunde inte avkoppla enheten" },
      { status: 500 }
    );
  }

  // Återskapa tomma device_settings (triggern gör detta vid ny enhet, men inte vid update)
  await admin.from("device_settings").insert({ device_id: deviceId });

  return NextResponse.json({ ok: true });
}
