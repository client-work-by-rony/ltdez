import { motion } from "framer-motion";
import { Crown, Mic2, Globe, Volume2, Rocket, Check, Gift, ArrowRight } from "lucide-react";

const bonuses = [
  {
    icon: Mic2,
    title: "Public Speaking Techniques",
    desc: "Audience এর সামনে Confidently কথা বলার Secret Techniques।",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Globe,
    title: "Native Fluency Hacks",
    desc: "Native Speakers যেভাবে Naturally কথা বলে — সেই Style শেখানো হবে।",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Volume2,
    title: "British Phonetics Training",
    desc: "Professional Pronunciation & Accent Improvement System।",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Rocket,
    title: "Inertia Break Method",
    desc: "Speaking শুরু করার ভয় ও Mental Block দূর করার Powerful System।",
    color: "from-rose-500 to-pink-500",
  },
];

const vipPoints = [
  "Personal Fluency Review",
  "Mistake Analysis",
  "Confidence Coaching",
  "Customized Improvement Plan",
];

export default function PromoBonuses() {
  return (
    <section id="bonuses" className="py-20 md:py-28 px-4 bg-[#1a0e08] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* VIP Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-16"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/40 via-yellow-300/40 to-orange-500/40 blur-2xl rounded-3xl" />
          <div className="relative rounded-3xl bg-gradient-to-br from-[#2a1810] via-[#1f1108] to-[#2a1810] border border-amber-400/30 p-8 md:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />

            <div className="grid md:grid-cols-2 gap-8 items-center relative">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-[#1a0e08] text-[11px] font-extrabold tracking-wider uppercase shadow-lg">
                  <Crown className="h-3.5 w-3.5" /> VIP Bonus Session
                </span>
                <h2 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">
                  1-to-1 Private{" "}
                  <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                    Mentorship
                  </span>{" "}
                  Session
                </h2>
                <p className="mt-3 text-white/70 text-base">
                  Direct Personal Guidance & Speaking Improvement Session — শুধুমাত্র SPOKEN MASTERY Members এর জন্য।
                </p>
                <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-amber-400/30">
                  <Gift className="h-4 w-4 text-amber-300" />
                  <span className="text-sm">
                    Bonus Value: <span className="font-extrabold text-amber-300">৳ 5,000</span>
                  </span>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vipPoints.map((p, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-[#1a0e08]" />
                    </div>
                    <span className="text-sm font-medium">{p}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Exclusive Bonuses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-bold tracking-widest uppercase">
            <Gift className="h-3.5 w-3.5" /> Exclusive Bonuses
          </span>
          <h3 className="mt-4 text-2xl md:text-4xl font-extrabold">
            আরো{" "}
            <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
              4টি Premium Bonus
            </span>{" "}
            একদম Free
          </h3>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bonuses.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-6 hover:bg-white/10 hover:border-amber-300/30 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${b.color}`} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <b.icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-bold text-base mb-2 group-hover:text-amber-300 transition-colors">
                {b.title}
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.a
          href="/checkout"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 mx-auto max-w-md flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-amber-400 text-[#1a0e08] font-extrabold text-base shadow-2xl shadow-amber-500/30 hover:scale-[1.02] transition-transform"
        >
          এই সব Bonus সহ Join করুন <ArrowRight className="h-5 w-5" />
        </motion.a>
      </div>
    </section>
  );
}
