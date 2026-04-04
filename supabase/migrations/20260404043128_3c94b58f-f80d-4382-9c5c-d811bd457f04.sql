ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.wellness_articles ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}'::jsonb;