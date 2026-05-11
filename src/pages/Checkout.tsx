import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, CheckCircle2, ArrowLeft, Loader2, Sparkles, Award, Clock, Users } from "lucide-react";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/ltdez-logo.png";

const PRODUCT = {
  name: "Fear To Fluent — English Speaking Program",
  price: 499,
  oldPrice: 1499,
};

const schema = z.object({
  name: z.string().trim().min(2, "নাম কমপক্ষে ২ অক্ষর").max(100),
  phone: z.string().regex(/^01[0-9]{9}$/, "সঠিক ফোন নম্বর দিন (01XXXXXXXXX)"),
  email: z.string().trim().email("সঠিক ইমেইল দিন").max(255).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  trxId: z.string().trim().min(5, "TrxID কমপক্ষে ৫ অক্ষর").max(30, "TrxID সর্বোচ্চ ৩০ অক্ষর"),
});

const methods = [
  { id: "bkash", name: "bKash", color: "from-pink-500 to-pink-600", letter: "b", number: "01711282515" },
  { id: "nagad", name: "Nagad", color: "from-orange-500 to-red-500", letter: "N", number: "01711282515" },
  { id: "rocket", name: "Rocket", color: "from-purple-600 to-purple-700", letter: "R", number: "01711282515" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", trxId: "" });
  const [method, setMethod] = useState("bkash");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Checkout — Fear To Fluent";
  }, []);

  const selectedMethod = methods.find((m) => m.id === method)!;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "অসম্পূর্ণ তথ্য",
        description: parsed.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase.from("payment_requests").insert({
        user_id: userData.user?.id || null,
        customer_name: parsed.data.name,
        customer_email: parsed.data.email || null,
        customer_address: parsed.data.address || null,
        phone_number: parsed.data.phone,
        transaction_id: parsed.data.trxId,
        amount: PRODUCT.price,
        payment_method: method,
        product_name: PRODUCT.name,
        purchase_type: "course",
        status: "pending",
      });
      if (error) throw error;
      toast({
        title: "✅ অর্ডার সাবমিট হয়েছে",
        description: "Admin verify করার পর আপনাকে এনরোল করা হবে।",
      });
      navigate("/thank-you");
    } catch (err: any) {
      toast({
        title: "সাবমিট করা যায়নি",
        description: err?.message || "আবার চেষ্টা করুন।",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30">
      {/* Top bar */}
      <div className="border-b border-border bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> ফিরে যান
          </button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="LTDEZ" className="h-7 w-auto" />
            <span className="text-sm font-bold">LTDEZ</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Limited Time Offer
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold">Complete Your Order</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">কয়েক সেকেন্ডে payment complete করুন</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left — product summary */}
          <motion.aside initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">আপনার অর্ডার</p>
              <h2 className="text-lg font-bold leading-snug">{PRODUCT.name}</h2>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-3xl font-extrabold text-primary">৳{PRODUCT.price}</span>
                <span className="text-base text-muted-foreground line-through">৳{PRODUCT.oldPrice}</span>
                <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {Math.round((1 - PRODUCT.price / PRODUCT.oldPrice) * 100)}% OFF
                </span>
              </div>

              <ul className="mt-5 space-y-2.5">
                {[
                  "৩০+ recorded video lessons",
                  "৫টি live speaking session",
                  "৪০ দিনের community support",
                  "Lifetime course access",
                  "Course completion certificate",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { Icon: ShieldCheck, label: "Secure" },
                { Icon: Award, label: "Trusted" },
                { Icon: Users, label: "10K+ Students" },
              ].map(({ Icon, label }) => (
                <div key={label} className="bg-white rounded-xl border border-border p-3 text-center">
                  <Icon className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900">
                <strong>দ্রুত শেষ হবে!</strong> এই দামে আর মাত্র কয়েক ঘণ্টা — আজই enroll করুন।
              </p>
            </div>
          </motion.aside>

          {/* Right — form */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3">
            <form onSubmit={submit} className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm space-y-5">
              <div>
                <h3 className="text-base font-bold mb-1">Billing Information</h3>
                <p className="text-xs text-muted-foreground">আপনার তথ্য সম্পূর্ণ নিরাপদ</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="আপনার নাম" />
                <Field label="Phone Number *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="01XXXXXXXXX" type="tel" />
                <Field label="Email (Optional)" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@email.com" type="email" />
                <Field label="Address (Optional)" value={form.address} onChange={(v) => setForm({ ...form, address: v })} placeholder="ঠিকানা" />
              </div>

              <div className="pt-2">
                <h3 className="text-base font-bold mb-3">Payment Method</h3>
                <div className="grid grid-cols-3 gap-3">
                  {methods.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all text-center ${
                        method === m.id ? "border-primary bg-primary/5 shadow-md" : "border-border bg-white hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-br ${m.color} text-white font-extrabold flex items-center justify-center mb-2`}>
                        {m.letter}
                      </div>
                      <p className="text-xs font-semibold">{m.name}</p>
                      {method === m.id && (
                        <CheckCircle2 className="absolute top-1.5 right-1.5 h-4 w-4 text-primary fill-primary/20" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-2">
                <p className="text-xs font-bold text-primary uppercase tracking-wide">পেমেন্ট নির্দেশনা</p>
                <p className="text-sm">
                  অনুগ্রহ করে <strong>{selectedMethod.name}</strong> এ <strong>৳{PRODUCT.price}</strong> পাঠান এই নম্বরে — <span className="font-mono font-bold text-primary text-base select-all">{selectedMethod.number}</span> (Send Money)।
                </p>
                <p className="text-xs text-muted-foreground">
                  পাঠানোর পর প্রাপ্ত <strong>Transaction ID (TrxID)</strong> নিচে লিখে সাবমিট করুন।
                </p>
              </div>

              <Field
                label={`${selectedMethod.name} Transaction ID (TrxID) *`}
                value={form.trxId}
                onChange={(v) => setForm({ ...form, trxId: v })}
                placeholder="যেমন: 9A8B7C6D5E"
              />

              <div className="border-t border-border pt-5 space-y-2">
                <Row label="Subtotal" value={`৳${PRODUCT.oldPrice}`} muted />
                <Row label="Discount" value={`- ৳${PRODUCT.oldPrice - PRODUCT.price}`} muted accent="text-green-600" />
                <Row label="Total" value={`৳${PRODUCT.price}`} bold />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary via-orange-500 to-amber-500 text-primary-foreground font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</>
                ) : (
                  <><Lock className="h-5 w-5" /> অর্ডার সাবমিট করুন ৳{PRODUCT.price}</>
                )}
              </button>

              <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3 w-3" /> Admin verify করার পর আপনাকে instant access দেওয়া হবে
              </p>
            </form>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 text-foreground/80">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
      />
    </div>
  );
}

function Row({ label, value, muted, bold, accent }: { label: string; value: string; muted?: boolean; bold?: boolean; accent?: string }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "text-lg pt-2 border-t border-border" : "text-sm"}`}>
      <span className={muted ? "text-muted-foreground" : "font-bold"}>{label}</span>
      <span className={`${bold ? "font-extrabold text-primary text-2xl" : "font-semibold"} ${accent || ""}`}>{value}</span>
    </div>
  );
}
