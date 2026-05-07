import { motion } from "framer-motion";
import { XCircle, Wallet, HelpCircle } from "lucide-react";

const items = [
  { icon: XCircle, title: "Skill নেই", desc: "কোনো কাজ জানি না, তাই ইনকামের পথ পাচ্ছি না।" },
  { icon: Wallet, title: "Income নেই", desc: "ঘরে বসে কিছু করতে চাই, কিন্তু রাস্তা জানি না।" },
  { icon: HelpCircle, title: "শুরু কোথা থেকে?", desc: "এত গাইড, এত কোর্স — কোনটা সঠিক বুঝি না।" },
];

export default function NoorProblem() {
  return (
    <section id="problem" className="py-16 md:py-24 px-4 bg-secondary/40">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold">আপনি কি এই সমস্যায় ভুগছেন?</h2>
        <p className="mt-3 text-muted-foreground">নিচের যেকোনো একটার সাথে মিল আছে — আপনি সঠিক জায়গায় এসেছেন।</p>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-border rounded-2xl p-7 text-left shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <it.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{it.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
