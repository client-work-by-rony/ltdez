import { motion } from "framer-motion";
import { ArrowRight, Star, Users, Infinity as InfIcon } from "lucide-react";
import logo from "@/assets/noor-logo.png";

export default function NoorHero() {
  return (
    <section id="hero" className="relative pt-28 md:pt-36 pb-16 md:pb-24 px-4 overflow-hidden">
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5">
            <Star className="h-3.5 w-3.5 fill-primary" />
            ১০০০+ শিক্ষার্থী ইতিমধ্যে শুরু করেছেন
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
            হাতের কাজ শিখে <br />
            <span className="text-primary">ঘরে বসেই ইনকাম</span> শুরু করুন
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl">
            Beginner হলেও সমস্যা নেই — Step by Step শেখানো হবে। ডিজাইন, প্রোডাক্ট তৈরি ও অনলাইন সেলিং — সব এক কোর্সে।
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="#courses"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-primary text-primary-foreground font-bold text-base shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
            >
              এখনই জয়েন করুন <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full border border-border bg-white text-foreground font-semibold text-base hover:bg-muted"
            >
              কোর্স দেখুন
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> ১০০০+ স্টুডেন্ট</div>
            <div className="flex items-center gap-2"><InfIcon className="h-4 w-4 text-primary" /> Lifetime Access</div>
            <div className="flex items-center gap-2"><Star className="h-4 w-4 text-primary fill-primary" /> ৪.৯/৫ রেটিং</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative flex justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-[3rem] blur-2xl" />
          <div className="relative bg-white border border-border rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-primary/10">
            <img src={logo} alt="Noor" className="w-full max-w-sm h-auto object-contain" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
