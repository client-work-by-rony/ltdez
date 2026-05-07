import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trash2, ArrowUp, ArrowDown, Upload, Image, Loader2 } from 'lucide-react';

export default function HeroSlidesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: slides = [], isLoading } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('hero-images')
        .getPublicUrl(fileName);

      const maxOrder = slides.length > 0 ? Math.max(...slides.map(s => s.sort_order)) + 1 : 0;

      const { error: insertError } = await supabase
        .from('hero_slides')
        .insert({ image_url: urlData.publicUrl, sort_order: maxOrder });
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
      toast({ title: 'ইমেজ আপলোড সফল হয়েছে' });
      setUploading(false);
    },
    onError: (error: Error) => {
      toast({ title: 'আপলোড ব্যর্থ', description: error.message, variant: 'destructive' });
      setUploading(false);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('hero_slides')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hero-slides'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (slide: { id: string; image_url: string }) => {
      // Extract file name from URL
      const url = new URL(slide.image_url);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      
      await supabase.storage.from('hero-images').remove([fileName]);
      const { error } = await supabase.from('hero_slides').delete().eq('id', slide.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
      toast({ title: 'স্লাইড ডিলিট হয়েছে' });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      const idx = slides.findIndex(s => s.id === id);
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= slides.length) return;

      const current = slides[idx];
      const swap = slides[swapIdx];

      await Promise.all([
        supabase.from('hero_slides').update({ sort_order: swap.sort_order }).eq('id', current.id),
        supabase.from('hero_slides').update({ sort_order: current.sort_order }).eq('id', swap.id),
      ]);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hero-slides'] }),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
    e.target.value = '';
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">হিরো স্লাইড ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">হোম পেজের হিরো ব্যানার ইমেজ ম্যানেজ করুন</p>
        </div>
        <div>
          <Label htmlFor="slide-upload" className="cursor-pointer">
            <Button asChild disabled={uploading}>
              <span>
                {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                ইমেজ আপলোড
              </span>
            </Button>
          </Label>
          <Input
            id="slide-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {slides.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <Image className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">কোনো স্লাইড নেই। উপরের বাটনে ক্লিক করে ইমেজ আপলোড করুন।</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {slides.map((slide, idx) => (
            <Card key={slide.id} className="flex items-center gap-4 p-4">
              <img
                src={slide.image_url}
                alt={`Slide ${idx + 1}`}
                className="h-20 w-36 object-cover rounded-md border"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">স্লাইড #{idx + 1}</p>
                <p className="text-xs text-muted-foreground truncate max-w-xs">{slide.image_url}</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={slide.is_active}
                  onCheckedChange={(checked) => toggleMutation.mutate({ id: slide.id, is_active: checked })}
                />
                <span className="text-xs w-16">{slide.is_active ? 'অ্যাক্টিভ' : 'বন্ধ'}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  disabled={idx === 0}
                  onClick={() => reorderMutation.mutate({ id: slide.id, direction: 'up' })}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  disabled={idx === slides.length - 1}
                  onClick={() => reorderMutation.mutate({ id: slide.id, direction: 'down' })}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate({ id: slide.id, image_url: slide.image_url })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
