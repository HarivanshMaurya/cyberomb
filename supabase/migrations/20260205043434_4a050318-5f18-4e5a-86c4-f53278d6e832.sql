-- User roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table for admin access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Profiles table for user info
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Site settings table for global config
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Hero section content
CREATE TABLE public.hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Journey Through Life''s Spectrum',
  subtitle TEXT NOT NULL DEFAULT 'Welcome to Perspective''s Blog: A Realm of Reflection, Inspiration, and Discovery.',
  background_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&q=80',
  button_text TEXT NOT NULL DEFAULT 'Join Now',
  button_link TEXT NOT NULL DEFAULT '#',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Site sections for editable content blocks
CREATE TABLE public.site_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  section_name TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Articles/Posts table
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  category TEXT NOT NULL DEFAULT 'uncategorized',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  read_time TEXT DEFAULT '5 min read',
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Pages table for dynamic pages
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Media library
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  alt_text TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Categories for articles
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
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

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_admin());

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (public.is_admin());

-- RLS Policies for site_settings (public read, admin write)
CREATE POLICY "Anyone can read site settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (public.is_admin());

-- RLS Policies for hero_content (public read, admin write)
CREATE POLICY "Anyone can read hero content"
ON public.hero_content
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage hero content"
ON public.hero_content
FOR ALL
TO authenticated
USING (public.is_admin());

-- RLS Policies for site_sections (public read, admin write)
CREATE POLICY "Anyone can read site sections"
ON public.site_sections
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage site sections"
ON public.site_sections
FOR ALL
TO authenticated
USING (public.is_admin());

-- RLS Policies for articles
CREATE POLICY "Anyone can read published articles"
ON public.articles
FOR SELECT
TO anon, authenticated
USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage all articles"
ON public.articles
FOR ALL
TO authenticated
USING (public.is_admin());

-- RLS Policies for pages
CREATE POLICY "Anyone can read published pages"
ON public.pages
FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage all pages"
ON public.pages
FOR ALL
TO authenticated
USING (public.is_admin());

-- RLS Policies for media
CREATE POLICY "Anyone can view media"
ON public.media
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage media"
ON public.media
FOR ALL
TO authenticated
USING (public.is_admin());

-- RLS Policies for categories
CREATE POLICY "Anyone can read categories"
ON public.categories
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage categories"
ON public.categories
FOR ALL
TO authenticated
USING (public.is_admin());

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hero_content_updated_at
  BEFORE UPDATE ON public.hero_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_sections_updated_at
  BEFORE UPDATE ON public.site_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for dynamic updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_content;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_sections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pages;

-- Insert default hero content
INSERT INTO public.hero_content (title, subtitle, background_image, button_text, button_link)
VALUES (
  'Journey Through Life''s Spectrum',
  'Welcome to Perspective''s Blog: A Realm of Reflection, Inspiration, and Discovery. Where Words Illuminate Paths of Meaning and Thoughts Unravel the Mysteries of Life''s Spectrum.',
  'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&q=80',
  'Join Now',
  '#'
);

-- Insert default categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Wellness', 'wellness', 'Articles about health and wellness'),
  ('Travel', 'travel', 'Travel stories and guides'),
  ('Creativity', 'creativity', 'Creative inspiration and ideas'),
  ('Growth', 'growth', 'Personal and professional growth');

-- Insert default site sections
INSERT INTO public.site_sections (section_key, section_name, content) VALUES
  ('intro', 'Introduction Section', '{"heading": "Perspective is a space for exploring ideas, finding inspiration, and discovering new ways of seeing the world.", "description": "From mindful living and personal growth to travel experiences and creative pursuits, we share perspectives that enrich daily life. Join us as we explore topics that inspire curiosity and meaningful conversation."}'),
  ('newsletter', 'Newsletter Section', '{"heading": "Stay inspired.", "description": "Subscribe to receive our latest articles and insights directly in your inbox.", "button_text": "Subscribe"}'),
  ('footer', 'Footer Section', '{"copyright": "© 2025 Perspective. All rights reserved."}');