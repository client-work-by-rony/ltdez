import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Globe2, Footprints, Mic2, MessageSquare, GraduationCap, Bot, ArrowRight, Crown, Zap } from "lucide-react";

const reasons = [
  { icon: Globe2, title: "Bangla Friendly Learning", desc: "বাংলায় বুঝিয়ে English শেখানো" },
  { icon: Footprints, title: "Step-by-Step Guidance", desc: "শূন্য থেকে Advanced পর্যন্ত" },
  { icon: Mic2, title: "Live Practice Environment", desc: "Real-time Speaking Practice" },
  { icon: MessageSquare, title: "Real Communication Training", desc: "Daily life conversation focus" },
  { icon: GraduationCap, title: "Beginner Friendly System", desc: "যেকোনো Level থেকে শুরু" },
  { icon: Bot, title: "AI Powered Practice", desc: "24/7 AI Speaking Partner" },
];

export default function PromoWhyLove() {
  return (
    <section className="py-20 md:py-28 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 text-primary text-xs font-bold tracking-widest uppercase bg-primary/10 px-4 py-1.5 rounded-full">
            💎 Why Students Love Our Courses
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">
            Practical Learning <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            আমাদের প্রতিটি Course এমনভাবে তৈরি যাতে আপনি শুধু Theory না শিখে — Real Speaking Skill Build করতে পারেন।
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <r.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-extrabold text-sm md:text-base">{r.title}</h3>
              <p className="mt-1 text-xs md:text-sm text-muted-foreground">{r.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Decision helper */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center max-w-2xl mx-auto"
        >
          <h3 className="text-2xl md:text-3xl font-extrabold">🎯 Which Program Should You Choose?</h3>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-amber-50 to-orange-50 p-6 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <Crown className="h-6 w-6 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Complete Transformation</span>
            </div>
            <p className="text-sm text-muted-foreground">Want Complete Fluency Transformation?</p>
            <p className="mt-1 text-xl font-extrabold">Choose SPOKEN MASTERY</p>
            <Link
              to="/checkout?program=spoken-mastery"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
            >
              Enroll Now <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-orange-50 to-amber-50 p-6 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Fast Confidence</span>
            </div>
            <p className="text-sm text-muted-foreground">Want Fast Confidence & Speaking Practice?</p>
            <p className="mt-1 text-xl font-extrabold">Choose FEAR TO FLUENT BOOTCAMP</p>
            <Link
              to="/checkout?program=live-bootcamp"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
            >
              Join Bootcamp <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
