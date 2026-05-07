import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Radio, Calendar, Clock, Video, Users, CheckCircle2, ArrowLeft } from "lucide-react";
import PromoHeader from "@/components/promo/PromoHeader";
import PromoFooter from "@/components/promo/PromoFooter";
import FloatingActions from "@/components/noor/FloatingActions";

// ============================================================
//  LIVE PROGRAM PAGE — এখানে নিজের content edit/add করুন
//  নতুন program object copy-paste করে যত খুশি class add করুন
// ============================================================

const LIVE_PROGRAMS = [
  {
    title: "Speak English Without Fear — Live Workshop",
    topic: "প্রথম কথা থেকে fluent conversation পর্যন্ত",
    date: "শুক্রবার, ১৫ মে ২০২৬",
    time: "রাত ৯:০০ – ১০:৩০ (BD Time)",
    platform: "Zoom",
    seats: "১০০ Seats",
    bullets: [
      "Live speaking practice instructor এর সাথে",
      "আপনার প্রশ্নের real-time answer",
      "Pronunciation correction live",
      "Recording পাবেন lifetime access",
    ],
  },
  // আরও program এখানে add করুন
];

function getNextFriday9pm() {
  const now = new Date();
  const target = new Date(now);
  const day = now.getDay();
  const diff = (5 - day + 7) % 7 || 7;
  target.setDate(now.getDate() + diff);
  target.setHours(21, 0, 0, 0);
  return target;
}

function Countdown() {
  const [target] = useState(getNextFriday9pm());
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0 });
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-md mx-auto">
      {[
        { v: t.d, l: "DAYS" },
        { v: t.h, l: "HOURS" },
        { v: t.m, l: "MINS" },
        { v: t.s, l: "SECS" },
      ].map((x, i) => (
        <div key={i} className="bg-black/30 backdrop-blur rounded-xl p-3 md:p-4 border border-white/10">
          <div className="text-2xl md:text-4xl font-extrabold tabular-nums text-white">{String(x.v).padStart(2, "0")}</div>
          <div className="text-[10px] md:text-xs text-white/60 mt-1">{x.l}</div>
        </div>
      ))}
    </div>
  );
}

export default function LiveProgram() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PromoHeader />
      <main className="pt-20">
        <section className="relative px-4 py-16 md:py-24 bg-gradient-to-b from-orange-50 via-amber-50 to-background overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="h-4 w-4" /> হোমে ফিরুন
            </Link>
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-xs font-bold"
            >
              <Radio className="h-3.5 w-3.5 animate-pulse" /> LIVE PROGRAM
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight"
            >
              আমাদের{" "}
              <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                Live Programs
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Real-time interactive Zoom session — Instructor এর সাথে practice করুন, প্রশ্ন করুন, instantly feedback নিন।
            </motion.p>
          </div>
        </section>

        <section className="px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto space-y-8">
            {LIVE_PROGRAMS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl bg-gradient-to-br from-[#2d1810] to-[#5b2a14] text-white p-8 md:p-12 shadow-2xl"
              >
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">
                    <Radio className="h-3.5 w-3.5 animate-pulse" /> NEXT LIVE
                  </span>
                  <h2 className="mt-4 text-3xl md:text-4xl font-extrabold">{p.title}</h2>
                  <p className="mt-3 text-white/70 text-base md:text-lg">{p.topic}</p>

                  <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                      <Calendar className="h-5 w-5 text-amber-400" />
                      <span className="text-sm font-semibold">{p.date}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                      <Clock className="h-5 w-5 text-amber-400" />
                      <span className="text-sm font-semibold">{p.time}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                      <Video className="h-5 w-5 text-amber-400" />
                      <span className="text-sm font-semibold">Platform: {p.platform}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                      <Users className="h-5 w-5 text-amber-400" />
                      <span className="text-sm font-semibold">{p.seats}</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="text-sm font-bold text-white/50 tracking-wider mb-4">CLASS শুরু হবে</p>
                    <Countdown />
                  </div>

                  <ul className="mt-8 max-w-xl mx-auto grid sm:grid-cols-2 gap-3 text-left">
                    {p.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-white/85">{b}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/#order"
                    className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-amber-400 text-primary-foreground font-bold text-lg shadow-2xl shadow-primary/40 hover:scale-[1.03] transition-transform"
                  >
                    Reserve My Seat <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-4 py-16 md:py-20 bg-orange-50/40">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold">Live এ যুক্ত হতে চান?</h2>
            <p className="mt-3 text-muted-foreground">একটিমাত্র payment — সব live program এ lifetime access।</p>
            <a
              href="/#order"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary via-orange-500 to-amber-400 text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
            >
              এখনই Enroll করুন <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </section>
      </main>
      <PromoFooter />
      <FloatingActions />
    </div>
  );
}
