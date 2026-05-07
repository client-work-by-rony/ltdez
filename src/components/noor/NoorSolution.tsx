import { motion } from "framer-motion";
import { Palette, Package, ShoppingBag } from "lucide-react";

const items = [
  { icon: Palette, title: "ডিজাইন শেখাবো", desc: "শূন্য থেকে প্রফেশনাল ডিজাইন কনসেপ্ট ও প্যাটার্ন।" },
  { icon: Package, title: "প্রোডাক্ট বানানো", desc: "হাতে কলমে প্রোডাক্ট তৈরির পুরো প্রক্রিয়া।" },
  { icon: ShoppingBag, title: "অনলাইন সেলিং", desc: "Facebook, Instagram ও Marketplace-এ বিক্রির সিস্টেম।" },
];

export default function NoorSolution() {
  return (
    <section id="solution" className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <span className="text-primary text-sm font-bold tracking-widest uppercase">সমাধান</span>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold">আমাদের কোর্স যা শেখাবে</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">শূন্য থেকে শুরু করে ইনকাম পর্যন্ত — পুরো জার্নির সাথী।</p>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-2xl p-7 text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-5 shadow-lg shadow-primary/30">
                <it.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">{it.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
