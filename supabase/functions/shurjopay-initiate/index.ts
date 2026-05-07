import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const Body = z.object({
  customer_name: z.string().min(2).max(100),
  customer_phone: z.string().regex(/^01[0-9]{9}$/),
  customer_email: z.string().email().max(255).nullable().optional(),
  customer_address: z.string().max(500).nullable().optional(),
  amount: z.number().positive().max(1000000),
  product_name: z.string().min(1).max(200),
  payment_method: z.string().min(1).max(20),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const json = await req.json();
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.errors[0].message }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const input = parsed.data;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Read gateway settings
    const { data: settings, error: sErr } = await supabase
      .from("payment_gateway_settings")
      .select("*")
      .eq("gateway_name", "shurjopay")
      .maybeSingle();

    if (sErr || !settings) {
      return new Response(JSON.stringify({ error: "Gateway not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!settings.is_active) {
      return new Response(JSON.stringify({ error: "Payment gateway is disabled. Contact admin." }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const creds = settings.credentials || {};
    const { username, password, store_id, signature_key, prefix = "FTF" } = creds;
    if (!username || !password || !store_id || !signature_key) {
      return new Response(JSON.stringify({ error: "Gateway credentials incomplete" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const baseUrl = settings.mode === "live"
      ? "https://engine.shurjopayment.com"
      : "https://sandbox.shurjopayment.com";

    // 1. Get token
    const tokenRes = await fetch(`${baseUrl}/api/get_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData?.token) {
      return new Response(JSON.stringify({ error: "Gateway authentication failed", details: tokenData }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate order id
    const orderId = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
    const origin = req.headers.get("origin") || new URL(req.url).origin;
    const callbackUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/shurjopay-callback?frontend=${encodeURIComponent(origin)}`;

    // 2. Insert pending order
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!,
          { global: { headers: { Authorization: authHeader } } });
        const { data } = await sb.auth.getUser();
        userId = data.user?.id || null;
      } catch { /* guest */ }
    }

    const { error: insErr } = await supabase.from("payment_requests").insert({
      user_id: userId,
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_address: input.customer_address,
      phone_number: input.customer_phone,
      amount: input.amount,
      payment_method: input.payment_method,
      gateway_name: "shurjopay",
      gateway_order_id: orderId,
      product_name: input.product_name,
      status: "pending",
      purchase_type: "course",
    });
    if (insErr) {
      console.error("Insert error", insErr);
      return new Response(JSON.stringify({ error: "Failed to save order" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Make payment request
    const payRes = await fetch(`${baseUrl}/api/secret-pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenData.token}` },
      body: JSON.stringify({
        token: tokenData.token,
        return_url: callbackUrl,
        cancel_url: callbackUrl,
        store_id,
        prefix,
        amount: input.amount,
        order_id: orderId,
        currency: "BDT",
        customer_name: input.customer_name,
        customer_address: input.customer_address || "N/A",
        customer_phone: input.customer_phone,
        customer_city: "Dhaka",
        customer_post_code: "1200",
        customer_email: input.customer_email || "noreply@example.com",
        client_ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      }),
    });
    const payData = await payRes.json();

    if (!payData?.checkout_url) {
      return new Response(JSON.stringify({ error: "Gateway did not return checkout URL", details: payData }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save sp_order_id
    await supabase.from("payment_requests")
      .update({ gateway_response: payData })
      .eq("gateway_order_id", orderId);

    return new Response(JSON.stringify({ checkout_url: payData.checkout_url, order_id: orderId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("initiate error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
