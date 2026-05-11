import { motion } from "framer-motion";
import {
  Layers,
  Zap,
  BookOpen,
  HelpCircle,
  Presentation,
  Shuffle,
  Users,
  Bot,
  Check,
} from "lucide-react";

const modules = [
  {
    num: "01",
    icon: Layers,
    title: "Basic Building Mastery",
    tag: "5 Power Classes",
    desc: "English Speaking এর Strong Foundation তৈরি করার Step-by-Step Training।",
    color: "from-orange-500 to-amber-500",
    points: ["Sentence Formation Basics", "Daily Use Speaking Structure", "Confidence Building Exercises", "Vocabulary Activation"],
  },
  {
    num: "02",
    icon: Zap,
    title: "Fluency Special Training",
    tag: "5 Advanced Classes",
    desc: "Fluency Increase করার জন্য Practical Speaking System।",
    color: "from-rose-500 to-orange-500",
    points: ["Fast Speaking Techniques", "Hesitation Removal", "Real Conversation Flow", "Instant Response Training"],
  },
  {
    num: "03",
    icon: BookOpen,
    title: "Communicative Grammar",
    tag: "Practical Grammar",
    desc: "Grammar মুখস্থ নয় — Real Conversation এ ব্যবহার শেখানো হবে।",
    color: "from-blue-500 to-cyan-500",
    points: ["Practical Grammar Use", "Speaking Friendly Grammar", "Common Mistake Correction", "Natural Sentence Pattern"],
  },
  {
    num: "04",
    icon: HelpCircle,
    title: "Questioning Techniques",
    tag: "Smart Framework",
    desc: "Smart Question করার Powerful Framework।",
    color: "from-violet-500 to-purple-500",
    points: ["Professional Questioning Style", "Real Conversation Questions", "Interview Question Flow", "Interaction Skills"],
  },
  {
    num: "05",
    icon: Presentation,
    title: "Topic Based Presentation",
    tag: "Confident Speaking",
    desc: "যেকোনো Topic এ Confidently কথা বলার Training।",
    color: "from-emerald-500 to-teal-500",
    points: ["Structured Speaking Method", "Presentation Confidence", "Thought Organization", "Public Communication"],
  },
  {
    num: "06",
    icon: Shuffle,
    title: "Random Topic Challenge",
    tag: "Instant Thinking",
    desc: "Instant Thinking & Speaking Ability Build করার জন্য।",
    color: "from-pink-500 to-rose-500",
    points: ["Random Topic Practice", "Fast Thinking Training", "Instant Sentence Creation", "Fear Breaking System"],
  },
  {
    num: "07",
    icon: Users,
    title: "60 Hours Group Discussion",
    tag: "Massive Practice",
    desc: "Real Speaking Environment এ Massive Practice Opportunity।",
    color: "from-amber-500 to-yellow-500",
    points: ["Partner Discussion Sessions", "Team Conversation Practice", "Real Communication Training", "Daily Speaking Activities"],
  },
  {
    num: "08",
    icon: Bot,
    title: "AI Powered Practice",
    tag: "24/7 Support",
    desc: "দিনভর AI এর সাথে English Practice করার সুযোগ।",
    color: "from-indigo-500 to-blue-500",
    points: ["AI Speaking Partner", "24/7 Practice Support", "Pronunciation Improvement", "Fluency Repetition"],
  },
];

export default function PromoModules() {
  return (
    <section id="modules" className="py-20 md:py-28 px-4 bg-gradient-to-b from-background via-orange-50/40 to-background relative overflow-hidden">
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
            <Layers className="h-3.5 w-3.5" /> 8 Powerful Modules
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
              SPOKEN MASTERY
            </span>{" "}
            এর ভিতরে যা শিখবেন
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            শূন্য থেকে শুরু করে Real Life Confident Speaker — প্রতিটি Module আপনাকে এক ধাপ এগিয়ে নেবে।
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${m.color}`} />

              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <m.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-extrabold text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
                  {m.num}
                </span>
              </div>

              <span className={`inline-block text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r ${m.color} bg-clip-text text-transparent mb-2`}>
                {m.tag}
              </span>
              <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors leading-snug">
                {m.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{m.desc}</p>

              <ul className="space-y-1.5 pt-3 border-t border-border/60">
                {m.points.map((p, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-[11px] text-foreground/80">
                    <Check className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
