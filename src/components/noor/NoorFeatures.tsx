import { motion } from "framer-motion";
import { PlayCircle, ListChecks, Users, Infinity as InfIcon } from "lucide-react";

const items = [
  { icon: PlayCircle, title: "Video Lessons", desc: "HD ভিডিও লেসন, যেকোনো ডিভাইস থেকে দেখুন।" },
  { icon: ListChecks, title: "Step-by-step Guide", desc: "প্রত্যেক স্টেপের ক্লিয়ার গাইডলাইন।" },
  { icon: Users, title: "Private Support Group", desc: "প্রশ্নের সাথে সাথে উত্তর, কমিউনিটি সাপোর্ট।" },
  { icon: InfIcon, title: "Lifetime Access", desc: "একবার এনরোল — সারাজীবন এক্সেস।" },
];

export default function NoorFeatures() {
  return (
    <section id="features" className="py-16 md:py-24 px-4 bg-secondary/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold">কোর্সে যা যা পাবেন</h2>
          <p className="mt-3 text-muted-foreground">শেখার জার্নি সহজ ও পূর্ণাঙ্গ করতে যা যা দরকার, সব এক জায়গায়।</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all"
            >
              <it.icon className="h-9 w-9 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-1.5">{it.title}</h3>
              <p className="text-sm text-muted-foreground">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
