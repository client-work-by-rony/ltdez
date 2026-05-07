
-- Allow guest checkout
ALTER TABLE public.payment_requests
  ALTER COLUMN user_id DROP NOT NULL;

-- Extend payment_requests for full-order data
ALTER TABLE public.payment_requests
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS customer_address TEXT,
  ADD COLUMN IF NOT EXISTS gateway_name TEXT,
  ADD COLUMN IF NOT EXISTS gateway_order_id TEXT,
  ADD COLUMN IF NOT EXISTS gateway_transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS gateway_response JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS product_name TEXT,
  ADD COLUMN IF NOT EXISTS callback_log JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_payment_requests_gateway_order_id
  ON public.payment_requests(gateway_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status
  ON public.payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_payment_requests_created_at
  ON public.payment_requests(created_at DESC);

-- Public/guest insert policy (checkout without login allowed)
DROP POLICY IF EXISTS "Anyone can create payment requests" ON public.payment_requests;
CREATE POLICY "Anyone can create payment requests"
  ON public.payment_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Payment gateway settings
CREATE TABLE IF NOT EXISTS public.payment_gateway_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  mode TEXT NOT NULL DEFAULT 'sandbox',
  credentials JSONB NOT NULL DEFAULT '{}'::jsonb,
  return_url TEXT,
  cancel_url TEXT,
  success_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_gateway_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage gateway settings" ON public.payment_gateway_settings;
CREATE POLICY "Admins manage gateway settings"
  ON public.payment_gateway_settings
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE TRIGGER update_payment_gateway_settings_updated_at
  BEFORE UPDATE ON public.payment_gateway_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default rows for ShurjoPay & UddoktaPay (inactive, blank creds)
INSERT INTO public.payment_gateway_settings (gateway_name, is_active, mode, credentials)
VALUES
  ('shurjopay', false, 'sandbox', '{"store_id":"","signature_key":"","prefix":"FTF","username":"","password":""}'::jsonb),
  ('uddoktapay', false, 'sandbox', '{"api_key":"","base_url":"","webhook_secret":""}'::jsonb)
ON CONFLICT (gateway_name) DO NOTHING;
