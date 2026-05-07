import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const before = ["কোন skill নেই", "আয়ের পথ বন্ধ", "Confidence কম", "সময় নষ্ট হচ্ছে", "নিজের উপর সন্দেহ"];
const after = ["Professional Craft Skill", "মাসে ১০–৩০ হাজার আয়", "Strong Confidence", "Productive Routine", "Proud of yourself"];

export default function PromoTransformation() {
  return (
    <section className="py-20 md:py-28 px-4 bg-orange-50/40">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold">
            আপনার <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">Transformation</span>
          </h2>
          <p className="mt-3 text-muted-foreground">৯০ দিনে আপনি একদম নতুন version এ পরিণত হবেন।</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 bg-red-50 border-2 border-red-100"
          >
            <span className="text-xs font-bold text-red-500">BEFORE</span>
            <h3 className="text-2xl font-extrabold mt-1 mb-5">আজকের আপনি</h3>
            <ul className="space-y-3">
              {before.map((b, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0">
                    <X className="h-3.5 w-3.5 text-red-600" />
                  </div>
                  <span className="text-foreground/80">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 bg-green-50 border-2 border-green-100"
          >
            <span className="text-xs font-bold text-green-600">AFTER 90 DAYS</span>
            <h3 className="text-2xl font-extrabold mt-1 mb-5">নতুন আপনি</h3>
            <ul className="space-y-3">
              {after.map((a, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3.5 w-3.5 text-green-700" />
                  </div>
                  <span className="font-medium">{a}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
