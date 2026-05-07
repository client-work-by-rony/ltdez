import { motion } from "framer-motion";
import { Eye, Compass, Flame, Lightbulb } from "lucide-react";

const cards = [
  {
    title: "Vision",
    icon: Eye,
    description: "একটি disciplined, passionate এবং self-aware generation তৈরি করা—যারা নিজের স্বপ্নের দায়িত্ব নিজেই নেয়।",
  },
  {
    title: "Mission",
    icon: Compass,
    description: "মানুষকে নিজের ভেতরের সম্ভাবনাকে চিনতে শেখানো এবং প্রতিদিনের ছোট action দিয়ে বড় পরিবর্তন তৈরি করা।",
  },
  {
    title: "Passion",
    icon: Flame,
    description: "যা ভালোবাসো তার পেছনে ছুটো—passion-ই তোমাকে এগিয়ে নেবে, থামতে দেবে না।",
  },
  {
    title: "Innovation",
    icon: Lightbulb,
    description: "নতুন চিন্তা, নতুন পথ—সবকিছুতে creative approach রাখো এবং পরিবর্তনের নেতৃত্ব দাও।",
  },
];

const MissionVisionSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm text-primary uppercase tracking-wider">Mastery driven by Passion</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Vision to Innovation</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const IconComp = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-hero-gradient flex items-center justify-center mb-5 shadow-glow">
                  <IconComp className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{card.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
