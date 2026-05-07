import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TrendingUp, Users, GraduationCap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Analytics {
  id: string;
  date: string;
  visitors: number;
  signups: number;
  enrollments: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data, error } = await supabase
          .from('site_analytics')
          .select('*')
          .order('date', { ascending: false })
          .limit(30);

        if (error) throw error;
        setAnalytics(data || []);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast({
          title: 'এরর',
          description: 'অ্যানালিটিক্স লোড করতে সমস্যা হয়েছে',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [toast]);

  const totalVisitors = analytics.reduce((sum, a) => sum + a.visitors, 0);
  const totalSignups = analytics.reduce((sum, a) => sum + a.signups, 0);
  const totalEnrollments = analytics.reduce((sum, a) => sum + a.enrollments, 0);

  const chartData = [...analytics].reverse().map(a => ({
    date: new Date(a.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' }),
    visitors: a.visitors,
    signups: a.signups,
  }));

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
        <h1 className="text-3xl font-bold">অ্যানালিটিক্স</h1>
        <p className="text-muted-foreground">
          সাইটের পরিসংখ্যান দেখুন
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              মোট ভিজিটর (৩০ দিন)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisitors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              মোট সাইনআপ (৩০ দিন)
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSignups}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              মোট এনরোলমেন্ট (৩০ দিন)
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ভিজিটর ও সাইনআপ চার্ট</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>কোনো ডাটা নেই</p>
              <p className="text-sm">অ্যানালিটিক্স ডাটা স্বয়ংক্রিয়ভাবে সংগ্রহ হবে</p>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="hsl(var(--primary))" name="ভিজিটর" />
                  <Bar dataKey="signups" fill="hsl(var(--chart-2))" name="সাইনআপ" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
