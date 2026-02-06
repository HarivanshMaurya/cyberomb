-- Create a table for page content sections
CREATE TABLE public.page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key TEXT NOT NULL UNIQUE,
    page_name TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read page sections" 
ON public.page_sections 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage page sections" 
ON public.page_sections 
FOR ALL 
USING (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_page_sections_updated_at
BEFORE UPDATE ON public.page_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content for Wellness, Travel, and About pages
INSERT INTO public.page_sections (page_key, page_name, title, subtitle, content) VALUES
(
  'wellness',
  'Wellness Page',
  'Wellness & Self-Care',
  'Discover practices, insights, and strategies to nurture your physical, mental, and emotional wellbeing. From mindful routines to holistic health approaches, explore ways to create balance and vitality in your daily life.',
  '{
    "section_title": "Why Wellness Matters",
    "section_content": "Wellness is not just about physical health—it''s about creating harmony between body, mind, and spirit. In our fast-paced world, taking time to nurture ourselves isn''t a luxury; it''s essential for sustainable living.\n\nThrough thoughtful self-care practices, we can build resilience, improve our relationships, enhance our productivity, and ultimately, live more fulfilling lives. Whether it''s through nutrition, movement, meditation, or simply learning to rest, every small step toward wellness counts."
  }'::jsonb
),
(
  'travel',
  'Travel Page',
  'Travel & Exploration',
  'Journey through inspiring destinations, cultural insights, and mindful travel practices. Discover how to explore the world with intention, curiosity, and respect for local communities and environments.',
  '{
    "section_title": "Our Travel Philosophy",
    "section_content": "Travel is more than visiting new places—it''s about opening ourselves to new perspectives, cultures, and ways of being. We believe in slow, intentional travel that prioritizes meaningful connections over checking off bucket list items.\n\nWhether you''re exploring your own backyard or venturing to distant lands, we share stories and insights that inspire mindful exploration, sustainable practices, and genuine cultural exchange. Join us in discovering that the journey itself is often the most valuable destination."
  }'::jsonb
),
(
  'about',
  'About Page',
  'About Cyberom',
  'A space for exploring ideas, finding inspiration, and discovering new ways of seeing the world.',
  '{
    "story_title": "Our Story",
    "story_content": "Cyberom began with a simple question: What if we could create a space where thoughtful ideas, meaningful stories, and practical wisdom come together to enrich our daily lives?\n\nIn a world saturated with information, we felt the need for something different—a publication that prioritizes depth over speed, quality over quantity, and authentic connection over viral content. Cyberom is our answer to that need.\n\nWe explore topics that matter: wellness practices that actually work, travel experiences that transform us, creative pursuits that bring joy, and personal growth strategies that lead to lasting change. Our approach is grounded in curiosity, backed by research, and enriched by lived experience.",
    "mission_title": "Our Mission",
    "mission_content": "We believe that how we see the world shapes how we experience it. Cyberom is dedicated to offering fresh viewpoints, practical insights, and inspiring stories.",
    "mission_points": ["Cultivate mindful, balanced lifestyles that prioritize wellbeing", "Explore the world with curiosity and respect", "Express themselves authentically through creative pursuits", "Embrace personal growth as a lifelong journey"],
    "values": [
      {"title": "Authenticity", "description": "We share real experiences, honest reflections, and genuine insights—not curated perfection."},
      {"title": "Thoughtfulness", "description": "Every article is carefully researched, thoughtfully written, and designed to add real value."},
      {"title": "Inclusivity", "description": "We welcome diverse perspectives and believe everyone''s journey deserves respect and representation."},
      {"title": "Sustainability", "description": "We promote practices that are sustainable for individuals, communities, and the planet."}
    ],
    "cta_title": "Join Our Community",
    "cta_description": "Subscribe to receive our latest articles, insights, and inspiration directly in your inbox."
  }'::jsonb
);