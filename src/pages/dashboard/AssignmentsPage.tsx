import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMembership } from '@/hooks/useMembership';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Upload, Download, Clock, CheckCircle, Lock, Star } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  due_date: string | null;
  lesson_id: string | null;
  lesson_title?: string;
  course_title?: string;
  is_pro_lesson?: boolean;
}

interface Submission {
  id: string;
  assignment_id: string;
  file_url: string;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
}

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { isProActive } = useMembership();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, Submission>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  async function fetchAssignments() {
    try {
      // Fetch assignments with lesson info
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (assignmentsError) throw assignmentsError;

      // Fetch lessons to get titles and course info
      const lessonIds = [...new Set(assignmentsData?.map((a) => a.lesson_id).filter(Boolean))];
      let lessonsMap: Record<string, { title: string; course_id: string | null; is_free: boolean }> = {};

      if (lessonIds.length > 0) {
        const { data: lessonsData } = await supabase
          .from('lessons_secure' as any)
          .select('id, title, course_id, is_free')
          .in('id', lessonIds as string[]) as unknown as { data: { id: string; title: string; course_id: string | null; is_free: boolean }[] | null };

        lessonsData?.forEach((lesson) => {
          lessonsMap[lesson.id] = {
            title: lesson.title,
            course_id: lesson.course_id,
            is_free: lesson.is_free || false,
          };
        });
      }

      // Fetch courses
      const courseIds = [...new Set(Object.values(lessonsMap).map((l) => l.course_id).filter(Boolean))];
      let coursesMap: Record<string, string> = {};

      if (courseIds.length > 0) {
        const { data: coursesData } = await supabase
          .from('courses')
          .select('id, title')
          .in('id', courseIds as string[]);

        coursesData?.forEach((course) => {
          coursesMap[course.id] = course.title;
        });
      }

      // Combine data
      const assignmentsWithInfo = assignmentsData?.map((assignment) => {
        const lesson = assignment.lesson_id ? lessonsMap[assignment.lesson_id] : null;
        return {
          ...assignment,
          lesson_title: lesson?.title,
          course_title: lesson?.course_id ? coursesMap[lesson.course_id] : undefined,
          is_pro_lesson: lesson ? !lesson.is_free : false,
        };
      }) || [];

      setAssignments(assignmentsWithInfo);

      // Fetch user's submissions
      if (user) {
        const { data: submissionsData } = await supabase
          .from('assignment_submissions')
          .select('*')
          .eq('user_id', user.id);

        const submissionsMap: Record<string, Submission> = {};
        submissionsData?.forEach((s) => {
          submissionsMap[s.assignment_id] = s;
        });
        setSubmissions(submissionsMap);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function canAccessAssignment(assignment: Assignment) {
    return !assignment.is_pro_lesson || isProActive;
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedAssignment || !user) return;

    setIsUploading(true);
    try {
      // Upload file
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${selectedAssignment.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('assignments')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: signedData } = await supabase.storage.from('assignments').createSignedUrl(fileName, 60 * 60 * 24 * 365);

      // Create submission
      const { error: submitError } = await supabase.from('assignment_submissions').insert({
        assignment_id: selectedAssignment.id,
        user_id: user.id,
        file_url: signedData?.signedUrl || fileName,
      });

      if (submitError) throw submitError;

      toast({ title: 'সফল!', description: 'অ্যাসাইনমেন্ট জমা দেওয়া হয়েছে' });
      setSelectedAssignment(null);
      fetchAssignments();
    } catch (error) {
      console.error('Error submitting:', error);
      toast({
        title: 'Error',
        description: 'অ্যাসাইনমেন্ট জমা দিতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function getStatus(assignment: Assignment) {
    const submission = submissions[assignment.id];
    if (!submission) {
      if (assignment.due_date && new Date(assignment.due_date) < new Date()) {
        return { label: 'সময় শেষ', variant: 'destructive' as const };
      }
      return { label: 'জমা দেওয়া হয়নি', variant: 'outline' as const };
    }
    if (submission.grade !== null) {
      return { label: `গ্রেড: ${submission.grade}/100`, variant: 'default' as const };
    }
    return { label: 'জমা দেওয়া হয়েছে', variant: 'secondary' as const };
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
      <div>
        <h1 className="text-2xl font-bold mb-2">অ্যাসাইনমেন্ট</h1>
        <p className="text-muted-foreground">আপনার সকল অ্যাসাইনমেন্ট এখানে দেখুন</p>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">কোনো অ্যাসাইনমেন্ট নেই</h3>
            <p className="text-muted-foreground">শীঘ্রই নতুন অ্যাসাইনমেন্ট যোগ হবে</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => {
            const hasAccess = canAccessAssignment(assignment);
            const status = getStatus(assignment);
            const submission = submissions[assignment.id];

            return (
              <Card key={assignment.id} className={!hasAccess ? 'opacity-70' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {!hasAccess && <Lock className="h-4 w-4 text-muted-foreground" />}
                        {assignment.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        {assignment.course_title && (
                          <span>{assignment.course_title}</span>
                        )}
                        {assignment.lesson_title && (
                          <>
                            <span>•</span>
                            <span>{assignment.lesson_title}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {assignment.is_pro_lesson && !isProActive && (
                        <Badge variant="secondary">Pro</Badge>
                      )}
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assignment.description && (
                    <p className="text-sm text-muted-foreground">{assignment.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm">
                    {assignment.due_date && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        শেষ তারিখ: {new Date(assignment.due_date).toLocaleDateString('bn-BD')}
                      </div>
                    )}
                    {assignment.file_url && (
                      <a
                        href={assignment.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Download className="h-4 w-4" />
                        অ্যাসাইনমেন্ট ফাইল
                      </a>
                    )}
                  </div>

                  {hasAccess && (
                    <div className="flex items-center gap-2 pt-2">
                      {submission ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingSubmission(submission)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            সাবমিশন দেখুন
                          </Button>
                          {submission.grade !== null && (
                            <Badge variant="default" className="gap-1">
                              <Star className="h-3 w-3" />
                              {submission.grade}/100
                            </Badge>
                          )}
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setSelectedAssignment(assignment)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          অ্যাসাইনমেন্ট জমা দিন
                        </Button>
                      )}
                    </div>
                  )}

                  {!hasAccess && (
                    <p className="text-sm text-muted-foreground">
                      এই অ্যাসাইনমেন্ট দেখতে Pro মেম্বারশিপ প্রয়োজন
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>অ্যাসাইনমেন্ট জমা দিন</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {selectedAssignment?.title}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.zip,.rar"
            />
            <Button
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  আপলোড হচ্ছে...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  ফাইল সিলেক্ট করুন
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              সাপোর্টেড ফরম্যাট: PDF, DOC, DOCX, TXT, ZIP, RAR
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Submission View Dialog */}
      <Dialog open={!!viewingSubmission} onOpenChange={() => setViewingSubmission(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>আপনার সাবমিশন</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">জমা দেওয়ার সময়:</p>
              <p className="font-medium">
                {viewingSubmission && new Date(viewingSubmission.submitted_at).toLocaleString('bn-BD')}
              </p>
            </div>
            <div>
              <a
                href={viewingSubmission?.file_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  আপলোড করা ফাইল দেখুন
                </Button>
              </a>
            </div>
            {viewingSubmission && viewingSubmission.grade !== null && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span className="font-semibold">গ্রেড: {viewingSubmission.grade}/100</span>
                </div>
                {viewingSubmission.feedback && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">ফিডব্যাক:</p>
                    <p className="text-sm">{viewingSubmission.feedback}</p>
                  </div>
                )}
              </div>
            )}
            {viewingSubmission && viewingSubmission.grade === null && (
              <p className="text-sm text-muted-foreground text-center">
                এখনও গ্রেড দেওয়া হয়নি
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
