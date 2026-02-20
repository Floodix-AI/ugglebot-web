import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(
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

  // Generera ny API-nyckel
  const newApiKey = crypto.randomBytes(32).toString("hex");

  const { error: updateError } = await admin
    .from("devices")
    .update({ api_key: newApiKey })
    .eq("id", deviceId);

  if (updateError) {
    console.error("Key rotation error:", updateError);
    return NextResponse.json(
      { error: "Kunde inte rotera API-nyckeln" },
      { status: 500 }
    );
  }

  return NextResponse.json({ api_key: newApiKey });
}
