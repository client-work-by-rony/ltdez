import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Brain, Target, BookOpen, Users, Lightbulb, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const DailyTrackerPage = () => {
  const navigate = useNavigate();
  const [showVirtues, setShowVirtues] = useState(false);
  const [showTimeBlocking, setShowTimeBlocking] = useState(false);

  const virtues = [
    { bn: "পরিমিতিবোধ", en: "Temperance", desc: "খাওয়ার সময় অতিরিক্ত খাবেন না; মাতাল হওয়ার মতো পান করবেন না।" },
    { bn: "মিতবাক হওয়া", en: "Silence", desc: "অন্যের বা নিজের উপকার হয় এমন কথা ছাড়া অপ্রয়োজনীয় কথা বলবেন না; তুচ্ছ আলাপ এড়িয়ে চলুন।" },
    { bn: "শৃঙ্খলাপরায়ণতা", en: "Order", desc: "আপনার প্রতিটি জিনিসের জন্য নির্দিষ্ট স্থান রাখুন; প্রতিটি কাজের জন্য নির্দিষ্ট সময় বরাদ্দ করুন।" },
    { bn: "সংকল্প", en: "Resolution", desc: "যা করা উচিত তা করার সংকল্প করুন; যা সংকল্প করেছেন তা বিচ্যুতিহীনভাবে সম্পন্ন করুন।" },
    { bn: "মিতাচার বা সাশ্রয়", en: "Frugality", desc: "অন্যের বা নিজের ভালো হয় এমন কিছু ছাড়া অতিরিক্ত ব্যয় করবেন না; কোনো কিছু অপচয় করবেন না।" },
    { bn: "পরিশ্রম", en: "Industry", desc: "সময় নষ্ট করবেন না; সর্বদা কোনো না কোনো দরকারী কাজে ব্যস্ত থাকুন; অপ্রয়োজনীয় সব কাজ বাদ দিন।" },
    { bn: "সরলতা", en: "Sincerity", desc: "কোনো ক্ষতিকর ছলনা করবেন না; নির্দোষভাবে ও ন্যায়সঙ্গতভাবে চিন্তা করুন এবং কথা বলার সময়ও তা বজায় রাখুন।" },
    { bn: "ন্যায়নিষ্ঠতা", en: "Justice", desc: "কারো ক্ষতি করে বা প্রাপ্য অধিকার থেকে বঞ্চিত করে অন্যায় করবেন না।" },
    { bn: "মধ্যপন্থা", en: "Moderation", desc: "চরমপন্থা পরিহার করুন; অন্যের দেওয়া আঘাতের প্রতি ততটুকু বিরক্তি প্রকাশ করবেন না যতটুকু সে পাওয়ার যোগ্য বলে আপনি মনে করেন।" },
    { bn: "পরিচ্ছন্নতা", en: "Cleanliness", desc: "শরীর, পোশাক বা বাসস্থানে কোনো প্রকার অপরিচ্ছন্নতা সহ্য করবেন না।" },
    { bn: "প্রশান্তি", en: "Tranquility", desc: "তুচ্ছ বিষয় বা সাধারণ দুর্ঘটনা অথবা অনিবার্য কোনো ঘটনায় বিচলিত হবেন না।" },
    { bn: "পবিত্রতা", en: "Chastity", desc: "সুস্বাস্থ্যের জন্য বা বংশবৃদ্ধির জন্য পরিমিত মিলন করুন; কখনো জড়তা, দুর্বলতা বা নিজের বা অন্যের শান্তি ও সম্মানের ক্ষতি করে এমন কিছু করবেন না।" },
    { bn: "বিনয়", en: "Humility", desc: "যিশু এবং সক্রেটিসকে অনুসরণ করুন (অর্থাৎ অত্যন্ত বিনয়ী হোন)।" },
  ];

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
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Daily Tracker: <span className="text-primary">হারানো সময় কি আর ফিরে আসবে?</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              আমরা অনেকেই দিন শেষে আফসোস করি— "আজ সারাদিন কী করলাম? সময়টা কোথায় গেল?" অথচ এই সময়ের প্রতিটি সেকেন্ড আমাদের জীবনের একেকটি অমূল্য সম্পদ।
            </p>
          </motion.div>
        </div>
      </section>

      {/* Islamic Importance */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div {...fadeUp} className="rounded-2xl border border-primary/30 bg-primary/5 p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Quote className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">ইসলামে সময়ের গুরুত্ব</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              মহান আল্লাহ তায়ালা সময়ের কসম খেয়ে বলেছেন—
            </p>
            <blockquote className="border-l-4 border-primary pl-4 py-2 text-foreground italic mb-4">
              "নিশ্চয়ই মানুষ ক্ষতির মধ্যে নিমজ্জিত" — সূরা আসর
            </blockquote>
            <p className="text-muted-foreground leading-relaxed">
              হাদিসে এসেছে, কিয়ামতের দিন পাঁচটি প্রশ্নের উত্তর না দিয়ে কেউ এক কদমও নড়তে পারবে না, যার অন্যতম হলো— "সে তার জীবন কোন কাজে ব্যয় করেছে?"
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Daily Tracker বা আত্ম-হিসাব রাখা মূলত Self-reflection পদ্ধতিরই আধুনিক রূপ। প্রতিদিন ঘুমানোর আগে নিজের কাজের হিসাব নেওয়া একজন মুমিনের বৈশিষ্ট্য।
            </p>
          </motion.div>

          {/* Why You Need */}
          <motion.div {...fadeUp}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              কেন আপনার একটি 'Daily Tracker' প্রয়োজন?
            </h2>
            <div className="grid gap-4 mb-12">
              {[
                "লাগাম ছাড়া মেধা আপনাকে ধ্বংস করতে পারে, কিন্তু নিয়ন্ত্রিত মেধা আপনাকে সাফল্যের সিংহাসনে বসাতে পারে।",
                "তাপমাত্রা 0 থেকে মাত্র 1 বাড়লেই বরফ গলতে শুরু করে। ট্র্যাকার আপনাকে সেই ১ ডিগ্রির ধৈর্য ধরতে শেখায়।",
                "আপনার স্বপ্নগুলো হলো মোমবাতির শিখা, আর আত্ম-নিয়ন্ত্রণ হলো সেই দেয়াল যা বাইরের প্রলোভনের বাতাস থেকে স্বপ্নকে বাঁচিয়ে রাখে।",
              ].map((text, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-xl bg-card border border-border">
                  <span className="text-2xl font-bold text-primary shrink-0">{i + 1}</span>
                  <p className="text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Science */}
          <motion.div {...fadeUp} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Brain className="w-6 h-6 text-primary" />
              বিজ্ঞান বলে
            </h2>
            <div className="p-6 rounded-2xl bg-card border border-border leading-relaxed text-muted-foreground">
              <p className="mb-4">
                মনোবিজ্ঞানীদের মতে, যখন আমরা আমাদের লক্ষ্য এবং কাজগুলো লিখে রাখি, তখন আমাদের মস্তিষ্কের <strong className="text-foreground">'Reticular Activating System' (RAS)</strong> সক্রিয় হয়ে ওঠে। এটি আমাদের ফোকাস বাড়িয়ে দেয়।
              </p>
              <p>
                গবেষণায় দেখা গেছে, যারা 'Daily Progress' ট্র্যাক করেন, তাদের মস্তিষ্কে <strong className="text-foreground">ডোপামিন হরমোন</strong> নিঃসৃত হয়, যা পরবর্তী কাজের জন্য অনুপ্রেরণা যোগায়। একে বলা হয় <strong className="text-foreground">'The Progress Principle'</strong>।
              </p>
            </div>
          </motion.div>

          {/* Success Stories */}
          <motion.div {...fadeUp} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              যারা সফল
            </h2>
            <div className="grid gap-4">
              {/* বেঞ্জামিন ফ্র্যাঙ্কলিন — আলাদা কার্ড */}
              <div className="p-5 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-primary mb-2">বেঞ্জামিন ফ্র্যাঙ্কলিন</h3>
                <p className="text-muted-foreground leading-relaxed">
                  তিনি প্রতিদিন ভোরে উঠে নিজেকে প্রশ্ন করতেন, "আজ আমি কী ভালো কাজ করব?" এবং রাতে ঘুমানোর আগে মেলাতেন, "আজ আমি কী ভালো কাজ করলাম?" তার ১৩টি গুণের ট্র্যাকার আজও বিখ্যাত।
                </p>
                <button
                  onClick={() => setShowVirtues(true)}
                  className="mt-3 text-sm font-medium text-primary hover:text-primary/80 transition inline-flex items-center gap-1"
                >
                  ১৩টি গুণ জানুন →
                </button>
              </div>

              {/* ইমাম গাজ্জালী কার্ড */}
              <div className="p-5 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-primary mb-2">ইমাম গাজ্জালী (রহ.)</h3>
                <p className="text-muted-foreground leading-relaxed">
                  তিনি তার সময়ে প্রতিটি মুহূর্তকে ভাগ করে ইবাদত, জ্ঞান অর্জন এবং লেখালেখির জন্য নির্দিষ্ট করে রাখতেন। তার এই কঠোর রুটিনই তাকে 'হুজ্জাতুল ইসলাম' হিসেবে প্রতিষ্ঠিত করেছে।
                </p>
              </div>

              {/* বিল গেটস ও ইলন মাস্ক কার্ড */}
              <div className="p-5 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-primary mb-2">বিল গেটস ও ইলন মাস্ক</h3>
                <p className="text-muted-foreground leading-relaxed">
                  বর্তমান বিশ্বের সফলতম এই মানুষগুলো তাদের দিনকে ৫ মিনিটের স্লটে ভাগ করেন (Time Blocking)। প্রতিটা মুহূর্তের হিসাব তাদের কাছে থাকে।
                </p>
                <button
                  onClick={() => setShowTimeBlocking(true)}
                  className="mt-3 text-sm font-medium text-primary hover:text-primary/80 transition inline-flex items-center gap-1"
                >
                  টাইম ব্লকিং বিস্তারিত জানুন →
                </button>
              </div>
            </div>
          </motion.div>

          {/* ১৩ গুণের Dialog */}
          <Dialog open={showVirtues} onOpenChange={setShowVirtues}>
            <DialogContent className="max-w-2xl max-h-[85vh] p-0 bg-card border-primary/20">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-xl font-bold text-primary">
                  বেঞ্জামিন ফ্র্যাঙ্কলিনের ১৩টি মহৎ গুণ
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] px-6 pb-6">
                <div className="grid gap-3 mt-4">
                  {virtues.map((v, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-lg bg-background border border-border">
                      <span className="text-lg font-bold text-primary shrink-0 w-7">{i + 1}.</span>
                      <div>
                        <p className="font-semibold text-foreground">
                          {v.bn} <span className="text-muted-foreground font-normal text-sm">({v.en})</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl border border-primary/30 bg-primary/5">
                  <h3 className="font-semibold text-primary mb-2">ফ্র্যাঙ্কলিনের পদ্ধতি</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    তিনি একবারে সবকটি গুণ অর্জন করার চেষ্টা করতেন না। বরং প্রতি সপ্তাহে একটি নির্দিষ্ট গুণের ওপর বিশেষ মনোযোগ দিতেন। এভাবে ১৩ সপ্তাহে একটি চক্র পূর্ণ হতো এবং বছরে চারবার তিনি এই তালিকাটি সম্পন্ন করতেন।
                  </p>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* টাইম ব্লকিং Dialog */}
          <Dialog open={showTimeBlocking} onOpenChange={setShowTimeBlocking}>
            <DialogContent className="max-w-2xl max-h-[85vh] p-0 bg-card border-primary/20">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-xl font-bold text-primary">
                  সফলতার মাস্টার কি: ৫ মিনিটের টাইম ব্লকিং! 🧠⌚
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] px-6 pb-6">
                <div className="mt-4 space-y-5">
                  <p className="text-muted-foreground leading-relaxed">
                    আমরা সবাই জানি বিল গেটস বা ইলন মাস্ক অত্যন্ত ব্যস্ত মানুষ। কিন্তু আপনি কি জানেন তারা তাদের পুরো দিনকে মাত্র ৫ মিনিটের ছোট ছোট 'স্লটে' ভাগ করে কাজ করেন? একে বলা হয় <strong className="text-foreground">Micro-Scheduling</strong> বা <strong className="text-foreground">Time Blocking</strong>।
                  </p>

                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                    <h3 className="font-semibold text-primary mb-3">কেন এটি কাজ করে? ✅</h3>
                    <div className="space-y-3">
                      {[
                        { title: "লেজার ফোকাস", desc: "প্রতিটি ব্লকের জন্য একটি নির্দিষ্ট কাজ থাকায় মস্তিষ্ক বিচ্যুত হয় না।" },
                        { title: "আলসেমি দূর", desc: "যখন ঘড়ির কাঁটা আপনার সামনে থাকে, তখন কাজ ফেলে রাখার সুযোগ থাকে না।" },
                        { title: "ব্রেইন পাওয়ার সেভ", desc: "আগে থেকে রুটিন ঠিক থাকায় \"এখন কী করব\" ভেবে মস্তিষ্কের এনার্জি নষ্ট হয় না।" },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-lg bg-background border border-border">
                          <span className="text-lg font-bold text-primary shrink-0">{i + 1}.</span>
                          <div>
                            <p className="font-semibold text-foreground">{item.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-3">🚀 আপনি কীভাবে শুরু করবেন?</h3>
                    <div className="space-y-3">
                      {[
                        { title: "মাস্টার লিস্ট তৈরি করুন", desc: "প্রথমেই আপনার আজকের সব কাজের একটি তালিকা করে ফেলুন।" },
                        { title: "সময় নির্ধারণ (Time Boxing)", desc: "প্রতিটি কাজের পাশে লিখুন সেটি করতে আপনার ঠিক কতটুকু সময় লাগবে (যেমন: মেইল চেক - ১০ মিনিট, প্রেজেন্টেশন - ৩০ মিনিট)।" },
                        { title: "ক্যালেন্ডারে ব্লক করুন", desc: "আপনার দিনটিকে ১৫, ৩০ বা ৬০ মিনিটের ব্লকে ভাগ করুন। ৫ মিনিটের কনসেপ্টটি হলো—কখনো কোনো গ্যাপ রাখা যাবে না।" },
                        { title: "বাফার টাইম রাখুন", desc: "প্রতিটি বড় কাজের পর ৫-১০ মিনিটের একটি 'বাফার ব্লক' রাখুন বিশ্রাম বা জরুরি কোনো কাজের জন্য।" },
                        { title: "রিভিউ", desc: "দিন শেষে ৫ মিনিট সময় নিন দেখার জন্য যে কতটুকু সফলভাবে করতে পারলেন।" },
                      ].map((step, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-lg bg-background border border-border">
                          <span className="text-lg font-bold text-primary shrink-0">{i + 1}.</span>
                          <div>
                            <p className="font-semibold text-foreground">{step.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
                    <h3 className="font-semibold text-primary mb-2">💡 মনে রাখবেন</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      সূক্ষ্ম হিসাব রাখাটা মূল উদ্দেশ্য নয়, বরং "সময়ের সচেতন ব্যবহার" করাই আসল লক্ষ্য। আপনি যদি ৫ মিনিটের হিসাব রাখতে না-ও পারেন, অন্তত আপনার দিনকে ১ ঘণ্টা বা ৩০ মিনিটের স্লটে ভাগ করে দেখুন—আপনার প্রোডাক্টিভিটি কয়েক গুণ বেড়ে যাবে!
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Realization */}
          <motion.div {...fadeUp} className="mb-12">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-primary" />
                উপলব্ধি...
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                আপনার ব্যাংক অ্যাকাউন্টে যদি প্রতিদিন ৮৬,৪০০ টাকা জমা হয় এবং দিন শেষে তা মুছে যায়, তবে কি আপনি এক টাকাও নষ্ট হতে দিতেন?
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                আমাদের জীবনের প্রতিদিনে আল্লাহ <strong className="text-foreground">৮৬,৪০০ সেকেন্ড</strong> জমা দিচ্ছেন। কিন্তু আমরা কি তার হিসাব রাখছি?
              </p>
              <p className="text-muted-foreground leading-relaxed">
                একদিন হয়তো আমাদের কাছে অনেক সময় থাকবে না, থাকবে শুধু আফসোস। তাই আজই একটি ডায়েরি বা ট্র্যাকার নিন। আপনার নামাজ, আপনার পড়াশোনা, আপনার স্বপ্ন— সবকিছুর হিসাব রাখুন।
              </p>
            </div>
          </motion.div>

          {/* Closing */}
          <motion.div {...fadeUp} className="text-center py-8">
            <blockquote className="text-xl md:text-2xl font-bold text-primary italic">
              "যিনি নিজেকে নিয়ন্ত্রণ করতে পারেন না, তিনি পৃথিবী জয় করতে পারেন না।"
            </blockquote>
            <button
              onClick={() => navigate(-1)}
              className="mt-8 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
            >
              ← ফিরে যান
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DailyTrackerPage;
