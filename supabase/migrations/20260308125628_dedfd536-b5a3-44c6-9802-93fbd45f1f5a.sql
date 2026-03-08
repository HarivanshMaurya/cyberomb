
-- Reading analytics table
CREATE TABLE public.reading_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid NOT NULL,
  product_slug text,
  last_page_read integer NOT NULL DEFAULT 1,
  total_pages integer NOT NULL DEFAULT 0,
  pages_read integer NOT NULL DEFAULT 0,
  completion_percent numeric NOT NULL DEFAULT 0,
  total_reading_time_seconds integer NOT NULL DEFAULT 0,
  last_read_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.reading_analytics ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own analytics
CREATE POLICY "Users can manage own reading analytics"
  ON public.reading_analytics
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all analytics
CREATE POLICY "Admins can read all analytics"
  ON public.reading_analytics
  FOR SELECT
  TO authenticated
  USING (public.is_admin());
