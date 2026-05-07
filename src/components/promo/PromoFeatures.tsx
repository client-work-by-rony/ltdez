import { motion } from "framer-motion";
import { Mic, BookOpen, Headphones, MessageCircle, Video, Brain, Users } from "lucide-react";

const features = [
  { icon: Mic, title: "Daily Speaking Practice", desc: "প্রতিদিন structured speaking task — অভ্যাসই key।" },
  { icon: BookOpen, title: "Vocabulary System", desc: "৫০০+ daily-use word ও phrase, smart memorization technique সহ।" },
  { icon: Headphones, title: "Pronunciation Training", desc: "প্রতিটি sound ও accent এর সঠিক pronunciation drill।" },
  { icon: Video, title: "Live Zoom Class", desc: "Weekly live session — instructor এর সাথে real-time practice।" },
  { icon: MessageCircle, title: "WhatsApp Support", desc: "যেকোনো সময় instructor ও community এর সাহায্য।" },
  { icon: Brain, title: "Confidence Building", desc: "Fear-killing mindset training — ভয় কে আত্মবিশ্বাসে রূপান্তর।" },
  { icon: Users, title: "Real Conversation Practice", desc: "Partner pairing ও role-play — actual conversation এ fluency।" },
];

export default function PromoFeatures() {
  return (
    <section id="features" className="py-20 md:py-28 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold">কোর্সে যা যা পাবেন</h2>
          <p className="mt-3 text-muted-foreground">Fluent English Speaker হওয়ার জন্য যা যা দরকার — সবকিছু এক জায়গায়।</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-amber-100 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
