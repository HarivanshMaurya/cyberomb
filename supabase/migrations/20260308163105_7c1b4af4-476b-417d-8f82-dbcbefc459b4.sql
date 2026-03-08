
UPDATE public.site_sections 
SET content = jsonb_build_object(
  'copyright', COALESCE((content->>'copyright'), '© 2025 Cyberom. All rights reserved.'),
  'brand_description', 'Exploring ideas, finding inspiration. A space for wellness, creativity, travel, and personal growth.',
  'newsletter_placeholder', 'Your email'
)
WHERE section_key = 'footer';

-- Insert if not exists
INSERT INTO public.site_sections (section_key, section_name, content)
SELECT 'footer', 'Footer', '{
  "copyright": "© 2025 Cyberom. All rights reserved.",
  "brand_description": "Exploring ideas, finding inspiration. A space for wellness, creativity, travel, and personal growth.",
  "newsletter_placeholder": "Your email"
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.site_sections WHERE section_key = 'footer');
