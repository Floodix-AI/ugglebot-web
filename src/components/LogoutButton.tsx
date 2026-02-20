"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

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
      title="Logga ut"
      className="w-8 h-8 rounded-lg flex items-center justify-center text-night-400 hover:text-white hover:bg-white/10 transition-colors"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}
