-- Recreate view with security_invoker to respect RLS of calling user
DROP VIEW IF EXISTS public.lessons_secure;

CREATE VIEW public.lessons_secure
WITH (security_invoker=on) AS
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

-- Grant access
GRANT SELECT ON public.lessons_secure TO authenticated;
GRANT SELECT ON public.lessons_secure TO anon;

-- Re-add a restrictive policy so the view can access lessons through RLS
-- The view needs the base table to be accessible
CREATE POLICY "Authenticated users can view lessons via secure view"
ON public.lessons FOR SELECT
TO authenticated
USING (true);