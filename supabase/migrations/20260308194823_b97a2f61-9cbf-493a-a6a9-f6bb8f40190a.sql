
CREATE TABLE public.translation_languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  sublabel text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.translation_languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage languages" ON public.translation_languages FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Anyone can read active languages" ON public.translation_languages FOR SELECT USING (true);

-- Seed default languages
INSERT INTO public.translation_languages (code, label, sublabel, sort_order) VALUES
  ('hi', 'हिंदी', 'Hindi', 1),
  ('mr', 'मराठी', 'Marathi', 2),
  ('ta', 'தமிழ்', 'Tamil', 3),
  ('bn', 'বাংলা', 'Bengali', 4);
