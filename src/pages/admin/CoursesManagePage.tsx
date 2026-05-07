import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Loader2, Plus, Pencil, Trash2, BookOpen, Video, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  is_published: boolean;
  sort_order: number;
  created_at: string;
  lessonCount?: number;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);

const emptyForm = {
  slug: '',
  title: '',
  tagline: '',
  headline: '',
  description: '',
  level: 'Beginner',
  duration_label: '',
  emoji: '',
  price: '',
  old_price: '',
  thumbnail_url: '',
  banner_url: '',
  trailer_url: '',
  course_type: 'recorded',
  live_schedule: '',
  career_outcomes: '',
  student_count_override: '',
  outcomes: '',
  modules: '',
  is_published: true,
  sort_order: '0',
};

export default function CoursesManagePage() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      const { data: lessonsData } = await supabase.from('lessons').select('course_id');
      const lessonCounts: Record<string, number> = {};
      lessonsData?.forEach((l) => {
        if (l.course_id) lessonCounts[l.course_id] = (lessonCounts[l.course_id] || 0) + 1;
      });

      setCourses(
        (coursesData || []).map((c: any) => ({
          ...c,
          lessonCount: lessonCounts[c.id] || 0,
        }))
      );
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'কোর্স লোড করতে সমস্যা হয়েছে', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingCourse(null);
    setFormData(emptyForm);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setBannerFile(null);
    setBannerPreview(null);
    setIsDialogOpen(true);
  }

  function openEditDialog(course: Course) {
    setEditingCourse(course);
    setFormData({
      slug: course.slug || '',
      title: course.title,
      tagline: course.tagline || '',
      headline: course.headline || '',
      description: course.description || '',
      level: course.level || 'Beginner',
      duration_label: course.duration_label || '',
      emoji: course.emoji || '',
      price: course.price?.toString() || '',
      old_price: course.old_price?.toString() || '',
      thumbnail_url: course.thumbnail_url || '',
      banner_url: course.banner_url || '',
      trailer_url: course.trailer_url || '',
      course_type: course.course_type || 'recorded',
      live_schedule: course.live_schedule || '',
      career_outcomes: (course.career_outcomes || []).join('\n'),
      student_count_override: course.student_count_override?.toString() || '',
      outcomes: (course.outcomes || []).join('\n'),
      modules: (course.modules || []).join('\n'),
      is_published: course.is_published,
      sort_order: course.sort_order?.toString() || '0',
    });
    setThumbnailFile(null);
    setThumbnailPreview(course.thumbnail_url || null);
    setBannerFile(null);
    setBannerPreview(course.banner_url || null);
    setIsDialogOpen(true);
  }

  function handleImagePick(
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setPreview: (s: string | null) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'ত্রুটি', description: 'শুধুমাত্র ছবি ফাইল আপলোড করুন', variant: 'destructive' });
      return;
    }
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const { error } = await supabase.storage.from('course-thumbnails').upload(fileName, file);
    if (error) throw error;
    return supabase.storage.from('course-thumbnails').getPublicUrl(fileName).data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsUploading(true);
    try {
      let thumbnailUrl = formData.thumbnail_url || null;
      let bannerUrl = formData.banner_url || null;
      if (thumbnailFile) thumbnailUrl = await uploadImage(thumbnailFile);
      if (bannerFile) bannerUrl = await uploadImage(bannerFile);

      const payload: any = {
        slug: formData.slug || slugify(formData.title),
        title: formData.title,
        tagline: formData.tagline || null,
        headline: formData.headline || null,
        description: formData.description || null,
        level: formData.level || null,
        duration_label: formData.duration_label || null,
        emoji: formData.emoji || null,
        price: formData.price ? parseFloat(formData.price) : null,
        old_price: formData.old_price ? parseFloat(formData.old_price) : null,
        thumbnail_url: thumbnailUrl,
        banner_url: bannerUrl,
        trailer_url: formData.trailer_url || null,
        course_type: formData.course_type || 'recorded',
        live_schedule: formData.live_schedule || null,
        career_outcomes: formData.career_outcomes
          ? formData.career_outcomes.split('\n').map((s) => s.trim()).filter(Boolean)
          : [],
        student_count_override: formData.student_count_override
          ? parseInt(formData.student_count_override, 10)
          : null,
        outcomes: formData.outcomes
          ? formData.outcomes.split('\n').map((s) => s.trim()).filter(Boolean)
          : [],
        modules: formData.modules
          ? formData.modules.split('\n').map((s) => s.trim()).filter(Boolean)
          : [],
        is_published: formData.is_published,
        sort_order: parseInt(formData.sort_order || '0', 10) || 0,
      };

      if (editingCourse) {
        const { error } = await supabase.from('courses').update(payload).eq('id', editingCourse.id);
        if (error) throw error;
        toast({ title: 'সফল!', description: 'কোর্স আপডেট হয়েছে' });
      } else {
        const { error } = await supabase.from('courses').insert(payload);
        if (error) throw error;
        toast({ title: 'সফল!', description: 'নতুন কোর্স যোগ হয়েছে' });
      }

      setIsDialogOpen(false);
      fetchCourses();
    } catch (error: any) {
      console.error(error);
      toast({ title: 'Error', description: error.message || 'কোর্স সেভ করতে সমস্যা হয়েছে', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(courseId: string) {
    if (!confirm('আপনি কি নিশ্চিত? এই কোর্সের সব লেসনও ডিলিট হয়ে যাবে।')) return;
    try {
      const { error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) throw error;
      toast({ title: 'সফল!', description: 'কোর্স ডিলিট হয়েছে' });
      fetchCourses();
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'কোর্স ডিলিট করতে সমস্যা হয়েছে', variant: 'destructive' });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">কোর্স ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">কোর্স যোগ, এডিট এবং ডিলিট করুন। সব কোর্স homepage এ live দেখাবে।</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              নতুন কোর্স
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'কোর্স এডিট করুন' : 'নতুন কোর্স যোগ করুন'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-sm font-medium">কোর্সের নাম *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => {
                      const t = e.target.value;
                      setFormData({
                        ...formData,
                        title: t,
                        slug: editingCourse ? formData.slug : slugify(t),
                      });
                    }}
                    placeholder="যেমন: হাতের কাজের বেসিক"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Slug (URL) *</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                    placeholder="handicraft-basics"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Emoji</label>
                  <Input
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    placeholder="🧵"
                    maxLength={4}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Tagline (এক লাইনের বর্ণনা)</label>
                  <Input
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="শূন্য থেকে শুরু — হাতের কাজের ফাউন্ডেশন কোর্স"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Headline (Detail পেজে বড় শিরোনাম)</label>
                  <Input
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="হাতের কাজের বেসিক — শুরু করুন আজই"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Level</label>
                  <Select value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration Label</label>
                  <Input
                    value={formData.duration_label}
                    onChange={(e) => setFormData({ ...formData, duration_label: e.target.value })}
                    placeholder="৪ সপ্তাহ"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">দাম (৳)</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="999"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">পুরোনো দাম (৳)</label>
                  <Input
                    type="number"
                    value={formData.old_price}
                    onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                    placeholder="1999"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">বিবরণ</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="বিস্তারিত বিবরণ"
                    rows={3}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">যা শিখবেন (প্রতি লাইনে একটি)</label>
                  <Textarea
                    value={formData.outcomes}
                    onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
                    placeholder={'বেসিক টুলস চেনা\nপ্রথম প্রোডাক্ট তৈরি\n...'}
                    rows={4}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">কোর্স কারিকুলাম / Modules (প্রতি লাইনে একটি)</label>
                  <Textarea
                    value={formData.modules}
                    onChange={(e) => setFormData({ ...formData, modules: e.target.value })}
                    placeholder={'পরিচিতি ও টুলস\nবেসিক স্টিচ\n...'}
                    rows={4}
                  />
                </div>

                {/* Thumbnail */}
                <div className="col-span-2">
                  <label className="text-sm font-medium">কার্ড থাম্বনেইল</label>
                  <input type="file" ref={thumbInputRef} accept="image/*" className="hidden"
                    onChange={(e) => handleImagePick(e, setThumbnailFile, setThumbnailPreview)} />
                  {thumbnailPreview ? (
                    <div className="relative mt-2 w-full h-32 rounded-md overflow-hidden bg-muted">
                      <img src={thumbnailPreview} alt="" className="w-full h-full object-cover" />
                      <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); setFormData({ ...formData, thumbnail_url: '' }); }}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button type="button" variant="outline" className="w-full mt-2 h-20 border-dashed"
                      onClick={() => thumbInputRef.current?.click()}>
                      <Upload className="h-5 w-5 mr-2" /> থাম্বনেইল আপলোড
                    </Button>
                  )}
                </div>

                {/* Banner */}
                <div className="col-span-2">
                  <label className="text-sm font-medium">Detail পেজ ব্যানার</label>
                  <input type="file" ref={bannerInputRef} accept="image/*" className="hidden"
                    onChange={(e) => handleImagePick(e, setBannerFile, setBannerPreview)} />
                  {bannerPreview ? (
                    <div className="relative mt-2 w-full h-32 rounded-md overflow-hidden bg-muted">
                      <img src={bannerPreview} alt="" className="w-full h-full object-cover" />
                      <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => { setBannerFile(null); setBannerPreview(null); setFormData({ ...formData, banner_url: '' }); }}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button type="button" variant="outline" className="w-full mt-2 h-20 border-dashed"
                      onClick={() => bannerInputRef.current?.click()}>
                      <Upload className="h-5 w-5 mr-2" /> ব্যানার আপলোড
                    </Button>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium">ট্রেলার ভিডিও URL (YouTube/Vimeo)</label>
                  <Input
                    value={formData.trailer_url}
                    onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">কোর্সের ডিটেইল পেজে preview হিসেবে দেখানো হবে।</p>
                </div>

                <div>
                  <label className="text-sm font-medium">কোর্স টাইপ</label>
                  <Select value={formData.course_type} onValueChange={(v) => setFormData({ ...formData, course_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recorded">রেকর্ডেড</SelectItem>
                      <SelectItem value="live">লাইভ</SelectItem>
                      <SelectItem value="hybrid">হাইব্রিড (লাইভ + রেকর্ডেড)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">স্টুডেন্ট সংখ্যা (ম্যানুয়াল)</label>
                  <Input
                    type="number"
                    value={formData.student_count_override}
                    onChange={(e) => setFormData({ ...formData, student_count_override: e.target.value })}
                    placeholder="খালি = রিয়েল সংখ্যা"
                  />
                </div>
                {(formData.course_type === 'live' || formData.course_type === 'hybrid') && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium">লাইভ ক্লাসের সময়সূচি</label>
                    <Textarea
                      value={formData.live_schedule}
                      onChange={(e) => setFormData({ ...formData, live_schedule: e.target.value })}
                      placeholder="যেমন: প্রতি শুক্র ও শনিবার, রাত ৯টা — ১০:৩০টা"
                      rows={2}
                    />
                  </div>
                )}
                <div className="col-span-2">
                  <label className="text-sm font-medium">শিখে যা করতে পারবেন (প্রতি লাইনে একটি)</label>
                  <Textarea
                    value={formData.career_outcomes}
                    onChange={(e) => setFormData({ ...formData, career_outcomes: e.target.value })}
                    placeholder={'নিজের হাতের কাজের ব্যবসা শুরু\nঅনলাইনে বিক্রি\nফ্রিল্যান্স কাজ'}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Sort Order</label>
                  <Input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch
                    checked={formData.is_published}
                    onCheckedChange={(c) => setFormData({ ...formData, is_published: c })}
                  />
                  <label className="text-sm font-medium">Published (homepage এ দেখাবে)</label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />সেভ হচ্ছে...</>
                ) : editingCourse ? 'আপডেট করুন' : 'যোগ করুন'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            সকল কোর্স ({courses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">কোনো কোর্স নেই।</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>কোর্স</TableHead>
                  <TableHead>লেভেল</TableHead>
                  <TableHead>লেসন</TableHead>
                  <TableHead>মূল্য</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center text-2xl">
                          {course.thumbnail_url ? (
                            <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover" />
                          ) : (
                            <span>{course.emoji || '📘'}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{course.title}</p>
                          {course.tagline && (
                            <p className="text-xs text-muted-foreground truncate max-w-xs">{course.tagline}</p>
                          )}
                          {course.slug && (
                            <p className="text-[10px] text-muted-foreground font-mono">/{course.slug}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.level || '—'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Video className="h-3 w-3 mr-1" />
                        {course.lessonCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {course.price ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-primary">৳{course.price}</span>
                          {course.old_price && (
                            <span className="text-xs line-through text-muted-foreground">৳{course.old_price}</span>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline">ফ্রি</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {course.is_published ? (
                        <Badge className="bg-green-600">Live</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="default" size="sm" asChild>
                          <Link to={`/admin/courses/${course.id}/lessons`}>
                            <Video className="h-4 w-4 mr-1" />লেসন
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(course)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(course.id)}>
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
