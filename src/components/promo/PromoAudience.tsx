import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Rocket, Search, Mic2, Globe, Laptop } from "lucide-react";

const items = [
  { icon: GraduationCap, label: "Students" },
  { icon: Briefcase, label: "Job Seekers" },
  { icon: Laptop, label: "Freelancers" },
  { icon: Rocket, label: "Beginners" },
  { icon: Search, label: "University Students" },
  { icon: Globe, label: "Online Earners" },
  { icon: Mic2, label: "Content Creators" },
];

export default function PromoAudience() {
  return (
    <section className="py-12 md:py-16 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-center text-sm font-semibold text-muted-foreground mb-6">এই কোর্স কাদের জন্য</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center">
                <it.icon className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xs text-center">{it.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
