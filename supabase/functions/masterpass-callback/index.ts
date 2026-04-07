import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: unknown) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[MASTERPASS-CALLBACK] ${step}${d}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const body = await req.json();
    logStep("Received params", body);

    // Validate required fields from Masterpass / SRC callback
    const sessionId = body.session_id || body.checkout_session_id;
    const paymentStatus = body.status || body.payment_status;

    // If we have a Stripe session ID, verify it
    if (sessionId) {
      const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      logStep("Stripe session retrieved", { id: session.id, status: session.payment_status });

      if (session.payment_status === "paid") {
        // Optionally sync premium status
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
          { auth: { persistSession: false } }
        );

        if (session.customer_email) {
          await supabaseClient
            .from("profiles")
            .update({ is_premium: true, premium_since: new Date().toISOString() })
            .eq("email", session.customer_email);
          logStep("Profile updated to premium", { email: session.customer_email });
        }

        return new Response(
          JSON.stringify({ success: true, message: "Pagamento confirmado com sucesso!" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }

      return new Response(
        JSON.stringify({ success: false, message: "O pagamento ainda não foi confirmado. Tente novamente em instantes." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Fallback: check status param directly
    if (paymentStatus === "success" || paymentStatus === "approved") {
      logStep("Payment approved via status param");
      return new Response(
        JSON.stringify({ success: true, message: "Pagamento aprovado!" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    if (paymentStatus === "cancelled" || paymentStatus === "canceled") {
      logStep("Payment cancelled");
      return new Response(
        JSON.stringify({ success: false, message: "O pagamento foi cancelado." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    logStep("Unknown payment status", { paymentStatus });
    return new Response(
      JSON.stringify({ success: false, message: "Status de pagamento não reconhecido." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(
      JSON.stringify({ success: false, message: "Erro interno ao processar o retorno." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
