import { motion } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

const problems = [
  { title: "কোথা থেকে শুরু করবেন বুঝতে পারছেন না", desc: "অনেক ভিডিও দেখেছেন, কিন্তু গুছিয়ে কিছু শিখতে পারছেন না।" },
  { title: "অনলাইনে বিক্রির পদ্ধতি জানেন না", desc: "প্রোডাক্ট বানালেও কাস্টমার পাচ্ছেন না, আয় হচ্ছে না।" },
  { title: "মূলধন কম, ভয়ও আছে", desc: "বড় investment ছাড়া শুরু করার সঠিক রাস্তা খুঁজে পাচ্ছেন না।" },
  { title: "Confidence-ই নেই", desc: "নিজের কাজ মানুষকে দেখাতে লজ্জা ও দ্বিধা কাজ করে।" },
];

export default function PromoProblem() {
  return (
    <section className="py-20 md:py-28 px-4 bg-[#1a0e08] text-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-900/60 text-red-300 text-xs font-semibold">
            <AlertTriangle className="h-3.5 w-3.5" /> THE REAL PROBLEM
          </span>
          <h2 className="mt-5 text-3xl md:text-4xl font-extrabold">
            আপনি কি এই সমস্যাগুলোতে আটকে আছেন?
          </h2>
          <p className="mt-3 text-white/60 text-sm md:text-base">
            ৯৫% নতুন handicraft learner এই একই সমস্যায় ভুগছেন — আপনি একা নন।
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-red-950/30 border border-red-900/40 rounded-2xl p-6"
            >
              <div className="w-9 h-9 rounded-lg bg-red-900/50 flex items-center justify-center mb-4">
                <X className="h-5 w-5 text-red-300" />
              </div>
              <h3 className="font-bold text-lg mb-2">{p.title}</h3>
              <p className="text-white/60 text-sm">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
