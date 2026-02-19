import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Autentisera användaren
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const { pairing_code, device_name } = await request.json();

  if (!pairing_code) {
    return NextResponse.json({ error: "Ange en parkopplingskod" }, { status: 400 });
  }

  // Använd admin-klient för att bypassa RLS (oparkopplade enheter har ingen ägare)
  const admin = createAdminClient();

  // Hitta enhet med denna kod som inte redan är parkopplad
  const { data: device, error: findError } = await admin
    .from("devices")
    .select("id, owner_id")
    .eq("pairing_code", pairing_code.toUpperCase().trim())
    .single();

  if (findError || !device) {
    return NextResponse.json({ error: "Ogiltig parkopplingskod" }, { status: 404 });
  }

  if (device.owner_id) {
    return NextResponse.json({ error: "Denna uggla är redan parkopplad till ett konto" }, { status: 409 });
  }

  // Parkoppla enheten till användaren
  const { error: updateError } = await admin
    .from("devices")
    .update({
      owner_id: user.id,
      device_name: device_name || "Min uggla",
      paired_at: new Date().toISOString(),
    })
    .eq("id", device.id);

  if (updateError) {
    return NextResponse.json({ error: "Kunde inte parkoppla ugglan" }, { status: 500 });
  }

  return NextResponse.json({ device_id: device.id });
}
