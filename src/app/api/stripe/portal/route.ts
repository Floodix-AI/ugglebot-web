import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "Ingen prenumeration hittad" }, { status: 404 });
  }

  const { origin } = new URL(request.url);

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${origin}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}
