import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Quote, BookOpen, Brain, Users, ListChecks } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const SelfReflectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="container mx-auto max-w-3xl relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> ফিরে যান
          </button>
          <motion.div {...fadeUp}>
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              সফল মানুষের সেই <span className="text-primary">'গোপন' অভ্যাস</span>
            </h1>
            <p className="text-xl text-muted-foreground">যা আপনাকে বদলে দিতে পারে!</p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              আমরা সবাই সফল হতে চাই, দৌড়াতে চাই। কিন্তু আমরা কি জানি আমরা সঠিক পথে দৌড়াচ্ছি কি না? পৃথিবীর সবথেকে প্রভাবশালী ব্যক্তিদের মধ্যে একটি সাধারণ অভ্যাস লক্ষ্য করা যায়—তা হলো <strong className="text-foreground">'Self-reflection'</strong> বা আত্ম-প্রতিফলন।
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-3xl px-4 pb-20">
        {/* Success Stories */}
        <motion.div {...fadeUp} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            সফলদের জীবন থেকে শিক্ষা
          </h2>
          <div className="grid gap-4">
            {[
              { name: "বিল গেটস", text: "তিনি বছরে দুবার \"Think Week\" পালন করেন। সব ধরনের যোগাযোগ বিচ্ছিন্ন করে নির্জনে শুধু চিন্তা আর পড়াশোনা করেন। মাইক্রোসফটের বড় বড় আইডিয়া কিন্তু এখান থেকেই এসেছে!" },
              { name: "স্টিভ জবস", text: "প্রতিদিন আয়নার সামনে দাঁড়িয়ে নিজেকে প্রশ্ন করতেন— \"যদি আজই আমার জীবনের শেষ দিন হতো, তবে আজ আমি যা করতে যাচ্ছি তা কি সত্যিই করতে চাইতাম?\"" },
              { name: "অপরাহ উইনফ্রে", text: "তার সাফল্যের অন্যতম হাতিয়ার হলো Journaling বা ডায়েরি লেখা। নিজের অভিজ্ঞতা লিখে রাখা এবং তা নিয়ে ভাবাই তাকে আজকের অবস্থানে নিয়ে এসেছে।" },
              { name: "আলবার্ট আইন্সটাইন", text: "তিনি মনে করতেন, কঠোর পরিশ্রমের চেয়েও জরুরি হলো সমস্যার গভীরে গিয়ে চিন্তা করা।" },
            ].map((person, i) => (
              <div key={i} className="p-5 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-primary mb-2">{person.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{person.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Islamic Section */}
        <motion.div {...fadeUp} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" />
            ইসলাম ও আত্ম-প্রতিফলন (মুহাসাবাহ)
          </h2>
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              ইসলাম আমাদের শিখিয়েছে 'মুহাসাবাহ' বা আত্ম-পর্যালোচনার গুরুত্ব। পরকালে আল্লাহর কাছে হিসাব দেওয়ার আগে আজই নিজের হিসাব নেওয়া বুদ্ধিমানের কাজ।
            </p>
            <blockquote className="border-l-4 border-primary pl-4 py-2 italic">
              "হে মুমিনগণ! তোমরা আল্লাহকে ভয় করো; আর প্রত্যেক ব্যক্তির উচিত এটা লক্ষ্য করা যে, সে আগামীকালের (পরকালের) জন্য কী পাঠিয়েছে।"
              <span className="block text-primary text-sm mt-1 not-italic">— সূরা হাশর: ১৮</span>
            </blockquote>
            <blockquote className="border-l-4 border-primary pl-4 py-2 italic">
              সেই ব্যক্তিই প্রকৃত বুদ্ধিমান, যে নিজের নফসের (প্রবৃত্তি) হিসাব গ্রহণ করে।
              <span className="block text-primary text-sm mt-1 not-italic">— তিরমিজি: ২৪৫৯</span>
            </blockquote>
            <blockquote className="border-l-4 border-primary pl-4 py-2 italic">
              "তোমাদের হিসাব নেওয়ার আগে তোমরা নিজেদের হিসাব নিজেরা গ্রহণ করো।"
              <span className="block text-primary text-sm mt-1 not-italic">— খলিফা হযরত উমর (রা.)</span>
            </blockquote>
          </div>
        </motion.div>

        {/* Science */}
        <motion.div {...fadeUp} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Brain className="w-6 h-6 text-primary" />
            বিজ্ঞানের ভাষায় এর গুরুত্ব
          </h2>
          <div className="p-6 rounded-2xl bg-card border border-border mb-4">
            <div className="text-center mb-6 p-6 rounded-xl bg-primary/10 border border-primary/30">
              <p className="text-4xl font-bold text-primary">২৩%</p>
              <p className="text-muted-foreground mt-1">বেশি ভালো পারফরম্যান্স — মাত্র ১৫ মিনিটের Self-reflection-এ</p>
              <p className="text-xs text-muted-foreground mt-1">— হার্ভার্ড বিজনেস স্কুল গবেষণা</p>
            </div>
          </div>
        </motion.div>

        {/* 3 Methods */}
        <motion.div {...fadeUp} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <ListChecks className="w-6 h-6 text-primary" />
            আপনি আজ থেকেই যেভাবে শুরু করবেন
          </h2>
          <div className="grid gap-4">
            {[
              { title: "What, So What, Now What মডেল", desc: "আজ কী ঘটল? এর প্রভাব কী? এবং ভবিষ্যতে কী করব?—এই তিনটি ধাপে চিন্তা করুন।" },
              { title: "স্টপ অ্যান্ড গো (Stop & Go)", desc: "সপ্তাহ শেষে ভাবুন—কোন কাজটি আমি বন্ধ করব, কোনটি চালু রাখব এবং কোনটি নতুন করে শুরু করব।" },
              { title: "ইভিনিং রিভিউ (৫ মিনিটের ইসলামিক রুটিন)", desc: "রাতে ঘুমানোর আগে ৫ মিনিট চোখ বন্ধ করে সারাদিনের কাজের হিসাব মেলান। ভালো কাজের জন্য বলুন: 'আলহামদুলিল্লাহ'। ভুলের জন্য ক্ষমা চেয়ে বলুন: 'আস্তাগফিরুল্লাহ'।" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl bg-card border border-border">
                <span className="text-2xl font-bold text-primary shrink-0">{i + 1}</span>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Closing */}
        <motion.div {...fadeUp} className="text-center py-8">
          <blockquote className="text-xl md:text-2xl font-bold text-primary italic">
            "সফলতা মানে কেবল অন্ধের মতো দৌড়ানো নয়, বরং সঠিক পথে এগিয়ে যাওয়া।"
          </blockquote>
          <p className="text-muted-foreground mt-4">
            আপনার আত্ম-প্রতিফলনই হোক আপনার জীবনের কম্পাস।
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-8 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
          >
            ← ফিরে যান
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SelfReflectionPage;
