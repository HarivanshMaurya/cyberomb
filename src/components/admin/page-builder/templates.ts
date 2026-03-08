import { PageBlock } from './types';

export interface PageTemplate {
  name: string;
  description: string;
  icon: string;
  blocks: PageBlock[];
}

function id() { return crypto.randomUUID(); }

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    name: 'Landing Page',
    description: 'Hero, features, testimonials, and CTA',
    icon: '🚀',
    blocks: [
      { type: 'hero', id: id(), title: 'Welcome to Our Platform', subtitle: 'Build something amazing with us today', image: '', buttonText: 'Get Started', buttonLink: '#', overlay: true, style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'fade-in' } },
      { type: 'feature_cards', id: id(), heading: 'Why Choose Us', subtitle: 'Everything you need to succeed', columns: 3, cards: [{ icon: '⭐', title: 'Quality', description: 'Top-notch quality in everything' }, { icon: '🚀', title: 'Speed', description: 'Fast and efficient delivery' }, { icon: '💡', title: 'Innovation', description: 'Cutting-edge solutions' }], style: { spacing: { paddingTop: 20, paddingBottom: 20, marginTop: 0, marginBottom: 0 }, animation: 'slide-up' } },
      { type: 'testimonials', id: id(), heading: 'What Our Users Say', testimonials: [{ quote: 'Amazing platform! Changed how we work.', author: 'Sarah K.', role: 'CEO', avatar: '' }, { quote: 'Best decision we ever made.', author: 'Mike R.', role: 'Developer', avatar: '' }], style: { spacing: { paddingTop: 16, paddingBottom: 16, marginTop: 0, marginBottom: 0 }, animation: 'fade-in', backgroundColor: '#f8f9fa' } },
      { type: 'cta', id: id(), title: 'Ready to Get Started?', subtitle: 'Join thousands of happy users today', buttonText: 'Sign Up Now', buttonLink: '#', variant: 'default', style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'scale-in' } },
    ],
  },
  {
    name: 'About Page',
    description: 'Introduction, story, team, and values',
    icon: '👤',
    blocks: [
      { type: 'hero', id: id(), title: 'About Us', subtitle: 'Our story, our mission, our team', image: '', buttonText: '', buttonLink: '#', overlay: true, style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'fade-in' } },
      { type: 'richtext', id: id(), content: '<h2>Our Story</h2><p>Founded with a vision to make a difference, we have been working tirelessly to deliver exceptional value. Our journey started with a simple idea and has grown into something extraordinary.</p>', style: { spacing: { paddingTop: 16, paddingBottom: 16, marginTop: 0, marginBottom: 0 }, animation: 'slide-up' } },
      { type: 'text_image', id: id(), text: '<h3>Our Mission</h3><p>To empower individuals and businesses with tools that drive growth and success.</p>', image: '', imageAlt: '', imagePosition: 'right', style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'slide-left' } },
      { type: 'feature_cards', id: id(), heading: 'Our Values', subtitle: 'What drives us every day', columns: 3, cards: [{ icon: '💡', title: 'Innovation', description: 'Always pushing boundaries' }, { icon: '🤝', title: 'Integrity', description: 'Honest and transparent' }, { icon: '❤️', title: 'Passion', description: 'Love what we do' }], style: { spacing: { paddingTop: 20, paddingBottom: 20, marginTop: 0, marginBottom: 0 }, animation: 'slide-up', backgroundColor: '#f8f9fa' } },
    ],
  },
  {
    name: 'Contact Page',
    description: 'Hero, info cards, FAQ, and CTA',
    icon: '📬',
    blocks: [
      { type: 'hero', id: id(), title: 'Get in Touch', subtitle: "We'd love to hear from you", image: '', buttonText: '', buttonLink: '#', overlay: true, style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'fade-in' } },
      { type: 'feature_cards', id: id(), heading: 'Contact Information', subtitle: 'Reach out through any channel', columns: 3, cards: [{ icon: '📧', title: 'Email', description: 'hello@example.com' }, { icon: '📱', title: 'Phone', description: '+1 (555) 123-4567' }, { icon: '📍', title: 'Address', description: '123 Main Street, City' }], style: { spacing: { paddingTop: 16, paddingBottom: 16, marginTop: 0, marginBottom: 0 }, animation: 'slide-up' } },
      { type: 'faq', id: id(), heading: 'Frequently Asked Questions', subtitle: 'Quick answers to common questions', items: [{ question: 'What are your business hours?', answer: 'Monday to Friday, 9 AM to 6 PM.' }, { question: 'How quickly do you respond?', answer: 'Within 24 hours.' }, { question: 'Do you offer support?', answer: 'Yes, via email and phone.' }], style: { spacing: { paddingTop: 16, paddingBottom: 16, marginTop: 0, marginBottom: 0 }, animation: 'fade-in', backgroundColor: '#f8f9fa' } },
      { type: 'cta', id: id(), title: 'Still Have Questions?', subtitle: 'Our team is here to help', buttonText: 'Send Message', buttonLink: '#', variant: 'default', style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'scale-in' } },
    ],
  },
  {
    name: 'Portfolio / Gallery',
    description: 'Hero, gallery, testimonials',
    icon: '🎨',
    blocks: [
      { type: 'hero', id: id(), title: 'Our Work', subtitle: 'Explore our latest projects', image: '', buttonText: '', buttonLink: '#', overlay: true, style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'fade-in' } },
      { type: 'richtext', id: id(), content: '<p style="text-align:center;font-size:1.2em;">We take pride in delivering exceptional work. Browse our portfolio below.</p>', style: { spacing: { paddingTop: 8, paddingBottom: 8, marginTop: 0, marginBottom: 0 }, animation: 'slide-up' } },
      { type: 'image_gallery', id: id(), heading: 'Featured Projects', columns: 3, images: [], style: { spacing: { paddingTop: 16, paddingBottom: 16, marginTop: 0, marginBottom: 0 }, animation: 'fade-in' } },
      { type: 'testimonials', id: id(), heading: 'Client Reviews', testimonials: [{ quote: 'Outstanding work!', author: 'Alex M.', role: 'Client', avatar: '' }], style: { spacing: { paddingTop: 16, paddingBottom: 16, marginTop: 0, marginBottom: 0 }, animation: 'slide-up', backgroundColor: '#f8f9fa' } },
      { type: 'cta', id: id(), title: 'Want to Work Together?', subtitle: "Let's create something amazing", buttonText: 'Start a Project', buttonLink: '#', variant: 'default', style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'scale-in' } },
    ],
  },
];
