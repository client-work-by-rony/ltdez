import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Award, BookOpen, Briefcase, Calendar, Check, Clock, Download, GraduationCap, Heart, Infinity, Languages, Loader2, MessageCircle, Play, Shield, Sparkles, Star, Target, Users, Video } from "lucide-react";
import NoorHeader from "@/components/noor/NoorHeader";
import NoorFooter from "@/components/noor/NoorFooter";
import FloatingActions from "@/components/noor/FloatingActions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import CourseReviews from "@/components/courses/CourseReviews";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const formatBn = (n: number) => n.toLocaleString("bn-BD");

function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      return v ? `https://www.youtube.com/embed/${v}` : null;
    }
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video/${u.pathname.replace(/\D/g, "")}`;
  } catch {}
  return null;
}

interface Course {
  id: string;
  slug: string | null;
  title: string;
  tagline: string | null;
  headline: string | null;
  description: string | null;
  level: string | null;
  duration_label: string | null;
  emoji: string | null;
  price: number | null;
  old_price: number | null;
  thumbnail_url: string | null;
  banner_url: string | null;
  trailer_url: string | null;
  course_type: string | null;
  live_schedule: string | null;
  career_outcomes: string[] | null;
  student_count_override: number | null;
  outcomes: string[] | null;
  modules: string[] | null;
}

export default function CourseDetailPublic() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessonTitles, setLessonTitles] = useState<string[]>([]);
  const [lessonCount, setLessonCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .eq("is_published", true)
        .maybeSingle();

      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setCourse(data as any);
      const courseId = (data as any).id;

      const [{ data: lessons }, { count: enrollCount }, { data: reviews }] = await Promise.all([
        supabase.from("lessons").select("title").eq("course_id", courseId).order("order_index", { ascending: true }),
        supabase.from("enrollments").select("id", { count: "exact", head: true }).eq("course_id", courseId),
        supabase.from("course_reviews").select("rating").eq("course_id", courseId).eq("is_approved", true),
      ]);
      setLessonTitles((lessons || []).map((l: any) => l.title));
      setLessonCount((lessons || []).length);
      setStudentCount((data as any).student_count_override ?? enrollCount ?? 0);
      const ratings = (reviews || []).map((r: any) => r.rating);
      setReviewCount(ratings.length);
      setAvgRating(ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0);
      setLoading(false);
    })();
  }, [slug]);

  if (notFound) return <Navigate to="/#courses" replace />;
  if (loading || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleBuy = () => setBuyOpen(true);
  const modules = course.modules && course.modules.length > 0 ? course.modules : lessonTitles;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NoorHeader />

      <main className="pt-24 md:pt-28 pb-24">
        {/* Hero */}
        <section className="px-4">
          <div className="max-w-5xl mx-auto">
            <Link to="/#courses" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="h-4 w-4" /> সকল কোর্সে ফিরুন
            </Link>

            {course.banner_url && (
              <div className="mb-8 rounded-2xl overflow-hidden border border-border shadow-lg">
                <img src={course.banner_url} alt={course.title} className="w-full h-48 md:h-72 object-cover" />
              </div>
            )}

            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-wrap items-center gap-2">
                  {course.level && (
                    <span className="inline-block text-xs font-bold tracking-wider uppercase bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {course.level}
                    </span>
                  )}
                  {course.course_type === 'live' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase bg-red-500/10 text-red-600 px-3 py-1 rounded-full">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                      লাইভ ক্লাস
                    </span>
                  )}
                  {course.course_type === 'recorded' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full">
                      <Play className="h-3 w-3 fill-current" /> রেকর্ডেড
                    </span>
                  )}
                  {course.course_type === 'hybrid' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase bg-purple-500/10 text-purple-600 px-3 py-1 rounded-full">
                      হাইব্রিড (লাইভ + রেকর্ডেড)
                    </span>
                  )}
                </div>
                <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">
                  {course.headline || course.title}
                </h1>
                {course.tagline && <p className="mt-4 text-lg text-muted-foreground">{course.tagline}</p>}
                {course.description && <p className="mt-3 text-foreground/80">{course.description}</p>}

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                  {reviewCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {avgRating.toFixed(1)}
                      <span className="text-muted-foreground font-normal">({formatBn(reviewCount)} রিভিউ)</span>
                    </span>
                  )}
                  {studentCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                      <Users className="h-4 w-4 text-primary" />
                      {formatBn(studentCount)} <span className="text-muted-foreground font-normal">জন স্টুডেন্ট</span>
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {lessonCount > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-primary" /> {formatBn(lessonCount)} লেসন
                    </span>
                  )}
                  {course.duration_label && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" /> {course.duration_label}
                    </span>
                  )}
                  {course.level && (
                    <span className="inline-flex items-center gap-1.5">
                      <Target className="h-4 w-4 text-primary" /> {course.level}
                    </span>
                  )}
                </div>
              </motion.div>

              <motion.aside
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl shadow-primary/10"
              >
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-40 object-cover rounded-xl mb-4" />
                ) : (
                  <div className="text-7xl text-center mb-4">{course.emoji || "📘"}</div>
                )}
                {course.price != null && (
                  <>
                    <div className="flex items-baseline justify-center gap-3">
                      <span className="text-4xl font-extrabold text-primary">৳{formatBn(course.price)}</span>
                      {course.old_price && (
                        <span className="text-muted-foreground line-through">৳{formatBn(course.old_price)}</span>
                      )}
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-1">Lifetime Access · ৭ দিনের গ্যারান্টি</p>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleBuy}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 hover:scale-[1.01] transition-transform"
                >
                  এখনই জয়েন করুন <ArrowRight className="h-5 w-5" />
                </button>
              </motion.aside>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="px-4 mt-12">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: Star, label: "অ্যাভারেজ রেটিং", value: reviewCount > 0 ? avgRating.toFixed(1) : "নতুন", sub: reviewCount > 0 ? `${formatBn(reviewCount)} রিভিউ` : "প্রথম রিভিউ দিন", color: "text-yellow-500" },
              { icon: Users, label: "মোট স্টুডেন্ট", value: formatBn(studentCount || 0), sub: "সক্রিয় শিক্ষার্থী", color: "text-primary" },
              { icon: BookOpen, label: "মোট লেসন", value: formatBn(lessonCount || modules.length || 0), sub: "ভিডিও + প্র্যাকটিস", color: "text-blue-600" },
              { icon: Clock, label: "সময়কাল", value: course.duration_label || "Lifetime", sub: "নিজের গতিতে শিখুন", color: "text-purple-600" },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-4 md:p-5 text-center shadow-sm">
                <s.icon className={`h-5 w-5 md:h-6 md:w-6 mx-auto ${s.color}`} />
                <div className="mt-2 text-xl md:text-2xl font-extrabold">{s.value}</div>
                <div className="text-[11px] md:text-xs font-semibold text-foreground/80 mt-0.5">{s.label}</div>
                <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Format Highlight Banner */}
        <section className="px-4 mt-8">
          <div className="max-w-5xl mx-auto">
            {course.course_type === 'live' && (
              <div className="rounded-2xl p-5 md:p-6 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border border-red-500/30 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0">
                  <Video className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg">এই কোর্সটি লাইভ ক্লাসে পরিচালিত হবে</h3>
                  <p className="text-sm text-muted-foreground mt-1">ইনস্ট্রাক্টরের সাথে সরাসরি প্রশ্ন-উত্তরের সুযোগ। সব ক্লাসের রেকর্ডিং পরে দেখতে পারবেন।</p>
                </div>
              </div>
            )}
            {course.course_type === 'hybrid' && (
              <div className="rounded-2xl p-5 md:p-6 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/30 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg">হাইব্রিড কোর্স — লাইভ ক্লাস + রেকর্ডেড লেসন</h3>
                  <p className="text-sm text-muted-foreground mt-1">সাপ্তাহিক লাইভ ক্লাসে সরাসরি শিখুন এবং পুরো লাইব্রেরির রেকর্ডেড লেসন যেকোনো সময় দেখুন।</p>
                </div>
              </div>
            )}
            {course.course_type === 'recorded' && (
              <div className="rounded-2xl p-5 md:p-6 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/30 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Play className="h-6 w-6 fill-current" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg">এই কোর্সটি সম্পূর্ণ রেকর্ডেড — যেকোনো সময় দেখুন</h3>
                  <p className="text-sm text-muted-foreground mt-1">আপনার সুবিধামত সময়ে, আপনার গতিতে শিখুন। লাইফটাইম অ্যাক্সেস — যত খুশি দেখুন।</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {course.trailer_url && youtubeEmbed(course.trailer_url) && (
          <section className="px-4 mt-12">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4">কোর্স ট্রেলার</h2>
              <div className="aspect-video rounded-2xl overflow-hidden border border-border shadow-lg bg-foreground">
                <iframe
                  src={youtubeEmbed(course.trailer_url)!}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={`${course.title} trailer`}
                />
              </div>
            </div>
          </section>
        )}

        {/* Live Schedule */}
        {(course.course_type === 'live' || course.course_type === 'hybrid') && course.live_schedule && (
          <section className="px-4 mt-12">
            <div className="max-w-5xl mx-auto">
              <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
                      লাইভ ক্লাসের সময়সূচি
                      <Clock className="h-5 w-5 text-primary" />
                    </h2>
                    <p className="mt-2 text-foreground/90 whitespace-pre-line leading-relaxed">{course.live_schedule}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* What you'll learn */}
        {course.outcomes && course.outcomes.length > 0 && (
          <section className="px-4 mt-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-extrabold">এই কোর্সে যা শিখবেন</h2>
              <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                {course.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4">
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </span>
                    <span className="text-foreground/90">{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Career Outcomes — what you can do after */}
        {course.career_outcomes && course.career_outcomes.length > 0 && (
          <section className="px-4 mt-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
                <Briefcase className="h-7 w-7 text-primary" />
                শিখে যা করতে পারবেন
              </h2>
              <p className="mt-2 text-muted-foreground">এই কোর্স শেষ করলে আপনি নিচের সুযোগগুলো পাবেন</p>
              <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                {course.career_outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-3 bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-xl p-4">
                    <span className="mt-0.5 w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <Target className="h-4 w-4" />
                    </span>
                    <span className="text-foreground/90 font-medium">{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Curriculum */}
        {modules.length > 0 && (
          <section className="px-4 mt-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-extrabold">কোর্স কারিকুলাম</h2>
              <ol className="mt-6 space-y-3">
                {modules.map((m, i) => (
                  <li key={`${m}-${i}`} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
                    <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shrink-0">
                      {formatBn(i + 1)}
                    </span>
                    <span className="font-semibold">{m}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* Who is this for */}
        <section className="px-4 mt-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
              <Heart className="h-7 w-7 text-primary" /> এই কোর্স কাদের জন্য
            </h2>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "নতুন শিক্ষার্থী", desc: "যারা একদম শূন্য থেকে হাতের কাজ শিখতে চান" },
                { title: "গৃহিণী", desc: "যিনি ঘরে বসে শিখে নিজের আয় শুরু করতে চান" },
                { title: "শিক্ষার্থী", desc: "পড়াশোনার পাশাপাশি একটি স্কিল গড়তে চান" },
                { title: "উদ্যোক্তা", desc: "নিজস্ব হ্যান্ডিক্রাফট ব্র্যান্ড দাঁড় করাতে চান" },
                { title: "ফ্রিল্যান্সার", desc: "অনলাইনে অর্ডার নিয়ে আয় শুরু করতে চান" },
                { title: "শখের কারিগর", desc: "সৌখিনতা থেকে পেশাদারিত্বে যেতে চান" },
              ].map((p) => (
                <div key={p.title} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Check className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-bold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you'll get */}
        <section className="px-4 mt-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
              <GraduationCap className="h-7 w-7 text-primary" /> কোর্সে যা যা পাবেন
            </h2>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Video, label: "HD ভিডিও লেসন", desc: "সম্পূর্ণ বাংলায়, ধাপে ধাপে" },
                { icon: Download, label: "PDF রিসোর্স", desc: "ডাউনলোডযোগ্য নোটস ও গাইড" },
                { icon: Infinity, label: "Lifetime Access", desc: "একবার ভর্তি, সারাজীবন দেখুন" },
                { icon: MessageCircle, label: "কমিউনিটি সাপোর্ট", desc: "শিক্ষার্থী ও মেন্টরদের সাথে যোগাযোগ" },
                { icon: Award, label: "সার্টিফিকেট", desc: "কোর্স শেষে ডিজিটাল সার্টিফিকেট" },
                { icon: Languages, label: "১০০% বাংলায়", desc: "সহজ ভাষায় ব্যাখ্যা" },
              ].map((f) => (
                <div key={f.label} className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-2xl p-5 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{f.label}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <CourseReviews courseId={course.id} onRequireSignup={() => setBuyOpen(true)} />

        {/* Money-back Guarantee */}
        <section className="px-4 mt-16">
          <div className="max-w-3xl mx-auto rounded-3xl p-6 md:p-8 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-green-500/30 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center shrink-0">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold">৭ দিনের মানি-ব্যাক গ্যারান্টি</h3>
              <p className="text-sm md:text-base text-muted-foreground mt-1">কোর্সে ভর্তি হওয়ার ৭ দিনের মধ্যে সন্তুষ্ট না হলে সম্পূর্ণ টাকা ফেরত — কোনো প্রশ্ন ছাড়া।</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 mt-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-center">সাধারণ জিজ্ঞাসা</h2>
            <Accordion type="single" collapsible className="mt-6">
              {[
                { q: "কীভাবে ভর্তি হবো?", a: "উপরের 'এখনই জয়েন করুন' বাটনে ক্লিক করুন। bKash/Nagad/Rocket-এ পেমেন্ট করে ট্রানজেকশন আইডি সাবমিট করুন। অ্যাডমিন যাচাই করার পর আপনার অ্যাকাউন্টে কোর্স সক্রিয় হয়ে যাবে।" },
                { q: "কোর্স ফি কীভাবে দিবো?", a: "bKash, Nagad বা Rocket-এ Send Money করে ট্রানজেকশন আইডি জমা দিন। ম্যানুয়াল যাচাইয়ের পর সাধারণত ২৪ ঘণ্টার মধ্যে অ্যাক্সেস পাবেন।" },
                { q: "কোর্সটি কতদিন দেখতে পারবো?", a: "একবার ভর্তি হলে আজীবন (Lifetime) অ্যাক্সেস পাবেন। যত খুশি, যেকোনো সময়, যত বার ইচ্ছা দেখতে পারবেন।" },
                { q: "মোবাইলে দেখা যাবে?", a: "হ্যাঁ, মোবাইল, ট্যাবলেট ও কম্পিউটার — সব ডিভাইসেই কোর্স দেখা যাবে। শুধু ইন্টারনেট কানেকশন থাকতে হবে।" },
                { q: "সার্টিফিকেট পাবো?", a: "হ্যাঁ, সব লেসন শেষ করার পর ডিজিটাল সার্টিফিকেট ডাউনলোড করতে পারবেন।" },
                { q: "টাকা ফেরত পাবো?", a: "৭ দিনের মধ্যে অসন্তুষ্ট হলে সম্পূর্ণ টাকা ফেরত — কোনো প্রশ্ন ছাড়া।" },
              ].map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-xl mb-3 px-4">
                  <AccordionTrigger className="text-left font-bold hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-foreground/80">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 mt-16 pb-20 md:pb-0">
          <div className="max-w-3xl mx-auto bg-foreground text-background rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold">আজই {course.title} কোর্সে যোগ দিন</h2>
            {course.price != null && (
              <p className="mt-3 opacity-80">মাত্র ৳{formatBn(course.price)} — Lifetime Access।</p>
            )}
            <button
              type="button"
              onClick={handleBuy}
              className="mt-6 inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-primary text-primary-foreground font-bold text-base shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
            >
              এখনই জয়েন করুন <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      </main>

      {/* Mobile Sticky CTA */}
      {course.price != null && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border p-3 flex items-center gap-3 shadow-2xl">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">কোর্স ফি</div>
            <div className="text-lg font-extrabold text-primary leading-none">৳{formatBn(course.price)}</div>
          </div>
          <button
            type="button"
            onClick={handleBuy}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30"
          >
            জয়েন করুন <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <UpgradeModal isOpen={buyOpen} onClose={() => setBuyOpen(false)} preselectedCourseId={course.id} />
      <NoorFooter />
      <FloatingActions />
    </div>
  );
}
