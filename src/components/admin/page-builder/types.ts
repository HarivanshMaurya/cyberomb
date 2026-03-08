export type BlockType =
  | 'hero'
  | 'richtext'
  | 'text_image'
  | 'feature_cards'
  | 'image_gallery'
  | 'testimonials'
  | 'faq'
  | 'cta';

export type BlockAnimation = 'none' | 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale-in' | 'zoom-in';

export interface BlockSpacing {
  paddingTop: number;
  paddingBottom: number;
  marginTop: number;
  marginBottom: number;
}

export interface BlockStyleSettings {
  spacing: BlockSpacing;
  animation: BlockAnimation;
}

export const DEFAULT_SPACING: BlockSpacing = { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 };
export const DEFAULT_STYLE: BlockStyleSettings = { spacing: DEFAULT_SPACING, animation: 'none' };

export interface HeroBlock {
  type: 'hero';
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  overlay: boolean;
  style?: BlockStyleSettings;
}

export interface RichTextBlock {
  type: 'richtext';
  id: string;
  content: string;
  style?: BlockStyleSettings;
}

export interface TextImageBlock {
  type: 'text_image';
  id: string;
  text: string;
  image: string;
  imageAlt: string;
  imagePosition: 'left' | 'right';
  style?: BlockStyleSettings;
}

export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

export interface FeatureCardsBlock {
  type: 'feature_cards';
  id: string;
  heading: string;
  subtitle: string;
  columns: 2 | 3 | 4;
  cards: FeatureCard[];
  style?: BlockStyleSettings;
}

export interface GalleryImage {
  url: string;
  alt: string;
  caption: string;
}

export interface ImageGalleryBlock {
  type: 'image_gallery';
  id: string;
  heading: string;
  columns: 2 | 3 | 4;
  images: GalleryImage[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export interface TestimonialsBlock {
  type: 'testimonials';
  id: string;
  heading: string;
  testimonials: Testimonial[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQBlock {
  type: 'faq';
  id: string;
  heading: string;
  subtitle: string;
  items: FAQItem[];
}

export interface CTABlock {
  type: 'cta';
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  variant: 'default' | 'accent' | 'dark';
}

export type PageBlock =
  | HeroBlock
  | RichTextBlock
  | TextImageBlock
  | FeatureCardsBlock
  | ImageGalleryBlock
  | TestimonialsBlock
  | FAQBlock
  | CTABlock;

export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: 'Hero Banner',
  richtext: 'Rich Text',
  text_image: 'Text + Image',
  feature_cards: 'Feature Cards',
  image_gallery: 'Image Gallery',
  testimonials: 'Testimonials',
  faq: 'FAQ Accordion',
  cta: 'Call to Action',
};

export const BLOCK_ICONS: Record<BlockType, string> = {
  hero: '🖼️',
  richtext: '📝',
  text_image: '📰',
  feature_cards: '🃏',
  image_gallery: '🖼',
  testimonials: '💬',
  faq: '❓',
  cta: '🚀',
};

export function createDefaultBlock(type: BlockType): PageBlock {
  const id = crypto.randomUUID();
  switch (type) {
    case 'hero':
      return { type, id, title: 'Your Heading', subtitle: 'A brief description', image: '', buttonText: 'Get Started', buttonLink: '#', overlay: true };
    case 'richtext':
      return { type, id, content: '<p>Start writing your content here...</p>' };
    case 'text_image':
      return { type, id, text: '<p>Your text content here...</p>', image: '', imageAlt: '', imagePosition: 'right' };
    case 'feature_cards':
      return { type, id, heading: 'Our Features', subtitle: '', columns: 3, cards: [{ icon: '⭐', title: 'Feature 1', description: 'Description here' }, { icon: '🚀', title: 'Feature 2', description: 'Description here' }, { icon: '💡', title: 'Feature 3', description: 'Description here' }] };
    case 'image_gallery':
      return { type, id, heading: 'Gallery', columns: 3, images: [] };
    case 'testimonials':
      return { type, id, heading: 'What People Say', testimonials: [{ quote: 'Great experience!', author: 'John Doe', role: 'Customer', avatar: '' }] };
    case 'faq':
      return { type, id, heading: 'Frequently Asked Questions', subtitle: '', items: [{ question: 'What is this?', answer: 'This is a sample FAQ item.' }] };
    case 'cta':
      return { type, id, title: 'Ready to Get Started?', subtitle: 'Join us today', buttonText: 'Sign Up', buttonLink: '#', variant: 'default' };
  }
}
