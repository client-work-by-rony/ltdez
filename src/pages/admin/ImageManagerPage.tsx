import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Trash2, ImageIcon, FolderOpen } from 'lucide-react';
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

const BUCKETS = ['course-thumbnails', 'hero-images', 'community-images', 'assignments', 'user-uploads'];

interface StorageFile {
  name: string;
  bucket: string;
  url: string;
  created_at: string;
}

export default function ImageManagerPage() {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<string>('all');
  const [uploadBucket, setUploadBucket] = useState<string>(BUCKETS[0]);
  const { toast } = useToast();

  const fetchFiles = async () => {
    setIsLoading(true);
    const allFiles: StorageFile[] = [];

    const bucketsToFetch = selectedBucket === 'all' ? BUCKETS : [selectedBucket];

    for (const bucket of bucketsToFetch) {
      const { data, error } = await supabase.storage.from(bucket).list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (!error && data) {
        for (const file of data) {
          if (file.name === '.emptyFolderPlaceholder') continue;
          let fileUrl = '';
          const privateBuckets = ['user-uploads', 'assignments'];
          if (privateBuckets.includes(bucket)) {
            const { data: signedData } = await supabase.storage.from(bucket).createSignedUrl(file.name, 60 * 60);
            fileUrl = signedData?.signedUrl || '';
          } else {
            const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(file.name);
            fileUrl = urlData.publicUrl;
          }
          allFiles.push({
            name: file.name,
            bucket,
            url: fileUrl,
            created_at: file.created_at || '',
          });
        }
      }
    }

    setFiles(allFiles);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedBucket]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(uploadBucket).upload(fileName, file);

    if (error) {
      toast({ title: 'আপলোড ব্যর্থ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'সফলভাবে আপলোড হয়েছে' });
      fetchFiles();
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (bucket: string, name: string) => {
    const { error } = await supabase.storage.from(bucket).remove([name]);
    if (error) {
      toast({ title: 'ডিলিট ব্যর্থ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'সফলভাবে ডিলিট হয়েছে' });
      setFiles((prev) => prev.filter((f) => !(f.bucket === bucket && f.name === name)));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ইমেজ ম্যানেজার</h1>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5" /> নতুন ইমেজ আপলোড
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={uploadBucket} onValueChange={setUploadBucket}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BUCKETS.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
              />
            </div>
            {uploading && <Loader2 className="h-5 w-5 animate-spin self-center" />}
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <FolderOpen className="h-5 w-5 text-muted-foreground" />
        <Select value={selectedBucket} onValueChange={setSelectedBucket}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব বাকেট</SelectItem>
            {BUCKETS.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{files.length} টি ফাইল</span>
      </div>

      {/* Files Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : files.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mb-2" />
            <p>কোনো ইমেজ পাওয়া যায়নি</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <Card key={`${file.bucket}-${file.name}`} className="overflow-hidden">
              <div className="aspect-square bg-muted relative group">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" /> ডিলিট
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ডিলিট করতে চান?</AlertDialogTitle>
                        <AlertDialogDescription>
                          এই ইমেজটি স্থায়ীভাবে মুছে ফেলা হবে।
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>বাতিল</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(file.bucket, file.name)}>
                          ডিলিট
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <CardContent className="p-2">
                <p className="text-xs font-medium truncate" title={file.name}>{file.name}</p>
                <p className="text-xs text-muted-foreground">{file.bucket}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
