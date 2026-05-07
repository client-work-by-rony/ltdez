
-- 1. Fix lessons table: remove the overly permissive policy that bypasses pro-only access
DROP POLICY IF EXISTS "Authenticated users can view lessons via secure view" ON public.lessons;

-- 2. Fix enrollments: restrict self-enrollment to free courses or courses with approved payment
DROP POLICY IF EXISTS "Users can enroll themselves" ON public.enrollments;
CREATE POLICY "Users can enroll themselves in free or paid courses"
ON public.enrollments
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (
    -- Course is free (price is null or 0)
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_id
      AND (courses.price IS NULL OR courses.price = 0)
    )
    -- OR user has an approved payment request
    OR EXISTS (
      SELECT 1 FROM public.payment_requests
      WHERE payment_requests.user_id = auth.uid()
      AND payment_requests.status = 'approved'
    )
    -- OR user is already a pro member
    OR is_pro_member()
    -- OR user is admin
    OR is_admin()
  )
);

-- 3. Fix storage: make user-uploads and assignments buckets private
UPDATE storage.buckets SET public = false WHERE id IN ('user-uploads', 'assignments');

-- 4. Fix storage policies: restrict user-uploads reads to owner or admin
DROP POLICY IF EXISTS "Anyone can view user-uploads" ON storage.objects;
CREATE POLICY "Owner or admin can view user-uploads"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-uploads'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR public.is_admin()
  )
);

-- 5. Fix storage policies: restrict assignments reads to authenticated users
DROP POLICY IF EXISTS "Anyone can view assignment files" ON storage.objects;
CREATE POLICY "Authenticated users can view assignment files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'assignments'
  AND auth.uid() IS NOT NULL
);

-- 6. Fix contact_messages: the always-true INSERT is needed for public contact forms,
-- but restrict to rate-limit by requiring non-empty fields (already validated by trigger)
-- We'll keep it but scope it to anon+authenticated roles explicitly
DROP POLICY IF EXISTS "Anyone can submit messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) > 0 AND length(message) > 0 AND length(email) > 0
);
