
-- Create authors table
CREATE TABLE public.authors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text,
  bio text,
  image text,
  email text,
  twitter text,
  instagram text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- Anyone can read authors
CREATE POLICY "Anyone can read authors"
ON public.authors FOR SELECT
USING (true);

-- Admins can manage authors
CREATE POLICY "Admins can manage authors"
ON public.authors FOR ALL
USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_authors_updated_at
BEFORE UPDATE ON public.authors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
