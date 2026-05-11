import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Minus, Crown, Zap, ArrowRight } from "lucide-react";

type Row = {
  feature: string;
  spoken: string | boolean;
  bootcamp: string | boolean;
};

const rows: Row[] = [
  { feature: "Program Type", spoken: "Complete System", bootcamp: "Live Bootcamp" },
  { feature: "Duration", spoken: "Long-term Mastery", bootcamp: "Short Intensive" },
  { feature: "Basic Building Master Class", spoken: true, bootcamp: false },
  { feature: "Fluency Special Training", spoken: true, bootcamp: true },
  { feature: "Communicative Grammar", spoken: true, bootcamp: false },
  { feature: "Questioning Techniques", spoken: true, bootcamp: true },
  { feature: "Topic Based Presentation", spoken: true, bootcamp: false },
  { feature: "Random Topic Speaking", spoken: true, bootcamp: true },
  { feature: "Group Discussion Practice", spoken: "60+ Hours", bootcamp: "Live Zoom" },
  { feature: "AI Speaking Practice", spoken: true, bootcamp: true },
  { feature: "VIP One-to-One Session", spoken: true, bootcamp: false },
  { feature: "Public Speaking Training", spoken: true, bootcamp: false },
  { feature: "British Phonetics", spoken: true, bootcamp: false },
  { feature: "Native Fluency Hacks", spoken: true, bootcamp: false },
  { feature: "Live Zoom Classes", spoken: false, bootcamp: true },
  { feature: "WhatsApp Support Group", spoken: true, bootcamp: true },
  { feature: "Practice Partner System", spoken: true, bootcamp: true },
  { feature: "Beginner Friendly", spoken: true, bootcamp: true },
  { feature: "Best For", spoken: "Complete Fluency", bootcamp: "Fast Confidence" },
  { feature: "Program Value", spoken: "৳15,000+", bootcamp: "৳2,500+" },
];

function Cell({ value, accent }: { value: string | boolean; accent?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/15 text-primary">
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
    ) : (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-muted-foreground">
        <Minus className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span className={`text-xs md:text-sm font-bold ${accent ? "text-primary" : "text-foreground"}`}>{value}</span>
  );
}

export default function PromoComparison() {
  return (
    <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-background via-orange-50/30 to-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 text-primary text-xs font-bold tracking-widest uppercase bg-primary/10 px-4 py-1.5 rounded-full">
            ⚖️ Course Comparison
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">
            Side-by-Side{" "}
            <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">Comparison</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            দুটি Program এর Feature পাশাপাশি দেখে আপনার জন্য Perfect Choice নির্বাচন করুন।
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-border bg-card shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-[1.4fr_1fr_1fr] md:grid-cols-[1.6fr_1fr_1fr] bg-gradient-to-br from-[#1a0e08] via-zinc-900 to-[#1a0e08] text-white">
            <div className="p-4 md:p-6 flex items-center text-xs md:text-sm font-bold uppercase tracking-widest text-white/60">
              Features
            </div>
            <div className="p-4 md:p-6 text-center border-l border-white/10 relative">
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-primary text-black">
                BEST SELLER
              </span>
              <Crown className="h-5 w-5 md:h-6 md:w-6 text-primary mx-auto mt-3" />
              <p className="mt-1.5 font-extrabold text-sm md:text-lg leading-tight">SPOKEN MASTERY</p>
              <p className="text-[10px] md:text-xs text-white/60 mt-0.5">Complete Fluency</p>
            </div>
            <div className="p-4 md:p-6 text-center border-l border-white/10 relative">
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-orange-500 text-white">
                POPULAR
              </span>
              <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary mx-auto mt-3" />
              <p className="mt-1.5 font-extrabold text-sm md:text-lg leading-tight">FEAR TO FLUENT</p>
              <p className="text-[10px] md:text-xs text-white/60 mt-0.5">Live Bootcamp</p>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {rows.map((r, i) => (
              <div
                key={r.feature}
                className={`grid grid-cols-[1.4fr_1fr_1fr] md:grid-cols-[1.6fr_1fr_1fr] items-center hover:bg-orange-50/40 transition-colors ${
                  i % 2 === 1 ? "bg-muted/30" : ""
                }`}
              >
                <div className="p-3 md:p-4 text-xs md:text-sm font-semibold text-foreground">{r.feature}</div>
                <div className="p-3 md:p-4 text-center border-l border-border">
                  <Cell value={r.spoken} accent />
                </div>
                <div className="p-3 md:p-4 text-center border-l border-border">
                  <Cell value={r.bootcamp} />
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-[1.4fr_1fr_1fr] md:grid-cols-[1.6fr_1fr_1fr] bg-muted/40 border-t border-border">
            <div className="hidden md:block p-4" />
            <div className="p-3 md:p-4 border-l border-border">
              <Link
                to="/checkout?program=spoken-mastery"
                className="w-full inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-full bg-gradient-to-r from-primary to-amber-400 text-black font-bold text-[11px] md:text-sm shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform"
              >
                Enroll <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="p-3 md:p-4 border-l border-border">
              <Link
                to="/checkout?program=live-bootcamp"
                className="w-full inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-full border-2 border-primary text-primary font-bold text-[11px] md:text-sm hover:bg-primary hover:text-white transition-colors"
              >
                Join <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          💡 দুটোতেই Bangla Friendly Learning, Real Practice, এবং Beginner Support পাবেন।
        </p>
      </div>
    </section>
  );
}
