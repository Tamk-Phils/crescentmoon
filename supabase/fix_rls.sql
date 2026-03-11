-- 1. Create the secure admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing problematic recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can insert puppies" ON public.puppies;
DROP POLICY IF EXISTS "Admins can update puppies" ON public.puppies;
DROP POLICY IF EXISTS "Admins can delete puppies" ON public.puppies;
DROP POLICY IF EXISTS "Admins can view all requests" ON public.adoption_requests;
DROP POLICY IF EXISTS "Admins can update all requests" ON public.adoption_requests;
DROP POLICY IF EXISTS "Admins can view all conversations" ON public.conversations;
DROP POLICY IF EXISTS "Admins can update all conversations" ON public.conversations;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can insert all messages" ON public.messages;

-- 3. Recreate the policies using the new secure function
CREATE POLICY "Admins can view all profiles" ON public.users FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert puppies" ON public.puppies FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update puppies" ON public.puppies FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete puppies" ON public.puppies FOR DELETE USING (public.is_admin());

CREATE POLICY "Admins can view all requests" ON public.adoption_requests FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all requests" ON public.adoption_requests FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can view all conversations" ON public.conversations FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all conversations" ON public.conversations FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can view all messages" ON public.messages FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert all messages" ON public.messages FOR INSERT WITH CHECK (public.is_admin());
