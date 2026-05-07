import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMembership } from '@/hooks/useMembership';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, PlayCircle, Lock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  content: string | null;
  order_index: number;
  is_free: boolean;
  duration_minutes: number | null;
  course_id: string | null;
}

interface CourseData {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;
    if (parsed.hostname.includes('youtube.com')) {
      videoId = parsed.searchParams.get('v');
    } else if (parsed.hostname === 'youtu.be') {
      videoId = parsed.pathname.slice(1);
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isProActive } = useMembership();
  const { toast } = useToast();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && courseId) fetchData();
  }, [user, courseId, isProActive]);

  async function fetchData() {
    try {
      const [courseRes, lessonsRes, progressRes] = await Promise.all([
        supabase.from('courses').select('*').eq('id', courseId!).single(),
        supabase.from('lessons_secure' as any).select('*').eq('course_id', courseId!).order('order_index', { ascending: true }) as unknown as { data: Lesson[] | null; error: any },
        supabase.from('lesson_progress').select('lesson_id').eq('user_id', user!.id).eq('completed', true),
      ]);

      if (courseRes.error) throw courseRes.error;
      if (lessonsRes.error) throw lessonsRes.error;

      setCourse(courseRes.data);
      setLessons(lessonsRes.data || []);

      const completedIds = new Set(
        (progressRes.data || [])
          .filter(p => (lessonsRes.data || []).some(l => l.id === p.lesson_id))
          .map(p => p.lesson_id)
      );
      setCompletedLessons(completedIds);

      // Select first accessible lesson
      if (lessonsRes.data && lessonsRes.data.length > 0) {
        const firstAccessible = lessonsRes.data.find(l => l.is_free || isProActive);
        setSelectedLessonId(firstAccessible?.id || lessonsRes.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const selectedLesson = useMemo(
    () => lessons.find(l => l.id === selectedLessonId) || null,
    [lessons, selectedLessonId]
  );

  const currentIndex = useMemo(
    () => lessons.findIndex(l => l.id === selectedLessonId),
    [lessons, selectedLessonId]
  );

  function canAccess(lesson: Lesson) {
    return lesson.is_free || isProActive;
  }

  async function toggleComplete() {
    if (!user || !selectedLesson) return;
    const isCompleted = completedLessons.has(selectedLesson.id);

    try {
      if (isCompleted) {
        await supabase
          .from('lesson_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('lesson_id', selectedLesson.id);
        setCompletedLessons(prev => {
          const next = new Set(prev);
          next.delete(selectedLesson.id);
          return next;
        });
      } else {
        await supabase.from('lesson_progress').upsert({
          user_id: user.id,
          lesson_id: selectedLesson.id,
          completed: true,
          completed_at: new Date().toISOString(),
        });
        setCompletedLessons(prev => new Set([...prev, selectedLesson.id]));
        toast({ title: '🎉 দারুণ!', description: 'লেসন সম্পন্ন হয়েছে' });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  function goToLesson(direction: 'prev' | 'next') {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < lessons.length) {
      setSelectedLessonId(lessons[newIndex].id);
    }
  }

  const progressPercent = lessons.length > 0
    ? Math.round((completedLessons.size / lessons.length) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">কোর্স পাওয়া যায়নি</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard/courses')}>
          ← ফিরে যান
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-0 -m-6 min-h-[calc(100vh-4rem)]">
      {/* Sidebar - Curriculum */}
      <div className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Curriculum</h2>
            <span className="text-xs text-muted-foreground font-medium">
              {completedLessons.size}/{lessons.length}
            </span>
          </div>
          <Progress value={progressPercent} className="h-1" />
        </div>

        <ScrollArea className="h-[30vh] lg:h-[calc(100vh-10rem)]">
          <div className="p-2">
            {lessons.map((lesson) => {
              const isActive = lesson.id === selectedLessonId;
              const isCompleted = completedLessons.has(lesson.id);
              const hasAccess = canAccess(lesson);

              return (
                <button
                  key={lesson.id}
                  onClick={() => hasAccess && setSelectedLessonId(lesson.id)}
                  disabled={!hasAccess}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors mb-1 ${
                    isActive
                      ? 'bg-primary/10 border border-primary/30'
                      : hasAccess
                        ? 'hover:bg-muted/50'
                        : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : hasAccess ? (
                      <PlayCircle className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className={`text-sm truncate ${
                    isActive ? 'font-semibold text-foreground' : 'text-muted-foreground'
                  }`}>
                    {lesson.title}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/courses')}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <p className="text-xs text-primary font-semibold uppercase tracking-wider truncate">
                {course.title}
              </p>
              {selectedLesson && (
                <h1 className="text-base lg:text-lg font-bold truncate">{selectedLesson.title}</h1>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={currentIndex >= lessons.length - 1}
            onClick={() => goToLesson('next')}
          >
            Next Lesson <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Video + Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {selectedLesson && canAccess(selectedLesson) ? (
            <>
              {/* Video Player */}
              {selectedLesson.video_url && (
                <div className="aspect-video bg-foreground rounded-xl overflow-hidden">
                  {(() => {
                    const embedUrl = getYouTubeEmbedUrl(selectedLesson.video_url!);
                    if (embedUrl) {
                      return (
                        <iframe
                          src={embedUrl}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      );
                    }
                    return (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlayCircle className="h-16 w-16 text-white/50" />
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Lesson Overview */}
              <div className="rounded-xl bg-card border border-border p-6">
                <h2 className="text-lg font-bold mb-3">Lesson Overview</h2>
                {selectedLesson.description && (
                  <p className="text-muted-foreground mb-4">{selectedLesson.description}</p>
                )}
                {selectedLesson.content && (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {selectedLesson.content}
                  </div>
                )}
              </div>

              {/* Complete button */}
              <div className="flex items-center gap-3">
                <Button
                  variant={completedLessons.has(selectedLesson.id) ? 'outline' : 'default'}
                  onClick={toggleComplete}
                >
                  {completedLessons.has(selectedLesson.id) ? (
                    <><CheckCircle2 className="h-4 w-4 mr-2" /> সম্পন্ন হয়েছে</>
                  ) : (
                    'সম্পন্ন হিসেবে চিহ্নিত করুন'
                  )}
                </Button>
                {currentIndex < lessons.length - 1 && (
                  <Button variant="secondary" onClick={() => goToLesson('next')}>
                    পরবর্তী লেসন <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </>
          ) : selectedLesson ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Lock className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold mb-2">Premium Only</p>
              <p className="text-muted-foreground mb-4">এই লেসন দেখতে Pro মেম্বারশিপ প্রয়োজন</p>
              <Button onClick={() => navigate('/dashboard')}>Upgrade Now</Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
