import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ReviewRow {
  id: string;
  user_id: string;
  rating: number;
  content: string;
  created_at: string;
  is_approved: boolean;
}

interface ReviewWithProfile extends ReviewRow {
  full_name: string | null;
  avatar_url: string | null;
}

interface Props {
  courseId: string;
  onRequireSignup: () => void;
}

const formatBn = (n: number) => n.toLocaleString("bn-BD");

function StarRow({ value, onChange, size = 20 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            style={{ width: size, height: size }}
            className={n <= value ? "fill-primary text-primary" : "text-muted-foreground/40"}
          />
        </button>
      ))}
    </div>
  );
}

export default function CourseReviews({ courseId, onRequireSignup }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ReviewWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRating, setMyRating] = useState(5);
  const [myContent, setMyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: rs } = await supabase
      .from("course_reviews" as any)
      .select("*")
      .eq("course_id", courseId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    const list = (rs || []) as unknown as ReviewRow[];
    const userIds = [...new Set(list.map((r) => r.user_id))];
    let profiles: Record<string, { full_name: string | null; avatar_url: string | null }> = {};
    if (userIds.length > 0) {
      const { data: ps } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", userIds);
      (ps || []).forEach((p: any) => {
        profiles[p.user_id] = { full_name: p.full_name, avatar_url: p.avatar_url };
      });
    }
    setReviews(
      list.map((r) => ({
        ...r,
        full_name: profiles[r.user_id]?.full_name || null,
        avatar_url: profiles[r.user_id]?.avatar_url || null,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const myExisting = user ? reviews.find((r) => r.user_id === user.id) : undefined;
  const avg =
    reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleSubmit = async () => {
    if (!user) {
      onRequireSignup();
      return;
    }
    if (myContent.trim().length < 1) {
      toast({ title: "ত্রুটি", description: "রিভিউ লিখুন", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("course_reviews" as any).upsert(
        {
          course_id: courseId,
          user_id: user.id,
          rating: myRating,
          content: myContent.trim(),
        },
        { onConflict: "course_id,user_id" }
      );
      if (error) throw error;
      toast({ title: "✅ ধন্যবাদ", description: "আপনার রিভিউ যোগ হয়েছে" });
      setMyContent("");
      setMyRating(5);
      await load();
    } catch (e: any) {
      toast({ title: "ত্রুটি", description: e.message || "রিভিউ পোস্ট করা যায়নি", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-4 mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold">শিক্ষার্থীদের রিভিউ</h2>
            {reviews.length > 0 && (
              <div className="mt-2 flex items-center gap-3">
                <StarRow value={Math.round(avg)} />
                <span className="font-bold text-lg">{avg.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">
                  ({formatBn(reviews.length)} রিভিউ)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Write a review */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-6">
          <h3 className="font-bold mb-3">{myExisting ? "আপনার রিভিউ আপডেট করুন" : "রিভিউ লিখুন"}</h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-muted-foreground">আপনার রেটিং:</span>
            <StarRow value={myRating} onChange={setMyRating} />
          </div>
          <Textarea
            placeholder="এই কোর্সটি সম্পর্কে আপনার অভিজ্ঞতা শেয়ার করুন..."
            value={myContent}
            onChange={(e) => setMyContent(e.target.value)}
            rows={3}
            maxLength={1000}
          />
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">{myContent.length}/1000</span>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {user ? (myExisting ? "আপডেট করুন" : "পোস্ট করুন") : "সাইনআপ করে পোস্ট করুন"}
            </Button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground text-sm py-6 text-center">
            এখনও কোনো রিভিউ নেই। প্রথম রিভিউটি আপনিই দিন!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center shrink-0 overflow-hidden">
                    {r.avatar_url ? (
                      <img src={r.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (r.full_name?.[0] || "শ").toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{r.full_name || "শিক্ষার্থী"}</span>
                      <StarRow value={r.rating} size={14} />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(r.created_at), "dd MMM yyyy")}
                      </span>
                    </div>
                    <p className="mt-2 text-foreground/90 whitespace-pre-line">{r.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
