import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const frontend = url.searchParams.get("frontend") || "";
  const orderId = url.searchParams.get("order_id") || url.searchParams.get("merchant_order_id") || "";

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    if (!orderId) throw new Error("Missing order id");

    // Verify with ShurjoPay
    const { data: settings } = await supabase
      .from("payment_gateway_settings")
      .select("*")
      .eq("gateway_name", "shurjopay")
      .maybeSingle();
    if (!settings) throw new Error("Gateway settings missing");

    const baseUrl = settings.mode === "live"
      ? "https://engine.shurjopayment.com"
      : "https://sandbox.shurjopayment.com";

    const creds = settings.credentials || {};
    const tokenRes = await fetch(`${baseUrl}/api/get_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: creds.username, password: creds.password }),
    });
    const tokenData = await tokenRes.json();

    const verifyRes = await fetch(`${baseUrl}/api/verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenData.token}` },
      body: JSON.stringify({ order_id: orderId }),
    });
    const verifyArr = await verifyRes.json();
    const verify = Array.isArray(verifyArr) ? verifyArr[0] : verifyArr;

    let status = "failed";
    const spStatus = (verify?.sp_code || verify?.bank_status || verify?.transaction_status || "").toString().toLowerCase();
    if (verify?.sp_code === "1000" || spStatus.includes("success") || spStatus === "success") {
      status = "completed";
    } else if (spStatus.includes("cancel")) {
      status = "cancelled";
    }

    const { data: existing } = await supabase
      .from("payment_requests")
      .select("callback_log")
      .eq("gateway_order_id", orderId)
      .maybeSingle();
    const log = Array.isArray(existing?.callback_log) ? existing.callback_log : [];
    log.push({ at: new Date().toISOString(), source: "callback", verify });

    await supabase.from("payment_requests").update({
      status,
      gateway_transaction_id: verify?.bank_trx_id || verify?.bank_tran_id || verify?.method || null,
      gateway_response: verify,
      callback_log: log,
      verified_at: status === "completed" ? new Date().toISOString() : null,
    }).eq("gateway_order_id", orderId);

    const target = status === "completed"
      ? `${frontend}/thank-you?order_id=${orderId}`
      : `${frontend}/payment-failed?reason=${encodeURIComponent(spStatus || "Payment not completed")}&order_id=${orderId}`;

    return Response.redirect(target, 302);
  } catch (err) {
    console.error("callback error", err);
    const target = `${frontend}/payment-failed?reason=${encodeURIComponent((err as Error).message)}`;
    return Response.redirect(target, 302);
  }
});
