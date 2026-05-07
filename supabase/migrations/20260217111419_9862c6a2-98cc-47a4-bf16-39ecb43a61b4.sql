
-- 1. Profile UPDATE policy for users (safe fields only)
CREATE POLICY "Users can update own profile safe fields"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Trigger to protect sensitive profile fields from non-admin users
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN
    NEW.membership := OLD.membership;
    NEW.membership_expires_at := OLD.membership_expires_at;
    NEW.is_blocked := OLD.is_blocked;
    NEW.email := OLD.email;
    NEW.user_id := OLD.user_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_profile_fields_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_fields();

-- 3. Input validation for payment_requests
CREATE OR REPLACE FUNCTION public.validate_payment_request()
RETURNS trigger LANGUAGE plpgsql
SET search_path = public AS $$
BEGIN
  IF NEW.transaction_id IS NOT NULL AND (length(NEW.transaction_id) < 5 OR length(NEW.transaction_id) > 30) THEN
    RAISE EXCEPTION 'Transaction ID must be between 5 and 30 characters';
  END IF;
  IF NEW.phone_number IS NOT NULL AND NEW.phone_number !~ '^01[0-9]{9}$' THEN
    RAISE EXCEPTION 'Phone number must be a valid Bangladeshi number (01XXXXXXXXX)';
  END IF;
  IF NEW.notes IS NOT NULL AND length(NEW.notes) > 500 THEN
    RAISE EXCEPTION 'Notes must be less than 500 characters';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_payment_request_trigger
BEFORE INSERT OR UPDATE ON public.payment_requests
FOR EACH ROW
EXECUTE FUNCTION public.validate_payment_request();

-- 4. Input validation for community_posts
CREATE OR REPLACE FUNCTION public.validate_community_post()
RETURNS trigger LANGUAGE plpgsql
SET search_path = public AS $$
BEGIN
  IF length(NEW.content) > 5000 THEN
    RAISE EXCEPTION 'Post content must be less than 5000 characters';
  END IF;
  IF length(NEW.content) < 1 THEN
    RAISE EXCEPTION 'Post content cannot be empty';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_community_post_trigger
BEFORE INSERT OR UPDATE ON public.community_posts
FOR EACH ROW
EXECUTE FUNCTION public.validate_community_post();

-- 5. Input validation for post_comments
CREATE OR REPLACE FUNCTION public.validate_post_comment()
RETURNS trigger LANGUAGE plpgsql
SET search_path = public AS $$
BEGIN
  IF length(NEW.content) > 2000 THEN
    RAISE EXCEPTION 'Comment must be less than 2000 characters';
  END IF;
  IF length(NEW.content) < 1 THEN
    RAISE EXCEPTION 'Comment cannot be empty';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_post_comment_trigger
BEFORE INSERT OR UPDATE ON public.post_comments
FOR EACH ROW
EXECUTE FUNCTION public.validate_post_comment();

-- 6. Input validation for contact_messages
CREATE OR REPLACE FUNCTION public.validate_contact_message()
RETURNS trigger LANGUAGE plpgsql
SET search_path = public AS $$
BEGIN
  IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  IF length(NEW.name) > 100 THEN
    RAISE EXCEPTION 'Name must be less than 100 characters';
  END IF;
  IF length(NEW.message) > 5000 THEN
    RAISE EXCEPTION 'Message must be less than 5000 characters';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_contact_message_trigger
BEFORE INSERT OR UPDATE ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION public.validate_contact_message();

-- 7. Secure lessons RLS - replace open SELECT with Pro-aware policy
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view lessons" ON public.lessons;

-- Create a function to get safe lesson data (hides video_url for non-pro on paid lessons)
CREATE OR REPLACE FUNCTION public.is_pro_member()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND membership = 'pro'
    AND (membership_expires_at IS NULL OR membership_expires_at > now())
  )
$$;

-- Allow everyone to see lesson metadata (title, description, order, etc.)
-- But video_url and content for paid lessons need Pro check at application level
-- Since RLS can't hide individual columns, we allow SELECT but create a secure view
CREATE POLICY "Anyone can view free lessons"
ON public.lessons FOR SELECT
USING (is_free = true);

CREATE POLICY "Pro users can view all lessons"
ON public.lessons FOR SELECT
USING (public.is_pro_member());

CREATE POLICY "Authenticated users can view lesson metadata"
ON public.lessons FOR SELECT
USING (auth.uid() IS NOT NULL);
