import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const forYouItems = [
  "You want real income, not just certificates",
  "You want to use AI to solve business problems",
  "You want your first paying client",
  "You want systems, not hustle",
];

const notForItems = [
  "Free content collectors",
  "No‑action mindset",
];

const TargetAudienceSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm text-primary uppercase tracking-wider">Target Audience</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Is This Program Right for You?</h2>
          <p className="text-muted-foreground mt-2">Check if you match any of these criteria.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* This is for you */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-card border border-border"
          >
            <h3 className="text-xl font-semibold mb-6 text-success flex items-center gap-2">
              <Check className="w-5 h-5" /> This is for you if:
            </h3>
            <ul className="space-y-4">
              {forYouItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Not for */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-card border border-border"
          >
            <h3 className="text-xl font-semibold mb-6 text-destructive flex items-center gap-2">
              <X className="w-5 h-5" /> Not for:
            </h3>
            <ul className="space-y-4">
              {notForItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;
