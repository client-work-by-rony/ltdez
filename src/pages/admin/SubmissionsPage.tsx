import { useState, useEffect } from 'react';
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
import { Loader2, ArrowLeft, Download, CheckCircle, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Submission {
  id: string;
  assignment_id: string;
  user_id: string;
  file_url: string;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
  graded_at: string | null;
  user_email?: string;
  user_name?: string;
}

interface Assignment {
  id: string;
  title: string;
  lesson_id: string | null;
}

export default function SubmissionsPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });

  useEffect(() => {
    if (assignmentId) {
      fetchData();
    }
  }, [assignmentId]);

  async function fetchData() {
    try {
      // Fetch assignment
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('assignments')
        .select('id, title, lesson_id')
        .eq('id', assignmentId)
        .single();

      if (assignmentError) throw assignmentError;
      setAssignment(assignmentData);

      // Fetch submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .order('submitted_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      // Fetch user profiles for submissions
      const userIds = submissionsData?.map((s) => s.user_id) || [];
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, email, full_name')
          .in('user_id', userIds);

        const profileMap: Record<string, { email: string; name: string | null }> = {};
        profilesData?.forEach((p) => {
          profileMap[p.user_id] = { email: p.email, name: p.full_name };
        });

        const submissionsWithUsers = submissionsData?.map((s) => ({
          ...s,
          user_email: profileMap[s.user_id]?.email,
          user_name: profileMap[s.user_id]?.name,
        }));

        setSubmissions(submissionsWithUsers || []);
      } else {
        setSubmissions([]);
      }
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

  function openGradeDialog(submission: Submission) {
    setGradingSubmission(submission);
    setGradeData({
      grade: submission.grade?.toString() || '',
      feedback: submission.feedback || '',
    });
  }

  async function handleGrade(e: React.FormEvent) {
    e.preventDefault();
    if (!gradingSubmission || !user) return;

    try {
      const { error } = await supabase
        .from('assignment_submissions')
        .update({
          grade: gradeData.grade ? parseInt(gradeData.grade) : null,
          feedback: gradeData.feedback || null,
          graded_at: new Date().toISOString(),
          graded_by: user.id,
        })
        .eq('id', gradingSubmission.id);

      if (error) throw error;
      toast({ title: 'সফল!', description: 'গ্রেড দেওয়া হয়েছে' });
      setGradingSubmission(null);
      fetchData();
    } catch (error) {
      console.error('Error grading:', error);
      toast({
        title: 'Error',
        description: 'গ্রেড দিতে সমস্যা হয়েছে',
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
          <Link to={assignment?.lesson_id ? `/admin/lessons/${assignment.lesson_id}/assignments` : '/admin/courses'}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            ফিরে যান
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{assignment?.title}</h1>
          <p className="text-muted-foreground">স্টুডেন্ট সাবমিশন</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            সকল সাবমিশন ({submissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              কোনো সাবমিশন নেই।
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>স্টুডেন্ট</TableHead>
                  <TableHead>ফাইল</TableHead>
                  <TableHead>জমা দেওয়ার সময়</TableHead>
                  <TableHead>গ্রেড</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {submission.user_name || 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {submission.user_email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={submission.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Badge variant="secondary" className="gap-1 cursor-pointer">
                          <Download className="h-3 w-3" />
                          ডাউনলোড
                        </Badge>
                      </a>
                    </TableCell>
                    <TableCell>
                      {new Date(submission.submitted_at).toLocaleString('bn-BD')}
                    </TableCell>
                    <TableCell>
                      {submission.grade !== null ? (
                        <Badge variant="default" className="gap-1">
                          <Star className="h-3 w-3" />
                          {submission.grade}/100
                        </Badge>
                      ) : (
                        <Badge variant="outline">গ্রেড করা হয়নি</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openGradeDialog(submission)}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        গ্রেড দিন
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!gradingSubmission} onOpenChange={() => setGradingSubmission(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>গ্রেড দিন</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGrade} className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                স্টুডেন্ট: {gradingSubmission?.user_name || gradingSubmission?.user_email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">গ্রেড (0-100)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={gradeData.grade}
                onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                placeholder="85"
              />
            </div>
            <div>
              <label className="text-sm font-medium">ফিডব্যাক</label>
              <Textarea
                value={gradeData.feedback}
                onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                placeholder="আপনার মতামত লিখুন..."
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full">
              গ্রেড সেভ করুন
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
