
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS long_description text,
  ADD COLUMN IF NOT EXISTS author text,
  ADD COLUMN IF NOT EXISTS pages_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS language text DEFAULT 'Hindi',
  ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS table_of_contents jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS slug text;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique ON public.products(slug);
