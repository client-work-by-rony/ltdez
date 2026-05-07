
-- Drop unused view from previous failed migration
DROP VIEW IF EXISTS public.profiles_membership;

-- Remove profiles from realtime, then re-add with only safe columns
ALTER PUBLICATION supabase_realtime DROP TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles (user_id, membership, membership_expires_at);
