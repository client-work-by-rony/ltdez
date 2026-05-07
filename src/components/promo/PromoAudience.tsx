import { motion } from "framer-motion";
import { GraduationCap, Home, Briefcase, Rocket } from "lucide-react";

const items = [
  { icon: GraduationCap, label: "শিক্ষার্থী" },
  { icon: Home, label: "গৃহিণী" },
  { icon: Briefcase, label: "চাকরিজীবী" },
  { icon: Rocket, label: "Beginners" },
];

export default function PromoAudience() {
  return (
    <section className="py-12 md:py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-center text-sm font-semibold text-muted-foreground mb-6">এই কোর্স কাদের জন্য</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center">
                <it.icon className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-sm">{it.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
