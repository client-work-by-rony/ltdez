
-- 1. Fix lessons_secure view: enable security_invoker so RLS on underlying lessons table is enforced
ALTER VIEW public.lessons_secure SET (security_invoker = true);

-- 2. Fix enrollments INSERT policy: remove the overly broad payment check
DROP POLICY IF EXISTS "Users can enroll themselves in free or paid courses" ON public.enrollments;

CREATE POLICY "Users can enroll themselves in eligible courses"
ON public.enrollments
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = enrollments.course_id
      AND (courses.price IS NULL OR courses.price = 0)
    )
    OR is_pro_member()
    OR is_admin()
  )
);

-- 3. Fix assignments storage: restrict reads to own files + admin
DROP POLICY IF EXISTS "Authenticated users can view assignment files" ON storage.objects;

CREATE POLICY "Users can view own assignment files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'assignments'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.is_admin()
  )
);

-- 4. Fix user-uploads storage: restrict uploads to own folder
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;

CREATE POLICY "Users can upload to own folder only"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can update own uploaded files" ON storage.objects;

CREATE POLICY "Users can update own uploaded files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete own uploaded files" ON storage.objects;

CREATE POLICY "Users can delete own uploaded files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
