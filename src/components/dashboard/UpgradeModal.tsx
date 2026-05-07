import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, Phone, CreditCard, Crown, BookOpen, Check, UserPlus, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** If provided, the picker preselects this course id */
  preselectedCourseId?: string;
  /** @deprecated use preselectedCourseId; kept for back-compat */
  coursePrice?: number;
  /** @deprecated kept for back-compat */
  courseTitle?: string;
}

const PAYMENT_DETAILS = {
  bkash: { number: '01711282515', name: 'Noor Handicraft Academy' },
  nagad: { number: '01711282515', name: 'Noor Handicraft Academy' },
};

const PRO_PRICE = 999;

interface CourseOption {
  id: string;
  title: string;
  emoji: string | null;
  thumbnail_url: string | null;
  price: number | null;
}

type Selection =
  | { type: 'pro' }
  | { type: 'course'; courseId: string };

export function UpgradeModal({ isOpen, onClose, preselectedCourseId }: UpgradeModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<'signup' | 'pick' | 'payment' | 'success'>('pick');
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [selection, setSelection] = useState<Selection>({ type: 'pro' });

  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guest signup state
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signingUp, setSigningUp] = useState(false);
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);

  // Fetch published, paid courses when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setLoadingCourses(true);
    supabase
      .from('courses')
      .select('id, title, emoji, thumbnail_url, price')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        const list = (data || []).filter((c: any) => Number(c.price) > 0) as CourseOption[];
        setCourses(list);
        setLoadingCourses(false);
      });
  }, [isOpen]);

  // Apply preselection when it changes / modal opens
  useEffect(() => {
    if (!isOpen) return;
    if (preselectedCourseId) {
      setSelection({ type: 'course', courseId: preselectedCourseId });
    } else {
      setSelection({ type: 'pro' });
    }
    setEmailSentTo(null);
    if (!user) {
      setStep('signup');
    } else {
      setStep('pick');
    }
  }, [isOpen, preselectedCourseId, user]);

  const selectedCourse =
    selection.type === 'course' ? courses.find((c) => c.id === selection.courseId) : undefined;
  const amount = selection.type === 'pro' ? PRO_PRICE : Number(selectedCourse?.price ?? 0);
  const summaryTitle =
    selection.type === 'pro'
      ? 'Pro মেম্বারশিপ (সব কোর্স)'
      : selectedCourse?.title || 'কোর্স';

  const validateInputs = () => {
    if (!transactionId || transactionId.length < 5 || transactionId.length > 30) {
      toast({ title: 'ত্রুটি', description: 'ট্রানজেকশন আইডি ৫-৩০ অক্ষরের মধ্যে হতে হবে', variant: 'destructive' });
      return false;
    }
    if (!phoneNumber || !/^01[0-9]{9}$/.test(phoneNumber)) {
      toast({ title: 'ত্রুটি', description: 'সঠিক বাংলাদেশি ফোন নম্বর দিন (01XXXXXXXXX)', variant: 'destructive' });
      return false;
    }
    if (notes && notes.length > 500) {
      toast({ title: 'ত্রুটি', description: 'নোটস ৫০০ অক্ষরের বেশি হতে পারবে না', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!validateInputs()) return;
    if (selection.type === 'course' && !selectedCourse) {
      toast({ title: 'ত্রুটি', description: 'কোর্স নির্বাচন করুন', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('payment_requests').insert({
        user_id: user.id,
        amount,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        phone_number: phoneNumber,
        notes,
        membership_type: selection.type === 'pro' ? 'pro' : 'free',
        purchase_type: selection.type,
        course_id: selection.type === 'course' ? selection.courseId : null,
      } as any);
      if (error) throw error;
      setStep('success');
    } catch (error: any) {
      toast({
        title: 'ত্রুটি',
        description: error.message || 'পেমেন্ট রিকোয়েস্ট সাবমিট করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async () => {
    if (!signupName.trim()) {
      toast({ title: 'ত্রুটি', description: 'আপনার নাম দিন', variant: 'destructive' });
      return;
    }
    if (signupPassword.length < 6) {
      toast({ title: 'ত্রুটি', description: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে', variant: 'destructive' });
      return;
    }
    setSigningUp(true);
    try {
      if (authMode === 'phone') {
        if (!/^01\d{9}$/.test(signupPhone)) {
          throw new Error('সঠিক ফোন নম্বর দিন (01XXXXXXXXX)');
        }
        const { data, error } = await supabase.functions.invoke('phone-signup', {
          body: { phone: signupPhone, password: signupPassword, fullName: signupName },
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        const syntheticEmail = `${signupPhone}@phone.noor.local`;
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: syntheticEmail,
          password: signupPassword,
        });
        if (signInError) throw signInError;
        if (!phoneNumber) setPhoneNumber(signupPhone);
        toast({ title: '✅ অ্যাকাউন্ট তৈরি হয়েছে', description: 'এবার পেমেন্টে এগিয়ে যান' });
        // step transitions to payment via the user-effect above
      } else {
        if (!/^\S+@\S+\.\S+$/.test(signupEmail)) {
          throw new Error('সঠিক ইমেইল দিন');
        }
        const { error } = await supabase.auth.signUp({
          email: signupEmail,
          password: signupPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: { full_name: signupName },
          },
        });
        if (error) throw error;
        setEmailSentTo(signupEmail);
      }
    } catch (error: any) {
      toast({
        title: 'সাইনআপ ব্যর্থ',
        description: error.message || 'অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    } finally {
      setSigningUp(false);
    }
  };

  const handleClose = () => {
    setStep(user ? 'pick' : 'signup');
    setTransactionId('');
    setPhoneNumber('');
    setNotes('');
    setSignupName('');
    setSignupPhone('');
    setSignupEmail('');
    setSignupPassword('');
    setEmailSentTo(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 'signup' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                অ্যাকাউন্ট তৈরি করুন
              </DialogTitle>
              <DialogDescription>
                কোর্সে জয়েন করতে প্রথমে একটি অ্যাকাউন্ট খুলুন। ফোন দিয়ে সাইনআপ করলে সাথে সাথেই অ্যাকাউন্ট চালু হবে।
              </DialogDescription>
            </DialogHeader>

            {emailSentTo ? (
              <div className="py-6 text-center space-y-3">
                <Mail className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-lg font-bold">ইমেইল ভেরিফিকেশন পাঠানো হয়েছে</h3>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{emailSentTo}</span> এ একটি কনফার্মেশন লিংক পাঠানো হয়েছে। ভেরিফাই করার পর লগইন করে ফিরে এসে কোর্সে জয়েন করুন।
                </p>
                <Button variant="outline" onClick={() => setEmailSentTo(null)} className="mt-2">
                  অন্যভাবে চেষ্টা করুন
                </Button>
              </div>
            ) : (
              <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as 'phone' | 'email')} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="phone"><Phone className="h-4 w-4 mr-2" />ফোন (ইনস্ট্যান্ট)</TabsTrigger>
                  <TabsTrigger value="email"><Mail className="h-4 w-4 mr-2" />ইমেইল</TabsTrigger>
                </TabsList>

                <div className="space-y-3 pt-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="su-name">আপনার নাম *</Label>
                    <Input id="su-name" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="পূর্ণ নাম" />
                  </div>

                  <TabsContent value="phone" className="m-0 space-y-1.5">
                    <Label htmlFor="su-phone">ফোন নম্বর *</Label>
                    <Input id="su-phone" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} placeholder="01XXXXXXXXX" />
                  </TabsContent>

                  <TabsContent value="email" className="m-0 space-y-1.5">
                    <Label htmlFor="su-email">ইমেইল *</Label>
                    <Input id="su-email" type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="you@example.com" />
                    <p className="text-xs text-muted-foreground">ইমেইল ভেরিফাই করতে হবে।</p>
                  </TabsContent>

                  <div className="space-y-1.5">
                    <Label htmlFor="su-pass">পাসওয়ার্ড * (৬+ অক্ষর)</Label>
                    <Input id="su-pass" type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="********" />
                  </div>
                </div>

                <Button onClick={handleSignup} disabled={signingUp} className="w-full mt-4">
                  {signingUp ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />অ্যাকাউন্ট তৈরি হচ্ছে...</> : 'অ্যাকাউন্ট তৈরি করে এগিয়ে যান'}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  ইতিমধ্যে অ্যাকাউন্ট আছে? <a href="/auth" className="text-primary font-medium underline">লগইন করুন</a>
                </p>
              </Tabs>
            )}
          </>
        )}

        {step === 'pick' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                কোর্স বা প্যাকেজ বাছাই করুন
              </DialogTitle>
              <DialogDescription>
                সব কোর্স একসাথে নিতে Pro নিন, অথবা পছন্দের একটি কোর্স আলাদাভাবে কিনুন।
              </DialogDescription>
            </DialogHeader>

            {/* Pro Bundle */}
            <button
              type="button"
              onClick={() => setSelection({ type: 'pro' })}
              className={cn(
                'w-full text-left rounded-2xl border-2 p-5 transition-all',
                selection.type === 'pro'
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-primary" />
                    <span className="font-bold text-lg">Pro মেম্বারশিপ</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" /> সব কোর্স ও লেসন আনলিমিটেড</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" /> প্রাইভেট কমিউনিটি অ্যাক্সেস</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" /> এক্সক্লুসিভ রিসোর্স ও লাইভ Q&A</li>
                  </ul>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-extrabold text-primary">৳{PRO_PRICE}</div>
                  <div className="text-[10px] text-muted-foreground">প্রতি বছর</div>
                </div>
              </div>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs text-muted-foreground">অথবা একটি কোর্স কিনুন</span>
              <div className="h-px bg-border flex-1" />
            </div>

            {/* Course grid */}
            {loadingCourses ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : courses.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">কোনো পেইড কোর্স নেই</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[280px] overflow-y-auto pr-1">
                {courses.map((c) => {
                  const active = selection.type === 'course' && selection.courseId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelection({ type: 'course', courseId: c.id })}
                      className={cn(
                        'rounded-xl border-2 p-3 text-left transition-all relative',
                        active
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      {active && (
                        <span className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                      {c.thumbnail_url ? (
                        <img src={c.thumbnail_url} alt={c.title} className="w-full h-20 object-cover rounded-lg mb-2" />
                      ) : (
                        <div className="w-full h-20 rounded-lg bg-muted flex items-center justify-center text-3xl mb-2">
                          {c.emoji || '📘'}
                        </div>
                      )}
                      <div className="text-xs font-semibold line-clamp-2 min-h-[2.25rem]">{c.title}</div>
                      <div className="mt-1 text-sm font-bold text-primary">৳{c.price}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Sticky summary + CTA */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg mt-2">
              <div className="text-sm">
                <div className="text-muted-foreground text-xs">নির্বাচিত:</div>
                <div className="font-semibold truncate max-w-[200px] sm:max-w-none">{summaryTitle}</div>
              </div>
              <div className="text-xl font-extrabold text-primary">৳{amount}</div>
            </div>
            <Button onClick={() => setStep('payment')} className="w-full" disabled={amount <= 0}>
              পেমেন্টে যান
            </Button>
          </>
        )}

        {step === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                পেমেন্ট করুন
              </DialogTitle>
              <DialogDescription>
                <span className="font-medium text-foreground">{summaryTitle}</span> — নিচের নম্বরে ৳{amount} টাকা পাঠান।
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as 'bkash' | 'nagad')}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="bkash" id="bkash" className="peer sr-only" />
                  <Label
                    htmlFor="bkash"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span className="text-lg font-bold text-pink-500">bKash</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="nagad" id="nagad" className="peer sr-only" />
                  <Label
                    htmlFor="nagad"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span className="text-lg font-bold text-orange-500">Nagad</span>
                  </Label>
                </div>
              </RadioGroup>

              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">Send Money করুন:</p>
                <p className="text-xl font-bold flex items-center justify-center gap-2">
                  <Phone className="h-5 w-5" />
                  {PAYMENT_DETAILS[paymentMethod].number}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{PAYMENT_DETAILS[paymentMethod].name}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionId">ট্রানজেকশন আইডি *</Label>
                <Input id="transactionId" placeholder="যেমন: 8N7ABC1234" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">আপনার ফোন নম্বর *</Label>
                <Input id="phoneNumber" placeholder="01XXXXXXXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">অতিরিক্ত তথ্য (ঐচ্ছিক)</Label>
                <Textarea id="notes" placeholder="কোনো মন্তব্য থাকলে লিখুন..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('pick')} className="flex-1">পেছনে</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />সাবমিট হচ্ছে...</>) : 'সাবমিট করুন'}
              </Button>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <div className="py-8 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">পেমেন্ট রিকোয়েস্ট সাবমিট হয়েছে! ✅</h3>
              <p className="text-muted-foreground">
                আপনার পেমেন্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে। অ্যাডমিন ভেরিফাই করার পর আপনার অ্যাকাউন্টে অ্যাক্সেস চালু হয়ে যাবে। সাধারণত ১-২৪ ঘণ্টা সময় লাগে।
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">ঠিক আছে</Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
