
-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Admins can manage all messages
CREATE POLICY "Admins can manage contact messages"
  ON public.contact_messages FOR ALL
  USING (is_admin());

-- Anyone can insert (submit contact form)
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Insert contact page section if not exists
INSERT INTO public.page_sections (page_key, page_name, title, subtitle, content)
VALUES (
  'contact',
  'Contact Page',
  'Get in Touch',
  'Have a question, suggestion, or just want to say hello? We''d love to hear from you.',
  '{
    "hero_badge": "Contact",
    "email": "hello@cyberom.blog",
    "email_sub": "We''ll respond within 24 hours",
    "location": "India",
    "location_sub": "Remote-first team",
    "phone": "+91 98765 43210",
    "phone_sub": "Mon-Fri, 9am-6pm IST",
    "form_title": "Send a Message",
    "faqs": [
      {"q": "Can I contribute to Cyberom?", "a": "Yes! We welcome guest contributions. Please use the form to submit your pitch or article idea."},
      {"q": "How do I advertise with you?", "a": "For advertising inquiries, email us with details about your brand and goals."},
      {"q": "Can I republish your content?", "a": "Please contact us for permissions and licensing. We are generally open to republishing with proper attribution."}
    ]
  }'::jsonb
)
ON CONFLICT DO NOTHING;
