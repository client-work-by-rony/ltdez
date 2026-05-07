import { motion } from "framer-motion";
import { Sparkles, MapPin, BookOpen } from "lucide-react";

const items = [
  { icon: BookOpen, title: "Bangla Friendly System", desc: "প্রতিটি concept বাংলায় explain — জটিল কিছু নেই।" },
  { icon: MapPin, title: "Step-by-Step Roadmap", desc: "Beginner থেকে professional — প্রতিদিন কী করতে হবে clear।" },
];

export default function PromoSolution() {
  return (
    <section className="py-20 md:py-28 px-4 bg-orange-50/40">
      <div className="max-w-4xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" /> THE SOLUTION
        </span>
        <h2 className="mt-5 text-3xl md:text-5xl font-extrabold">
          <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">Fear To Skill</span> — সম্পূর্ণ Solution
        </h2>
        <p className="mt-3 text-muted-foreground">
          Beginner-friendly system যেটা আপনাকে hand-hold করে professional craft maker বানাবে।
        </p>
        <div className="mt-12 grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center mb-4">
                <it.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{it.title}</h3>
              <p className="text-sm text-muted-foreground">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
