import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Star } from "lucide-react";
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
          ১০০০+ শিক্ষার্থী ইংরেজি বলা শুরু করেছেন
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
            alt="Fear To Fluent — English Speaking Program"
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
          Speak English{" "}
          <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
            Confidently
          </span>{" "}
          — Even If You're Starting From Zero
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Bangla Friendly Step-by-Step English Speaking Fluency Program — শূন্য থেকে শুরু করে fluent speaker হওয়ার complete roadmap, live practice আর daily support সহ।
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <a
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-primary to-amber-500 text-primary-foreground font-bold text-base shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
          >
            Start Speaking Today <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center px-7 py-4 rounded-full border border-border bg-white font-semibold text-base hover:bg-muted"
          >
            কী কী পাবেন দেখুন
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" /> ১০০০+ Active Learners</span>
          <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> 4.9/5 Student Rating</span>
          <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> Weekly Live Zoom Class</span>
        </motion.div>
      </div>
    </section>
  );
}
