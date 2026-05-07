import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Loader2, UserPlus, ArrowRight, Mail, Phone, User, Lock, Eye, EyeOff, Dice5, CheckCircle2 } from 'lucide-react';
import logo from '@/assets/noor-logo.png';
import { supabase } from '@/integrations/supabase/client';
import { checkPasswordStrength, generateStrongPassword, mapAuthErrorToBangla } from '@/lib/passwordUtils';

const emailSchema = z.string().email('সঠিক ইমেইল দিন');
const PHONE_DOMAIN = 'phone.noor.local';
const isPhoneStr = (s: string) => /^01\d{9}$/.test(s.trim());
const phoneToEmail = (p: string) => `${p.trim()}@${PHONE_DOMAIN}`;

function PasswordStrengthBar({ password }: { password: string }) {
  const check = checkPasswordStrength(password);
  if (!password) return null;
  const colorClass = check.strength === 'strong' ? 'bg-green-500' : check.strength === 'medium' ? 'bg-yellow-500' : 'bg-red-500';
  const textClass = check.strength === 'strong' ? 'text-green-500' : check.strength === 'medium' ? 'text-yellow-500' : 'text-red-500';
  return (
    <div className="space-y-1">
      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-300 ${colorClass}`} style={{ width: `${check.score}%` }} />
      </div>
      <p className={`text-xs ${textClass}`}>
        {check.isCommon ? '⚠️ এই পাসওয়ার্ডটি leak হয়ে গেছে' : `পাসওয়ার্ডের শক্তি: ${check.label}`}
      </p>
    </div>
  );
}

export default function Auth() {
  const [mode, setMode] = useState<'register' | 'login' | 'forgot' | 'reset'>('register');
  const [registerTab, setRegisterTab] = useState<'phone' | 'email'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  // Phone register
  const [phoneName, setPhoneName] = useState('');
  const [phone, setPhone] = useState('');
  const [phonePassword, setPhonePassword] = useState('');
  const [showPhonePassword, setShowPhonePassword] = useState(false);

  // Email register
  const [emailName, setEmailName] = useState('');
  const [email, setEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [emailVerifySent, setEmailVerifySent] = useState(false);

  // Login
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Forgot / reset
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { user, signIn, signUp, resetPassword, updatePassword, isLoading: authLoading, isAdmin, isRoleLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'reset') setMode('reset');
  }, []);

  useEffect(() => {
    if (user && !authLoading && !isRoleLoading && mode !== 'reset') {
      const params = new URLSearchParams(window.location.search);
      const explicitRedirect = params.get('redirect');
      if (explicitRedirect) navigate(explicitRedirect);
      else if (isAdmin) navigate('/admin');
      else navigate('/dashboard');
    }
  }, [user, authLoading, isRoleLoading, isAdmin, navigate, mode]);

  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!phoneName.trim()) { toast({ title: 'এরর', description: 'আপনার নাম দিন', variant: 'destructive' }); setIsLoading(false); return; }
    if (!isPhoneStr(phone)) { toast({ title: 'এরর', description: 'সঠিক ফোন নম্বর দিন (যেমন: 01712345678)', variant: 'destructive' }); setIsLoading(false); return; }
    if (phonePassword.length < 6) { toast({ title: 'এরর', description: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর', variant: 'destructive' }); setIsLoading(false); return; }
    if (checkPasswordStrength(phonePassword).isCommon) { toast({ title: 'দুর্বল পাসওয়ার্ড', description: 'এই পাসওয়ার্ডটি leak হয়ে গেছে। অন্য একটি দিন।', variant: 'destructive' }); setIsLoading(false); return; }

    try {
      const { data, error } = await supabase.functions.invoke('phone-signup', {
        body: { phone: phone.trim(), password: phonePassword, full_name: phoneName.trim() },
      });
      if (error || (data as any)?.error) {
        toast({ title: 'রেজিস্ট্রেশন ব্যর্থ', description: (data as any)?.error || error?.message || 'সমস্যা হয়েছে', variant: 'destructive' });
      } else {
        toast({ title: '✅ অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে', description: 'আপনাকে log in করানো হচ্ছে...' });
        await signIn(phoneToEmail(phone), phonePassword);
      }
    } catch (err: any) {
      toast({ title: 'এরর', description: err.message || 'সমস্যা হয়েছে', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!emailName.trim()) { toast({ title: 'এরর', description: 'আপনার নাম দিন', variant: 'destructive' }); setIsLoading(false); return; }
    try { emailSchema.parse(email); } catch (err) { if (err instanceof z.ZodError) { toast({ title: 'এরর', description: err.errors[0].message, variant: 'destructive' }); setIsLoading(false); return; } }
    if (emailPassword.length < 6) { toast({ title: 'এরর', description: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর', variant: 'destructive' }); setIsLoading(false); return; }
    if (checkPasswordStrength(emailPassword).isCommon) { toast({ title: 'দুর্বল পাসওয়ার্ড', description: 'অন্য একটি পাসওয়ার্ড দিন।', variant: 'destructive' }); setIsLoading(false); return; }

    const { error } = await signUp(email, emailPassword, emailName);
    if (error) {
      toast({ title: 'রেজিস্ট্রেশন ব্যর্থ', description: mapAuthErrorToBangla(error.message), variant: 'destructive' });
    } else {
      setEmailVerifySent(true);
      toast({ title: '📧 ইমেইল পাঠানো হয়েছে', description: 'আপনার ইমেইলে verification link পাঠানো হয়েছে। লগইনের আগে verify করুন।' });
    }
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const id = loginIdentifier.trim();
    if (!id) { toast({ title: 'এরর', description: 'ফোন বা ইমেইল দিন', variant: 'destructive' }); setIsLoading(false); return; }
    if (!loginPassword) { toast({ title: 'এরর', description: 'পাসওয়ার্ড দিন', variant: 'destructive' }); setIsLoading(false); return; }

    const credential = isPhoneStr(id) ? phoneToEmail(id) : id;
    if (!isPhoneStr(id)) {
      try { emailSchema.parse(id); } catch { toast({ title: 'এরর', description: 'সঠিক ফোন (01XXXXXXXXX) বা ইমেইল দিন', variant: 'destructive' }); setIsLoading(false); return; }
    }

    const { error } = await signIn(credential, loginPassword);
    if (error) {
      const raw = (error.message || '').toLowerCase();
      let description = 'লগইন তথ্য সঠিক নয়';
      if (raw.includes('email not confirmed') || raw.includes('email_not_confirmed')) description = 'আপনার ইমেইল এখনো verify করা হয়নি। ইনবক্স/স্প্যাম চেক করুন।';
      else if (raw.includes('invalid login credentials') || raw.includes('invalid_credentials')) description = 'ফোন/ইমেইল বা পাসওয়ার্ড সঠিক নয়।';
      else if (raw.includes('rate limit') || raw.includes('too many')) description = 'অনেক বার চেষ্টা হয়েছে। কিছুক্ষণ পরে চেষ্টা করুন।';
      toast({ title: 'লগইন ব্যর্থ', description, variant: 'destructive' });
    } else {
      toast({ title: '✅ সফল!', description: 'লগইন হয়েছে।' });
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try { emailSchema.parse(forgotEmail); } catch (err) { if (err instanceof z.ZodError) { toast({ title: 'এরর', description: err.errors[0].message, variant: 'destructive' }); setIsLoading(false); return; } }
    const { error } = await resetPassword(forgotEmail);
    if (error) toast({ title: 'এরর', description: 'রিসেট লিংক পাঠাতে সমস্যা', variant: 'destructive' });
    else { setResetSent(true); toast({ title: '✅ পাঠানো হয়েছে', description: 'ইমেইল চেক করুন।' }); }
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (newPassword.length < 6) { toast({ title: 'এরর', description: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর', variant: 'destructive' }); setIsLoading(false); return; }
    if (newPassword !== confirmPassword) { toast({ title: 'এরর', description: 'পাসওয়ার্ড মিলছে না', variant: 'destructive' }); setIsLoading(false); return; }
    if (checkPasswordStrength(newPassword).isCommon) { toast({ title: 'দুর্বল পাসওয়ার্ড', description: 'অন্য একটি দিন।', variant: 'destructive' }); setIsLoading(false); return; }
    const { error } = await updatePassword(newPassword);
    if (error) toast({ title: 'এরর', description: mapAuthErrorToBangla(error.message), variant: 'destructive' });
    else { toast({ title: '✅ সফল!', description: 'পাসওয়ার্ড পরিবর্তন হয়েছে।' }); setMode('login'); setNewPassword(''); setConfirmPassword(''); }
    setIsLoading(false);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(270,30%,8%)] via-background to-[hsl(270,20%,12%)] p-4">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-6">
          <img src={logo} alt="Noor Handicraft Academy" className="h-14 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            {mode === 'register' && 'নতুন অ্যাকাউন্ট তৈরি করুন'}
            {mode === 'login' && 'আপনার অ্যাকাউন্টে প্রবেশ করুন'}
            {mode === 'forgot' && 'পাসওয়ার্ড রিসেট করুন'}
            {mode === 'reset' && 'নতুন পাসওয়ার্ড সেট করুন'}
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 md:p-8 shadow-glow-lg">
          {mode === 'register' ? (
            emailVerifySent ? (
              <div className="text-center space-y-4 py-4">
                <CheckCircle2 className="h-14 w-14 text-primary mx-auto" />
                <h3 className="text-xl font-bold text-foreground">ইমেইল verify করুন</h3>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">{email}</strong> ঠিকানায় একটি verification link পাঠানো হয়েছে। দয়া করে link এ click করে ইমেইল verify করুন, তারপর লগইন করুন।
                </p>
                <Button onClick={() => { setEmailVerifySent(false); setMode('login'); }} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">লগইন পেইজে যান</Button>
              </div>
            ) : (
              <Tabs value={registerTab} onValueChange={(v) => setRegisterTab(v as 'phone' | 'email')}>
                <TabsList className="grid grid-cols-2 w-full mb-5 bg-secondary/50">
                  <TabsTrigger value="phone" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Phone className="h-4 w-4 mr-1.5" />ফোন</TabsTrigger>
                  <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Mail className="h-4 w-4 mr-1.5" />ইমেইল</TabsTrigger>
                </TabsList>

                <TabsContent value="phone">
                  <form onSubmit={handlePhoneRegister} className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">আপনার নাম</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="text" placeholder="পুরো নাম" value={phoneName} onChange={(e) => setPhoneName(e.target.value)} className="pl-10 bg-secondary/50 border-border/50 h-12" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">ফোন নম্বর</Label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1.5 bg-secondary/50 border border-border/50 rounded-md px-3 h-12 text-sm font-medium shrink-0">🇧🇩 +880</div>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="tel" placeholder="01XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 bg-secondary/50 border-border/50 h-12" required />
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground">কোনো OTP লাগবে না — সরাসরি অ্যাকাউন্ট তৈরি হবে।</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">পাসওয়ার্ড</Label>
                        <button type="button" onClick={() => { const g = generateStrongPassword(12); setPhonePassword(g); setShowPhonePassword(true); toast({ title: '🎲 পাসওয়ার্ড তৈরি', description: g }); }} className="flex items-center gap-1 text-[11px] text-primary font-semibold"><Dice5 className="h-3.5 w-3.5" />Auto Generate</button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type={showPhonePassword ? 'text' : 'password'} placeholder="কমপক্ষে ৬ অক্ষর" value={phonePassword} onChange={(e) => setPhonePassword(e.target.value)} className="pl-10 pr-10 bg-secondary/50 border-border/50 h-12" required />
                        <button type="button" onClick={() => setShowPhonePassword(!showPhonePassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPhonePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      </div>
                      <PasswordStrengthBar password={phonePassword} />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full h-14 text-base font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                      {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />তৈরি হচ্ছে...</> : <><UserPlus className="mr-2 h-5 w-5" />অ্যাকাউন্ট তৈরি করুন</>}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="email">
                  <form onSubmit={handleEmailRegister} className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">আপনার নাম</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="text" placeholder="পুরো নাম" value={emailName} onChange={(e) => setEmailName(e.target.value)} className="pl-10 bg-secondary/50 border-border/50 h-12" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">ইমেইল</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="email" placeholder="yourname@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-secondary/50 border-border/50 h-12" required />
                      </div>
                      <p className="text-[11px] text-muted-foreground">Verification link পাঠানো হবে। লগইনের আগে verify করতে হবে।</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">পাসওয়ার্ড</Label>
                        <button type="button" onClick={() => { const g = generateStrongPassword(12); setEmailPassword(g); setShowEmailPassword(true); toast({ title: '🎲 পাসওয়ার্ড তৈরি', description: g }); }} className="flex items-center gap-1 text-[11px] text-primary font-semibold"><Dice5 className="h-3.5 w-3.5" />Auto Generate</button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type={showEmailPassword ? 'text' : 'password'} placeholder="কমপক্ষে ৬ অক্ষর" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} className="pl-10 pr-10 bg-secondary/50 border-border/50 h-12" required />
                        <button type="button" onClick={() => setShowEmailPassword(!showEmailPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showEmailPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      </div>
                      <PasswordStrengthBar password={emailPassword} />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full h-14 text-base font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                      {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />রেজিস্টার হচ্ছে...</> : <><UserPlus className="mr-2 h-5 w-5" />রেজিস্টার করুন</>}
                    </Button>
                  </form>
                </TabsContent>

                <p className="text-center text-sm text-muted-foreground pt-5">
                  আগেই অ্যাকাউন্ট আছে?{' '}
                  <button type="button" onClick={() => setMode('login')} className="text-foreground font-semibold underline underline-offset-4 hover:text-primary">লগইন করুন</button>
                </p>
              </Tabs>
            )
          ) : mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <h2 className="text-2xl font-bold text-center text-foreground">লগইন করুন</h2>
              <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">Noor Handicraft Academy</p>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">ফোন নম্বর বা ইমেইল</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="text" placeholder="01XXXXXXXXX অথবা email@example.com" value={loginIdentifier} onChange={(e) => setLoginIdentifier(e.target.value)} className="pl-10 bg-secondary/50 border-border/50 h-12" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">পাসওয়ার্ড</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type={showLoginPassword ? 'text' : 'password'} placeholder="পাসওয়ার্ড" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="pl-10 pr-10 bg-secondary/50 border-border/50 h-12" required />
                  <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              <div className="text-right">
                <button type="button" onClick={() => setMode('forgot')} className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2">পাসওয়ার্ড ভুলে গেছেন?</button>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-14 text-base font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />লগইন হচ্ছে...</> : <>লগইন করুন<ArrowRight className="ml-2 h-5 w-5" /></>}
              </Button>
              <p className="text-center text-sm text-muted-foreground pt-2">
                নতুন এখানে?{' '}
                <button type="button" onClick={() => setMode('register')} className="text-foreground font-semibold underline underline-offset-4 hover:text-primary">রেজিস্টার করুন</button>
              </p>
            </form>
          ) : mode === 'forgot' ? (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <h2 className="text-2xl font-bold text-center text-foreground">পাসওয়ার্ড রিসেট</h2>
              <p className="text-center text-xs text-muted-foreground">আপনার ইমেইল দিন, রিসেট লিংক পাঠানো হবে। (শুধু ইমেইল অ্যাকাউন্টের জন্য)</p>
              {resetSent ? (
                <div className="text-center space-y-3 py-4">
                  <Mail className="h-12 w-12 text-primary mx-auto" />
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground">{forgotEmail}</strong> এ রিসেট লিংক পাঠানো হয়েছে।</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">ইমেইল</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="email" placeholder="yourname@email.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="pl-10 bg-secondary/50 border-border/50 h-12" required />
                  </div>
                </div>
              )}
              {!resetSent && (
                <Button type="submit" disabled={isLoading} className="w-full h-14 text-base font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                  {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />পাঠানো হচ্ছে...</> : <>রিসেট লিংক পাঠান<ArrowRight className="ml-2 h-5 w-5" /></>}
                </Button>
              )}
              <p className="text-center text-sm text-muted-foreground pt-2">
                <button type="button" onClick={() => { setMode('login'); setResetSent(false); }} className="text-foreground font-semibold underline underline-offset-4 hover:text-primary">লগইনে ফিরে যান</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <h2 className="text-2xl font-bold text-center text-foreground">নতুন পাসওয়ার্ড</h2>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">নতুন পাসওয়ার্ড</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="text" placeholder="কমপক্ষে ৬ অক্ষর" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-10 bg-secondary/50 border-border/50 h-12" required />
                </div>
                <PasswordStrengthBar password={newPassword} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">নিশ্চিত করুন</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="আবার লিখুন" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 bg-secondary/50 border-border/50 h-12" required />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-14 text-base font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />আপডেট হচ্ছে...</> : <>পাসওয়ার্ড আপডেট করুন</>}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
