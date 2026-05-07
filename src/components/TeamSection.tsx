import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import teamMember1 from "@/assets/team-member-1.jpg";
import teamMember2 from "@/assets/team-member-2.jpg";

const teamMembers = [
  {
    name: "Md. Touhidul Islam",
    role: "Founder, Believers' Dreams",
    title: "Strategic Leader & Growth Framework Specialist",
    description: "He believes that the foundation of success for any business or individual lies in four fundamental elements: Vision, Mission, Passion, and Innovation. To survive and achieve excellence in a competitive market, he transforms these four elements into a well-organized 'Success Framework'.",
    image: teamMember1,
  },
  {
    name: "Sadman Sadik Mohammad",
    role: "Co-Founder, Believers' Dreams",
    title: "Spiritual & Strategic Mentor",
    description: "He believes that true fulfillment lies in the pleasure of Allah and the purification of the soul (Nafs). His mission is to liberate people from worldly illusions and the deceptions of Satan, helping them rediscover their true essence and build a disciplined, ethical, and successful life.",
    image: teamMember2,
  },
];

const TeamSection = () => {
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
          <span className="text-sm text-primary uppercase tracking-wider">আমাদের টিম</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Meet Our Team</h2>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <Heart className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-2 text-primary">
            Ultimate Success is Jannah
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Dedicating life to Allah's commands and spiritual excellence.
          </p>
        </motion.div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/30 shadow-glow">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-xl font-bold mb-1">{member.name}</h4>
              <p className="text-sm text-primary font-medium mb-1">{member.role}</p>
              <p className="text-sm text-muted-foreground font-medium mb-3">{member.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
