-- Create a public view that exposes only safe profile columns
CREATE VIEW public.public_profiles AS
  SELECT id, full_name, avatar_url, bio, state, sport_discipline, created_at
  FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Make the main profiles table more restrictive
DROP POLICY IF EXISTS "Public profiles viewable without email" ON public.profiles;

CREATE POLICY "Users can view own complete profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);