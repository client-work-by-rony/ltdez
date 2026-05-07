import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMembership } from '@/hooks/useMembership';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { UpgradeModal } from '@/components/dashboard/UpgradeModal';
import { Link } from 'react-router-dom';
import {
  Camera, User as UserIcon, Mail, Phone, Calendar, ShieldCheck, ShieldX, Clock,
  Crown, Zap, BookOpen, CheckCircle2, FileText, KeyRound, LogOut, Loader2, CreditCard
} from 'lucide-react';

interface ProfileData {
  full_name: string | null;
  email: string;
  phone_number: string | null;
  avatar_url: string | null;
  status: string;
  created_at: string;
  membership: string | null;
  membership_expires_at: string | null;
}

interface EnrollmentRow {
  id: string;
  enrolled_at: string;
  status: string | null;
  course_id: string;
  courses: { id: string; title: string; thumbnail_url: string | null } | null;
}

interface PaymentRow {
  id: string;
  created_at: string;
  amount: number;
  payment_method: string;
  transaction_id: string | null;
  status: string | null;
  membership_type: string | null;
}

export default function ProfilePage() {
  const { user, resetPassword, signOut } = useAuth();
  const { isProActive } = useMembership();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    progressPercent: 0,
    submissions: 0,
  });

  useEffect(() => {
    if (!user) return;

    async function loadAll() {
      try {
        const [profileRes, enrollRes, payRes, totalLessonsRes, completedRes, subsRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('user_id', user!.id).maybeSingle(),
          supabase
            .from('enrollments')
            .select('id, enrolled_at, status, course_id, courses(id, title, thumbnail_url)')
            .eq('user_id', user!.id)
            .order('enrolled_at', { ascending: false }),
          supabase
            .from('payment_requests')
            .select('id, created_at, amount, payment_method, transaction_id, status, membership_type')
            .eq('user_id', user!.id)
            .order('created_at', { ascending: false }),
          supabase.from('lessons_secure' as any).select('*', { count: 'exact', head: true }),
          supabase
            .from('lesson_progress')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user!.id)
            .eq('completed', true),
          supabase
            .from('assignment_submissions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user!.id),
        ]);

        if (profileRes.data) {
          const p = profileRes.data as any;
          setProfile(p);
          setFullName(p.full_name || '');
          setPhone(p.phone_number || '');
        }

        setEnrollments((enrollRes.data as any) || []);
        setPayments((payRes.data as any) || []);

        const total = (totalLessonsRes as any).count || 0;
        const done = (completedRes as any).count || 0;
        setStats({
          totalLessons: total,
          completedLessons: done,
          progressPercent: total > 0 ? Math.round((done / total) * 100) : 0,
          submissions: (subsRes as any).count || 0,
        });
      } catch (err) {
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    if (phone && !/^01[0-9]{9}$/.test(phone)) {
      toast({
        title: 'ফোন নম্বর সঠিক নয়',
        description: 'অনুগ্রহ করে ১১ ডিজিটের সঠিক বাংলাদেশি নম্বর দিন (যেমন: 01XXXXXXXXX)।',
        variant: 'destructive',
      });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone_number: phone || null } as any)
      .eq('user_id', user.id);
    setSaving(false);
    if (error) {
      toast({ title: 'সেভ ব্যর্থ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'প্রোফাইল আপডেট হয়েছে' });
      setProfile((p) => (p ? { ...p, full_name: fullName, phone_number: phone || null } : p));
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingAvatar(true);
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast({ title: 'আপলোড ব্যর্থ', description: uploadError.message, variant: 'destructive' });
      setUploadingAvatar(false);
      return;
    }
    const { data: signedData } = await supabase.storage
      .from('user-uploads')
      .createSignedUrl(filePath, 60 * 60 * 24 * 365);
    if (!signedData?.signedUrl) {
      toast({ title: 'URL তৈরি ব্যর্থ', variant: 'destructive' });
      setUploadingAvatar(false);
      return;
    }
    await supabase.from('profiles').update({ avatar_url: signedData.signedUrl } as any).eq('user_id', user.id);
    setProfile((p) => (p ? { ...p, avatar_url: signedData.signedUrl } : p));
    toast({ title: 'অ্যাভাটার আপডেট হয়েছে' });
    setUploadingAvatar(false);
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    const { error } = await resetPassword(user.email);
    if (error) {
      toast({ title: 'ব্যর্থ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'ইমেইল পাঠানো হয়েছে', description: 'পাসওয়ার্ড রিসেট লিংকের জন্য আপনার ইমেইল চেক করুন।' });
    }
  };

  const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  const statusBadge = (status: string) => {
    if (status === 'approved')
      return <Badge className="bg-green-500/15 text-green-600 border-green-500/30 hover:bg-green-500/20"><ShieldCheck className="h-3 w-3 mr-1" />অ্যাপ্রুভড</Badge>;
    if (status === 'rejected')
      return <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20"><ShieldX className="h-3 w-3 mr-1" />রিজেক্টেড</Badge>;
    return <Badge className="bg-yellow-500/15 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/20"><Clock className="h-3 w-3 mr-1" />পেন্ডিং</Badge>;
  };

  const paymentStatusBadge = (s: string | null) => {
    if (s === 'approved') return <Badge className="bg-green-500/15 text-green-600 border-green-500/30">অ্যাপ্রুভড</Badge>;
    if (s === 'rejected') return <Badge className="bg-destructive/15 text-destructive border-destructive/30">রিজেক্টেড</Badge>;
    return <Badge className="bg-yellow-500/15 text-yellow-600 border-yellow-500/30">পেন্ডিং</Badge>;
  };

  const daysLeft = profile?.membership_expires_at
    ? Math.max(0, Math.ceil((new Date(profile.membership_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = fullName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="space-y-6">
      {/* Header / Profile Info */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative group shrink-0 mx-auto md:mx-0">
              <Avatar className="h-24 w-24 border-4 border-primary/30">
                <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>

            <div className="flex-1 w-full space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold">{displayName}</h1>
                {profile && statusBadge(profile.status)}
                <Badge variant={isProActive ? 'default' : 'secondary'}>
                  {isProActive ? <><Crown className="h-3 w-3 mr-1" />Pro</> : 'Free'}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" /> পূর্ণ নাম
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="আপনার নাম"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> ইমেইল
                  </Label>
                  <Input id="email" value={profile?.email || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> ফোন নম্বর
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    maxLength={11}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> অ্যাকাউন্ট তৈরির তারিখ
                  </Label>
                  <Input value={formatDate(profile?.created_at)} disabled />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  সেভ করুন
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Crown className="h-5 w-5 text-primary" /> মেম্বারশিপ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-2xl font-bold">{isProActive ? 'Pro মেম্বার' : 'Free মেম্বার'}</div>
              {isProActive && profile?.membership_expires_at && (
                <p className="text-sm text-muted-foreground mt-1">
                  মেয়াদ শেষ: <span className="font-medium">{formatDate(profile.membership_expires_at)}</span>
                  {daysLeft !== null && <> • আর {daysLeft} দিন বাকি</>}
                </p>
              )}
              {!isProActive && (
                <p className="text-sm text-muted-foreground mt-1">
                  সব কোর্স, রিসোর্স ও কমিউনিটি অ্যাক্সেসের জন্য Pro-তে আপগ্রেড করুন।
                </p>
              )}
            </div>
            {!isProActive && (
              <Button onClick={() => setUpgradeOpen(true)}>
                <Zap className="h-4 w-4 mr-2" />
                আপগ্রেড করুন
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Learning Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <BookOpen className="h-7 w-7 text-blue-500 mb-2" />
            <div className="text-2xl font-bold">{enrollments.length}</div>
            <div className="text-sm text-muted-foreground">এনরোলড কোর্স</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <CheckCircle2 className="h-7 w-7 text-green-500 mb-2" />
            <div className="text-2xl font-bold">{stats.completedLessons}/{stats.totalLessons}</div>
            <div className="text-sm text-muted-foreground">সম্পন্ন লেসন</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Zap className="h-7 w-7 text-yellow-500 mb-2" />
            <div className="text-2xl font-bold">{stats.progressPercent}%</div>
            <Progress value={stats.progressPercent} className="h-2 mt-1" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <FileText className="h-7 w-7 text-primary mb-2" />
            <div className="text-2xl font-bold">{stats.submissions}</div>
            <div className="text-sm text-muted-foreground">জমা দেওয়া অ্যাসাইনমেন্ট</div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollments */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" /> আমার এনরোলমেন্ট
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">এখনো কোনো কোর্সে এনরোল করা হয়নি।</p>
          ) : (
            <div className="space-y-3">
              {enrollments.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {e.courses?.thumbnail_url ? (
                      <img
                        src={e.courses.thumbnail_url}
                        alt={e.courses.title}
                        className="h-12 w-12 rounded object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium truncate">{e.courses?.title || 'Course'}</p>
                      <p className="text-xs text-muted-foreground">
                        এনরোল: {formatDate(e.enrolled_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{e.status || 'active'}</Badge>
                    {e.courses?.id && (
                      <Link to={`/dashboard/courses/${e.courses.id}`}>
                        <Button size="sm" variant="outline">কোর্সে যান</Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-primary" /> পেমেন্ট ইতিহাস
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">কোনো পেমেন্ট রেকর্ড নেই।</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>পরিমাণ</TableHead>
                    <TableHead>মাধ্যম</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="whitespace-nowrap text-sm">{formatDate(p.created_at)}</TableCell>
                      <TableCell className="font-medium">৳{p.amount}</TableCell>
                      <TableCell className="capitalize">{p.payment_method}</TableCell>
                      <TableCell className="text-sm font-mono">{p.transaction_id || '—'}</TableCell>
                      <TableCell>{paymentStatusBadge(p.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">অ্যাকাউন্ট অ্যাকশন</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={handlePasswordReset}>
            <KeyRound className="h-4 w-4 mr-2" />
            পাসওয়ার্ড পরিবর্তন করুন
          </Button>
          <Button variant="destructive" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            লগ আউট
          </Button>
        </CardContent>
      </Card>

      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
