"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Settings } from "lucide-react";

interface UserMenuProps {
  name: string;
  email: string;
}

export function UserMenu({ name, email }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const initial = name.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-glow-500/20 border border-glow-500/30 flex items-center justify-center text-sm font-bold text-glow-400 hover:bg-glow-500/30 transition-colors cursor-pointer"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-night-900/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-xl shadow-night-950/40 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <p className="text-sm font-medium text-white truncate">{name}</p>
            <p className="text-xs text-night-400 truncate">{email}</p>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-night-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              Inställningar
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-night-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Logga ut
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
