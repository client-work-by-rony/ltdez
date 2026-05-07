import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Search, Trash2, GraduationCap, Crown } from 'lucide-react';
import { format } from 'date-fns';

interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  status: string;
  user_email?: string;
  user_name?: string;
  course_title?: string;
}

interface ProUser {
  user_id: string;
  email: string;
  full_name: string | null;
  membership: string | null;
}

interface Course {
  id: string;
  title: string;
}

export default function EnrollmentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [proUsers, setProUsers] = useState<ProUser[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [enrolling, setEnrolling] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<Enrollment | null>(null);

  useEffect(() => {
    fetchAll();

    const channel = supabase
      .channel('admin-enrollments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enrollments' },
        () => fetchEnrollments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAll() {
    setIsLoading(true);
    await Promise.all([fetchEnrollments(), fetchProUsers(), fetchCourses()]);
    setIsLoading(false);
  }

  async function fetchEnrollments() {
    try {
      const { data: enrollmentsData, error } = await supabase
        .from('enrollments')
        .select('*')
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      const userIds = [...new Set(enrollmentsData?.map((e) => e.user_id) || [])];
      const courseIds = [...new Set(enrollmentsData?.map((e) => e.course_id) || [])];

      const [profilesRes, coursesRes] = await Promise.all([
        userIds.length
          ? supabase.from('profiles').select('user_id, email, full_name').in('user_id', userIds)
          : Promise.resolve({ data: [] as any[] }),
        courseIds.length
          ? supabase.from('courses').select('id, title').in('id', courseIds)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const profilesMap = new Map((profilesRes.data || []).map((p: any) => [p.user_id, p]));
      const coursesMap = new Map((coursesRes.data || []).map((c: any) => [c.id, c]));

      const enriched: Enrollment[] = (enrollmentsData || []).map((e) => ({
        ...e,
        user_email: profilesMap.get(e.user_id)?.email || 'Unknown',
        user_name: profilesMap.get(e.user_id)?.full_name || '',
        course_title: coursesMap.get(e.course_id)?.title || 'কোর্স নেই',
      }));

      setEnrollments(enriched);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast({
        title: 'এরর',
        description: 'এনরোলমেন্ট লোড করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    }
  }

  async function fetchProUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, email, full_name, membership')
      .eq('membership', 'pro')
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching pro users:', error);
      return;
    }
    setProUsers((data as ProUser[]) || []);
  }

  async function fetchCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title')
      .order('title', { ascending: true });

    if (error) {
      console.error('Error fetching courses:', error);
      return;
    }
    setCourses((data as Course[]) || []);
  }

  async function handleEnroll() {
    if (!user) return;
    if (!selectedUserId || !selectedCourseId) {
      toast({
        title: 'সিলেক্ট করুন',
        description: 'ইউজার এবং কোর্স দুটোই সিলেক্ট করুন',
        variant: 'destructive',
      });
      return;
    }

    setEnrolling(true);
    try {
      const { error } = await supabase.from('enrollments').insert({
        user_id: selectedUserId,
        course_id: selectedCourseId,
        status: 'active',
      });

      if (error) {
        if (error.code === '23505') {
          throw new Error('এই ইউজার ইতিমধ্যে এই কোর্সে এনরোল করা আছে');
        }
        throw error;
      }

      toast({
        title: '✅ সফল',
        description: 'ইউজারকে কোর্সে এনরোল করা হয়েছে',
      });

      setSelectedUserId('');
      setSelectedCourseId('');
      fetchEnrollments();
    } catch (error: any) {
      toast({
        title: 'এরর',
        description: error.message || 'এনরোল করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    } finally {
      setEnrolling(false);
    }
  }

  async function handleRemove(enrollment: Enrollment) {
    setRemovingId(enrollment.id);
    try {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', enrollment.id);

      if (error) throw error;

      toast({
        title: 'রিমুভ করা হয়েছে',
        description: 'এনরোলমেন্ট সফলভাবে রিমুভ করা হয়েছে',
      });
      setConfirmRemove(null);
      fetchEnrollments();
    } catch (error: any) {
      toast({
        title: 'এরর',
        description: error.message || 'রিমুভ করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    } finally {
      setRemovingId(null);
    }
  }

  const filteredEnrollments = useMemo(() => {
    if (!searchQuery.trim()) return enrollments;
    const q = searchQuery.toLowerCase();
    return enrollments.filter(
      (e) =>
        e.user_name?.toLowerCase().includes(q) ||
        e.user_email?.toLowerCase().includes(q) ||
        e.course_title?.toLowerCase().includes(q)
    );
  }, [enrollments, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">এনরোলমেন্ট ম্যানেজমেন্ট</h1>
        <p className="text-muted-foreground">
          Pro ইউজারদের কোর্সে ম্যানুয়ালি এনরোল করুন
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{enrollments.length}</p>
            <p className="text-sm text-muted-foreground mt-1">মোট এনরোলমেন্ট</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-500">{proUsers.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Pro ইউজার</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{courses.length}</p>
            <p className="text-sm text-muted-foreground mt-1">মোট কোর্স</p>
          </CardContent>
        </Card>
      </div>

      {/* Enroll Form */}
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            নতুন এনরোলমেন্ট তৈরি করুন
          </CardTitle>
        </CardHeader>
        <CardContent>
          {proUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              কোনো Pro ইউজার নেই। প্রথমে পেমেন্ট অ্যাপ্রুভ করে ইউজারকে Pro করুন।
            </p>
          ) : courses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              কোনো কোর্স নেই। প্রথমে কোর্স তৈরি করুন।
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Pro ইউজার</label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="ইউজার সিলেক্ট করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {proUsers.map((u) => (
                      <SelectItem key={u.user_id} value={u.user_id}>
                        <div className="flex items-center gap-2">
                          <Crown className="h-3.5 w-3.5 text-yellow-500" />
                          <span>{u.full_name || u.email}</span>
                          {u.full_name && (
                            <span className="text-xs text-muted-foreground">({u.email})</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">কোর্স</label>
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="কোর্স সিলেক্ট করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleEnroll}
                  disabled={enrolling || !selectedUserId || !selectedCourseId}
                  className="w-full md:w-auto gap-2"
                >
                  {enrolling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <GraduationCap className="h-4 w-4" />
                  )}
                  এনরোল করুন
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enrollments List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle>সব এনরোলমেন্ট ({filteredEnrollments.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="নাম, ইমেইল বা কোর্স সার্চ করুন"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEnrollments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {searchQuery ? 'কোনো ম্যাচিং এনরোলমেন্ট নেই' : 'কোনো এনরোলমেন্ট নেই'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ইউজার</TableHead>
                    <TableHead>কোর্স</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead>তারিখ</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {enrollment.user_name || 'নাম নেই'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {enrollment.user_email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{enrollment.course_title}</TableCell>
                      <TableCell>
                        <Badge
                          variant={enrollment.status === 'active' ? 'default' : 'secondary'}
                        >
                          {enrollment.status === 'active' ? 'সক্রিয়' : enrollment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(enrollment.enrolled_at), 'dd/MM/yy HH:mm')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setConfirmRemove(enrollment)}
                          disabled={removingId === enrollment.id}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {removingId === enrollment.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!confirmRemove} onOpenChange={(open) => !open && setConfirmRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>এনরোলমেন্ট রিমুভ করবেন?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmRemove && (
                <>
                  <strong>{confirmRemove.user_name || confirmRemove.user_email}</strong>-কে{' '}
                  <strong>{confirmRemove.course_title}</strong> কোর্স থেকে রিমুভ করা হবে। এটি undo করা যাবে না।
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmRemove && handleRemove(confirmRemove)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              রিমুভ করুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
