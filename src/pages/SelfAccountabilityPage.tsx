import { motion } from "framer-motion";
import { ArrowLeft, UserCheck, Quote, BookOpen, Brain, Users, Award, ListChecks } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const SelfAccountabilityPage = () => {
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
              <UserCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Self-Accountability: <span className="text-primary">অজুহাত নয়, আত্ম-সংশোধনই হোক আপনার মূলমন্ত্র</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              আমরা প্রায়ই আমাদের ব্যর্থতার জন্য অন্যদের দোষ দেই, কিন্তু দিনশেষে আমাদের জীবন আমাদেরই সিদ্ধান্তের প্রতিফলন।
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-3xl px-4 pb-20">
        {/* Quran & Hadith */}
        <motion.div {...fadeUp} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" />
            কোরআন এবং হাদিসের নির্দেশনা
          </h2>
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 space-y-6">
            <blockquote className="border-l-4 border-primary pl-4 py-2 italic">
              "বরং মানুষ নিজের সম্পর্কে নিজেই সম্যক অবগত (নিজের কাজের হিসাব তার নিজের কাছেই পরিষ্কার)।"
              <span className="block text-primary text-sm mt-1 not-italic">— সূরা আল-কিয়ামাহ: ১৪</span>
            </blockquote>
            <blockquote className="border-l-4 border-primary pl-4 py-2 italic">
              "নিশ্চয়ই আল্লাহ কোনো জাতির অবস্থা ততক্ষণ পরিবর্তন করেন না, যতক্ষণ না তারা নিজেদের অবস্থা নিজেরা পরিবর্তন করে।"
              <span className="block text-primary text-sm mt-1 not-italic">— সূরা আর-রাদ: ১১</span>
            </blockquote>
          </div>
        </motion.div>

        {/* Science */}
        <motion.div {...fadeUp} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Brain className="w-6 h-6 text-primary" />
            বিজ্ঞানের দৃষ্টিতে আত্ম-জবাবদিহিতা
          </h2>
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4 text-muted-foreground leading-relaxed">
            <p>
              আধুনিক সাইকোলজি এবং নিউরোসায়েন্স বলছে, যারা নিয়মিত নিজের কাজের মূল্যায়ন করেন, তাদের মস্তিষ্কের <strong className="text-foreground">Prefrontal Cortex</strong> অনেক বেশি কার্যকর থাকে।
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-secondary border border-border">
                <h3 className="font-semibold text-foreground mb-2">Metacognition</h3>
                <p className="text-sm">মানুষ নিজের চিন্তাভাবনা নিয়ে নিজেই চিন্তা করে। এটি শেখার গতি এবং সমস্যা সমাধানের ক্ষমতা বহুগুণ বাড়িয়ে দেয়।</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary border border-border">
                <h3 className="font-semibold text-foreground mb-2">Growth Mindset</h3>
                <p className="text-sm">প্রফেসর Carol Dweck এর মতে, নিজের ভুল স্বীকার করা এবং তা থেকে শিক্ষা নেওয়ার মানসিকতাই অসাধারণ করে তোলে।</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Stories */}
        <motion.div {...fadeUp} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            যারা এই চর্চায় সফল হয়েছেন
          </h2>
          <div className="grid gap-4">
            {[
              { name: "বেঞ্জামিন ফ্রাঙ্কলিন", text: "প্রতিদিন রাতে ডায়েরি লিখতেন এবং ১৩টি মানবিক গুণের একটি চার্ট বজায় রাখতেন। প্রতিদিনের শেষে তিনি দেখতেন কোন গুণটি আজ পালন করতে পেরেছেন আর কোনটি পারেননি।" },
              { name: "ওয়ারেন বাফেট", text: "প্রতি বছর তার বিনিয়োগের ভুলগুলো নিয়ে একটি \"Mistake Manual\" তৈরি করেন, যাতে একই ভুল দ্বিতীয়বার না হয়।" },
              { name: "ইলন মাস্ক", text: "তিনি 'Feedback Loop' এর ওপর জোর দেন। সবসময় নিজেকে প্রশ্ন করেন, \"আমি কী করেছি এবং কীভাবে এটি আরও ভালো করা যেত?\"" },
            ].map((person, i) => (
              <div key={i} className="p-5 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-primary mb-2">{person.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{person.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Researchers */}
        <motion.div {...fadeUp} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Award className="w-6 h-6 text-primary" />
            গবেষক ও প্রবক্তা
          </h2>
          <div className="grid gap-4">
            <div className="p-5 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-primary mb-2">Stephen Covey</h3>
              <p className="text-muted-foreground leading-relaxed">
                তার বিখ্যাত বই <em>The 7 Habits of Highly Effective People</em>-এ তিনি 'Be Proactive' অভ্যাসের মাধ্যমে নিজের জীবনের দায়িত্ব নেওয়ার কথা বলেছেন।
              </p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-primary mb-2">Jocko Willink</h3>
              <p className="text-muted-foreground leading-relaxed">
                মার্কিন নেভি সিল কমান্ডার এবং লেখক, যার মূলমন্ত্রই হলো "Extreme Ownership"। আপনার সাথে যা ঘটছে তার জন্য আপনিই দায়ী—এই মানসিকতাই জয়ী হওয়ার মূল শক্তি।
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Items */}
        <motion.div {...fadeUp} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <ListChecks className="w-6 h-6 text-primary" />
            আপনি আজ থেকে যা করতে পারেন
          </h2>
          <div className="grid gap-4">
            {[
              "রাতে ঘুমানোর আগে ৫ মিনিট ভাবুন আজ সারাদিনে আপনি কী কী ভুল করেছেন।",
              "একটি 'Gratitude & Growth' জার্নাল মেইনটেইন করুন।",
              "নিজেদের ভুলগুলো অন্যের ওপর না চাপিয়ে তা সংশোধনের উপায় খুঁজুন।",
            ].map((text, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl bg-card border border-border">
                <span className="text-2xl font-bold text-primary shrink-0">•</span>
                <p className="text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Closing */}
        <motion.div {...fadeUp} className="text-center py-8">
          <blockquote className="text-xl md:text-2xl font-bold text-primary italic">
            "আপনি যখন নিজের কাছে দায়বদ্ধ থাকবেন, তখন আপনাকে সফল হওয়া থেকে কেউ আটকাতে পারবে না।"
          </blockquote>
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

export default SelfAccountabilityPage;
