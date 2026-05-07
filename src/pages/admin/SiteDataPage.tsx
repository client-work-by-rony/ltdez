import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Database } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SiteDataItem {
  id: string;
  key: string;
  value: any;
  category: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

const CATEGORIES = ['general', 'homepage', 'settings', 'feature_flags', 'content'];

export default function SiteDataPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<SiteDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SiteDataItem | null>(null);
  const [formKey, setFormKey] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formCategory, setFormCategory] = useState('general');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    let query = supabase.from('site_data' as any).select('*').order('created_at', { ascending: false });
    if (filterCategory !== 'all') {
      query = query.eq('category', filterCategory);
    }
    const { data, error } = await query;
    if (error) {
      toast({ title: 'ডেটা লোড ব্যর্থ', description: error.message, variant: 'destructive' });
    } else {
      setItems((data as any) || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [filterCategory]);

  const openCreate = () => {
    setEditingItem(null);
    setFormKey('');
    setFormValue('');
    setFormCategory('general');
    setDialogOpen(true);
  };

  const openEdit = (item: SiteDataItem) => {
    setEditingItem(item);
    setFormKey(item.key);
    setFormValue(JSON.stringify(item.value, null, 2));
    setFormCategory(item.category);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formKey.trim()) {
      toast({ title: 'Key প্রয়োজন', variant: 'destructive' });
      return;
    }

    let parsedValue: any;
    try {
      parsedValue = JSON.parse(formValue);
    } catch {
      parsedValue = formValue;
    }

    setSaving(true);

    if (editingItem) {
      const { error } = await supabase.from('site_data' as any).update({
        key: formKey,
        value: parsedValue,
        category: formCategory,
      } as any).eq('id', editingItem.id);

      if (error) {
        toast({ title: 'আপডেট ব্যর্থ', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'সফলভাবে আপডেট হয়েছে' });
        setDialogOpen(false);
        fetchData();
      }
    } else {
      const { error } = await supabase.from('site_data' as any).insert({
        key: formKey,
        value: parsedValue,
        category: formCategory,
        created_by: user?.id,
      } as any);

      if (error) {
        toast({ title: 'তৈরি ব্যর্থ', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'সফলভাবে তৈরি হয়েছে' });
        setDialogOpen(false);
        fetchData();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('site_data' as any).delete().eq('id', id);
    if (error) {
      toast({ title: 'ডিলিট ব্যর্থ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'সফলভাবে ডিলিট হয়েছে' });
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Database className="h-6 w-6" /> সাইট ডেটা
        </h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> নতুন এন্ট্রি
        </Button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Label>ক্যাটেগরি:</Label>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">কোনো ডেটা নেই</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>ক্যাটেগরি</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.key}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">
                      {typeof item.value === 'string' ? item.value : JSON.stringify(item.value)}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full bg-muted text-xs">{item.category}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(item.updated_at).toLocaleDateString('bn-BD')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>ডিলিট করতে চান?</AlertDialogTitle>
                              <AlertDialogDescription>
                                "{item.key}" এন্ট্রি স্থায়ীভাবে মুছে যাবে।
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>বাতিল</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.id)}>ডিলিট</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'এন্ট্রি এডিট করুন' : 'নতুন এন্ট্রি তৈরি করুন'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Key</Label>
              <Input value={formKey} onChange={(e) => setFormKey(e.target.value)} placeholder="e.g. homepage_title" />
            </div>
            <div>
              <Label>Value (JSON বা টেক্সট)</Label>
              <Textarea
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder='e.g. "Welcome" or {"title": "Hello"}'
                rows={5}
              />
            </div>
            <div>
              <Label>ক্যাটেগরি</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>বাতিল</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingItem ? 'আপডেট' : 'তৈরি করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
