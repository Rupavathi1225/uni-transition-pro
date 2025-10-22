-- Create homepage_content table to store editable content
CREATE TABLE public.homepage_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  box_1_title TEXT NOT NULL,
  box_1_link TEXT NOT NULL,
  box_2_title TEXT NOT NULL,
  box_2_link TEXT NOT NULL,
  box_3_title TEXT NOT NULL,
  box_3_link TEXT NOT NULL,
  box_4_title TEXT NOT NULL,
  box_4_link TEXT NOT NULL,
  box_5_title TEXT NOT NULL,
  box_5_link TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Policy to allow everyone to read content
CREATE POLICY "Allow public read access"
ON public.homepage_content
FOR SELECT
TO public
USING (true);

-- Policy to allow authenticated users to update content (for admin)
CREATE POLICY "Allow authenticated users to update"
ON public.homepage_content
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert initial content
INSERT INTO public.homepage_content (
  title,
  description,
  box_1_title,
  box_1_link,
  box_2_title,
  box_2_link,
  box_3_title,
  box_3_link,
  box_4_title,
  box_4_link,
  box_5_title,
  box_5_link
) VALUES (
  'Five Ways to Make the Transition from High School to College Easy',
  'Making the transition from high school to college can be overwhelming, but with a bit of planning and guidance from the right sources, it can be a lot easier than you think! In this article, we provide five tips on how to make the transition as smooth as possible. From setting realistic expectations to finding support networks, these tips will help make the transition as easy as possible for you.',
  'Transition to University',
  '/page1',
  'Online Colleges that Pay You to Attend',
  '/page2',
  'Transition to Higher Education',
  '/page3',
  'Can I Get a Pell Grant for Online Classes',
  '/page4',
  'Free Graduate School',
  '/page5'
);

-- Create user_roles table for admin management
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = $1
    AND role = 'admin'
  )
$$;

-- Policy for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Enable realtime for homepage_content
ALTER PUBLICATION supabase_realtime ADD TABLE public.homepage_content;