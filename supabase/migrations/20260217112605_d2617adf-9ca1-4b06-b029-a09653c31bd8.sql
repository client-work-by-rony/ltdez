-- Create a secure view that masks video_url and content for non-Pro users on paid lessons
CREATE OR REPLACE VIEW public.lessons_secure AS
SELECT 
  id, course_id, title, description, order_index, is_free, 
  duration_minutes, created_at, updated_at,
  CASE 
    WHEN is_free = true OR public.is_pro_member() OR public.is_admin() THEN video_url 
    ELSE NULL 
  END as video_url,
  CASE 
    WHEN is_free = true OR public.is_pro_member() OR public.is_admin() THEN content 
    ELSE NULL 
  END as content
FROM public.lessons;

-- Grant access to authenticated users
GRANT SELECT ON public.lessons_secure TO authenticated;
GRANT SELECT ON public.lessons_secure TO anon;

-- Drop the problematic policy that leaks video_url to all authenticated users
DROP POLICY IF EXISTS "Authenticated users can view lesson metadata" ON public.lessons;