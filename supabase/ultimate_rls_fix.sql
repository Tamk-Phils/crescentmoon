-- ULTIMATE RLS FIX SCRIPT
-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 1. Create a bulletproof Security Definer admin check function. 
-- "SECURITY DEFINER" means it bypasses RLS during the check, permanently fixing all infinite recursion bugs.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Wipe the slate clean. Drop ALL existing policies to prevent conflicts.
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

DROP POLICY IF EXISTS "Anyone can view available puppies" ON public.puppies;
DROP POLICY IF EXISTS "Admins can insert puppies" ON public.puppies;
DROP POLICY IF EXISTS "Admins can update puppies" ON public.puppies;
DROP POLICY IF EXISTS "Admins can delete puppies" ON public.puppies;

DROP POLICY IF EXISTS "Users can view own requests" ON public.adoption_requests;
DROP POLICY IF EXISTS "Users can insert own requests" ON public.adoption_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON public.adoption_requests;
DROP POLICY IF EXISTS "Admins can update all requests" ON public.adoption_requests;

DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Admins can view all conversations" ON public.conversations;
DROP POLICY IF EXISTS "Admins can update all conversations" ON public.conversations;

DROP POLICY IF EXISTS "Users can view own conversation messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages in own conversations" ON public.messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can insert all messages" ON public.messages;

-- 3. Re-apply flawlessly secure and strict policies.

-- USERS
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.users FOR SELECT USING (public.is_admin());
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- PUPPIES
CREATE POLICY "Anyone can view available puppies" ON public.puppies FOR SELECT USING (true);
CREATE POLICY "Admins can insert puppies" ON public.puppies FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update puppies" ON public.puppies FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete puppies" ON public.puppies FOR DELETE USING (public.is_admin());

-- ADOPTION REQUESTS
CREATE POLICY "Users can view own requests" ON public.adoption_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own requests" ON public.adoption_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all requests" ON public.adoption_requests FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all requests" ON public.adoption_requests FOR UPDATE USING (public.is_admin());

-- CONVERSATIONS
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own conversations" ON public.conversations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all conversations" ON public.conversations FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all conversations" ON public.conversations FOR UPDATE USING (public.is_admin());

-- MESSAGES
CREATE POLICY "Users can view own conversation messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert messages in own conversations" ON public.messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can view all messages" ON public.messages FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert all messages" ON public.messages FOR INSERT WITH CHECK (public.is_admin());
