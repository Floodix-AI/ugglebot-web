import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UgglyLogo } from "@/components/brand/UgglyLogo";
import { UserMenu } from "@/components/UserMenu";
import { DashboardNav } from "./DashboardNav";
import { SubscriptionBanner } from "@/components/dashboard/SubscriptionBanner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, subscription_status")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.name || user.email?.split("@")[0] || "";

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 px-4 pt-4 pb-2">
        <nav className="max-w-5xl mx-auto bg-night-950/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-night-950/30 text-white ring-1 ring-inset ring-white/[0.05]">
          <div className="flex items-center justify-between px-5 h-14">
            <Link href="/dashboard" className="flex-shrink-0">
              <UgglyLogo size="sm" variant="color" onDark />
            </Link>

            <div className="h-5 w-px bg-white/10" />

            <div className="flex items-center gap-1">
              <DashboardNav />
            </div>

            <div className="h-5 w-px bg-white/10" />

            <UserMenu
              name={displayName}
              email={user.email || ""}
            />
          </div>
        </nav>
      </div>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <SubscriptionBanner status={profile?.subscription_status || "inactive"} />
        {children}
      </main>
    </div>
  );
}
