import { motion } from "framer-motion";
import { Check, Zap, Clock, Lock, ShieldCheck } from "lucide-react";

const includes = [
  "Complete ৬০-Day Speaking Roadmap",
  "৫০০+ Vocabulary ও Phrase Library",
  "Pronunciation Drill Pack",
  "Weekly Live Zoom Class",
  "Daily Speaking Tasks",
  "WhatsApp Group Support",
  "Lifetime Recording Access",
  "Confidence Mindset Training",
];

export default function PromoPricing() {
  return (
    <section className="py-20 md:py-28 px-4 bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-xs font-bold">
          <Clock className="h-3.5 w-3.5" /> LIMITED TIME OFFER
        </span>
        <h2 className="mt-5 text-3xl md:text-5xl font-extrabold">
          One-Time Special <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">Pricing</span>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-amber-300/30 blur-2xl rounded-3xl" />
          <div className="relative bg-white border border-border rounded-3xl p-8 md:p-10 shadow-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-amber-400 text-white text-[11px] font-bold">
              <Zap className="h-3 w-3" /> MOST POPULAR
            </span>
            <h3 className="mt-4 text-xl font-bold">Fear To Fluent — Full Program</h3>

            <div className="mt-6">
              <div className="text-muted-foreground line-through text-lg">৳ ২,৯৯০</div>
              <div className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                ৳ ৪৯৯
              </div>
              <div className="mt-2 text-red-500 text-sm font-bold">
                <Zap className="h-3.5 w-3.5 inline" /> Save ৳ ২,৪৯১ — শুধু আজকের জন্য
              </div>
            </div>

            <ul className="mt-8 grid sm:grid-cols-2 gap-3 text-left">
              {includes.map((it, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm">{it}</span>
                </li>
              ))}
            </ul>

            <a
              href="/checkout"
              className="mt-8 w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary via-orange-500 to-amber-400 text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
            >
              <Zap className="h-5 w-5" /> Place Order Now
            </a>
            <p className="mt-3 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Lock className="h-3 w-3" /> Secure Checkout • Payment এর পর Instant Access
            </p>
          </div>
        </motion.div>

        <div className="mt-12">
          <p className="text-xs font-bold text-muted-foreground tracking-wider">ACCEPTED PAYMENT METHODS</p>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            {["bKash", "Nagad", "Rocket", "Card"].map((m) => (
              <span key={m} className="px-4 py-2 rounded-full bg-white border border-border text-sm font-semibold shadow-sm">
                {m}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-green-600" /> 100% Secure & Encrypted Checkout
          </p>
        </div>
      </div>
    </section>
  );
}
