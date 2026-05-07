import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, BookOpen, HelpCircle, Loader2, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const WHATSAPP_GROUP = "https://chat.whatsapp.com/your-group-link";
const SUPPORT_PHONE = "8801711282515";

export default function ThankYou() {
  const [params] = useSearchParams();
  const orderId = params.get("order_id") || params.get("order") || "";
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Payment Successful — Fear To Fluent";
    if (!orderId) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from("payment_requests")
        .select("*")
        .eq("gateway_order_id", orderId)
        .maybeSingle();
      setOrder(data);
      setLoading(false);
    })();
  }, [orderId]);

  const txn = order?.gateway_transaction_id || order?.transaction_id || orderId;

  const copy = () => {
    navigator.clipboard.writeText(txn);
    toast({ title: "Copied!", description: "Transaction ID copied to clipboard" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-xl border border-border p-8 md:p-10 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-5">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </motion.div>

          <h1 className="text-2xl md:text-3xl font-extrabold mb-2">Payment Successful! 🎉</h1>
          <p className="text-muted-foreground mb-6">আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।</p>

          {txn && (
            <div className="bg-muted rounded-xl p-4 mb-6 text-left">
              <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm font-mono font-semibold break-all">{txn}</code>
                <button onClick={copy} className="p-2 rounded-lg hover:bg-white shrink-0"><Copy className="h-4 w-4" /></button>
              </div>
            </div>
          )}

          {order && (
            <div className="grid grid-cols-2 gap-3 mb-6 text-left">
              <Info label="Customer" value={order.customer_name || "-"} />
              <Info label="Amount" value={`৳${order.amount}`} />
              <Info label="Method" value={order.payment_method || "-"} />
              <Info label="Status" value={order.status} accent="text-green-600" />
            </div>
          )}

          <div className="space-y-3 mt-6">
            <h3 className="font-bold text-sm">Next Steps</h3>
            <a href={WHATSAPP_GROUP} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition">
              <MessageCircle className="h-5 w-5" /> WhatsApp গ্রুপে join করুন
            </a>
            <Link to="/dashboard/courses" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-amber-500 text-primary-foreground font-bold transition shadow-lg shadow-primary/20">
              <BookOpen className="h-5 w-5" /> Course access করুন
            </Link>
            <a href={`https://wa.me/${SUPPORT_PHONE}`} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border hover:bg-muted text-sm font-semibold">
              <HelpCircle className="h-4 w-4" /> Support — {SUPPORT_PHONE}
            </a>
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          একটি confirmation email আপনার ইমেইলে পাঠানো হয়েছে (যদি দেওয়া থাকে)।
        </p>
      </div>
    </main>
  );
}

function Info({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-muted/40 rounded-lg p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</p>
      <p className={`text-sm font-bold mt-0.5 ${accent || ""}`}>{value}</p>
    </div>
  );
}
