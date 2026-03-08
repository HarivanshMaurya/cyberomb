
CREATE TABLE public.wellness_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  read_time TEXT DEFAULT '5 min read',
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.wellness_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published wellness articles"
  ON public.wellness_articles
  FOR SELECT
  USING ((status = 'published') OR is_admin());

CREATE POLICY "Admins can manage all wellness articles"
  ON public.wellness_articles
  FOR ALL
  USING (is_admin());
