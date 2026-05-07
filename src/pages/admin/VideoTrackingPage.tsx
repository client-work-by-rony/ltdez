import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Play, Eye, CheckCircle2, Clock, TrendingUp, Users } from 'lucide-react';

interface LessonWithProgress {
  id: string;
  title: string;
  course_title: string;
  duration_minutes: number | null;
  total_views: number;
  completed_count: number;
  video_url: string | null;
}

interface UserProgress {
  user_email: string;
  user_name: string | null;
  lesson_title: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export default function VideoTrackingPage() {
  const { toast } = useToast();
  const [lessonStats, setLessonStats] = useState<LessonWithProgress[]>([]);
  const [recentActivity, setRecentActivity] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [activeViewers, setActiveViewers] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Fetch lessons with course info
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, title, duration_minutes, video_url, course_id')
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;

      // Fetch all courses
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id, title');

      if (coursesError) throw coursesError;

      // Fetch all lesson progress
      const { data: progress, error: progressError } = await supabase
        .from('lesson_progress')
        .select('lesson_id, user_id, completed, completed_at, created_at');

      if (progressError) throw progressError;

      // Fetch profiles for user info
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name');

      if (profilesError) throw profilesError;

      const courseMap = new Map(courses?.map(c => [c.id, c.title]) || []);
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      // Build lesson stats
      const stats: LessonWithProgress[] = (lessons || []).map(lesson => {
        const lessonProgress = (progress || []).filter(p => p.lesson_id === lesson.id);
        return {
          id: lesson.id,
          title: lesson.title,
          course_title: courseMap.get(lesson.course_id || '') || 'N/A',
          duration_minutes: lesson.duration_minutes,
          total_views: lessonProgress.length,
          completed_count: lessonProgress.filter(p => p.completed).length,
          video_url: lesson.video_url,
        };
      });

      // Sort by views descending
      stats.sort((a, b) => b.total_views - a.total_views);

      // Build recent activity
      const recent: UserProgress[] = (progress || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 20)
        .map(p => {
          const profile = profileMap.get(p.user_id);
          const lesson = (lessons || []).find(l => l.id === p.lesson_id);
          return {
            user_email: profile?.email || 'অজানা',
            user_name: profile?.full_name || null,
            lesson_title: lesson?.title || 'অজানা',
            completed: p.completed || false,
            completed_at: p.completed_at,
            created_at: p.created_at,
          };
        });

      const allViews = (progress || []).length;
      const allCompleted = (progress || []).filter(p => p.completed).length;
      const uniqueUsers = new Set((progress || []).map(p => p.user_id)).size;

      setLessonStats(stats);
      setRecentActivity(recent);
      setTotalViews(allViews);
      setTotalCompleted(allCompleted);
      setActiveViewers(uniqueUsers);
    } catch (error) {
      console.error('Error fetching video tracking data:', error);
      toast({
        title: 'Error',
        description: 'ডেটা লোড করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const completionRate = totalViews > 0 ? Math.round((totalCompleted / totalViews) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Play className="h-8 w-8 text-primary" />
          ভিডিও ট্র্যাকিং
        </h1>
        <p className="text-muted-foreground">
          ইউজারদের ভিডিও দেখা ও প্রগ্রেস ট্র্যাক করুন
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              মোট ভিউ
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground mt-1">সকল লেসন মিলিয়ে</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              সম্পন্ন হয়েছে
            </CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{totalCompleted}</div>
            <p className="text-xs text-muted-foreground mt-1">লেসন কমপ্লিট</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              অ্যাক্টিভ শিক্ষার্থী
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{activeViewers}</div>
            <p className="text-xs text-muted-foreground mt-1">ইউনিক ইউজার</p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              কমপ্লিশন রেট
            </CardTitle>
            <div className="p-2 rounded-lg bg-orange-500/10">
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Lesson-wise Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            লেসন ভিত্তিক পরিসংখ্যান
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lessonStats.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">কোনো লেসন নেই</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>লেসন</TableHead>
                  <TableHead>কোর্স</TableHead>
                  <TableHead>সময়</TableHead>
                  <TableHead>ভিডিও</TableHead>
                  <TableHead>ভিউ</TableHead>
                  <TableHead>সম্পন্ন</TableHead>
                  <TableHead>কমপ্লিশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessonStats.map((lesson) => {
                  const rate = lesson.total_views > 0
                    ? Math.round((lesson.completed_count / lesson.total_views) * 100)
                    : 0;
                  return (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {lesson.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{lesson.course_title}</Badge>
                      </TableCell>
                      <TableCell>
                        {lesson.duration_minutes ? (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {lesson.duration_minutes} মি.
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {lesson.video_url ? (
                          <Badge variant="secondary" className="gap-1">
                            <Play className="h-3 w-3" /> আছে
                          </Badge>
                        ) : (
                          <Badge variant="outline">নেই</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{lesson.total_views}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-green-500 font-semibold">{lesson.completed_count}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <Progress value={rate} className="h-2 flex-1" />
                          <span className="text-xs text-muted-foreground w-8">{rate}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            সাম্প্রতিক কার্যকলাপ
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">কোনো কার্যকলাপ নেই</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${activity.completed ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                      {activity.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Play className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {activity.user_name || activity.user_email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.lesson_title}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={activity.completed ? 'default' : 'secondary'} className="text-xs">
                      {activity.completed ? 'সম্পন্ন' : 'দেখছে'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(activity.created_at)}
                    </p>
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
