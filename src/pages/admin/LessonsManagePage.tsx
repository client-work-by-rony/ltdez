import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, Video, FileText, Youtube } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  content: string | null;
  order_index: number;
  is_free: boolean | null;
  duration_minutes: number | null;
  course_id: string | null;
}

interface Course {
  id: string;
  title: string;
}

export default function LessonsManagePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    content: '',
    duration_minutes: '',
    is_free: false,
  });

  useEffect(() => {
    if (courseId) {
      fetchCourseAndLessons();
    }
  }, [courseId]);

  async function fetchCourseAndLessons() {
    try {
      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, title')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'ডেটা লোড করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingLesson(null);
    setFormData({
      title: '',
      description: '',
      video_url: '',
      content: '',
      duration_minutes: '',
      is_free: false,
    });
    setIsDialogOpen(true);
  }

  function openEditDialog(lesson: Lesson) {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description || '',
      video_url: lesson.video_url || '',
      content: lesson.content || '',
      duration_minutes: lesson.duration_minutes?.toString() || '',
      is_free: lesson.is_free || false,
    });
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const lessonData = {
        title: formData.title,
        description: formData.description || null,
        video_url: formData.video_url || null,
        content: formData.content || null,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        is_free: formData.is_free,
        course_id: courseId,
      };

      if (editingLesson) {
        const { error } = await supabase
          .from('lessons')
          .update(lessonData)
          .eq('id', editingLesson.id);

        if (error) throw error;
        toast({ title: 'সফল!', description: 'লেসন আপডেট হয়েছে' });
      } else {
        // Get max order_index
        const maxOrder = lessons.length > 0 ? Math.max(...lessons.map((l) => l.order_index)) : -1;

        const { error } = await supabase.from('lessons').insert({
          ...lessonData,
          order_index: maxOrder + 1,
        });

        if (error) throw error;
        toast({ title: 'সফল!', description: 'নতুন লেসন যোগ হয়েছে' });
      }

      setIsDialogOpen(false);
      fetchCourseAndLessons();
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast({
        title: 'Error',
        description: 'লেসন সেভ করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    }
  }

  async function handleDelete(lessonId: string) {
    if (!confirm('আপনি কি নিশ্চিত? এই লেসনের সব অ্যাসাইনমেন্টও ডিলিট হয়ে যাবে।')) return;

    try {
      const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
      if (error) throw error;
      toast({ title: 'সফল!', description: 'লেসন ডিলিট হয়েছে' });
      fetchCourseAndLessons();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        title: 'Error',
        description: 'লেসন ডিলিট করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/courses">
            <ArrowLeft className="h-4 w-4 mr-1" />
            ফিরে যান
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{course?.title}</h1>
          <p className="text-muted-foreground">লেসন ম্যানেজমেন্ট</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              নতুন লেসন
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLesson ? 'লেসন এডিট করুন' : 'নতুন লেসন যোগ করুন'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">লেসনের নাম *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="লেসনের নাম লিখুন"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">বিবরণ</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="লেসনের বিবরণ লিখুন"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-red-500" />
                  YouTube ভিডিও URL
                </label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  YouTube ভিডিওর লিংক দিন
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">লেসন কন্টেন্ট (টেক্সট)</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="লেসনের টেক্সট কন্টেন্ট লিখুন..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">ভিডিওর সময়কাল</label>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground mb-1">ঘণ্টা</span>
                      <Input
                        type="number"
                        min="0"
                        max="99"
                        className="w-16 text-center font-mono"
                        value={formData.duration_minutes ? Math.floor(Math.round(parseFloat(formData.duration_minutes) * 60) / 3600) : ''}
                        placeholder="0"
                        onChange={(e) => {
                          const total = formData.duration_minutes ? Math.round(parseFloat(formData.duration_minutes) * 60) : 0;
                          const oldH = Math.floor(total / 3600);
                          const rem = total - oldH * 3600;
                          const h = Math.max(0, parseInt(e.target.value) || 0);
                          setFormData({ ...formData, duration_minutes: ((h * 3600 + rem) / 60).toFixed(2) });
                        }}
                      />
                    </div>
                    <span className="text-lg font-bold mt-5">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground mb-1">মিনিট</span>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        className="w-16 text-center font-mono"
                        value={formData.duration_minutes ? Math.floor((Math.round(parseFloat(formData.duration_minutes) * 60) % 3600) / 60) : ''}
                        placeholder="0"
                        onChange={(e) => {
                          const total = formData.duration_minutes ? Math.round(parseFloat(formData.duration_minutes) * 60) : 0;
                          const h = Math.floor(total / 3600);
                          const s = total % 60;
                          const m = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                          setFormData({ ...formData, duration_minutes: ((h * 3600 + m * 60 + s) / 60).toFixed(2) });
                        }}
                      />
                    </div>
                    <span className="text-lg font-bold mt-5">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground mb-1">সেকেন্ড</span>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        className="w-16 text-center font-mono"
                        value={formData.duration_minutes ? Math.round(parseFloat(formData.duration_minutes) * 60) % 60 : ''}
                        placeholder="0"
                        onChange={(e) => {
                          const total = formData.duration_minutes ? Math.round(parseFloat(formData.duration_minutes) * 60) : 0;
                          const h = Math.floor(total / 3600);
                          const m = Math.floor((total % 3600) / 60);
                          const s = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                          setFormData({ ...formData, duration_minutes: ((h * 3600 + m * 60 + s) / 60).toFixed(2) });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={formData.is_free}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_free: checked })
                    }
                  />
                  <label className="text-sm font-medium">ফ্রি লেসন</label>
                </div>
              </div>
              <Button type="submit" className="w-full">
                {editingLesson ? 'আপডেট করুন' : 'যোগ করুন'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            সকল লেসন ({lessons.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lessons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              কোনো লেসন নেই। নতুন লেসন যোগ করুন।
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ক্রম</TableHead>
                  <TableHead>লেসনের নাম</TableHead>
                  <TableHead>ভিডিও</TableHead>
                  <TableHead>সময়</TableHead>
                  <TableHead>টাইপ</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell>
                      <Badge variant="outline">{lesson.order_index + 1}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        {lesson.description && (
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {lesson.video_url ? (
                        <Badge variant="secondary" className="gap-1">
                          <Youtube className="h-3 w-3" />
                          আছে
                        </Badge>
                      ) : (
                        <Badge variant="outline">নেই</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {lesson.duration_minutes ? `${Math.floor(lesson.duration_minutes)}:${String(Math.round((lesson.duration_minutes % 1) * 60)).padStart(2, '0')} মিনিট` : '-'}
                    </TableCell>
                    <TableCell>
                      {lesson.is_free ? (
                        <Badge variant="default">ফ্রি</Badge>
                      ) : (
                        <Badge variant="secondary">Pro</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/lessons/${lesson.id}/assignments`}>
                            <FileText className="h-4 w-4 mr-1" />
                            অ্যাসাইনমেন্ট
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(lesson)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(lesson.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
