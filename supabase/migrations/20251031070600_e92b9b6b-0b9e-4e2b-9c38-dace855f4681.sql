-- Fix the security definer issue by recreating the view without security definer
-- First drop the existing view
DROP VIEW IF EXISTS public.public_profiles;

-- Create view without security definer (makes it security invoker by default)
CREATE VIEW public.public_profiles 
WITH (security_invoker = true) AS
  SELECT id, full_name, avatar_url, bio, state, sport_discipline, created_at
  FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO anon, authenticated;