import { motion } from "framer-motion";

const traits = [
  "প্র্যাক্টিক্যাল অ্যাপ্রোচ",
  "সৎ ও স্বচ্ছ",
  "সিস্টেম-ফোকাসড",
  "বিগিনার ফ্রেন্ডলি",
];

const InstructorSection = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm text-primary uppercase tracking-wider">ইন্সট্রাক্টর</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">আপনার ইন্সট্রাক্টর</h2>
        </motion.div>

        {/* Instructor Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-2xl bg-card border border-border"
        >
          {/* Image */}
          <div className="shrink-0">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary/30 shadow-glow">
              <img 
                src="https://aicm.coachrony.com/assets/instructor-coach-rony-DkMOPg4O.png"
                alt="Coach Rony"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4">Coach Rony</h3>
            <p className="text-muted-foreground mb-6">
              আমি বিশ্বাস করি যে AI শেখার জন্য হাইপ নয়, পরিষ্কার দিকনির্দেশনা দরকার। আমার লক্ষ্য হলো আপনাকে সিম্পল এবং প্র্যাক্টিক্যাল উপায়ে AI ইনকাম জার্নি শুরু করতে সাহায্য করা। কোনো ফেক প্রমিজ নেই, শুধু রিয়েল অ্যাকশনেবল গাইডেন্স।
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {traits.map((trait, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InstructorSection;
