
-- Auto-approve payment and upgrade to pro on insert
CREATE OR REPLACE FUNCTION public.auto_approve_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Auto approve the payment
  NEW.status := 'approved';
  NEW.verified_at := now();

  -- Upgrade user membership to pro (1 year)
  UPDATE public.profiles
  SET membership = 'pro',
      membership_expires_at = (now() + interval '1 year')
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_approve_payment_trigger
BEFORE INSERT ON public.payment_requests
FOR EACH ROW
EXECUTE FUNCTION public.auto_approve_payment();
