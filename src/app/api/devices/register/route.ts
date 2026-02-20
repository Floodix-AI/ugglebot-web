import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

function generatePairingCode(): string {
  // 6 tecken: versaler + siffror, lättläst (inga O/0, I/1, L)
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
}

// Pi:n anropar detta vid första uppstart för att registrera sig.
// Ingen auth krävs — enheten har inga credentials ännu.
// Returnerar device_id, api_key och pairing_code.
export async function POST() {
  const admin = createAdminClient();
  const pairingCode = generatePairingCode();

  // Skapa enheten (api_key genereras av databasen via default)
  const { data: device, error } = await admin
    .from("devices")
    .insert({ pairing_code: pairingCode })
    .select("id, api_key, pairing_code")
    .single();

  if (error) {
    // Om pairing_code-kollision, försök igen
    if (error.code === "23505") {
      const retry = generatePairingCode();
      const { data: retryDevice, error: retryError } = await admin
        .from("devices")
        .insert({ pairing_code: retry })
        .select("id, api_key, pairing_code")
        .single();

      if (retryError || !retryDevice) {
        return NextResponse.json(
          { error: "Kunde inte registrera enheten" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        device_id: retryDevice.id,
        api_key: retryDevice.api_key,
        pairing_code: retryDevice.pairing_code,
      });
    }

    console.error("Device registration error:", error);
    return NextResponse.json(
      { error: "Kunde inte registrera enheten", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    device_id: device.id,
    api_key: device.api_key,
    pairing_code: device.pairing_code,
  });
}
