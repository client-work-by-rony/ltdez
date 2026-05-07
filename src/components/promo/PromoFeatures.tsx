import { motion } from "framer-motion";
import { Mic, BookOpen, Headphones, MessageCircle, Video, Brain, Users, Check, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Daily Speaking Practice",
    desc: "প্রতিদিন structured speaking task — অভ্যাসই key।",
    highlight: "60+ Days Practice",
    color: "from-orange-500 to-red-500",
    span: "",
  },
  {
    icon: BookOpen,
    title: "Vocabulary System",
    desc: "৫০০+ daily-use word ও phrase, smart memorization technique সহ।",
    highlight: "500+ Words",
    color: "from-blue-500 to-cyan-500",
    span: "",
  },
  {
    icon: Headphones,
    title: "Pronunciation Training",
    desc: "প্রতিটি sound ও accent এর সঠিক pronunciation drill।",
    highlight: "Native Accent",
    color: "from-purple-500 to-pink-500",
    span: "",
  },
  {
    icon: Video,
    title: "Live Zoom Class",
    desc: "Weekly live session — instructor এর সাথে real-time practice। Recording সবসময় available।",
    highlight: "Weekly Live",
    color: "from-green-500 to-emerald-500",
    span: "",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Support",
    desc: "যেকোনো সময় instructor ও community এর সাহায্য।",
    highlight: "24/7 Support",
    color: "from-teal-500 to-green-500",
    span: "",
  },
  {
    icon: Brain,
    title: "Confidence Building",
    desc: "Fear-killing mindset training — ভয় কে আত্মবিশ্বাসে রূপান্তর।",
    highlight: "Mindset Shift",
    color: "from-amber-500 to-orange-500",
    span: "",
  },
  {
    icon: Users,
    title: "Real Conversation Practice",
    desc: "Partner pairing ও role-play — actual conversation এ fluency।",
    highlight: "Real Practice",
    color: "from-rose-500 to-pink-500",
    span: "",
  },
];

const checklist = [
  "Complete 60-Day Speaking Roadmap",
  "500+ Vocabulary & Phrase Library",
  "Weekly Live Zoom Classes",
  "Lifetime Recording Access",
  "WhatsApp Group Support",
  "Certificate of Completion",
];

export default function PromoFeatures() {
  return (
    <section id="features" className="py-20 md:py-28 px-4 bg-background relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase">
            <Check className="h-3.5 w-3.5" /> What's Included
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-extrabold">
            কোর্সে যা যা <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">পাবেন</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Fluent English Speaker হওয়ার জন্য যা যা দরকার — সবকিছু এক জায়গায়, step-by-step।
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`group relative bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${f.span}`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r ${f.color} text-white mb-4`}>
                {f.highlight}
              </span>

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className="h-6 w-6 text-white" />
              </div>

              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>

              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 relative"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-amber-300/20 blur-xl rounded-3xl" />
          <div className="relative bg-gradient-to-br from-white to-orange-50/50 border border-border rounded-3xl p-8 md:p-10 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
                  <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">Everything You Need</span> in One Place
                </h3>
                <p className="text-muted-foreground">
                  আর কোনো confusion নয় — কোথায় শুরু করবেন, কীভাবে practice করবেন, সব কিছু ready আছে।
                </p>
                <a
                  href="/checkout"
                  className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-amber-500 text-white font-bold text-sm shadow-lg hover:scale-[1.02] transition-transform"
                >
                  Enroll Now <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {checklist.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border/50"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
