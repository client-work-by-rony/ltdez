import { motion } from "framer-motion";
import { Video, BookOpen, Headphones, MessageCircle, FileCheck, Brain } from "lucide-react";

const features = [
  { icon: Video, title: "Step-by-Step ভিডিও লেসন", desc: "প্রতিটি craft technique HD ভিডিওতে শিখুন।" },
  { icon: BookOpen, title: "ডিজাইন ও প্যাটার্ন রিসোর্স", desc: "১০০+ ready-to-use design template ও pattern।" },
  { icon: Headphones, title: "Live Zoom ক্লাস", desc: "Live session-এ প্রশ্ন করুন এবং real-time feedback নিন।" },
  { icon: MessageCircle, title: "WhatsApp Group Support", desc: "যেকোনো সময় instructor ও কমিউনিটির সাহায্য।" },
  { icon: FileCheck, title: "অনলাইন সেলিং গাইড", desc: "Facebook page, Instagram ও marketplace-এ বিক্রি।" },
  { icon: Brain, title: "Mindset & Confidence Training", desc: "ভয়কে আত্মবিশ্বাসে রূপান্তর করার practical system।" },
];

export default function PromoFeatures() {
  return (
    <section id="features" className="py-20 md:py-28 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold">কোর্সে যা যা পাবেন</h2>
          <p className="mt-3 text-muted-foreground">সবকিছু এক জায়গায় — সফল হওয়ার জন্য যা যা দরকার।</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-amber-100 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
