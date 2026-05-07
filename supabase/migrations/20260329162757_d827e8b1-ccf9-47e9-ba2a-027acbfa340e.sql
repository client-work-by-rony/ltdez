
-- Create hero_slides table
CREATE TABLE public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Anyone can view active slides
CREATE POLICY "Anyone can view hero slides" ON public.hero_slides
  FOR SELECT TO public USING (true);

-- Admins can manage slides
CREATE POLICY "Admins can manage hero slides" ON public.hero_slides
  FOR ALL TO public USING (public.is_admin());

-- Create hero-images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', true);

-- Storage policies: anyone can view
CREATE POLICY "Anyone can view hero images" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'hero-images');

-- Admins can upload hero images
CREATE POLICY "Admins can upload hero images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'hero-images' AND public.is_admin());

-- Admins can delete hero images
CREATE POLICY "Admins can delete hero images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'hero-images' AND public.is_admin());
