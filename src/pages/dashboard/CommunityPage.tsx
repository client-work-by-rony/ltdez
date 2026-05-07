import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useMembership } from '@/hooks/useMembership';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UpgradeModal } from '@/components/dashboard/UpgradeModal';
import {
  Heart,
  MessageCircle,
  Send,
  Loader2,
  Trash2,
  MoreVertical,
  Bookmark,
  TrendingUp,
  ImagePlus,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user_name: string | null;
  user_email: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_name: string | null;
  user_email: string;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const { isProActive } = useMembership();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [loadingComments, setLoadingComments] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = useCallback(async () => {
    if (!user) return;
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, email');

      const { data: likes } = await supabase
        .from('post_likes')
        .select('post_id, user_id');

      const { data: comments } = await supabase
        .from('post_comments')
        .select('post_id');

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      const likesGrouped = new Map<string, string[]>();
      (likes || []).forEach(l => {
        const arr = likesGrouped.get(l.post_id) || [];
        arr.push(l.user_id);
        likesGrouped.set(l.post_id, arr);
      });
      const commentsCount = new Map<string, number>();
      (comments || []).forEach(c => {
        commentsCount.set(c.post_id, (commentsCount.get(c.post_id) || 0) + 1);
      });

      const enrichedPosts: Post[] = (postsData || []).map(post => {
        const profile = profileMap.get(post.user_id);
        const postLikes = likesGrouped.get(post.id) || [];
        return {
          id: post.id,
          user_id: post.user_id,
          content: post.content,
          image_url: post.image_url,
          created_at: post.created_at,
          user_name: profile?.full_name || null,
          user_email: profile?.email || '',
          likes_count: postLikes.length,
          comments_count: commentsCount.get(post.id) || 0,
          is_liked: postLikes.includes(user.id),
        };
      });

      setPosts(enrichedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const channel = supabase
      .channel('community-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => fetchPosts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, () => fetchPosts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_comments' }, () => fetchPosts())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'ফাইল সাইজ বেশি', description: 'সর্বোচ্চ ৫MB ফাইল আপলোড করা যাবে', variant: 'destructive' });
      return;
    }
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleCreatePost() {
    if ((!newPostContent.trim() && !selectedImage) || !user) return;
    setIsPosting(true);
    try {
      let imageUrl: string | null = null;

      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('community-images')
          .upload(filePath, selectedImage);
        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from('community-images')
          .getPublicUrl(filePath);
        imageUrl = publicData.publicUrl;
      }

      const { error } = await supabase.from('community_posts').insert({
        user_id: user.id,
        content: newPostContent.trim() || '',
        image_url: imageUrl,
      });
      if (error) throw error;
      setNewPostContent('');
      clearImage();
      toast({ title: 'পোস্ট করা হয়েছে!' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'পোস্ট করতে সমস্যা হয়েছে', variant: 'destructive' });
    } finally {
      setIsPosting(false);
    }
  }

  async function handleLike(postId: string, isLiked: boolean) {
    if (!user) return;
    try {
      if (isLiked) {
        await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeletePost(postId: string) {
    if (!confirm('পোস্টটি ডিলিট করতে চান?')) return;
    try {
      const { error } = await supabase.from('community_posts').delete().eq('id', postId);
      if (error) throw error;
      toast({ title: 'পোস্ট ডিলিট হয়েছে' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'ডিলিট করতে সমস্যা হয়েছে', variant: 'destructive' });
    }
  }

  async function toggleComments(postId: string) {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      if (!commentsMap[postId]) {
        await fetchComments(postId);
      }
    }
    setExpandedComments(newExpanded);
  }

  async function fetchComments(postId: string) {
    setLoadingComments(prev => new Set(prev).add(postId));
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (error) throw error;

      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, email');

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      const enriched: Comment[] = (data || []).map(c => ({
        ...c,
        user_name: profileMap.get(c.user_id)?.full_name || null,
        user_email: profileMap.get(c.user_id)?.email || '',
      }));
      setCommentsMap(prev => ({ ...prev, [postId]: enriched }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingComments(prev => { const n = new Set(prev); n.delete(postId); return n; });
    }
  }

  async function handleAddComment(postId: string) {
    const content = commentInputs[postId]?.trim();
    if (!content || !user) return;
    try {
      const { error } = await supabase.from('post_comments').insert({
        post_id: postId, user_id: user.id, content,
      });
      if (error) throw error;
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      await fetchComments(postId);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'কমেন্ট করতে সমস্যা হয়েছে', variant: 'destructive' });
    }
  }

  async function handleDeleteComment(commentId: string, postId: string) {
    try {
      const { error } = await supabase.from('post_comments').delete().eq('id', commentId);
      if (error) throw error;
      await fetchComments(postId);
    } catch (error) {
      console.error(error);
    }
  }

  function getInitials(name: string | null, email: string) {
    if (name) return name.slice(0, 2).toUpperCase();
    return email.slice(0, 2).toUpperCase();
  }

  function timeAgo(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'এইমাত্র';
    if (diff < 3600) return `${Math.floor(diff / 60)} মিনিট আগে`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ঘন্টা আগে`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} দিন আগে`;
    return `${Math.floor(diff / 604800)} সপ্তাহ আগে`;
  }

  // Trending = top 5 posts by likes
  const trendingPosts = [...posts].sort((a, b) => b.likes_count - a.likes_count).slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 max-w-5xl mx-auto">
      {/* Main Feed */}
      <div className="flex-1 min-w-0 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">কমিউনিটি</h1>
            <p className="text-muted-foreground text-sm">শেয়ার করুন, শিখুন এবং একসাথে গ্রো করুন</p>
          </div>
          <Badge variant="outline" className="text-xs">Public</Badge>
        </div>

        {/* Create Post - Pro only */}
        {isProActive ? (
          <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/5 via-card to-card p-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/30">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-sm">
                  {getInitials(null, user?.email || '')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="আপনার মনে কি আছে? শেয়ার করুন..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={3}
                  className="resize-none bg-background/50 border-border/50 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                />
                {imagePreview && (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg border border-border/50 object-cover" />
                    <button onClick={clearImage} className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-90">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={() => fileInputRef.current?.click()}>
                      <ImagePlus className="h-5 w-5 mr-1.5" />
                      <span className="hidden sm:inline">ছবি যোগ করুন</span>
                      <span className="sm:hidden">ছবি</span>
                    </Button>
                  </div>
                  <Button onClick={handleCreatePost} disabled={(!newPostContent.trim() && !selectedImage) || isPosting} size="sm" className="px-4 sm:px-6">
                    {isPosting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                    পোস্ট করুন
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border/50 bg-muted/30 p-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              🔒 শুধুমাত্র <span className="font-semibold text-primary">Pro</span> মেম্বাররা পোস্ট করতে পারবেন।
            </p>
            <Button onClick={() => setShowUpgradeModal(true)} size="sm" className="px-6">
              Pro তে আপগ্রেড করুন
            </Button>
          </div>
        )}

        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />

        {/* Posts Feed */}
        {posts.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card p-10 text-center">
            <MessageCircle className="h-14 w-14 mx-auto mb-3 text-muted-foreground/30" />
            <p className="font-semibold text-muted-foreground">এখনো কোনো পোস্ট নেই</p>
            <p className="text-sm text-muted-foreground/70 mt-1">প্রথম পোস্ট করে কমিউনিটি শুরু করুন!</p>
          </div>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              className="rounded-xl border border-border/50 bg-card overflow-hidden hover:border-primary/20 transition-colors"
            >
              <div className="p-5">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-sm">
                        {getInitials(post.user_name, post.user_email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm">
                          {post.user_name || post.user_email}
                        </p>
                        <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 bg-primary/10 text-primary border-primary/20">
                          মেম্বার
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {timeAgo(post.created_at)}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {post.user_id === user?.id && (
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          ডিলিট করুন
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Post Content */}
                {post.content && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap mb-3 pl-14">
                    {post.content}
                  </p>
                )}

                {/* Post Image */}
                {post.image_url && (
                  <div className="mb-4 pl-14">
                    <div className="relative w-full max-w-lg aspect-square rounded-xl overflow-hidden border border-border/30 cursor-pointer hover:opacity-95 transition-opacity"
                         onClick={() => window.open(post.image_url!, '_blank')}>
                      <img
                        src={post.image_url}
                        alt="Post image"
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}


                {/* Actions Bar */}
                <div className="flex items-center justify-between pl-14">
                  <div className="flex items-center gap-4">
                    <button
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        post.is_liked
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                      onClick={() => handleLike(post.id, post.is_liked)}
                    >
                      <Heart className={`h-[18px] w-[18px] ${post.is_liked ? 'fill-primary' : ''}`} />
                      <span className="font-medium">{post.likes_count || ''}</span>
                    </button>
                    <button
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => toggleComments(post.id)}
                    >
                      <MessageCircle className="h-[18px] w-[18px]" />
                      <span className="font-medium">{post.comments_count || ''}</span>
                    </button>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Bookmark className="h-[18px] w-[18px]" />
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments.has(post.id) && (
                  <div className="mt-4 pt-4 border-t border-border/50 pl-14 space-y-3">
                    {loadingComments.has(post.id) ? (
                      <div className="flex justify-center py-3">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <>
                        {(commentsMap[post.id] || []).map(comment => (
                          <div key={comment.id} className="flex gap-2.5 group">
                            <Avatar className="h-7 w-7 mt-0.5 ring-1 ring-border">
                              <AvatarFallback className="text-[10px] bg-muted font-semibold">
                                {getInitials(comment.user_name, comment.user_email)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-muted/60 rounded-2xl px-3.5 py-2.5">
                                <p className="text-xs font-bold mb-0.5">
                                  {comment.user_name || comment.user_email}
                                </p>
                                <p className="text-sm leading-relaxed">{comment.content}</p>
                              </div>
                              <div className="flex items-center gap-3 mt-1 px-2">
                                <span className="text-[10px] text-muted-foreground">
                                  {timeAgo(comment.created_at)}
                                </span>
                                {comment.user_id === user?.id && (
                                  <button
                                    className="text-[10px] text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDeleteComment(comment.id, post.id)}
                                  >
                                    ডিলিট
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Add Comment */}
                        <div className="flex gap-2.5 items-center">
                          <Avatar className="h-7 w-7 ring-1 ring-primary/20">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                              {getInitials(null, user?.email || '')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="মন্তব্য লিখুন..."
                              value={commentInputs[post.id] || ''}
                              onChange={(e) =>
                                setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddComment(post.id);
                                }
                              }}
                              className="flex-1 h-9 rounded-full bg-muted/60 border-none px-4 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-full shrink-0 hover:bg-primary/10 hover:text-primary"
                              onClick={() => handleAddComment(post.id)}
                              disabled={!commentInputs[post.id]?.trim()}
                            >
                              <Send className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Trending Sidebar */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-6">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-b from-primary/10 via-card to-card overflow-hidden">
            <div className="p-4 border-b border-border/50">
              <h3 className="font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Trending Today
              </h3>
            </div>
            <div className="p-3 space-y-1">
              {trendingPosts.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">কোনো ট্রেন্ডিং পোস্ট নেই</p>
              ) : (
                trendingPosts.map(post => (
                  <div
                    key={post.id}
                    className="p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <p className="text-sm font-medium line-clamp-2 leading-snug">
                      {post.content.length > 60 ? post.content.slice(0, 60) + '...' : post.content}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {post.likes_count} LIKES
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" /> {post.comments_count} COMMENTS
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
