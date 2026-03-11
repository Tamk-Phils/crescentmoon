-- 1. Create a bulletproof role function
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- 2. Drop all policies that might be broken
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

DROP POLICY IF EXISTS "Admins can insert puppies" ON public.puppies;
DROP POLICY IF EXISTS "Admins can update puppies" ON public.puppies;
DROP POLICY IF EXISTS "Admins can delete puppies" ON public.puppies;

DROP POLICY IF EXISTS "Admins can view all requests" ON public.adoption_requests;
DROP POLICY IF EXISTS "Admins can update all requests" ON public.adoption_requests;

DROP POLICY IF EXISTS "Admins can view all conversations" ON public.conversations;
DROP POLICY IF EXISTS "Admins can update all conversations" ON public.conversations;

DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can insert all messages" ON public.messages;

-- 3. Correct policies for users (this is the ONLY table that can infinite recurse)
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.users FOR SELECT USING (public.get_user_role() = 'admin');
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Correct standard policies for puppies (no recursion risk, direct select is safest)
CREATE POLICY "Admins can insert puppies" ON public.puppies FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update puppies" ON public.puppies FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete puppies" ON public.puppies FOR DELETE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 5. Standard policies for adoption_requests
CREATE POLICY "Admins can view all requests" ON public.adoption_requests FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update all requests" ON public.adoption_requests FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 6. Standard policies for conversations
CREATE POLICY "Admins can view all conversations" ON public.conversations FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update all conversations" ON public.conversations FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 7. Standard policies for messages
CREATE POLICY "Admins can view all messages" ON public.messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can insert all messages" ON public.messages FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
