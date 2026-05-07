
-- Create course-thumbnails storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('course-thumbnails', 'course-thumbnails', true);

-- Allow anyone to view course thumbnails (public bucket)
CREATE POLICY "Course thumbnails are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-thumbnails');

-- Allow admins to upload course thumbnails
CREATE POLICY "Admins can upload course thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'course-thumbnails' AND public.is_admin());

-- Allow admins to update course thumbnails
CREATE POLICY "Admins can update course thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'course-thumbnails' AND public.is_admin());

-- Allow admins to delete course thumbnails
CREATE POLICY "Admins can delete course thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'course-thumbnails' AND public.is_admin());
