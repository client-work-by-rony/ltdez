import { motion } from "framer-motion";
import { Gift, FileText, Zap, Bot, MessageSquare, ClipboardList } from "lucide-react";

const bonusItems = [
  { icon: FileText, label: "Prompts" },
  { icon: Zap, label: "Automation Templates" },
  { icon: Bot, label: "AI App Kit" },
  { icon: MessageSquare, label: "DM Scripts" },
  { icon: ClipboardList, label: "Proposals" },
];

const BonusSection = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-4xl">
        {/* Course Value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm text-primary uppercase tracking-wider">COURSE VALUE</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Real Course Value</h2>
          <p className="text-muted-foreground mt-2">Here's what you're actually getting in this program.</p>
          
          <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-6">
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground">Core 8‑Week Program</span>
              <span className="block text-2xl font-bold text-primary">৳48,000</span>
            </div>
            <span className="text-2xl font-bold text-primary">+</span>
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-muted-foreground">Resource Kit Bonus</span>
              <span className="block text-2xl font-bold text-primary">৳10,000+</span>
            </div>
          </div>
          
          <div className="mt-6 text-3xl font-bold">
            Total Value: <span className="text-primary">৳58,000+</span>
          </div>
        </motion.div>

        {/* Bonus Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-card border border-primary/30 shadow-glow"
        >
          <div className="text-center mb-8">
            <span className="text-sm text-primary uppercase tracking-wider">Bonus</span>
            <h3 className="text-2xl md:text-3xl font-bold mt-2">Free Bonus (Today Only)</h3>
            <p className="text-muted-foreground mt-2">Get the complete resource kit with your enrollment!</p>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 text-xl font-semibold">
              <Gift className="w-6 h-6 text-primary" />
              🎁 AI CASH MACHINE Resource Kit
            </div>
            <p className="text-muted-foreground mt-1">Everything you need to get started</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {bonusItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border"
              >
                <item.icon className="w-4 h-4 text-primary" />
                <span className="text-sm">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BonusSection;
