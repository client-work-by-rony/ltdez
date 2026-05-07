import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface MembershipData {
  membership: 'free' | 'pro';
  membershipExpiresAt: string | null;
  isProActive: boolean;
}

export function useMembership() {
  const { user } = useAuth();
  const [membershipData, setMembershipData] = useState<MembershipData>({
    membership: 'free',
    membershipExpiresAt: null,
    isProActive: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  function computeMembership(membership: string | null, expiresAt: string | null): MembershipData {
    const mem = (membership as 'free' | 'pro') || 'free';
    const isProActive = mem === 'pro' && (!expiresAt || new Date(expiresAt) > new Date());
    return { membership: mem, membershipExpiresAt: expiresAt, isProActive };
  }

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    async function fetchMembership() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('membership, membership_expires_at')
          .eq('user_id', user!.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching membership:', error);
        } else if (data) {
          setMembershipData(computeMembership(data.membership, data.membership_expires_at));
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembership();

    // Realtime subscription for membership changes
    const channel = supabase
      .channel(`membership-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newData = payload.new as any;
          setMembershipData(computeMembership(newData.membership, newData.membership_expires_at));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { ...membershipData, isLoading };
}
