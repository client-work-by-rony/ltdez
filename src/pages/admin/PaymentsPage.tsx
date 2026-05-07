import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, XCircle, Clock, CreditCard, Crown, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentRequest {
  id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  transaction_id: string | null;
  phone_number: string | null;
  status: string;
  membership_type: string;
  purchase_type?: string | null;
  course_id?: string | null;
  notes: string | null;
  created_at: string;
  user_email?: string;
  user_name?: string;
  course_title?: string;
}

const DURATION_OPTIONS = [
  { value: '3', label: '৩ মাস' },
  { value: '6', label: '৬ মাস' },
  { value: '12', label: '১ বছর' },
];

export default function PaymentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [durations, setDurations] = useState<Record<string, string>>({});
  const [enrollFor, setEnrollFor] = useState<PaymentRequest | null>(null);
  const [enrollCourseId, setEnrollCourseId] = useState<string>('');
  const [enrolling, setEnrolling] = useState(false);
  const [courses, setCourses] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    supabase
      .from('courses')
      .select('id, title')
      .order('title')
      .then(({ data }) => setCourses(data || []));
  }, []);

  async function handleEnrollToCourse() {
    if (!enrollFor || !enrollCourseId) return;
    setEnrolling(true);
    try {
      const { error } = await supabase.from('enrollments').insert({
        user_id: enrollFor.user_id,
        course_id: enrollCourseId,
        status: 'active',
      });
      if (error) {
        if (error.code === '23505') throw new Error('এই ইউজার ইতিমধ্যে এই কোর্সে এনরোল করা আছে');
        throw error;
      }
      toast({ title: '✅ এনরোল করা হয়েছে', description: 'ইউজারকে কোর্সে এনরোল করা হয়েছে' });
      setEnrollFor(null);
      setEnrollCourseId('');
    } catch (error: any) {
      toast({ title: 'এরর', description: error.message || 'এনরোল করতে সমস্যা হয়েছে', variant: 'destructive' });
    } finally {
      setEnrolling(false);
    }
  }

  useEffect(() => {
    fetchPayments();

    const paymentsChannel = supabase
      .channel('admin-payment-requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_requests' }, fetchPayments)
      .subscribe();

    return () => {
      supabase.removeChannel(paymentsChannel);
    };
  }, []);

  async function fetchPayments() {
    try {
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payment_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      const userIds = [...new Set(paymentsData?.map((p) => p.user_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, email, full_name')
        .in('user_id', userIds);

      const profilesMap = new Map(profilesData?.map((p) => [p.user_id, p]) || []);

      const courseIds = [...new Set((paymentsData || []).map((p: any) => p.course_id).filter(Boolean))];
      const coursesMap = new Map<string, string>();
      if (courseIds.length > 0) {
        const { data: courseRows } = await supabase
          .from('courses')
          .select('id, title')
          .in('id', courseIds);
        (courseRows || []).forEach((c: any) => coursesMap.set(c.id, c.title));
      }

      const enrichedPayments = paymentsData?.map((payment: any) => ({
        ...payment,
        user_email: profilesMap.get(payment.user_id)?.email || 'Unknown user',
        user_name: profilesMap.get(payment.user_id)?.full_name || '',
        course_title: payment.course_id ? coursesMap.get(payment.course_id) : undefined,
      })) || [];

      setPayments(enrichedPayments);
      setDurations((current) => {
        const next = { ...current };
        enrichedPayments.forEach((payment) => {
          if (!next[payment.id]) next[payment.id] = '12';
        });
        return next;
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApprove(paymentId: string) {
    if (!user) return;
    setProcessingId(paymentId);

    try {
      const durationMonths = Number(durations[paymentId] || '12');
      const { data, error } = await supabase.functions.invoke('admin-approve-payment', {
        body: { paymentId, durationMonths },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setPayments((current) => current.map((payment) =>
        payment.id === paymentId ? { ...payment, status: 'approved' } : payment
      ));

      const target = payments.find((p) => p.id === paymentId);
      const isCourse = target?.purchase_type === 'course';
      toast({
        title: '✅ অ্যাপ্রুভ হয়েছে!',
        description: isCourse
          ? `ইউজারকে "${target?.course_title || 'কোর্স'}"-এ এনরোল করা হয়েছে`
          : `ইউজার ${durationMonths} মাসের জন্য Pro হয়েছে`,
      });

      fetchPayments();
    } catch (error: any) {
      toast({
        title: 'ত্রুটি',
        description: error.message || 'অ্যাপ্রুভ করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(paymentId: string) {
    if (!user) return;
    setProcessingId(paymentId);

    try {
      const { error } = await supabase
        .from('payment_requests')
        .update({
          status: 'rejected',
          verified_by: user.id,
          verified_at: new Date().toISOString(),
        })
        .eq('id', paymentId);

      if (error) throw error;

      setPayments((current) => current.map((payment) =>
        payment.id === paymentId ? { ...payment, status: 'rejected' } : payment
      ));

      toast({
        title: 'রিজেক্ট করা হয়েছে',
        description: 'পেমেন্ট রিকোয়েস্ট রিজেক্ট করা হয়েছে',
      });
    } catch (error: any) {
      toast({
        title: 'ত্রুটি',
        description: error.message || 'রিজেক্ট করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingPayments = payments.filter((p) => p.status === 'pending');
  const processedPayments = payments.filter((p) => p.status !== 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">পেমেন্ট ম্যানেজমেন্ট</h1>
        <p className="text-muted-foreground">পেমেন্ট অ্যাপ্রুভ করলে ইউজার সাথে সাথে Pro হয়ে যাবে</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-500">{pendingPayments.length}</p>
            <p className="text-sm text-muted-foreground mt-1">পেন্ডিং</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-500">{payments.filter((p) => p.status === 'approved').length}</p>
            <p className="text-sm text-muted-foreground mt-1">অ্যাপ্রুভড</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-destructive">{payments.filter((p) => p.status === 'rejected').length}</p>
            <p className="text-sm text-muted-foreground mt-1">রিজেক্টেড</p>
          </CardContent>
        </Card>
      </div>

      {pendingPayments.length > 0 && (
        <Card className="border-orange-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-orange-500" />
              পেন্ডিং রিকোয়েস্ট ({pendingPayments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingPayments.map((payment) => {
              const isCourse = payment.purchase_type === 'course';
              return (
              <div key={payment.id} className="flex flex-col gap-3 p-4 rounded-lg border bg-card lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-sm truncate">{payment.user_name || payment.user_email}</p>
                    <Badge variant="outline" className="capitalize text-xs shrink-0">{payment.payment_method}</Badge>
                    {isCourse ? (
                      <Badge className="text-xs shrink-0 gap-1"><GraduationCap className="h-3 w-3" />কোর্স: {payment.course_title || '—'}</Badge>
                    ) : (
                      <Badge className="text-xs shrink-0 gap-1"><Crown className="h-3 w-3" />Pro মেম্বারশিপ</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>৳{payment.amount}</span>
                    <span>TrxID: <span className="font-mono">{payment.transaction_id || '-'}</span></span>
                    <span>{payment.phone_number}</span>
                    <span>{format(new Date(payment.created_at), 'dd/MM/yy HH:mm')}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 lg:items-center">
                  {!isCourse && (
                    <Select value={durations[payment.id] || '12'} onValueChange={(value) => setDurations((current) => ({ ...current, [payment.id]: value }))}>
                      <SelectTrigger className="w-full sm:w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleApprove(payment.id)}
                    disabled={processingId === payment.id}
                    className="gap-1.5"
                  >
                    {processingId === payment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : isCourse ? (<><GraduationCap className="h-4 w-4" /> এনরোল করুন</>) : (<><Crown className="h-4 w-4" /> Pro করুন</>)}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(payment.id)}
                    disabled={processingId === payment.id}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {processedPayments.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" />
              প্রসেসড ({processedPayments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {processedPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{payment.user_name || payment.user_email}</p>
                    <span className="text-xs text-muted-foreground">৳{payment.amount}</span>
                    <span className="text-xs text-muted-foreground font-mono">{payment.transaction_id || '-'}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(payment.created_at), 'dd/MM/yy HH:mm')} • {payment.payment_method}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={payment.status === 'approved' ? 'default' : 'destructive'}>
                    {payment.status === 'approved' ? <><CheckCircle2 className="h-3 w-3 mr-1" />Pro</> : <><XCircle className="h-3 w-3 mr-1" />রিজেক্ট</>}
                  </Badge>
                  {payment.status === 'approved' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => { setEnrollFor(payment); setEnrollCourseId(''); }}
                    >
                      <GraduationCap className="h-3.5 w-3.5" />
                      এনরোল
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {payments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">কোনো পেমেন্ট রিকোয়েস্ট নেই</CardContent>
        </Card>
      )}

      <Dialog open={!!enrollFor} onOpenChange={(open) => { if (!open) { setEnrollFor(null); setEnrollCourseId(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>কোর্সে এনরোল করুন</DialogTitle>
            <DialogDescription>
              {enrollFor && (<><strong>{enrollFor.user_name || enrollFor.user_email}</strong>-কে একটি কোর্সে এনরোল করুন।</>)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">কোর্স সিলেক্ট করুন</label>
            <Select value={enrollCourseId} onValueChange={setEnrollCourseId}>
              <SelectTrigger><SelectValue placeholder="কোর্স সিলেক্ট করুন" /></SelectTrigger>
              <SelectContent>
                {courses.map((c) => (<SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEnrollFor(null); setEnrollCourseId(''); }}>বাতিল</Button>
            <Button onClick={handleEnrollToCourse} disabled={!enrollCourseId || enrolling} className="gap-2">
              {enrolling ? <Loader2 className="h-4 w-4 animate-spin" /> : <GraduationCap className="h-4 w-4" />}
              এনরোল করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
