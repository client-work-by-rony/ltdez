-- Create membership_type enum
CREATE TYPE public.membership_type AS ENUM ('free', 'pro');

-- Add membership fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN membership membership_type DEFAULT 'free',
ADD COLUMN membership_expires_at TIMESTAMP WITH TIME ZONE;

-- Create lessons table for course modules
CREATE TABLE public.lessons (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    content TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_free BOOLEAN DEFAULT false,
    duration_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lesson_progress table to track user progress
CREATE TABLE public.lesson_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, lesson_id)
);

-- Create resources table for downloadable files
CREATE TABLE public.resources (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT,
    is_pro_only BOOLEAN DEFAULT false,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_requests table for bKash/Nagad payments
CREATE TABLE public.payment_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    transaction_id TEXT,
    phone_number TEXT,
    status TEXT DEFAULT 'pending',
    membership_type membership_type DEFAULT 'pro',
    notes TEXT,
    verified_by UUID,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- Lessons policies (anyone can view, admins can manage)
CREATE POLICY "Anyone can view lessons" ON public.lessons
FOR SELECT USING (true);

CREATE POLICY "Admins can manage lessons" ON public.lessons
FOR ALL USING (is_admin());

-- Lesson progress policies
CREATE POLICY "Users can view own progress" ON public.lesson_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.lesson_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.lesson_progress
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress" ON public.lesson_progress
FOR SELECT USING (is_admin());

-- Resources policies
CREATE POLICY "Anyone can view free resources" ON public.resources
FOR SELECT USING (is_pro_only = false OR is_admin());

CREATE POLICY "Pro users can view all resources" ON public.resources
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND (membership = 'pro' OR is_admin())
    )
);

CREATE POLICY "Admins can manage resources" ON public.resources
FOR ALL USING (is_admin());

-- Payment requests policies
CREATE POLICY "Users can view own payment requests" ON public.payment_requests
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create payment requests" ON public.payment_requests
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payment requests" ON public.payment_requests
FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update payment requests" ON public.payment_requests
FOR UPDATE USING (is_admin());

-- Add triggers for updated_at
CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();