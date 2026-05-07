-- 1. Add trailer_url to courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS trailer_url TEXT;

-- 2. Create course_reviews table
CREATE TABLE IF NOT EXISTS public.course_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_course_reviews_course ON public.course_reviews(course_id);

-- 3. Validation trigger
CREATE OR REPLACE FUNCTION public.validate_course_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  IF length(NEW.content) < 1 OR length(NEW.content) > 1000 THEN
    RAISE EXCEPTION 'Review content must be 1-1000 characters';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_course_review_trigger ON public.course_reviews;
CREATE TRIGGER validate_course_review_trigger
BEFORE INSERT OR UPDATE ON public.course_reviews
FOR EACH ROW EXECUTE FUNCTION public.validate_course_review();

DROP TRIGGER IF EXISTS update_course_reviews_updated_at ON public.course_reviews;
CREATE TRIGGER update_course_reviews_updated_at
BEFORE UPDATE ON public.course_reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. RLS
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews"
ON public.course_reviews FOR SELECT
USING (is_approved = true OR auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can create own reviews"
ON public.course_reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
ON public.course_reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
ON public.course_reviews FOR DELETE
USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins can manage reviews"
ON public.course_reviews FOR ALL
USING (is_admin());