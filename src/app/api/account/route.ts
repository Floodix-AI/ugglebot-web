import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Hämta användarens enheter
  const { data: devices } = await admin
    .from("devices")
    .select("id")
    .eq("owner_id", user.id);

  const deviceIds = (devices || []).map((d) => d.id);

  if (deviceIds.length > 0) {
    // Radera usage_logs för alla enheter
    const { error: usageError } = await admin
      .from("usage_logs")
      .delete()
      .in("device_id", deviceIds);

    if (usageError) {
      console.error("Failed to delete usage_logs:", usageError);
      return NextResponse.json(
        { error: "Kunde inte radera användningsdata" },
        { status: 500 }
      );
    }

    // Radera device_settings för alla enheter
    const { error: settingsError } = await admin
      .from("device_settings")
      .delete()
      .in("device_id", deviceIds);

    if (settingsError) {
      console.error("Failed to delete device_settings:", settingsError);
      return NextResponse.json(
        { error: "Kunde inte radera enhetsinställningar" },
        { status: 500 }
      );
    }

    // Radera alla enheter
    const { error: devicesError } = await admin
      .from("devices")
      .delete()
      .eq("owner_id", user.id);

    if (devicesError) {
      console.error("Failed to delete devices:", devicesError);
      return NextResponse.json(
        { error: "Kunde inte radera enheter" },
        { status: 500 }
      );
    }
  }

  // Radera profil
  const { error: profileError } = await admin
    .from("profiles")
    .delete()
    .eq("id", user.id);

  if (profileError) {
    console.error("Failed to delete profile:", profileError);
    return NextResponse.json(
      { error: "Kunde inte radera profil" },
      { status: 500 }
    );
  }

  // Radera auth-användare
  const { error: authError } = await admin.auth.admin.deleteUser(user.id);

  if (authError) {
    console.error("Failed to delete auth user:", authError);
    return NextResponse.json(
      { error: "Kunde inte radera kontot" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
