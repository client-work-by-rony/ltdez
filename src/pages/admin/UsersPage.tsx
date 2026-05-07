import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Ban, CheckCircle, Trash2, Crown, XCircle, Clock, CreditCard, ShieldMinus, Search, Filter, KeyRound, Eye, EyeOff } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  is_blocked: boolean;
  membership: string | null;
  membership_expires_at: string | null;
  status: string;
  created_at: string;
  phone_number: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [upgradeUser, setUpgradeUser] = useState<Profile | null>(null);
  const [upgradeDuration, setUpgradeDuration] = useState('12');
  const [downgradeUser, setDowngradeUser] = useState<Profile | null>(null);
  const [paymentCounts, setPaymentCounts] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [membershipFilter, setMembershipFilter] = useState<string>('all');
  const [passwordResetUser, setPasswordResetUser] = useState<Profile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUsers((data as unknown as Profile[]) || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({ title: 'এরর', description: 'ইউজার লোড করতে সমস্যা হয়েছে', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .select('user_id, status');
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data || []).forEach((p: any) => {
        counts[p.user_id] = (counts[p.user_id] || 0) + 1;
      });
      setPaymentCounts(counts);
    } catch (e) {
      console.error('Error fetching payment counts:', e);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPaymentCounts();

    const channel = supabase
      .channel('admin-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchUsers())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    let result = users;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u =>
        (u.full_name?.toLowerCase().includes(q)) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone_number?.includes(q))
      );
    }
    if (membershipFilter !== 'all') {
      result = result.filter(u => {
        if (membershipFilter === 'pro') return u.membership === 'pro';
        if (membershipFilter === 'free') return u.membership !== 'pro';
        if (membershipFilter === 'expired') return u.membership === 'pro' && u.membership_expires_at && new Date(u.membership_expires_at) < new Date();
        return true;
      });
    }
    return result;
  }, [users, searchQuery, membershipFilter]);

  const updateStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('profiles').update({ status: newStatus } as any).eq('user_id', userId);
      if (error) throw error;
      setUsers(users.map(u => u.user_id === userId ? { ...u, status: newStatus } : u));
      toast({ title: 'সফল', description: `ইউজার ${newStatus === 'approved' ? 'অ্যাপ্রুভ' : 'রিজেক্ট'} করা হয়েছে` });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({ title: 'এরর', description: 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে', variant: 'destructive' });
    }
  };

  const toggleBlock = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('profiles').update({ is_blocked: !currentStatus }).eq('user_id', userId);
      if (error) throw error;
      setUsers(users.map(u => u.user_id === userId ? { ...u, is_blocked: !currentStatus } : u));
      toast({ title: 'সফল', description: currentStatus ? 'ইউজার আনব্লক করা হয়েছে' : 'ইউজার ব্লক করা হয়েছে' });
    } catch (error) {
      console.error('Error toggling block:', error);
      toast({ title: 'এরর', description: 'অপারেশন ব্যর্থ হয়েছে', variant: 'destructive' });
    }
  };

  const confirmUpgrade = async () => {
    if (!upgradeUser) return;
    const months = parseInt(upgradeDuration);
    try {
      const expiresAt = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString();
      const { error } = await supabase.from('profiles').update({
        membership: 'pro',
        membership_expires_at: expiresAt,
      }).eq('user_id', upgradeUser.user_id);
      if (error) throw error;
      setUsers(users.map(u =>
        u.user_id === upgradeUser.user_id
          ? { ...u, membership: 'pro', membership_expires_at: expiresAt }
          : u
      ));
      toast({ title: 'সফল', description: `${upgradeUser.full_name || upgradeUser.email} কে ${months} মাসের Pro দেওয়া হয়েছে` });
    } catch (error) {
      console.error('Error upgrading user:', error);
      toast({ title: 'এরর', description: 'আপগ্রেড করতে সমস্যা হয়েছে', variant: 'destructive' });
    } finally {
      setUpgradeUser(null);
      setUpgradeDuration('12');
    }
  };

  const confirmDowngrade = async () => {
    if (!downgradeUser) return;
    try {
      const { error } = await supabase.from('profiles').update({
        membership: 'free',
        membership_expires_at: null,
      } as any).eq('user_id', downgradeUser.user_id);
      if (error) throw error;
      setUsers(users.map(u =>
        u.user_id === downgradeUser.user_id ? { ...u, membership: 'free', membership_expires_at: null } : u
      ));
      toast({ title: 'সফল', description: `${downgradeUser.full_name || downgradeUser.email} কে Free তে ডাউনগ্রেড করা হয়েছে` });
    } catch (error) {
      console.error('Error downgrading user:', error);
      toast({ title: 'এরর', description: 'ডাউনগ্রেড করতে সমস্যা হয়েছে', variant: 'destructive' });
    } finally {
      setDowngradeUser(null);
    }
  };

  const closePasswordReset = () => {
    setPasswordResetUser(null);
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const handleResetPassword = async () => {
    if (!passwordResetUser) return;
    if (newPassword.length < 6) {
      toast({ title: 'এরর', description: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'এরর', description: 'পাসওয়ার্ড মিলছে না', variant: 'destructive' });
      return;
    }
    setResettingPassword(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-reset-password', {
        body: { email: passwordResetUser.email, password: newPassword },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: 'সফল', description: `${passwordResetUser.full_name || passwordResetUser.email} এর পাসওয়ার্ড পরিবর্তিত হয়েছে` });
      closePasswordReset();
    } catch (err: any) {
      console.error('Password reset error:', err);
      toast({ title: 'এরর', description: err?.message || 'পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে', variant: 'destructive' });
    } finally {
      setResettingPassword(false);
    }
  };

  const deleteUser = async () => {
    if (!deleteUserId) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('user_id', deleteUserId);
      if (error) throw error;
      setUsers(users.filter(u => u.user_id !== deleteUserId));
      toast({ title: 'সফল', description: 'ইউজার ডিলিট করা হয়েছে' });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({ title: 'এরর', description: 'ডিলিট করতে সমস্যা হয়েছে', variant: 'destructive' });
    } finally {
      setDeleteUserId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600 hover:bg-green-700 text-white">✅ অ্যাপ্রুভড</Badge>;
      case 'rejected':
        return <Badge variant="destructive">❌ রিজেক্টেড</Badge>;
      default:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">⏳ পেন্ডিং</Badge>;
    }
  };

  const getMembershipBadge = (user: Profile) => {
    const isExpired = user.membership === 'pro' && user.membership_expires_at && new Date(user.membership_expires_at) < new Date();
    
    if (user.membership === 'pro' && !isExpired) {
      return (
        <div className="flex flex-col gap-1">
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Crown className="h-3 w-3 mr-1" /> Pro
          </Badge>
          {user.membership_expires_at && (
            <span className="text-xs text-muted-foreground">
              {new Date(user.membership_expires_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' })} পর্যন্ত
            </span>
          )}
        </div>
      );
    }

    if (isExpired) {
      return (
        <div className="flex flex-col gap-1">
          <Badge variant="outline" className="text-red-500 border-red-500/30">
            মেয়াদ শেষ
          </Badge>
          <span className="text-xs text-red-400">
            {new Date(user.membership_expires_at!).toLocaleDateString('bn-BD')}
          </span>
        </div>
      );
    }

    return <Badge variant="secondary">Free</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingUsers = filteredUsers.filter(u => u.status === 'pending');
  const otherUsers = filteredUsers.filter(u => u.status !== 'pending');
  const proCount = users.filter(u => u.membership === 'pro').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">ইউজার ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">
            মোট {users.length} জন • <span className="text-emerald-500">{proCount} Pro</span> • <span className="text-yellow-500">{pendingUsers.length} পেন্ডিং</span>
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="নাম, ইমেইল বা ফোন দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={membershipFilter} onValueChange={setMembershipFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="ফিল্টার" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব ইউজার</SelectItem>
            <SelectItem value="pro">Pro ইউজার</SelectItem>
            <SelectItem value="free">Free ইউজার</SelectItem>
            <SelectItem value="expired">মেয়াদ শেষ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {pendingUsers.length > 0 && (
        <Card className="border-yellow-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              পেন্ডিং অনুরোধ ({pendingUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UserTable
              users={pendingUsers}
              getStatusBadge={getStatusBadge}
              getMembershipBadge={getMembershipBadge}
              paymentCounts={paymentCounts}
              onApprove={(id) => updateStatus(id, 'approved')}
              onReject={(id) => updateStatus(id, 'rejected')}
              onToggleBlock={toggleBlock}
              onUpgrade={(user) => setUpgradeUser(user)}
              onDowngrade={(user) => setDowngradeUser(user)}
              onDelete={setDeleteUserId}
              onResetPassword={setPasswordResetUser}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {searchQuery || membershipFilter !== 'all'
              ? `ফলাফল (${otherUsers.length})`
              : `সব ইউজার (${otherUsers.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {otherUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {searchQuery ? 'কোনো ইউজার পাওয়া যায়নি' : 'কোনো ইউজার নেই'}
            </p>
          ) : (
            <UserTable
              users={otherUsers}
              getStatusBadge={getStatusBadge}
              getMembershipBadge={getMembershipBadge}
              paymentCounts={paymentCounts}
              onApprove={(id) => updateStatus(id, 'approved')}
              onReject={(id) => updateStatus(id, 'rejected')}
              onToggleBlock={toggleBlock}
              onUpgrade={(user) => setUpgradeUser(user)}
              onDowngrade={(user) => setDowngradeUser(user)}
              onDelete={setDeleteUserId}
              onResetPassword={setPasswordResetUser}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>এই ইউজার স্থায়ীভাবে ডিলিট হয়ে যাবে।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={deleteUser} className="bg-destructive">ডিলিট করুন</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pro Upgrade Dialog */}
      <Dialog open={!!upgradeUser} onOpenChange={() => setUpgradeUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" /> Pro আপগ্রেড
            </DialogTitle>
            <DialogDescription>
              <strong>{upgradeUser?.full_name || upgradeUser?.email}</strong> কে Pro মেম্বারশিপ দিতে চান?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <label className="text-sm font-medium">মেয়াদ নির্বাচন করুন</label>
            <Select value={upgradeDuration} onValueChange={setUpgradeDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">৩ মাস</SelectItem>
                <SelectItem value="6">৬ মাস</SelectItem>
                <SelectItem value="12">১ বছর</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeUser(null)}>বাতিল</Button>
            <Button onClick={confirmUpgrade}>
              <Crown className="h-4 w-4 mr-1" /> Pro দিন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Downgrade Confirmation */}
      <AlertDialog open={!!downgradeUser} onOpenChange={() => setDowngradeUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pro সরিয়ে দিতে চান?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{downgradeUser?.full_name || downgradeUser?.email}</strong> কে Free তে ডাউনগ্রেড করা হবে। সব Pro কন্টেন্ট লক হয়ে যাবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDowngrade} className="bg-destructive">হ্যাঁ, Free করুন</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Reset Dialog */}
      <Dialog open={!!passwordResetUser} onOpenChange={(open) => { if (!open) closePasswordReset(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" /> পাসওয়ার্ড রিসেট
            </DialogTitle>
            <DialogDescription>
              <strong>{passwordResetUser?.full_name || passwordResetUser?.email}</strong> এর জন্য নতুন পাসওয়ার্ড সেট করুন। পুরোনো পাসওয়ার্ডের প্রয়োজন নেই।
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="rounded-md bg-yellow-500/10 border border-yellow-500/30 p-3 text-xs text-yellow-700 dark:text-yellow-400">
              ⚠️ ইউজারকে স্বয়ংক্রিয় কোনো নোটিফিকেশন যাবে না। নতুন পাসওয়ার্ড নিজে তাকে জানিয়ে দিন।
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">নতুন পাসওয়ার্ড (ন্যূনতম ৬ অক্ষর)</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="নতুন পাসওয়ার্ড"
                  className="pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">পাসওয়ার্ড নিশ্চিত করুন</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="আবার লিখুন"
                autoComplete="new-password"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive">পাসওয়ার্ড মিলছে না</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closePasswordReset} disabled={resettingPassword}>বাতিল</Button>
            <Button
              onClick={handleResetPassword}
              disabled={resettingPassword || newPassword.length < 6 || newPassword !== confirmPassword}
            >
              {resettingPassword ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <KeyRound className="h-4 w-4 mr-1" />}
              পাসওয়ার্ড সেট করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserTable({
  users, getStatusBadge, getMembershipBadge, paymentCounts, onApprove, onReject, onToggleBlock, onUpgrade, onDowngrade, onDelete, onResetPassword,
}: {
  users: Profile[];
  getStatusBadge: (status: string) => React.ReactNode;
  getMembershipBadge: (user: Profile) => React.ReactNode;
  paymentCounts: Record<string, number>;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  onToggleBlock: (userId: string, isBlocked: boolean) => void;
  onUpgrade: (user: Profile) => void;
  onDowngrade: (user: Profile) => void;
  onDelete: (userId: string) => void;
  onResetPassword: (user: Profile) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>নাম</TableHead>
            <TableHead>ইমেইল</TableHead>
            <TableHead>ফোন</TableHead>
            <TableHead>স্ট্যাটাস</TableHead>
            <TableHead>মেম্বারশিপ</TableHead>
            <TableHead>পেমেন্ট</TableHead>
            <TableHead>যোগদান</TableHead>
            <TableHead className="text-right">অ্যাকশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isExpired = user.membership === 'pro' && user.membership_expires_at && new Date(user.membership_expires_at) < new Date();
            return (
              <TableRow key={user.id} className={user.is_blocked ? 'opacity-50' : ''}>
                <TableCell className="font-medium">
                  {user.full_name || 'নাম নেই'}
                  {user.is_blocked && <Badge variant="destructive" className="ml-2 text-xs">ব্লকড</Badge>}
                </TableCell>
                <TableCell className="text-sm">{user.email}</TableCell>
                <TableCell className="text-sm">{user.phone_number || '-'}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{getMembershipBadge(user)}</TableCell>
                <TableCell>
                  {(paymentCounts[user.user_id] || 0) > 0 ? (
                    <span className="flex items-center gap-1 text-xs text-blue-500">
                      <CreditCard className="h-3 w-3" />
                      {paymentCounts[user.user_id]} টি
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">নেই</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">{new Date(user.created_at).toLocaleDateString('bn-BD')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 flex-wrap">
                    {user.status !== 'approved' && (
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600/30 hover:bg-green-600/10" onClick={() => onApprove(user.user_id)}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {user.status !== 'rejected' && (
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600/30 hover:bg-red-600/10" onClick={() => onReject(user.user_id)}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {(user.membership !== 'pro' || isExpired) ? (
                      <Button size="sm" variant="outline" className="text-primary border-primary/30 hover:bg-primary/10" onClick={() => onUpgrade(user)}>
                        <Crown className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="text-orange-600 border-orange-600/30 hover:bg-orange-600/10" onClick={() => onDowngrade(user)}>
                        <ShieldMinus className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant={user.is_blocked ? 'outline' : 'secondary'} onClick={() => onToggleBlock(user.user_id, user.is_blocked ?? false)}>
                      {user.is_blocked ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-600/30 hover:bg-blue-600/10" title="পাসওয়ার্ড রিসেট" onClick={() => onResetPassword(user)}>
                      <KeyRound className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(user.user_id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
