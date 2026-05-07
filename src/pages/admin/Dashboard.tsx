import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Users, GraduationCap, MessageSquare, TrendingUp, Crown, CreditCard, Clock, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Stats {
  totalUsers: number;
  proUsers: number;
  totalEnrollments: number;
  unreadMessages: number;
  todayVisitors: number;
  pendingPayments: number;
  totalRevenue: number;
  pendingApprovals: number;
}

interface RecentActivity {
  type: 'signup' | 'payment' | 'enrollment';
  description: string;
  time: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    proUsers: 0,
    totalEnrollments: 0,
    unreadMessages: 0,
    todayVisitors: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: usersCount },
          { data: proData },
          { count: enrollmentsCount },
          { count: messagesCount },
          { count: pendingPaymentsCount },
          { data: approvedPayments },
          { count: pendingApprovals },
          { data: recentSignups },
          { data: recentPayments },
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('user_id').eq('membership', 'pro'),
          supabase.from('enrollments').select('*', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
          supabase.from('payment_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('payment_requests').select('amount').eq('status', 'approved'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('profiles').select('full_name, email, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('payment_requests').select('user_id, amount, payment_method, created_at, status').order('created_at', { ascending: false }).limit(5),
        ]);

        const today = new Date().toISOString().split('T')[0];
        const { data: todayStats } = await supabase
          .from('site_analytics')
          .select('visitors')
          .eq('date', today)
          .maybeSingle();

        const totalRevenue = (approvedPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0);

        setStats({
          totalUsers: usersCount || 0,
          proUsers: proData?.length || 0,
          totalEnrollments: enrollmentsCount || 0,
          unreadMessages: messagesCount || 0,
          todayVisitors: todayStats?.visitors || 0,
          pendingPayments: pendingPaymentsCount || 0,
          totalRevenue,
          pendingApprovals: pendingApprovals || 0,
        });

        // Build recent activity
        const activities: RecentActivity[] = [];
        (recentSignups || []).forEach((u: any) => {
          activities.push({
            type: 'signup',
            description: `${u.full_name || u.email} রেজিস্ট্রেশন করেছেন`,
            time: u.created_at,
          });
        });
        (recentPayments || []).forEach((p: any) => {
          activities.push({
            type: 'payment',
            description: `৳${p.amount} পেমেন্ট (${p.payment_method}) — ${p.status}`,
            time: p.created_at,
          });
        });
        activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setRecentActivity(activities.slice(0, 8));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'মোট ইউজার', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { title: 'Pro ইউজার', value: stats.proUsers, icon: Crown, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    { title: 'মোট এনরোলমেন্ট', value: stats.totalEnrollments, icon: GraduationCap, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { title: 'অপঠিত মেসেজ', value: stats.unreadMessages, icon: MessageSquare, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { title: 'পেন্ডিং পেমেন্ট', value: stats.pendingPayments, icon: CreditCard, color: 'text-red-500', bgColor: 'bg-red-500/10' },
    { title: 'মোট রেভিনিউ', value: `৳${stats.totalRevenue}`, icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { title: 'পেন্ডিং অ্যাপ্রুভাল', value: stats.pendingApprovals, icon: Clock, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { title: 'আজকের ভিজিটর', value: stats.todayVisitors, icon: TrendingUp, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'signup': return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'payment': return <CreditCard className="h-4 w-4 text-green-500" />;
      default: return <GraduationCap className="h-4 w-4 text-purple-500" />;
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} মিনিট আগে`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ঘণ্টা আগে`;
    return `${Math.floor(hours / 24)} দিন আগে`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ড্যাশবোর্ড</h1>
        <p className="text-muted-foreground">Noor Handicraft Academy এডমিন প্যানেলে স্বাগতম</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">সাম্প্রতিক কার্যকলাপ</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-sm">কোনো কার্যকলাপ নেই</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{timeAgo(activity.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">দ্রুত অ্যাকশন</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'ইউজার ম্যানেজ', path: '/admin/users', icon: Users, color: 'text-blue-500' },
              { label: 'পেমেন্ট দেখুন', path: '/admin/payments', icon: CreditCard, color: 'text-green-500' },
              { label: 'কোর্স ম্যানেজ', path: '/admin/courses', icon: GraduationCap, color: 'text-purple-500' },
              { label: 'মেসেজ দেখুন', path: '/admin/messages', icon: MessageSquare, color: 'text-orange-500' },
            ].map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
              >
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <span className="text-sm font-medium">{action.label}</span>
                {action.path === '/admin/payments' && stats.pendingPayments > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs">{stats.pendingPayments}</Badge>
                )}
                {action.path === '/admin/users' && stats.pendingApprovals > 0 && (
                  <Badge className="ml-auto text-xs bg-yellow-500">{stats.pendingApprovals}</Badge>
                )}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
