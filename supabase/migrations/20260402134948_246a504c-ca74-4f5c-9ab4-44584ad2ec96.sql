
-- Add premium fields to profiles
ALTER TABLE public.profiles
ADD COLUMN is_premium boolean NOT NULL DEFAULT false,
ADD COLUMN premium_since timestamp with time zone,
ADD COLUMN premium_expires_at timestamp with time zone,
ADD COLUMN subscription_id text;

-- Create subscriptions table for history
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  plan text NOT NULL DEFAULT 'premium',
  status text NOT NULL DEFAULT 'pending',
  mercadopago_subscription_id text,
  amount numeric NOT NULL DEFAULT 19.90,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
ON public.subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
ON public.subscriptions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
ON public.subscriptions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
