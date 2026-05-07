import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, FileText, Upload, Download, Users } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  due_date: string | null;
  lesson_id: string | null;
  created_at: string;
}

interface Lesson {
  id: string;
  title: string;
  course_id: string | null;
}

export default function AssignmentsManagePage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (lessonId) {
      fetchLessonAndAssignments();
    }
  }, [lessonId]);

  async function fetchLessonAndAssignments() {
    try {
      // Fetch lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('id, title, course_id')
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;
      setLesson(lessonData);

      // Fetch assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: false });

      if (assignmentsError) throw assignmentsError;
      setAssignments(assignmentsData || []);
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
    setEditingAssignment(null);
    setFormData({ title: '', description: '', due_date: '' });
    setSelectedFile(null);
    setIsDialogOpen(true);
  }

  function openEditDialog(assignment: Assignment) {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description || '',
      due_date: assignment.due_date ? assignment.due_date.split('T')[0] : '',
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  }

  async function uploadFile(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `assignments/${fileName}`;

    const { error } = await supabase.storage.from('assignments').upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: signedData } = await supabase.storage.from('assignments').createSignedUrl(filePath, 60 * 60 * 24 * 365);
    return signedData?.signedUrl || null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsUploading(true);

    try {
      let fileUrl = editingAssignment?.file_url || null;

      if (selectedFile) {
        const uploadedUrl = await uploadFile(selectedFile);
        if (uploadedUrl) {
          fileUrl = uploadedUrl;
        }
      }

      const assignmentData = {
        title: formData.title,
        description: formData.description || null,
        file_url: fileUrl,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        lesson_id: lessonId,
      };

      if (editingAssignment) {
        const { error } = await supabase
          .from('assignments')
          .update(assignmentData)
          .eq('id', editingAssignment.id);

        if (error) throw error;
        toast({ title: 'সফল!', description: 'অ্যাসাইনমেন্ট আপডেট হয়েছে' });
      } else {
        const { error } = await supabase.from('assignments').insert(assignmentData);

        if (error) throw error;
        toast({ title: 'সফল!', description: 'নতুন অ্যাসাইনমেন্ট যোগ হয়েছে' });
      }

      setIsDialogOpen(false);
      fetchLessonAndAssignments();
    } catch (error) {
      console.error('Error saving assignment:', error);
      toast({
        title: 'Error',
        description: 'অ্যাসাইনমেন্ট সেভ করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(assignmentId: string) {
    if (!confirm('আপনি কি নিশ্চিত?')) return;

    try {
      const { error } = await supabase.from('assignments').delete().eq('id', assignmentId);
      if (error) throw error;
      toast({ title: 'সফল!', description: 'অ্যাসাইনমেন্ট ডিলিট হয়েছে' });
      fetchLessonAndAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast({
        title: 'Error',
        description: 'অ্যাসাইনমেন্ট ডিলিট করতে সমস্যা হয়েছে',
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
          <Link to={lesson?.course_id ? `/admin/courses/${lesson.course_id}/lessons` : '/admin/courses'}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            ফিরে যান
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{lesson?.title}</h1>
          <p className="text-muted-foreground">অ্যাসাইনমেন্ট ম্যানেজমেন্ট</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              নতুন অ্যাসাইনমেন্ট
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAssignment ? 'অ্যাসাইনমেন্ট এডিট করুন' : 'নতুন অ্যাসাইনমেন্ট যোগ করুন'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">অ্যাসাইনমেন্টের নাম *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="অ্যাসাইনমেন্টের নাম লিখুন"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">বিবরণ</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="অ্যাসাইনমেন্টের বিস্তারিত নির্দেশনা লিখুন"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">জমা দেওয়ার শেষ তারিখ</label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">ফাইল আপলোড (PDF, DOC, etc.)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.zip"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {selectedFile ? selectedFile.name : 'ফাইল সিলেক্ট করুন'}
                </Button>
                {editingAssignment?.file_url && !selectedFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    বর্তমান ফাইল আছে। নতুন ফাইল আপলোড করলে পুরাতন ফাইল রিপ্লেস হবে।
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    আপলোড হচ্ছে...
                  </>
                ) : editingAssignment ? (
                  'আপডেট করুন'
                ) : (
                  'যোগ করুন'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            সকল অ্যাসাইনমেন্ট ({assignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              কোনো অ্যাসাইনমেন্ট নেই। নতুন অ্যাসাইনমেন্ট যোগ করুন।
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>অ্যাসাইনমেন্ট</TableHead>
                  <TableHead>ফাইল</TableHead>
                  <TableHead>শেষ তারিখ</TableHead>
                  <TableHead>তৈরি</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        {assignment.description && (
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {assignment.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignment.file_url ? (
                        <a
                          href={assignment.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Badge variant="secondary" className="gap-1 cursor-pointer">
                            <Download className="h-3 w-3" />
                            ডাউনলোড
                          </Badge>
                        </a>
                      ) : (
                        <Badge variant="outline">নেই</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {assignment.due_date
                        ? new Date(assignment.due_date).toLocaleDateString('bn-BD')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {new Date(assignment.created_at).toLocaleDateString('bn-BD')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/assignments/${assignment.id}/submissions`}>
                            <Users className="h-4 w-4 mr-1" />
                            সাবমিশন
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(assignment)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(assignment.id)}
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
