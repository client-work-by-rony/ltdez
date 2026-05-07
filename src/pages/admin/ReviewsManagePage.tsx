import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Star, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

interface ReviewRow {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  content: string;
  is_approved: boolean;
  created_at: string;
}
interface Enriched extends ReviewRow {
  course_title?: string;
  user_name?: string;
  user_email?: string;
}

export default function ReviewsManagePage() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Enriched[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [courses, setCourses] = useState<Array<{ id: string; title: string }>>([]);

  const load = async () => {
    setLoading(true);
    const { data: rs } = await supabase
      .from("course_reviews" as any)
      .select("*")
      .order("created_at", { ascending: false });
    const list = (rs || []) as unknown as ReviewRow[];

    const userIds = [...new Set(list.map((r) => r.user_id))];
    const courseIds = [...new Set(list.map((r) => r.course_id))];

    const [{ data: ps }, { data: cs }] = await Promise.all([
      userIds.length
        ? supabase.from("profiles").select("user_id, full_name, email").in("user_id", userIds)
        : Promise.resolve({ data: [] as any[] }),
      supabase.from("courses").select("id, title").order("title"),
    ]);

    const pmap = new Map((ps || []).map((p: any) => [p.user_id, p]));
    const cmap = new Map((cs || []).map((c: any) => [c.id, c.title]));
    setCourses(cs || []);
    setReviews(
      list.map((r) => ({
        ...r,
        course_title: cmap.get(r.course_id) || "—",
        user_name: pmap.get(r.user_id)?.full_name,
        user_email: pmap.get(r.user_id)?.email,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleApprove = async (r: Enriched) => {
    const { error } = await supabase
      .from("course_reviews" as any)
      .update({ is_approved: !r.is_approved })
      .eq("id", r.id);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: r.is_approved ? "Unpublished" : "Approved" });
    load();
  };

  const remove = async (r: Enriched) => {
    if (!confirm("রিভিউটি মুছে ফেলবেন?")) return;
    const { error } = await supabase.from("course_reviews" as any).delete().eq("id", r.id);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "মুছে ফেলা হয়েছে" });
    load();
  };

  const filtered = reviews.filter((r) => filter === "all" || r.course_id === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">রিভিউ ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground text-sm">কোর্স রিভিউ অনুমোদন বা মুছে ফেলুন</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[240px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব কোর্স</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">রিভিউ ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">কোনো রিভিউ নেই</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((r) => (
                <div key={r.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">{r.user_name || r.user_email || "শিক্ষার্থী"}</span>
                    <Badge variant="outline" className="text-xs">{r.course_title}</Badge>
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`h-3.5 w-3.5 ${n <= r.rating ? "fill-primary text-primary" : "text-muted-foreground/40"}`}
                        />
                      ))}
                    </span>
                    {r.is_approved ? (
                      <Badge className="text-xs gap-1"><CheckCircle2 className="h-3 w-3" />অনুমোদিত</Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs gap-1"><XCircle className="h-3 w-3" />অপ্রকাশিত</Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {format(new Date(r.created_at), "dd/MM/yy HH:mm")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-line">{r.content}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleApprove(r)}>
                      {r.is_approved ? "Unpublish" : "Approve"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(r)}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" />মুছুন
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
