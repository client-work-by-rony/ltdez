import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMembership } from '@/hooks/useMembership';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle2, Trophy, Zap, Rocket, Users, Crown, Camera, Clock, ShieldCheck, ShieldX } from 'lucide-react';
import { UpgradeModal } from '@/components/dashboard/UpgradeModal';
import { useToast } from '@/hooks/use-toast';

export default function UserDashboard() {
  const { user } = useAuth();
  const { membership, isProActive, isLoading: membershipLoading } = useMembership();
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    progressPercent: 0,
  });
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [accountStatus, setAccountStatus] = useState<string>('pending');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;

      try {
        // Fetch avatar
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url, status')
          .eq('user_id', user.id)
          .single();
        if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
        if ((profile as any)?.status) setAccountStatus((profile as any).status);

        // Fetch total lessons
        const { count: totalLessons } = await supabase
          .from('lessons_secure' as any)
          .select('*', { count: 'exact', head: true }) as unknown as { count: number | null };

        // Fetch completed lessons
        const { count: completedLessons } = await supabase
          .from('lesson_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('completed', true);

        const total = totalLessons || 0;
        const completed = completedLessons || 0;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        setStats({
          totalLessons: total,
          completedLessons: completed,
          progressPercent: percent,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();

    // Realtime: listen for profile status changes
    if (user) {
      const channel = supabase
        .channel('user-profile-status')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `user_id=eq.${user.id}` },
          (payload: any) => {
            if (payload.new?.status) setAccountStatus(payload.new.status);
            if (payload.new?.avatar_url) setAvatarUrl(payload.new.avatar_url);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingAvatar(true);
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from('user-uploads').upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast({ title: 'আপলোড ব্যর্থ', description: uploadError.message, variant: 'destructive' });
      setUploadingAvatar(false);
      return;
    }
    const { data: signedData, error: signError } = await supabase.storage.from('user-uploads').createSignedUrl(filePath, 60 * 60 * 24 * 365);
    if (signError || !signedData?.signedUrl) {
      toast({ title: 'URL তৈরি ব্যর্থ', variant: 'destructive' });
      setUploadingAvatar(false);
      return;
    }
    const newUrl = signedData.signedUrl;
    await supabase.from('profiles').update({ avatar_url: newUrl } as any).eq('user_id', user.id);
    setAvatarUrl(newUrl);
    toast({ title: 'অ্যাভাটার আপডেট হয়েছে' });
    setUploadingAvatar(false);
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Builder';

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20">
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="h-16 w-16 border-2 border-primary/30">
                <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                disabled={uploadingAvatar}
              >
                <Camera className="h-5 w-5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                স্বাগতম, {displayName}! <Rocket className="inline h-7 w-7" />
              </h1>
              <p className="text-muted-foreground">
                শিখুন, শেয়ার করুন এবং একসাথে গ্রো করুন!
              </p>
            </div>
          </div>
          <Button variant="default" className="whitespace-nowrap" onClick={() => window.location.href = '/dashboard/community'}>
            <Users className="h-4 w-4 mr-2" />
            কমিউনিটিতে যান →
          </Button>
        </CardContent>
      </Card>

      {/* Account Status Banner */}
      {accountStatus === 'pending' && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-6 w-6 text-yellow-500 shrink-0" />
            <div>
              <p className="font-semibold">⏳ আপনার অ্যাকাউন্ট রিভিউ করা হচ্ছে</p>
              <p className="text-sm text-muted-foreground">অ্যাডমিন আপনার অ্যাকাউন্ট অ্যাপ্রুভ করলে আপনি সব ফিচার ব্যবহার করতে পারবেন।</p>
            </div>
          </CardContent>
        </Card>
      )}
      {accountStatus === 'approved' && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-green-500 shrink-0" />
            <div>
              <p className="font-semibold">✅ আপনার অ্যাকাউন্ট অ্যাপ্রুভড</p>
              <p className="text-sm text-muted-foreground">আপনি সব ফিচার ব্যবহার করতে পারবেন।</p>
            </div>
          </CardContent>
        </Card>
      )}
      {accountStatus === 'rejected' && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldX className="h-6 w-6 text-destructive shrink-0" />
            <div>
              <p className="font-semibold">❌ আপনার অ্যাকাউন্ট রিজেক্ট করা হয়েছে</p>
              <p className="text-sm text-muted-foreground">বিস্তারিত জানতে অ্যাডমিনের সাথে যোগাযোগ করুন।</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4">
            <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
            <div className="text-2xl font-bold">{stats.totalLessons}</div>
            <div className="text-sm text-muted-foreground">মোট লেসন</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4">
            <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
            <div className="text-2xl font-bold">{stats.completedLessons}</div>
            <div className="text-sm text-muted-foreground">সম্পন্ন</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
          <CardContent className="p-4">
            <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
            <div className="text-2xl font-bold">{stats.progressPercent}%</div>
            <div className="text-sm text-muted-foreground">প্রগ্রেস</div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${isProActive ? 'from-primary/10 to-purple-500/5 border-primary/20' : 'from-gray-500/10 to-gray-600/5 border-gray-500/20'}`}>
          <CardContent className="p-4">
            <Zap className={`h-8 w-8 ${isProActive ? 'text-primary' : 'text-gray-500'} mb-2`} />
            <div className="text-2xl font-bold">{isProActive ? 'Pro' : 'Free'}</div>
            <div className="text-sm text-muted-foreground">মেম্বারশিপ</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            আপনার লার্নিং প্রগ্রেস
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {stats.completedLessons} / {stats.totalLessons} লেসন সম্পন্ন
              {stats.totalLessons - stats.completedLessons > 0 && 
                ` • ${stats.totalLessons - stats.completedLessons} বাকি আছে`
              }
            </span>
            <span className="text-sm font-medium text-primary">{stats.progressPercent}%</span>
          </div>
          <Progress value={stats.progressPercent} className="h-3" />
        </CardContent>
      </Card>

      {/* Upgrade Card (only for free users) */}
      {!isProActive && (
        <Card className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Crown className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Pro মেম্বারশিপে আপগ্রেড করুন</h3>
                  <p className="text-sm text-muted-foreground">
                    সব কোর্স, এক্সক্লুসিভ রিসোর্স এবং প্রাইভেট কমিউনিটি অ্যাক্সেস পান
                  </p>
                </div>
              </div>
              <Button onClick={() => setIsUpgradeModalOpen(true)} className="whitespace-nowrap">
                <Zap className="h-4 w-4 mr-2" />
                আপগ্রেড করুন
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
      />
    </div>
  );
}
