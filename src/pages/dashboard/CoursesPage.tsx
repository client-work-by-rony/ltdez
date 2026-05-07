import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMembership } from '@/hooks/useMembership';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Lock, BookOpen, PlayCircle, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Lesson {
  id: string;
  title: string;
  course_id: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  thumbnail_url: string | null;
  lessons: Lesson[];
  completedCount: number;
}

export default function CoursesPage() {
  const { user } = useAuth();
  const { isProActive } = useMembership();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) fetchCourses();
  }, [user, isProActive]);

  async function fetchCourses() {
    try {
      const [coursesRes, lessonsRes, progressRes] = await Promise.all([
        supabase.from('courses').select('*').order('created_at', { ascending: true }),
        supabase.from('lessons_secure' as any).select('id, title, course_id').order('order_index', { ascending: true }) as unknown as { data: Lesson[] | null; error: any },
        supabase.from('lesson_progress').select('lesson_id').eq('user_id', user!.id).eq('completed', true),
      ]);

      if (coursesRes.error) throw coursesRes.error;
      if (lessonsRes.error) throw lessonsRes.error;

      const completedIds = new Set(progressRes.data?.map(p => p.lesson_id) || []);

      const coursesWithLessons = (coursesRes.data || []).map(course => {
        const courseLessons = (lessonsRes.data || []).filter(l => l.course_id === course.id);
        return {
          ...course,
          lessons: courseLessons,
          completedCount: courseLessons.filter(l => completedIds.has(l.id)).length,
        };
      });

      setCourses(coursesWithLessons);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function isCourseAccessible(course: Course) {
    return (course.price === null || course.price === 0) || isProActive;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">কোনো কোর্স নেই</h3>
        <p className="text-muted-foreground">শীঘ্রই নতুন কোর্স যোগ হবে</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">কোর্স মডিউল</h1>
        <p className="text-muted-foreground">আপনার লার্নিং জার্নি শুরু করুন</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const hasAccess = isCourseAccessible(course);
          const progressPercent = course.lessons.length > 0
            ? Math.round((course.completedCount / course.lessons.length) * 100)
            : 0;
          const isPremium = course.price !== null && course.price > 0;

          return (
            <div
              key={course.id}
              className="rounded-xl border border-border bg-card overflow-hidden flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted overflow-hidden">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <BookOpen className="h-12 w-12 text-primary/40" />
                  </div>
                )}
                {/* Badge */}
                <Badge
                  className={`absolute top-3 right-3 ${
                    isPremium
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isPremium ? 'PREMIUM' : 'FREE'}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <PlayCircle className="h-3.5 w-3.5" />
                    {course.lessons.length} Lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" />
                    1 Module
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-3">{course.title}</h3>

                {/* Action area */}
                <div className="mt-auto">
                  {hasAccess ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">PROGRESS</span>
                        <span className="text-primary font-bold">{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-1.5" />
                      <Button
                        className="w-full"
                        onClick={() => navigate(`/dashboard/courses/${course.id}`)}
                      >
                        {progressPercent > 0 ? 'Continue Learning' : 'Start Learning'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-muted text-muted-foreground text-sm">
                        <Lock className="h-4 w-4" />
                        Premium Only
                      </div>
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full text-center text-xs text-primary font-semibold tracking-wider uppercase hover:underline"
                      >
                        UPGRADE NOW
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
