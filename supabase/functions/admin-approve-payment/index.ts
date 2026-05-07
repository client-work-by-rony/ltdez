import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "অনুমোদিত নয়" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { paymentId, durationMonths } = await req.json();
    if (!paymentId) {
      return new Response(JSON.stringify({ error: "paymentId প্রয়োজন" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const months = Number(durationMonths) || 12;
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + months);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const token = authHeader.replace("Bearer ", "");

    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: { user: caller }, error: authError } = await supabaseUser.auth.getUser(token);
    if (authError || !caller) {
      return new Response(JSON.stringify({ error: "অনুমোদিত নয়" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "শুধুমাত্র অ্যাডমিন এই কাজ করতে পারেন" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payment_requests")
      .select("id, user_id, status, membership_type, amount, purchase_type, course_id")
      .eq("id", paymentId)
      .maybeSingle();

    if (paymentError || !payment) {
      return new Response(JSON.stringify({ error: "পেমেন্ট পাওয়া যায়নি" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const purchaseType = (payment as any).purchase_type || "pro";

    const { data: authUserData, error: authUserError } = await supabaseAdmin.auth.admin.getUserById(payment.user_id);
    if (authUserError || !authUserData?.user) {
      return new Response(JSON.stringify({ error: "ইউজার পাওয়া যায়নি" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authUser = authUserData.user;
    const fullName = (authUser.user_metadata?.full_name as string | undefined) || authUser.email?.split("@")[0] || "User";

    if (purchaseType === "course") {
      const courseId = (payment as any).course_id;
      if (!courseId) {
        return new Response(JSON.stringify({ error: "course_id নেই" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Ensure profile + base role exist
      await supabaseAdmin.from("profiles").upsert({
        user_id: payment.user_id,
        email: authUser.email,
        full_name: fullName,
      }, { onConflict: "user_id" });
      await supabaseAdmin.from("user_roles").upsert({
        user_id: payment.user_id,
        role: "user",
      }, { onConflict: "user_id,role" });

      const { error: enrollError } = await supabaseAdmin
        .from("enrollments")
        .insert({ user_id: payment.user_id, course_id: courseId, status: "active" });
      if (enrollError && enrollError.code !== "23505") {
        return new Response(JSON.stringify({ error: enrollError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      const { error: profileUpsertError } = await supabaseAdmin
        .from("profiles")
        .upsert({
          user_id: payment.user_id,
          email: authUser.email,
          full_name: fullName,
          membership: "pro",
          membership_expires_at: expiresAt.toISOString(),
        }, { onConflict: "user_id" });

      if (profileUpsertError) {
        return new Response(JSON.stringify({ error: profileUpsertError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabaseAdmin.from("user_roles").upsert({
        user_id: payment.user_id,
        role: "user",
      }, { onConflict: "user_id,role" });
    }

    const { error: paymentUpdateError } = await supabaseAdmin
      .from("payment_requests")
      .update({
        status: "approved",
        verified_by: caller.id,
        verified_at: now.toISOString(),
      })
      .eq("id", paymentId);

    if (paymentUpdateError) {
      return new Response(JSON.stringify({ error: paymentUpdateError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      userId: payment.user_id,
      membership: "pro",
      membershipExpiresAt: expiresAt.toISOString(),
      paymentId,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("admin-approve-payment error:", error);
    return new Response(JSON.stringify({ error: "সমস্যা হয়েছে, আবার চেষ্টা করুন" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
