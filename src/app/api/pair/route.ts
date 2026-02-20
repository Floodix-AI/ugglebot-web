import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pairingSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Autentisera användaren
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const raw = await request.json();
  const parsed = pairingSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Ogiltig data" },
      { status: 400 }
    );
  }
  const { pairing_code, device_name } = parsed.data;

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
    return NextResponse.json({ error: "Denna Uggly är redan parkopplad till ett konto" }, { status: 409 });
  }

  // Säkerställ att profil finns (kan saknas om kontot skapades innan migrering)
  await admin
    .from("profiles")
    .upsert(
      { id: user.id, email: user.email || "" },
      { onConflict: "id" }
    );

  // Parkoppla enheten till användaren — atomär guard mot race condition
  const { data: updated, error: updateError } = await admin
    .from("devices")
    .update({
      owner_id: user.id,
      device_name: device_name || "Min Uggly",
      paired_at: new Date().toISOString(),
    })
    .eq("id", device.id)
    .is("owner_id", null)
    .select("id")
    .single();

  if (updateError || !updated) {
    return NextResponse.json(
      { error: "Denna Uggly har redan parkopplats till ett annat konto" },
      { status: 409 }
    );
  }

  return NextResponse.json({ device_id: updated.id });
}
