import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CHECK-SUBSCRIPTION] ${step}${d}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logStep("No valid authorization header");
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      logStep("Invalid token, returning unsubscribed", { error: claimsError?.message });
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    }

    const userId = claimsData.claims.sub as string;
    const userEmail = claimsData.claims.email as string;
    if (!userEmail) {
      logStep("No email in claims");
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    }
    logStep("User authenticated", { email: userEmail });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No Stripe customer found");

      // Check if user has manual premium (e.g. set directly in DB)
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("is_premium, premium_expires_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (profile?.is_premium && profile?.premium_expires_at && new Date(profile.premium_expires_at) > new Date()) {
        logStep("Manual premium active", { expires: profile.premium_expires_at });
        return new Response(JSON.stringify({ subscribed: true, product_id: null, subscription_end: profile.premium_expires_at }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Update profile to free
      await supabaseClient.from("profiles").update({
        is_premium: false, premium_since: null, premium_expires_at: null, subscription_id: null,
      }).eq("user_id", userId);

      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 1 });
    const hasActive = subscriptions.data.length > 0;

    let productId: string | null = null;
    let subscriptionEnd: string | null = null;
    let subscriptionId: string | null = null;

    if (hasActive) {
      const sub = subscriptions.data[0];
      subscriptionEnd = new Date(sub.current_period_end * 1000).toISOString();
      productId = sub.items.data[0].price.product as string;
      subscriptionId = sub.id;
      logStep("Active subscription", { subscriptionId: sub.id, productId, end: subscriptionEnd });

      // Update profile to premium
      await supabaseClient.from("profiles").update({
        is_premium: true,
        premium_since: new Date(sub.start_date * 1000).toISOString(),
        premium_expires_at: subscriptionEnd,
        subscription_id: sub.id,
      }).eq("user_id", userId);
    } else {
      logStep("No active subscription");
      // Check manual premium before clearing
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("is_premium, premium_expires_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (profile?.is_premium && profile?.premium_expires_at && new Date(profile.premium_expires_at) > new Date()) {
        logStep("Manual premium active (Stripe customer exists but no sub)", { expires: profile.premium_expires_at });
        return new Response(JSON.stringify({ subscribed: true, product_id: null, subscription_end: profile.premium_expires_at }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      await supabaseClient.from("profiles").update({
        is_premium: false, premium_since: null, premium_expires_at: null, subscription_id: null,
      }).eq("user_id", userId);
    }

    return new Response(JSON.stringify({
      subscribed: hasActive,
      product_id: productId,
      subscription_end: subscriptionEnd,
      subscription_id: subscriptionId,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
