import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Clock, Loader2, Play, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const formatBn = (n: number) => n.toLocaleString("bn-BD");

interface CourseRow {
  id: string;
  slug: string | null;
  title: string;
  tagline: string | null;
  level: string | null;
  duration_label: string | null;
  emoji: string | null;
  price: number | null;
  old_price: number | null;
  thumbnail_url: string | null;
  course_type: string | null;
  lessonCount: number;
}

export default function NoorCourses() {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: cs } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      const { data: ls } = await supabase.from("lessons").select("course_id");
      const counts: Record<string, number> = {};
      ls?.forEach((l: any) => {
        if (l.course_id) counts[l.course_id] = (counts[l.course_id] || 0) + 1;
      });

      setCourses(
        (cs || []).map((c: any) => ({
          ...c,
          lessonCount: counts[c.id] || 0,
        }))
      );
      setLoading(false);
    })();
  }, []);

  return (
    <section id="courses" className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary text-sm font-bold tracking-widest uppercase">কোর্সসমূহ</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold">আমাদের সকল কোর্স</h2>
          <p className="mt-3 text-muted-foreground">
            যে কোনো একটি কোর্স বেছে নিন, বিস্তারিত দেখুন, এবং আজই জয়েন করুন।
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">শীঘ্রই নতুন কোর্স আসছে।</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c, i) => (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                className="group flex flex-col bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all overflow-hidden"
              >
                <div className="relative h-36 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent flex items-center justify-center text-6xl overflow-hidden">
                  {c.thumbnail_url ? (
                    <img src={c.thumbnail_url} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <span>{c.emoji || "📘"}</span>
                  )}
                  {c.course_type === 'live' && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase bg-red-500 text-white px-2.5 py-1 rounded-full shadow">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                      </span>
                      লাইভ
                    </span>
                  )}
                  {c.course_type === 'hybrid' && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase bg-purple-600 text-white px-2.5 py-1 rounded-full shadow">
                      হাইব্রিড
                    </span>
                  )}
                  {c.course_type === 'recorded' && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase bg-blue-600 text-white px-2.5 py-1 rounded-full shadow">
                      <Play className="h-2.5 w-2.5 fill-current" /> রেকর্ডেড
                    </span>
                  )}
                  {c.level && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-primary border border-primary/20">
                      {c.level}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-extrabold leading-snug">{c.title}</h3>
                  {c.tagline && (
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                    {c.lessonCount > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 text-primary" /> {formatBn(c.lessonCount)} লেসন
                      </span>
                    )}
                    {c.duration_label && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-primary" /> {c.duration_label}
                      </span>
                    )}
                    {c.level && (
                      <span className="inline-flex items-center gap-1">
                        <Target className="h-3.5 w-3.5 text-primary" /> {c.level}
                      </span>
                    )}
                  </div>

                  {c.price != null && (
                    <div className="mt-5 flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-primary">৳{formatBn(c.price)}</span>
                      {c.old_price && (
                        <span className="text-sm text-muted-foreground line-through">৳{formatBn(c.old_price)}</span>
                      )}
                    </div>
                  )}

                  <Link
                    to={`/courses/${c.slug || c.id}`}
                    className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform"
                  >
                    বিস্তারিত দেখুন <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
