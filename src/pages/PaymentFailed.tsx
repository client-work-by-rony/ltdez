import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, RotateCcw, MessageCircle } from "lucide-react";

const SUPPORT_PHONE = "8801711282515";

export default function PaymentFailed() {
  const [params] = useSearchParams();
  const reason = params.get("reason") || params.get("status") || "Payment was not completed";

  useEffect(() => { document.title = "Payment Failed — Fear To Fluent"; }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4 flex items-center">
      <div className="max-w-md mx-auto w-full">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-xl border border-border p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-5">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="text-2xl font-extrabold mb-2">Payment Failed</h1>
          <p className="text-muted-foreground mb-6 text-sm">{reason}</p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left text-xs text-amber-900">
            <strong>চিন্তা করবেন না!</strong> আপনার টাকা যদি কেটে নেওয়া হয়, ২৪ ঘণ্টার মধ্যে refund হয়ে যাবে।
          </div>

          <div className="space-y-3">
            <Link to="/checkout" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-amber-500 text-primary-foreground font-bold transition shadow-lg shadow-primary/20">
              <RotateCcw className="h-5 w-5" /> আবার চেষ্টা করুন
            </Link>
            <a href={`https://wa.me/${SUPPORT_PHONE}`} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border hover:bg-muted text-sm font-semibold">
              <MessageCircle className="h-4 w-4" /> Support এর সাথে কথা বলুন
            </a>
            <Link to="/" className="block text-xs text-muted-foreground hover:text-primary mt-2">← হোম পেজে ফিরে যান</Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
