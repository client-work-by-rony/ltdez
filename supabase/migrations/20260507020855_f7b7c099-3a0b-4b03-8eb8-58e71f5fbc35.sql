ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS course_type TEXT NOT NULL DEFAULT 'recorded',
  ADD COLUMN IF NOT EXISTS live_schedule TEXT,
  ADD COLUMN IF NOT EXISTS career_outcomes JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS student_count_override INTEGER;