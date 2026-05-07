import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function PromoFinalCTA() {
  return (
    <section className="py-20 md:py-32 px-4 bg-[#1a0e08] text-white text-center">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-extrabold leading-tight"
        >
          হাজারো মানুষ Skill চায়।
          <br />
          <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
            Few Take Action.
          </span>
        </motion.h2>
        <p className="mt-6 text-white/70 text-base md:text-lg">
          আজকেই decision নিন — ৯০ দিন পর আপনি একদম নতুন version এ থাকবেন।
        </p>
        <a
          href="#order"
          className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-amber-400 text-primary-foreground font-bold text-lg shadow-2xl shadow-primary/40 hover:scale-[1.03] transition-transform"
        >
          এখনই জয়েন করুন <ArrowRight className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}
