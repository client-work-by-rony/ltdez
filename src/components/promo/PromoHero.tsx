import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import promoImg from "@/assets/promo-hero.jpg";

export default function PromoHero() {
  return (
    <section id="hero" className="relative pt-24 md:pt-28 pb-12 md:pb-16 px-4 overflow-hidden bg-gradient-to-b from-orange-50 via-amber-50 to-background">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border shadow-sm text-xs font-semibold mb-6"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          ১০০০+ বাংলাদেশী শিক্ষার্থী ইতিমধ্যে যুক্ত
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto w-full max-w-md mb-8"
        >
          <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" />
          <img
            src={promoImg}
            alt="LTDEZ Course Promo"
            width={1024}
            height={1024}
            className="relative w-full h-auto rounded-3xl shadow-2xl shadow-primary/30"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
        >
          হাতের কাজ শিখে{" "}
          <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
            আত্মবিশ্বাসের সাথে
          </span>{" "}
          আয় শুরু করুন
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Bangla Friendly Step-by-Step Handicraft & Online Selling Program — শূন্য থেকে শুরু করে professional craft maker হওয়ার complete roadmap, live practice আর daily support সহ।
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <a
            href="#order"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-primary to-amber-500 text-primary-foreground font-bold text-base shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
          >
            এখনই জয়েন করুন <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center px-7 py-4 rounded-full border border-border bg-white font-semibold text-base hover:bg-muted"
          >
            কী কী পাবেন দেখুন
          </a>
        </motion.div>
      </div>
    </section>
  );
}
