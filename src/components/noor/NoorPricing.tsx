import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "১০০+ HD Video Lessons",
  "Step-by-step Practical Guide",
  "Private Support Group",
  "Lifetime Access",
  "সার্টিফিকেট",
  "Online Selling Bonus মডিউল",
];

export default function NoorPricing() {
  return (
    <section id="pricing" className="py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-primary text-sm font-bold tracking-widest uppercase">প্রাইসিং</span>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold">এক ফি — পুরো কোর্স লাইফটাইম</h2>
        <p className="mt-3 text-muted-foreground">সীমিত সময়ের জন্য বিশেষ মূল্য।</p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 bg-white rounded-3xl border border-border shadow-2xl shadow-primary/10 p-8 md:p-12 text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
            ৫০% OFF
          </div>

          <h3 className="text-2xl font-extrabold">Noor Handicraft — Full Course</h3>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-muted-foreground line-through text-xl">৳১৯৯৯</span>
            <span className="text-5xl md:text-6xl font-extrabold text-primary">৳৯৯৯</span>
            <span className="text-muted-foreground text-sm">/ Lifetime</span>
          </div>

          <ul className="mt-7 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </span>
                <span className="text-foreground/85">{f}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/auth"
            className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 hover:scale-[1.01] transition-transform"
          >
            Enroll Now <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-3 text-xs text-center text-muted-foreground">৭ দিনের মানি-ব্যাক গ্যারান্টি</p>
        </motion.div>
      </div>
    </section>
  );
}
