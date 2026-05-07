import { motion } from "framer-motion";
import { ClipboardCheck, MessageCircleQuestion, UserCheck, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AccountabilityItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  route: string;
}

const accountabilityItems: AccountabilityItem[] = [
{
  icon: ClipboardCheck,
  title: "Daily Tracker",
  desc: "কাজ, সময়, অভ্যাস — সব track করুন",
  route: "/daily-tracker"
},
{
  icon: MessageCircleQuestion,
  title: "Self-reflection প্রশ্ন",
  desc: "নিজেকে জানো, নিজেকে বোঝো",
  route: "/self-reflection"
},
{
  icon: UserCheck,
  title: "নিজের সাথে Accountability",
  desc: "প্রতিদিন নিজের সাথে নিজের জবাবদিহি",
  route: "/self-accountability"
}];


const DailyAccountabilitySection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12">

          <span className="text-sm text-primary uppercase tracking-wider">Daily Accountability</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            স্বপ্ন টিকে থাকে না—<span className="text-primary">track না করলে।</span>
          </h2>
          <p className="text-muted-foreground mt-4">আমাদের Daily Accountability System:</p>
        </motion.div>

        {/* Accountability Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {accountabilityItems.map((item, index) =>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(item.route)}
            className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-glow transition-all duration-300 text-center cursor-pointer">

              <div className="w-14 h-14 rounded-full bg-hero-gradient flex items-center justify-center mx-auto mb-4 shadow-glow">
                <item.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
              <span className="text-xs text-primary mt-3 inline-block">বিস্তারিত দেখুন →</span>
            </motion.div>
          )}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl bg-destructive/10 border border-destructive/30 text-center">

          <p className="text-lg font-medium text-destructive">

          </p>
        </motion.div>
      </div>
    </section>);

};

export default DailyAccountabilitySection;