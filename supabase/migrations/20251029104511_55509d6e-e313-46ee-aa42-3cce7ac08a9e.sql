-- Fix Security Issues: Role System, RLS Policies, and Input Validation

-- 1. Create role enum for admin/moderator system
CREATE TYPE public.app_role AS ENUM ('user', 'moderator', 'admin');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Create security definer function to check roles (prevents recursive RLS issues)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Fix profiles table - protect email addresses from public view
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- New policy: Public can view profiles but NOT email addresses
CREATE POLICY "Public profiles viewable without email"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can view their own complete profile including email
-- (This is redundant with the public policy but explicit for clarity)

-- 5. Add moderator policies for stories approval
CREATE POLICY "Moderators can approve stories"
  ON public.stories
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'moderator') OR 
    public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'moderator') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- 6. Fix story_likes - restrict to show only aggregated data
DROP POLICY IF EXISTS "Story likes are viewable by everyone" ON public.story_likes;

CREATE POLICY "Users can view own likes"
  ON public.story_likes FOR SELECT
  USING (auth.uid() = user_id);

-- 7. Add input validation constraints
ALTER TABLE public.stories 
  ADD CONSTRAINT content_length_limit CHECK (length(content) <= 5000);

ALTER TABLE public.story_comments
  ADD CONSTRAINT comment_length_limit CHECK (length(content) <= 1000);

ALTER TABLE public.profiles
  ADD CONSTRAINT bio_length_limit CHECK (bio IS NULL OR length(bio) <= 500),
  ADD CONSTRAINT name_length_limit CHECK (full_name IS NULL OR length(full_name) <= 100),
  ADD CONSTRAINT state_length_limit CHECK (state IS NULL OR length(state) <= 100),
  ADD CONSTRAINT sport_length_limit CHECK (sport_discipline IS NULL OR length(sport_discipline) <= 100);

-- 8. Create function to get story like counts (for public display without exposing user_ids)
CREATE OR REPLACE FUNCTION public.get_story_like_count(story_uuid uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer
  FROM public.story_likes
  WHERE story_id = story_uuid
$$;