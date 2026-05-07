import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PHONE_DOMAIN = 'phone.noor.local';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, password, full_name } = await req.json();

    const cleanPhone = String(phone || '').trim();
    if (!/^01\d{9}$/.test(cleanPhone)) {
      return new Response(JSON.stringify({ error: 'সঠিক ফোন নম্বর দিন (01XXXXXXXXX)' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!password || String(password).length < 6) {
      return new Response(JSON.stringify({ error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!full_name || !String(full_name).trim()) {
      return new Response(JSON.stringify({ error: 'আপনার নাম দিন' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const syntheticEmail = `${cleanPhone}@${PHONE_DOMAIN}`;

    const { data, error } = await supabase.auth.admin.createUser({
      email: syntheticEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: String(full_name).trim(),
        phone: cleanPhone,
        signup_method: 'phone',
      },
    });

    if (error) {
      const msg = (error.message || '').toLowerCase();
      let userMsg = 'অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে';
      if (msg.includes('already') || msg.includes('exists') || msg.includes('registered')) {
        userMsg = 'এই ফোন নম্বর দিয়ে আগেই অ্যাকাউন্ট আছে। লগইন করুন।';
      } else if (msg.includes('pwned') || msg.includes('weak')) {
        userMsg = 'এই পাসওয়ার্ডটি অনলাইনে leak হয়েছে। আরও শক্তিশালী একটি দিন।';
      }
      return new Response(JSON.stringify({ error: userMsg }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (data.user) {
      await supabase.from('profiles')
        .update({ phone_number: cleanPhone, full_name: String(full_name).trim() })
        .eq('user_id', data.user.id);
    }

    return new Response(JSON.stringify({ success: true, email: syntheticEmail }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message || 'Unexpected error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
