import { createClient } from "@supabase/supabase-js";

// Service role-klient — bara för server-side API-routes
// Bypaserar RLS, använd med försiktighet
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
