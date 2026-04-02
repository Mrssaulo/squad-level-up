create or replace function public.is_admin_email()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from auth.users
    where id = auth.uid()
      and email = 'saulomoreira@admin.com'
  );
$$;

drop policy if exists "Admin can view all profiles" on public.profiles;
create policy "Admin can view all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin_email());

drop policy if exists "Admin can view all subscriptions" on public.subscriptions;
create policy "Admin can view all subscriptions"
on public.subscriptions
for select
to authenticated
using (public.is_admin_email());