import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  Crown,
  Mic2,
  Users,
  MessageCircle,
  Bot,
  Sparkles,
  Rocket,
  Flame,
} from "lucide-react";

type Course = {
  number: string;
  badge: string;
  badgeClass: string;
  title: string;
  tagline: string;
  subtitle: string;
  features: string[];
  programFeatures?: { icon: React.ComponentType<{ className?: string }>; label: string }[];
  perfectFor: string[];
  price: string;
  offer: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

const courses: Course[] = [
  {
    number: "01",
    badge: "BEST SELLER",
    badgeClass: "bg-gradient-to-r from-amber-400 to-primary text-black",
    title: "SPOKEN MASTERY",
    tagline: "Complete English Fluency Transformation Program",
    subtitle: "🔥 Beginner থেকে Confident Speaker হওয়ার Step-by-Step System",
    features: [
      "Basic Building Master Class",
      "Fluency Special Training",
      "Communicative Grammar",
      "Questioning Techniques",
      "Topic Based Presentation",
      "Random Topic Speaking",
      "60 Hours Group Discussion",
      "AI Speaking Practice",
      "VIP One-to-One Session",
      "Public Speaking Training",
      "British Phonetics",
      "Native Fluency Hacks",
    ],
    perfectFor: ["Beginners", "Freelancers", "Job Seekers", "University Students", "Anyone Who Wants Fluency"],
    price: "৳15,000+",
    offer: "🔥 Limited Time Offer Available",
    primaryCta: { label: "🚀 Enroll Now", href: "/checkout?program=spoken-mastery" },
    secondaryCta: { label: "📚 View Full Details", href: "#pricing" },
  },
  {
    number: "02",
    badge: "POPULAR",
    badgeClass: "bg-gradient-to-r from-primary to-orange-500 text-white",
    title: "FEAR TO FLUENT LIVE BOOTCAMP",
    tagline: "Live Zoom Based Speaking Confidence Program",
    subtitle: "যারা দ্রুত English Speaking Fear দূর করতে চান তাদের জন্য Intensive Live Practice Program",
    features: [
      "Hesitation Removal",
      "Live Speaking Practice",
      "Daily Conversation Training",
      "Smart Vocabulary Usage",
      "Instant Sentence Formation",
      "Confidence Building System",
      "Real-Life English Practice",
      "Zoom Group Discussion",
    ],
    programFeatures: [
      { icon: Mic2, label: "Live Zoom Classes" },
      { icon: Users, label: "Practice Partner" },
      { icon: MessageCircle, label: "WhatsApp Support" },
      { icon: Bot, label: "AI Assisted" },
      { icon: Sparkles, label: "Beginner Friendly" },
    ],
    perfectFor: ["যারা English বলতে ভয় পান", "Practice Environment চান", "দ্রুত Confidence চান"],
    price: "৳2,500+",
    offer: "🔥 Discount Offer Running Now",
    primaryCta: { label: "🚀 Join Live Bootcamp", href: "/checkout?program=live-bootcamp" },
    secondaryCta: { label: "📚 Learn More", href: "#features" },
  },
];

export default function PromoCoursesShowcase() {
  return (
    <section id="courses" className="py-20 md:py-28 px-4 bg-gradient-to-b from-background via-orange-50/40 to-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 text-primary text-xs font-bold tracking-widest uppercase bg-primary/10 px-4 py-1.5 rounded-full">
            🎯 Our Premium Courses
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">
            Choose Your Perfect{" "}
            <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
              English Transformation
            </span>{" "}
            Program
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            বাংলা ভাষাভাষীদের জন্য তৈরি Powerful English Learning Programs — যেখানে আপনি Real Life এ Confidently
            Communication করতে শিখবেন।
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((c, idx) => (
            <motion.div
              key={c.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="group relative rounded-3xl p-[1.5px] bg-gradient-to-br from-primary via-amber-400 to-primary/40 hover:from-amber-300 hover:to-primary transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30"
            >
              <div className="relative h-full rounded-3xl bg-gradient-to-br from-[#1a0e08] via-zinc-900 to-[#1a0e08] text-white p-7 md:p-9 overflow-hidden flex flex-col">
                {/* Glow */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top row: number + badge */}
                <div className="relative flex items-start justify-between mb-5">
                  <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white/20 to-white/5 leading-none">
                    {c.number}
                  </span>
                  <span className={`text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-lg ${c.badgeClass}`}>
                    {c.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="relative text-2xl md:text-3xl font-extrabold leading-tight">{c.title}</h3>
                <p className="relative mt-1.5 text-primary font-semibold text-sm">{c.tagline}</p>
                <p className="relative mt-3 text-white/70 text-sm">{c.subtitle}</p>

                {/* Features */}
                <div className="relative mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {c.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm text-white/85">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Program Features (live bootcamp only) */}
                {c.programFeatures && (
                  <div className="relative mt-5 flex flex-wrap gap-2">
                    {c.programFeatures.map((pf) => (
                      <span
                        key={pf.label}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full backdrop-blur bg-white/10 border border-white/15"
                      >
                        <pf.icon className="h-3.5 w-3.5 text-primary" />
                        {pf.label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Perfect For */}
                <div className="relative mt-6 pt-5 border-t border-white/10">
                  <p className="text-[11px] uppercase tracking-widest text-white/50 font-bold mb-2.5">Perfect For</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.perfectFor.map((p) => (
                      <span
                        key={p}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30"
                      >
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="relative mt-6 flex items-end justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-white/50 font-bold">Program Value</p>
                    <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-amber-300 bg-clip-text text-transparent">
                      {c.price}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full bg-red-500/15 text-red-300 border border-red-400/30">
                    <Flame className="h-3 w-3" /> {c.offer.replace("🔥 ", "")}
                  </span>
                </div>

                {/* CTAs */}
                <div className="relative mt-6 flex flex-col sm:flex-row gap-3 mt-auto pt-2">
                  <Link
                    to={c.primaryCta.href}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-primary to-amber-400 text-black font-bold text-sm shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
                  >
                    {c.primaryCta.label} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={c.secondaryCta.href}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border-2 border-white/20 text-white font-bold text-sm hover:bg-white/10 transition-colors"
                  >
                    {c.secondaryCta.label}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
