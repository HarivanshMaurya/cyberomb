
-- Create navbar_config table to store navbar settings
CREATE TABLE public.navbar_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'Cyberom',
  logo_url text,
  show_logo boolean NOT NULL DEFAULT true,
  show_site_name boolean NOT NULL DEFAULT true,
  nav_links jsonb NOT NULL DEFAULT '[
    {"label": "Home", "href": "/", "visible": true, "order": 1},
    {"label": "Articles", "href": "/articles", "visible": true, "order": 2},
    {"label": "Wellness", "href": "/wellness", "visible": true, "order": 3},
    {"label": "Travel", "href": "/travel", "visible": true, "order": 4},
    {"label": "About", "href": "/about", "visible": true, "order": 5}
  ]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.navbar_config ENABLE ROW LEVEL SECURITY;

-- Everyone can read navbar config
CREATE POLICY "Anyone can view navbar config"
ON public.navbar_config FOR SELECT USING (true);

-- Only admins can modify
CREATE POLICY "Admins can update navbar config"
ON public.navbar_config FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert navbar config"
ON public.navbar_config FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete navbar config"
ON public.navbar_config FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default config
INSERT INTO public.navbar_config (site_name, logo_url, nav_links) VALUES (
  'Cyberom',
  NULL,
  '[
    {"label": "Home", "href": "/", "visible": true, "order": 1},
    {"label": "Articles", "href": "/articles", "visible": true, "order": 2},
    {"label": "Wellness", "href": "/wellness", "visible": true, "order": 3},
    {"label": "Travel", "href": "/travel", "visible": true, "order": 4},
    {"label": "About", "href": "/about", "visible": true, "order": 5}
  ]'::jsonb
);

-- Trigger for updated_at
CREATE TRIGGER update_navbar_config_updated_at
BEFORE UPDATE ON public.navbar_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
