import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const beforeItems = [
  "Confused niche",
  "Jumping between tools",
  "No income direction",
];

const afterItems = [
  "Clear money offer",
  "Working AI system",
  "First paying clients",
];

const TransformationSection = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm text-primary uppercase tracking-wider">Transformation</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Your Transformation Journey</h2>
          <p className="text-muted-foreground mt-2">See where you are now vs where you'll be after the program.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-center">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-card border border-destructive/30"
          >
            <h3 className="text-xl font-semibold mb-6 text-destructive">Before</h3>
            <ul className="space-y-4">
              {beforeItems.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden md:flex justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-hero-gradient flex items-center justify-center shadow-glow">
              <ArrowRight className="w-8 h-8 text-primary-foreground" />
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-card border border-success/30"
          >
            <h3 className="text-xl font-semibold mb-6 text-success">After</h3>
            <ul className="space-y-4">
              {afterItems.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-success shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TransformationSection;
