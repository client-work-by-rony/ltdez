
-- 1. Add avatar_url to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- 2. Create site_data table
CREATE TABLE public.site_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  category text NOT NULL DEFAULT 'general',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.site_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage site_data" ON public.site_data
  FOR ALL USING (public.is_admin());

CREATE POLICY "Authenticated users can read site_data" ON public.site_data
  FOR SELECT TO authenticated USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_site_data_updated_at
  BEFORE UPDATE ON public.site_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Create user-uploads storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for user-uploads
CREATE POLICY "Authenticated users can upload to user-uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'user-uploads');

CREATE POLICY "Anyone can view user-uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-uploads');

CREATE POLICY "Users can update own uploads"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'user-uploads' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'user-uploads' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can delete any upload"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'user-uploads' AND public.is_admin());
