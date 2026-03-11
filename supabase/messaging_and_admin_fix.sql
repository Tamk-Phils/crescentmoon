-- 1. Drop the strict foreign key constraint to allow hardcoded admin bypass
-- Standard Supabase setup links public.users.id strictly to auth.users.id
-- We remove this so we can have an admin record without a real Supabase Auth session.
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- 2. Create the Hardcoded Admin User if it doesn't exist
DO $$
DECLARE
    admin_id UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = admin_id) THEN
        INSERT INTO public.users (id, email, full_name, role)
        VALUES (admin_id, 'hello@crescentmoonspaniels.com', 'Sanctuary Admin', 'admin');
    END IF;
END $$;

-- 3. Clean up and Deduplicate Conversations (Migrating messages first)
-- Step A: Identify the "keep" conversation (oldest) and the "discard" ones for each user
-- Step B: Move messages from discard to keep
DO $$
DECLARE
    rec RECORD;
    keep_id UUID;
BEGIN
    FOR rec IN SELECT user_id FROM public.conversations GROUP BY user_id HAVING count(*) > 1 LOOP
        -- Get the oldest conversation ID for this user
        SELECT id INTO keep_id FROM public.conversations WHERE user_id = rec.user_id ORDER BY created_at ASC LIMIT 1;
        
        -- Move all messages from other conversations to the keep_id
        UPDATE public.messages SET conversation_id = keep_id 
        WHERE conversation_id IN (SELECT id FROM public.conversations WHERE user_id = rec.user_id AND id != keep_id);
        
        -- Delete the other conversations
        DELETE FROM public.conversations WHERE user_id = rec.user_id AND id != keep_id;
    END LOOP;
END $$;

-- 4. Add UNIQUE constraint to prevent future duplicates
ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_user_id_key;
ALTER TABLE public.conversations ADD CONSTRAINT conversations_user_id_key UNIQUE (user_id);

-- 5. Relax RLS for Messaging
DROP POLICY IF EXISTS "Anyone can view conversations" ON public.conversations;
DROP POLICY IF EXISTS "Anyone can insert conversations" ON public.conversations;
DROP POLICY IF EXISTS "Anyone can update conversations" ON public.conversations;
CREATE POLICY "Anyone can view conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert conversations" ON public.conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update conversations" ON public.conversations FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can view messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.messages;
CREATE POLICY "Anyone can view messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Anyone can insert messages" ON public.messages FOR INSERT WITH CHECK (true);

-- 7. Enable Realtime for Chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Explicitly allow the hardcoded bypass ID
  IF auth.uid()::text = '00000000-0000-0000-0000-000000000000' THEN
    RETURN TRUE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
