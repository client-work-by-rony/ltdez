import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, Trash2, Mail, MailOpen } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'এরর',
        description: 'মেসেজ লোড করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (message: Message) => {
    if (!message.is_read) {
      try {
        await supabase
          .from('contact_messages')
          .update({ is_read: true })
          .eq('id', message.id);

        setMessages(messages.map(m => 
          m.id === message.id ? { ...m, is_read: true } : m
        ));
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
    setSelectedMessage(message);
  };

  const deleteMessage = async () => {
    if (!deleteMessageId) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', deleteMessageId);

      if (error) throw error;

      setMessages(messages.filter(m => m.id !== deleteMessageId));
      toast({
        title: 'সফল',
        description: 'মেসেজ ডিলিট করা হয়েছে',
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: 'এরর',
        description: 'ডিলিট করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    } finally {
      setDeleteMessageId(null);
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

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
        <h1 className="text-3xl font-bold">মেসেজ</h1>
        <p className="text-muted-foreground">
          ওয়েবসাইট থেকে আসা মেসেজ দেখুন
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} অপঠিত
            </Badge>
          )}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সব মেসেজ ({messages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              কোনো মেসেজ নেই
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>নাম</TableHead>
                  <TableHead>ইমেইল</TableHead>
                  <TableHead>বিষয়</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id} className={!message.is_read ? 'bg-muted/50' : ''}>
                    <TableCell>
                      {message.is_read ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-primary" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.subject || 'কোনো বিষয় নেই'}</TableCell>
                    <TableCell>
                      {new Date(message.created_at).toLocaleDateString('bn-BD')}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(message)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteMessageId(message.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject || 'মেসেজ'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">প্রেরক</p>
              <p className="font-medium">{selectedMessage?.name}</p>
              <p className="text-sm">{selectedMessage?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">মেসেজ</p>
              <p className="whitespace-pre-wrap">{selectedMessage?.message}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {selectedMessage && new Date(selectedMessage.created_at).toLocaleString('bn-BD')}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteMessageId} onOpenChange={() => setDeleteMessageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>
              এই মেসেজ স্থায়ীভাবে ডিলিট হয়ে যাবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={deleteMessage} className="bg-destructive">
              ডিলিট করুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
