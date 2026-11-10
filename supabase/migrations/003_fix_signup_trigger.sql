-- ============================================================
-- Fix: Supabase Auth "Database error saving new user"
-- Run this in your Supabase Dashboard -> SQL Editor
-- ============================================================

-- 1. Ensure RLS on profiles allows inserts from triggers
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow trigger insert on profiles" ON public.profiles;
CREATE POLICY "Allow trigger insert on profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
CREATE POLICY "Public can view profiles"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Replace the trigger function with explicit public schema qualification,
--    search_path safety, and exception fallback so it NEVER blocks signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, system_role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'player'
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    updated_at = NOW();
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Prevent database exceptions in trigger from aborting the auth signup transaction
  RAISE WARNING 'handle_new_user error: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- 3. Re-bind the trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Enable public read access on games and categories for visitors
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved games" ON public.games;
CREATE POLICY "Public can view approved games"
  ON public.games FOR SELECT
  USING (approval_status = 'approved' AND is_active = true AND deleted_at IS NULL);

ALTER TABLE public.game_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active categories" ON public.game_categories;
CREATE POLICY "Public can view active categories"
  ON public.game_categories FOR SELECT
  USING (is_active = true);

