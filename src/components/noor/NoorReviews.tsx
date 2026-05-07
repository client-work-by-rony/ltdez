import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { name: "রুমা আক্তার", role: "ঢাকা", text: "মাত্র ১ মাসেই প্রথম অর্ডার পেয়েছি! গাইডলাইন একদম সহজ।" },
  { name: "সাবিনা ইয়াসমিন", role: "চট্টগ্রাম", text: "Beginner হিসেবে শুরু করেছিলাম, এখন নিজে প্রোডাক্ট সেল করছি।" },
  { name: "মাহফুজা বেগম", role: "সিলেট", text: "সাপোর্ট গ্রুপ অসাধারণ। যেকোনো প্রশ্নের উত্তর সাথে সাথে পাই।" },
];

export default function NoorReviews() {
  return (
    <section id="reviews" className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold">শিক্ষার্থীরা যা বলছেন</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-border rounded-2xl p-7 shadow-sm"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/85 leading-relaxed">"{r.text}"</p>
              <div className="mt-5 pt-4 border-t border-border">
                <p className="font-bold">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
