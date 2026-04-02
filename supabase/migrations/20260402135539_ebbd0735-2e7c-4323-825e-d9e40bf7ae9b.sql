
-- Allow admin email to read all profiles
CREATE POLICY "Admin can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'saulomoreira@admin.com'
);

-- Allow admin to view all subscriptions
CREATE POLICY "Admin can view all subscriptions"
ON public.subscriptions FOR SELECT
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'saulomoreira@admin.com'
);
