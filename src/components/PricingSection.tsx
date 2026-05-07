import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Users, Sun, BookOpen } from "lucide-react";

const clubs = [
{
  name: "NAFS MASTERY",
  fullName: "Nafs Mastery",
  tagline: "From Desire to Discipline",
  description: "নিজের নফসকে নিয়ন্ত্রণ করো, ইচ্ছাশক্তি ও আত্মসংযম গড়ে তোলো। একটি পরিপূর্ণ জীবনের দিকে এগিয়ে যাও।",
  icon: Shield
},
{
  name: "MMC",
  fullName: "Morning Mastery Club",
  tagline: "Rise Before The World Wakes",
  description: "ভোরের রুটিন ও ডিসিপ্লিন গড়ে তোলার জন্য একটি structured system। প্রতিদিন সকালে নিজেকে এক ধাপ এগিয়ে নাও।",
  icon: Sun
},
{
  name: "LMC Club",
  fullName: "Life Mastery Club",
  tagline: "Learn, Master, Create",
  description: "Learning ও Growth কমিউনিটি। নতুন স্কিল শেখো, নিজেকে develop করো এবং একটি supportive community-র অংশ হও।",
  icon: BookOpen
}];


const PricingSection = () => {
  return (
    <section id="enroll" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12">

          <span className="text-sm text-primary uppercase tracking-wider">Join Now</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Believers' Dreams প্রোগ্রামে যোগদিন  </h2>
          <p className="text-muted-foreground mt-2">নিজের জীবনের control নিজেই নিন।</p>
        </motion.div>

        {/* Club Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {clubs.map((club, index) => {
            const IconComp = club.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-card border border-primary/30 shadow-glow-lg hover:shadow-[0_0_40px_rgba(var(--primary),0.3)] transition-shadow duration-300">

                {/* Icon */}
                <div className="mb-4">
                  <IconComp className="w-10 h-10 text-primary" />
                </div>

                {/* Badge */}
                <div className="mb-6">
                  <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    🌟 {club.name}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-3xl md:text-4xl font-bold text-primary">{club.fullName}</h3>

                {/* Tagline */}
                <p className="text-muted-foreground mt-2 italic">"{club.tagline}"</p>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mt-6 mb-8 px-2">
                  {club.description}
                </p>

                {/* CTA Button */}
                <Button
                  size="lg"
                  className="w-full text-lg py-6 bg-hero-gradient hover:opacity-90 shadow-glow font-semibold mt-auto"
                  asChild>

                  <Link to="/auth">বিস্তারিত দেখুন</Link>
                </Button>

                {/* Trust Badges */}
                <div className="flex justify-center gap-6 mt-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Secure
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Community
                  </div>
                </div>
              </motion.div>);

          })}
        </div>

        {/* Motivation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center p-6 rounded-xl bg-primary/10 border border-primary/30">

          <h3 className="text-xl font-semibold mb-4 text-primary">আপনার স্বপ্ন আপনার হাতে</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Structure পাবেন, consistency ধরে রাখতে পারবেন</li>
            <li>• Accountability system থাকবে</li>
            <li>• একা না, support system আছে</li>
          </ul>
        </motion.div>
      </div>
    </section>);

};

export default PricingSection;