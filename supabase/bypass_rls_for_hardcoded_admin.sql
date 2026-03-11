-- This script relaxes RLS for the puppies table to allow the hardcoded admin (who has no Auth session) to manage inventory.
-- In a real production environment, you would use proper Supabase Auth, but this matches the user's requested "Hardcoded" setup.

-- 1. Drop existing admin-only policies
DROP POLICY IF EXISTS "Admins can insert puppies" ON public.puppies;
DROP POLICY IF EXISTS "Admins can update puppies" ON public.puppies;
DROP POLICY IF EXISTS "Admins can delete puppies" ON public.puppies;

-- 2. Create new policies that allow anyone to manage puppies (Enables the hardcoded bypass)
CREATE POLICY "Anyone can insert puppies" ON public.puppies FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update puppies" ON public.puppies FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete puppies" ON public.puppies FOR DELETE USING (true);

-- 3. Do the same for adoption requests and users if needed for administrative actions
DROP POLICY IF EXISTS "Admins can view all requests" ON public.adoption_requests;
DROP POLICY IF EXISTS "Admins can update request status" ON public.adoption_requests;

CREATE POLICY "Anyone can view all requests" ON public.adoption_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can update request status" ON public.adoption_requests FOR UPDATE USING (true);

-- Also allow viewing users (for the Registered Users page)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
CREATE POLICY "Anyone can view all profiles" ON public.users FOR SELECT USING (true);
