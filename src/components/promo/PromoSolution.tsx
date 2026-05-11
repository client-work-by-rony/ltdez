import { motion } from "framer-motion";
import { Sparkles, MapPin, BookOpen, Mic, ArrowRight } from "lucide-react";

const items = [
  {
    icon: BookOpen,
    title: "Bangla Friendly System",
    desc: "প্রতিটি rule ও concept বাংলায় explain — জটিল কিছু নেই।",
    num: "01",
  },
  {
    icon: MapPin,
    title: "Step-by-Step Roadmap",
    desc: "Beginner থেকে fluent — প্রতিদিন কী practice করবেন তা clear।",
    num: "02",
  },
  {
    icon: Mic,
    title: "Real Speaking Practice",
    desc: "Live partner practice + daily speaking task — মুখ খোলার অভ্যাস।",
    num: "03",
  },
];

export default function PromoSolution() {
  return (
    <section className="relative py-20 md:py-28 px-4 bg-gradient-to-br from-orange-50 via-white to-amber-50 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/15 to-amber-200/50 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase shadow-sm">
            <Sparkles className="h-3.5 w-3.5" /> The Solution
          </span>

          <h2 className="mt-6 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
              SPOKEN MASTERY
            </span>
            <span className="text-foreground/80 mx-3">—</span>
            <span className="text-foreground">সম্পূর্ণ Solution</span>
          </h2>

          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-primary/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-primary/40" />
          </div>

          <p className="mt-5 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Beginner-friendly system যেটা আপনাকে hand-hold করে confident English speaker বানাবে।
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="group relative bg-white border border-orange-100 rounded-2xl p-7 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden"
            >
              {/* Top brand bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-amber-400" />

              {/* Number badge */}
              <span className="absolute top-5 right-5 text-xs font-bold tracking-wider text-primary/40 group-hover:text-primary/70 transition-colors">
                {it.num}
              </span>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center mb-5 shadow-lg shadow-primary/30 group-hover:rotate-3 group-hover:scale-110 transition-transform duration-300">
                <it.icon className="h-6 w-6 text-white" />
              </div>

              <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                {it.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {it.desc}
              </p>

              {/* Arrow */}
              <div className="mt-5 flex items-center gap-1.5 text-primary text-sm font-semibold opacity-60 group-hover:opacity-100 group-hover:gap-2.5 transition-all">
                <span>Learn more</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom social proof strip */}
        <motion.a
          href="/checkout"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 group relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-6 py-5 rounded-2xl bg-gradient-to-r from-primary to-amber-500 text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-[1.01] transition-all"
        >
          <div className="flex -space-x-2">
            {["bg-amber-300", "bg-orange-300", "bg-rose-300", "bg-yellow-300"].map((c, i) => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${c}`} />
            ))}
          </div>
          <p className="text-sm md:text-base font-semibold text-center">
            ১০,০০০+ student already started their journey
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold bg-white/20 backdrop-blur px-4 py-1.5 rounded-full group-hover:bg-white/30 transition-colors">
            Join Now <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </motion.a>
      </div>
    </section>
  );
}
