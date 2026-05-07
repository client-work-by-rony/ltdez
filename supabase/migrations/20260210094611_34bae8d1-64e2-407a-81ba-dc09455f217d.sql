-- Drop the auto_approve_payment trigger on payment_requests
DROP TRIGGER IF EXISTS auto_approve_payment_trigger ON public.payment_requests;

-- Drop the auto_approve_payment function
DROP FUNCTION IF EXISTS public.auto_approve_payment();
