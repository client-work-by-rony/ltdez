-- Add unique constraint to prevent duplicate enrollments
ALTER TABLE public.enrollments
  ADD CONSTRAINT enrollments_user_course_unique UNIQUE (user_id, course_id);

-- Enable realtime for enrollments
ALTER TABLE public.enrollments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.enrollments;