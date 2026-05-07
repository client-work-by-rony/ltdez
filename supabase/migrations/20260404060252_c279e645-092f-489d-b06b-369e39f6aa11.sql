
-- Add status column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

-- Set all existing users to approved
UPDATE public.profiles SET status = 'approved' WHERE status = 'pending';

-- Update the protect_profile_fields function to also protect status
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    NEW.membership := OLD.membership;
    NEW.membership_expires_at := OLD.membership_expires_at;
    NEW.is_blocked := OLD.is_blocked;
    NEW.email := OLD.email;
    NEW.user_id := OLD.user_id;
    NEW.status := OLD.status;
  END IF;
  RETURN NEW;
END;
$$;

-- Enable realtime for profiles
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
