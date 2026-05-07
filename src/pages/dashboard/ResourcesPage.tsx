import { useState, useEffect } from 'react';
import { useMembership } from '@/hooks/useMembership';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, FileText, Lock, Crown } from 'lucide-react';
import { UpgradeModal } from '@/components/dashboard/UpgradeModal';

interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  is_pro_only: boolean;
}

export default function ResourcesPage() {
  const { isProActive } = useMembership();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    async function fetchResources() {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setResources(data || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResources();
  }, []);

  function canAccessResource(resource: Resource) {
    return !resource.is_pro_only || isProActive;
  }

  function getFileIcon(fileType: string | null) {
    return <FileText className="h-8 w-8" />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">ডাউনলোডেবল রিসোর্স</h1>
        <p className="text-muted-foreground">PDF, টেমপ্লেট এবং অন্যান্য ম্যাটেরিয়াল</p>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-12">
          <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">কোনো রিসোর্স নেই</h3>
          <p className="text-muted-foreground">শীঘ্রই নতুন রিসোর্স যোগ হবে</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => {
            const hasAccess = canAccessResource(resource);

            return (
              <Card key={resource.id} className={!hasAccess ? 'opacity-75' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${hasAccess ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {hasAccess ? getFileIcon(resource.file_type) : <Lock className="h-8 w-8" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold truncate">{resource.title}</h3>
                        {resource.is_pro_only && (
                          <Badge variant={hasAccess ? 'default' : 'secondary'} className="flex-shrink-0">
                            <Crown className="h-3 w-3 mr-1" />
                            Pro
                          </Badge>
                        )}
                      </div>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {resource.description}
                        </p>
                      )}
                      <div className="mt-4">
                        {hasAccess ? (
                          <Button size="sm" asChild>
                            <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-2" />
                              ডাউনলোড
                            </a>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setIsUpgradeModalOpen(true)}
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            আপগ্রেড করুন
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}
