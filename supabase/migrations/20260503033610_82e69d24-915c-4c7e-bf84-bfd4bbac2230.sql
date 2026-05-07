ALTER TABLE public.payment_requests
  ADD COLUMN IF NOT EXISTS course_id uuid NULL,
  ADD COLUMN IF NOT EXISTS purchase_type text NOT NULL DEFAULT 'pro';

CREATE INDEX IF NOT EXISTS idx_payment_requests_course_id ON public.payment_requests(course_id);