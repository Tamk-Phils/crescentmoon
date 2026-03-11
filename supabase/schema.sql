-- Create a secure function to check admin status without infinite recursion
-- "SECURITY DEFINER" means it bypasses RLS during the check, permanently fixing all infinite recursion bugs.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Clean existing policies for users
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.users FOR SELECT USING (public.is_admin());
-- Users can insert their own profile on signup
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Create puppies table
CREATE TABLE IF NOT EXISTS public.puppies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  breed TEXT NOT NULL DEFAULT 'Cocker Spaniel',
  age TEXT NOT NULL,
  gender TEXT NOT NULL,
  adoption_fee NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'pending', 'adopted')),
  description TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for puppies
ALTER TABLE public.puppies ENABLE ROW LEVEL SECURITY;

-- Clean existing policies for puppies
DROP POLICY IF EXISTS "Anyone can view available puppies" ON public.puppies;
DROP POLICY IF EXISTS "Admins can insert puppies" ON public.puppies;
DROP POLICY IF EXISTS "Admins can update puppies" ON public.puppies;
DROP POLICY IF EXISTS "Admins can delete puppies" ON public.puppies;

-- Anyone can read available puppies
CREATE POLICY "Anyone can view available puppies" ON public.puppies FOR SELECT USING (true);
-- Admins can do everything
CREATE POLICY "Admins can insert puppies" ON public.puppies FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update puppies" ON public.puppies FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete puppies" ON public.puppies FOR DELETE USING (public.is_admin());

-- Create adoption_requests table
CREATE TABLE IF NOT EXISTS public.adoption_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  puppy_id UUID REFERENCES public.puppies(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  application_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for adoption_requests
ALTER TABLE public.adoption_requests ENABLE ROW LEVEL SECURITY;

-- Clean existing policies for adoption_requests
DROP POLICY IF EXISTS "Users can view own requests" ON public.adoption_requests;
DROP POLICY IF EXISTS "Users can insert own requests" ON public.adoption_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON public.adoption_requests;
DROP POLICY IF EXISTS "Admins can update all requests" ON public.adoption_requests;

-- Users can view and create their own requests
CREATE POLICY "Users can view own requests" ON public.adoption_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own requests" ON public.adoption_requests FOR INSERT WITH CHECK (user_id = auth.uid());
-- Admins can view and update all requests
CREATE POLICY "Admins can view all requests" ON public.adoption_requests FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all requests" ON public.adoption_requests FOR UPDATE USING (public.is_admin());

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  admin_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Clean existing policies for conversations
DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Admins can view all conversations" ON public.conversations;
DROP POLICY IF EXISTS "Admins can update all conversations" ON public.conversations;

-- Users can view and create their own conversations
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own conversations" ON public.conversations FOR INSERT WITH CHECK (user_id = auth.uid());
-- Admins can view and update all conversations
CREATE POLICY "Admins can view all conversations" ON public.conversations FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all conversations" ON public.conversations FOR UPDATE USING (public.is_admin());

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) NOT NULL,
  sender_id UUID REFERENCES public.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Clean existing policies for messages
DROP POLICY IF EXISTS "Users can view own conversation messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages in own conversations" ON public.messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can insert all messages" ON public.messages;

-- Users can view messages in their conversations
CREATE POLICY "Users can view own conversation messages" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id AND user_id = auth.uid()
  )
);
-- Users can insert messages in their conversations
CREATE POLICY "Users can insert messages in own conversations" ON public.messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id AND user_id = auth.uid()
  )
);
-- Admins can view and insert messages in all conversations
CREATE POLICY "Admins can view all messages" ON public.messages FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert all messages" ON public.messages FOR INSERT WITH CHECK (public.is_admin());

-- Create a generic function to automatically handle authenticated users sign up into public.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
