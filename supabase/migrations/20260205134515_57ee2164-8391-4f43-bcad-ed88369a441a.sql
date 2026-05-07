-- Create assignments table
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignment submissions table
CREATE TABLE public.assignment_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  file_url TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  grade INTEGER,
  feedback TEXT,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID
);

-- Enable RLS
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for assignments
CREATE POLICY "Anyone can view assignments"
ON public.assignments FOR SELECT
USING (true);

CREATE POLICY "Admins can manage assignments"
ON public.assignments FOR ALL
USING (is_admin());

-- RLS policies for assignment submissions
CREATE POLICY "Users can view own submissions"
ON public.assignment_submissions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions"
ON public.assignment_submissions FOR SELECT
USING (is_admin());

CREATE POLICY "Users can submit assignments"
ON public.assignment_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can grade submissions"
ON public.assignment_submissions FOR UPDATE
USING (is_admin());

-- Create storage bucket for assignments
INSERT INTO storage.buckets (id, name, public) VALUES ('assignments', 'assignments', true);

-- Storage policies for assignments bucket
CREATE POLICY "Anyone can view assignment files"
ON storage.objects FOR SELECT
USING (bucket_id = 'assignments');

CREATE POLICY "Authenticated users can upload assignment files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'assignments' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete assignment files"
ON storage.objects FOR DELETE
USING (bucket_id = 'assignments' AND (SELECT is_admin()));

-- Triggers for updated_at
CREATE TRIGGER update_assignments_updated_at
BEFORE UPDATE ON public.assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();