"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-amber-200 hover:text-white transition"
    >
      Logga ut
    </button>
  );
}
