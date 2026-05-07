import { motion } from "framer-motion";

const modules = [
  { number: "01", title: "Offer Clarity & Positioning", desc: "Profitable niche + one clear money offer", value: "৳5,000" },
  { number: "02", title: "Vibe Coding (Advanced)", desc: "Prompt → Product | Client‑ready AI tools", value: "৳7,000" },
  { number: "03", title: "AI Automation for Clients", desc: "Lead → Follow‑up → Booking automation", value: "৳8,000" },
  { number: "04", title: "AI Marketing System", desc: "Authority content + DM → Call system", value: "৳6,000" },
  { number: "05", title: "Client Acquisition", desc: "Outreach scripts + closing basics", value: "৳6,000" },
  { number: "06", title: "Delivery & Retention", desc: "Client onboarding + monthly retainer", value: "৳5,000" },
  { number: "07", title: "Scale with Systems", desc: "Templates + reusable automation", value: "৳5,000" },
  { number: "08", title: "Productize Your Skill", desc: "Service → Product → Passive income", value: "৳6,000" },
];

const ModulesSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm text-primary uppercase tracking-wider">Program Overview</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">What's Inside AI CASH MACHINE – PRO BUILDERS</h2>
          <p className="text-muted-foreground mt-2">8‑Week Paid Advanced Program</p>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-5 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-muted-foreground">Module {module.number}</span>
                <span className="text-xs text-primary">Value: {module.value}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {module.title}
              </h3>
              <p className="text-sm text-muted-foreground">{module.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
