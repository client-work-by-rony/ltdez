
-- Create storage bucket for community post images
INSERT INTO storage.buckets (id, name, public) VALUES ('community-images', 'community-images', true);

-- Anyone authenticated can upload images
CREATE POLICY "Users can upload community images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'community-images' AND auth.uid() IS NOT NULL);

-- Anyone can view community images (public bucket)
CREATE POLICY "Anyone can view community images"
ON storage.objects FOR SELECT
USING (bucket_id = 'community-images');

-- Users can delete their own uploaded images
CREATE POLICY "Users can delete own community images"
ON storage.objects FOR DELETE
USING (bucket_id = 'community-images' AND auth.uid()::text = (storage.foldername(name))[1]);
