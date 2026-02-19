import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook signature: ${message}` }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;
      const status = mapStatus(subscription.status);

      await admin
        .from("profiles")
        .update({ subscription_status: status })
        .eq("stripe_customer_id", customerId);

      // Aktivera/inaktivera ugglor baserat på prenumerationsstatus
      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile) {
        await admin
          .from("devices")
          .update({ is_active: status === "active" })
          .eq("owner_id", profile.id);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;

      await admin
        .from("profiles")
        .update({ subscription_status: "canceled" })
        .eq("stripe_customer_id", customerId);

      // Inaktivera alla ugglor
      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile) {
        await admin
          .from("devices")
          .update({ is_active: false })
          .eq("owner_id", profile.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

function mapStatus(stripeStatus: string): string {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
      return "past_due";
    default:
      return "canceled";
  }
}
