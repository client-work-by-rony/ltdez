import { useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ADMIN_WHATSAPP = "8801711282515";
const PRICE = 499;

export default function PromoOrderForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !/^01\d{9}$/.test(form.phone)) {
      toast({ title: "অসম্পূর্ণ তথ্য", description: "সঠিক নাম ও ফোন নম্বর দিন (01XXXXXXXXX)", variant: "destructive" });
      return;
    }
    setLoading(true);
    const msg = encodeURIComponent(
      `নতুন অর্ডার — Fear To Fluent\n\nনাম: ${form.name}\nফোন: ${form.phone}\nইমেইল: ${form.email || "-"}\nঠিকানা: ${form.address || "-"}\n\nProgram: Fear To Fluent — English Speaking Program\nমূল্য: ৳${PRICE}\n\nPayment instruction পাঠান।`
    );
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${msg}`, "_blank");
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <section id="order" className="py-20 md:py-28 px-4 bg-orange-50/40">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Complete Your <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">Order</span>
          </h2>
          <p className="mt-3 text-muted-foreground">নিচের form fill up করুন — আমরা WhatsApp এ payment instruction পাঠাব।</p>
        </div>

        <form onSubmit={submit} className="bg-white border border-border rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
          {[
            { k: "name", label: "Full Name", ph: "আপনার নাম", type: "text" },
            { k: "phone", label: "Phone Number", ph: "01XXXXXXXXX", type: "tel" },
            { k: "email", label: "Email (Optional)", ph: "you@email.com", type: "email" },
          ].map((f) => (
            <div key={f.k}>
              <label className="block text-sm font-semibold mb-1.5">{f.label}</label>
              <input
                type={f.type}
                value={(form as any)[f.k]}
                onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                placeholder={f.ph}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Address (Optional)</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="আপনার ঠিকানা"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>

          <div className="flex items-center justify-between bg-muted rounded-xl px-4 py-3">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-extrabold text-primary">৳ {PRICE}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary via-orange-500 to-amber-400 text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 hover:scale-[1.01] transition-transform disabled:opacity-60"
          >
            {loading ? "Processing..." : <>Place Order Now <ArrowRight className="h-5 w-5" /></>}
          </button>
          <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
            <Lock className="h-3 w-3" /> আপনার তথ্য সম্পূর্ণ নিরাপদ ও কখনো শেয়ার করা হবে না।
          </p>
        </form>
      </div>
    </section>
  );
}
