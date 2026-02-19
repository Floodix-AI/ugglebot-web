import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen">
      <nav className="bg-amber-900 text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold">
            Ugglebot
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard/pair" className="hover:text-amber-200 transition">
              Parkoppla uggla
            </Link>
            <Link href="/dashboard/billing" className="hover:text-amber-200 transition">
              Prenumeration
            </Link>
            <span className="text-amber-200 text-sm">
              {profile?.name || user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
