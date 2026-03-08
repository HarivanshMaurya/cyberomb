import { PageBlock, createDefaultBlock } from './types';

export interface PageTemplate {
  name: string;
  description: string;
  icon: string;
  blocks: PageBlock[];
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    name: 'Landing Page',
    description: 'Hero, features, testimonials, and CTA',
    icon: '🚀',
    blocks: [
      { ...createDefaultBlock('hero'), title: 'Welcome to Our Platform', subtitle: 'Build something amazing with us today', style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'fade-in', backgroundColor: '' } },
      { ...createDefaultBlock('feature_cards'), heading: 'Why Choose Us', subtitle: 'Everything you need to succeed', style: { spacing: { paddingTop: 20, paddingBottom: 20, marginTop: 0, marginBottom: 0 }, animation: 'slide-up', backgroundColor: '' } },
      { ...createDefaultBlock('testimonials'), heading: 'What Our Users Say', style: { spacing: { paddingTop: 16, paddingBottom: 16, marginTop: 0, marginBottom: 0 }, animation: 'fade-in', backgroundColor: '#f8f9fa' } },
      { ...createDefaultBlock('cta'), title: 'Ready to Get Started?', subtitle: 'Join thousands of happy users today', style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'scale-in', backgroundColor: '' } },
    ],
  },
  {
    name: 'About Page',
    description: 'Introduction, story, team, and values',
    icon: '👤',
    blocks: [
      { ...createDefaultBlock('hero'), title: 'About Us', subtitle: 'Our story, our mission, our team', overlay: true, style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'fade-in', backgroundColor: '' } },
      { ...createDefaultBlock('richtext'), content: '<h2>Our Story</h2><p>Founded with a vision to make a difference, we have been working tirelessly to deliver exceptional value to our customers. Our journey started with a simple idea and has grown into something extraordinary.</p><p>We believe in innovation, integrity, and putting our customers first. Every decision we make is guided by these core principles.</p>', style: { spacing: { paddingTop: 16, paddingBottom: 16, marginTop: 0, marginBottom: 0 }, animation: 'slide-up', backgroundColor: '' } },
      { ...createDefaultBlock('text_image'), text: '<h3>Our Mission</h3><p>To empower individuals and businesses with tools that drive growth and success. We are committed to creating solutions that are both powerful and easy to use.</p>', imagePosition: 'right', style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'slide-left', backgroundColor: '' } },
      { ...createDefaultBlock('feature_cards'), heading: 'Our Values', subtitle: 'What drives us every day', columns: 3, cards: [{ icon: '💡', title: 'Innovation', description: 'Always pushing boundaries' }, { icon: '🤝', title: 'Integrity', description: 'Honest and transparent' }, { icon: '❤️', title: 'Passion', description: 'Love what we do' }], style: { spacing: { paddingTop: 20, paddingBottom: 20, marginTop: 0, marginBottom: 0 }, animation: 'slide-up', backgroundColor: '#f8f9fa' } },
    ],
  },
  {
    name: 'Contact Page',
    description: 'Hero, info cards, FAQ, and CTA',
    icon: '📬',
    blocks: [
      { ...createDefaultBlock('hero'), title: 'Get in Touch', subtitle: 'We\'d love to hear from you', style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'fade-in', backgroundColor: '' } },
      { ...createDefaultBlock('feature_cards'), heading: 'Contact Information', subtitle: 'Reach out through any of these channels', columns: 3, cards: [{ icon: '📧', title: 'Email', description: 'hello@example.com' }, { icon: '📱', title: 'Phone', description: '+1 (555) 123-4567' }, { icon: '📍', title: 'Address', description: '123 Main Street, City' }], style: { spacing: { paddingTop: 16, paddingBottom: 16, marginTop: 0, marginBottom: 0 }, animation: 'slide-up', backgroundColor: '' } },
      { ...createDefaultBlock('faq'), heading: 'Frequently Asked Questions', subtitle: 'Quick answers to common questions', items: [{ question: 'What are your business hours?', answer: 'We are available Monday to Friday, 9 AM to 6 PM.' }, { question: 'How quickly do you respond?', answer: 'We aim to respond within 24 hours.' }, { question: 'Do you offer support?', answer: 'Yes, we provide comprehensive support via email and phone.' }], style: { spacing: { paddingTop: 16, paddingBottom: 16, marginTop: 0, marginBottom: 0 }, animation: 'fade-in', backgroundColor: '#f8f9fa' } },
      { ...createDefaultBlock('cta'), title: 'Still Have Questions?', subtitle: 'Our team is here to help', buttonText: 'Send Message', style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'scale-in', backgroundColor: '' } },
    ],
  },
  {
    name: 'Portfolio / Gallery',
    description: 'Hero, gallery, testimonials',
    icon: '🎨',
    blocks: [
      { ...createDefaultBlock('hero'), title: 'Our Work', subtitle: 'Explore our latest projects and creations', style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'fade-in', backgroundColor: '' } },
      { ...createDefaultBlock('richtext'), content: '<p style="text-align: center; font-size: 1.2em;">We take pride in delivering exceptional work across various industries. Browse through our portfolio to see what we can do for you.</p>', style: { spacing: { paddingTop: 8, paddingBottom: 8, marginTop: 0, marginBottom: 0 }, animation: 'slide-up', backgroundColor: '' } },
      { ...createDefaultBlock('image_gallery'), heading: 'Featured Projects', columns: 3, style: { spacing: { paddingTop: 16, paddingBottom: 16, marginTop: 0, marginBottom: 0 }, animation: 'fade-in', backgroundColor: '' } },
      { ...createDefaultBlock('testimonials'), heading: 'Client Reviews', style: { spacing: { paddingTop: 16, paddingBottom: 16, marginTop: 0, marginBottom: 0 }, animation: 'slide-up', backgroundColor: '#f8f9fa' } },
      { ...createDefaultBlock('cta'), title: 'Want to Work Together?', subtitle: 'Let\'s create something amazing', buttonText: 'Start a Project', style: { spacing: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, animation: 'scale-in', backgroundColor: '' } },
    ],
  },
];
