import { PageBlock, BlockStyleSettings, DEFAULT_STYLE, BlockAnimation } from '@/components/admin/page-builder/types';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// Intersection Observer hook for scroll-triggered animations
function useScrollAnimation(animation: BlockAnimation) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (animation === 'none') { setIsVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); obs.unobserve(el); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [animation]);

  return { ref, isVisible };
}

const ANIMATION_CLASSES: Record<BlockAnimation, { initial: string; visible: string }> = {
  'none': { initial: '', visible: '' },
  'fade-in': { initial: 'opacity-0 translate-y-6', visible: 'opacity-100 translate-y-0' },
  'slide-up': { initial: 'opacity-0 translate-y-12', visible: 'opacity-100 translate-y-0' },
  'slide-left': { initial: 'opacity-0 -translate-x-12', visible: 'opacity-100 translate-x-0' },
  'slide-right': { initial: 'opacity-0 translate-x-12', visible: 'opacity-100 translate-x-0' },
  'scale-in': { initial: 'opacity-0 scale-90', visible: 'opacity-100 scale-100' },
  'zoom-in': { initial: 'opacity-0 scale-75', visible: 'opacity-100 scale-100' },
};

function BlockWrapper({ style, children }: { style?: BlockStyleSettings; children: React.ReactNode }) {
  const s = style || DEFAULT_STYLE;
  const animation = s.animation || 'none';
  const { ref, isVisible } = useScrollAnimation(animation);
  const animClass = ANIMATION_CLASSES[animation];

  const inlineStyle: React.CSSProperties = {
    paddingTop: s.spacing.paddingTop ? `${s.spacing.paddingTop}px` : undefined,
    paddingBottom: s.spacing.paddingBottom ? `${s.spacing.paddingBottom}px` : undefined,
    marginTop: s.spacing.marginTop ? `${s.spacing.marginTop}px` : undefined,
    marginBottom: s.spacing.marginBottom ? `${s.spacing.marginBottom}px` : undefined,
  };

  return (
    <div
      ref={ref}
      style={inlineStyle}
      className={`transition-all duration-700 ease-out ${isVisible ? animClass.visible : animClass.initial}`}
    >
      {children}
    </div>
  );
}

function HeroRenderer({ block }: { block: any }) {
  return (
    <section
      className="relative flex items-center justify-center min-h-[60vh] bg-cover bg-center"
      style={{ backgroundImage: block.image ? `url(${block.image})` : undefined }}
    >
      {block.overlay && <div className="absolute inset-0 bg-foreground/50" />}
      <div className="relative z-10 text-center px-4 py-20 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary-foreground mb-4">{block.title}</h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">{block.subtitle}</p>
        {block.buttonText && (
          <Link to={block.buttonLink || '#'}>
            <Button size="lg" variant="secondary" className="rounded-full px-8">{block.buttonText}</Button>
          </Link>
        )}
      </div>
    </section>
  );
}

function RichTextRenderer({ block }: { block: any }) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: block.content }} />
    </section>
  );
}

function TextImageRenderer({ block }: { block: any }) {
  const isLeft = block.imagePosition === 'left';
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <div className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`}>
        <div className="flex-1">
          {block.image && <img src={block.image} alt={block.imageAlt || ''} className="rounded-2xl w-full object-cover shadow-lg" />}
        </div>
        <div className="flex-1">
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: block.text }} />
        </div>
      </div>
    </section>
  );
}

function FeatureCardsRenderer({ block }: { block: any }) {
  const cols = block.columns === 2 ? 'md:grid-cols-2' : block.columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      {block.heading && <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-3">{block.heading}</h2>}
      {block.subtitle && <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">{block.subtitle}</p>}
      <div className={`grid grid-cols-1 ${cols} gap-6`}>
        {block.cards?.map((card: any, i: number) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 text-center card-hover">
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-muted-foreground text-sm">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ImageGalleryRenderer({ block }: { block: any }) {
  const cols = block.columns === 2 ? 'md:grid-cols-2' : block.columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      {block.heading && <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-10">{block.heading}</h2>}
      <div className={`grid grid-cols-1 ${cols} gap-4`}>
        {block.images?.map((img: any, i: number) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl">
            <img src={img.url} alt={img.alt || ''} className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
            {img.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-foreground/70 to-transparent p-4 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-primary-foreground text-sm">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsRenderer({ block }: { block: any }) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
      {block.heading && <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-10">{block.heading}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {block.testimonials?.map((t: any, i: number) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 card-hover">
            <p className="text-foreground italic mb-4 text-lg leading-relaxed">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              {t.avatar && <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />}
              <div>
                <p className="font-semibold text-sm">{t.author}</p>
                {t.role && <p className="text-muted-foreground text-xs">{t.role}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQRenderer({ block }: { block: any }) {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      {block.heading && <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-3">{block.heading}</h2>}
      {block.subtitle && <p className="text-center text-muted-foreground mb-10">{block.subtitle}</p>}
      <Accordion type="single" collapsible className="space-y-2">
        {block.items?.map((item: any, i: number) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-4 bg-card">
            <AccordionTrigger className="text-left font-medium py-4">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function CTARenderer({ block }: { block: any }) {
  const bgClass = block.variant === 'accent'
    ? 'bg-accent text-accent-foreground'
    : block.variant === 'dark'
      ? 'bg-primary text-primary-foreground'
      : 'bg-muted';

  return (
    <section className={`${bgClass} py-16 md:py-20`}>
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{block.title}</h2>
        <p className="text-lg opacity-80 mb-8">{block.subtitle}</p>
        {block.buttonText && (
          <Link to={block.buttonLink || '#'}>
            <Button size="lg" variant={block.variant === 'dark' ? 'secondary' : 'default'} className="rounded-full px-8">
              {block.buttonText}
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}

interface BlockRendererProps {
  blocks: PageBlock[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div>
      {blocks.map((block) => {
        const content = (() => {
          switch (block.type) {
            case 'hero': return <HeroRenderer block={block} />;
            case 'richtext': return <RichTextRenderer block={block} />;
            case 'text_image': return <TextImageRenderer block={block} />;
            case 'feature_cards': return <FeatureCardsRenderer block={block} />;
            case 'image_gallery': return <ImageGalleryRenderer block={block} />;
            case 'testimonials': return <TestimonialsRenderer block={block} />;
            case 'faq': return <FAQRenderer block={block} />;
            case 'cta': return <CTARenderer block={block} />;
            default: return null;
          }
        })();
        return (
          <BlockWrapper key={block.id} style={block.style}>
            {content}
          </BlockWrapper>
        );
      })}
    </div>
  );
}
