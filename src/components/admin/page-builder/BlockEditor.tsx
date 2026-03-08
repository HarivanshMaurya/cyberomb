import { PageBlock, HeroBlock, RichTextBlock, TextImageBlock, FeatureCardsBlock, ImageGalleryBlock, TestimonialsBlock, FAQBlock, CTABlock, BlockStyleSettings, BlockAnimation, DEFAULT_STYLE } from './types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { MediaPicker } from './MediaPicker';
import { Plus, Trash2, Settings2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

interface BlockEditorProps {
  block: PageBlock;
  onChange: (block: PageBlock) => void;
}

function HeroEditor({ block, onChange }: { block: HeroBlock; onChange: (b: HeroBlock) => void }) {
  return (
    <div className="space-y-3">
      <div><Label>Title</Label><Input value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} /></div>
      <div><Label>Subtitle</Label><Input value={block.subtitle} onChange={(e) => onChange({ ...block, subtitle: e.target.value })} /></div>
      <div><Label>Background Image</Label><MediaPicker value={block.image} onChange={(image) => onChange({ ...block, image })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Button Text</Label><Input value={block.buttonText} onChange={(e) => onChange({ ...block, buttonText: e.target.value })} /></div>
        <div><Label>Button Link</Label><Input value={block.buttonLink} onChange={(e) => onChange({ ...block, buttonLink: e.target.value })} /></div>
      </div>
      <div className="flex items-center gap-2"><Switch checked={block.overlay} onCheckedChange={(c) => onChange({ ...block, overlay: c })} /><Label>Dark Overlay</Label></div>
    </div>
  );
}

function RichTextBlockEditor({ block, onChange }: { block: RichTextBlock; onChange: (b: RichTextBlock) => void }) {
  return <RichTextEditor content={block.content} onChange={(content) => onChange({ ...block, content })} />;
}

function TextImageEditor({ block, onChange }: { block: TextImageBlock; onChange: (b: TextImageBlock) => void }) {
  return (
    <div className="space-y-3">
      <div><Label>Image</Label><MediaPicker value={block.image} onChange={(image) => onChange({ ...block, image })} /></div>
      <div><Label>Image Alt Text</Label><Input value={block.imageAlt} onChange={(e) => onChange({ ...block, imageAlt: e.target.value })} /></div>
      <div>
        <Label>Image Position</Label>
        <Select value={block.imagePosition} onValueChange={(v) => onChange({ ...block, imagePosition: v as 'left' | 'right' })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div><Label>Text Content</Label><RichTextEditor content={block.text} onChange={(text) => onChange({ ...block, text })} /></div>
    </div>
  );
}

function FeatureCardsEditor({ block, onChange }: { block: FeatureCardsBlock; onChange: (b: FeatureCardsBlock) => void }) {
  const updateCard = (idx: number, field: string, value: string) => {
    const cards = [...block.cards];
    cards[idx] = { ...cards[idx], [field]: value };
    onChange({ ...block, cards });
  };
  return (
    <div className="space-y-3">
      <div><Label>Section Heading</Label><Input value={block.heading} onChange={(e) => onChange({ ...block, heading: e.target.value })} /></div>
      <div><Label>Subtitle</Label><Input value={block.subtitle} onChange={(e) => onChange({ ...block, subtitle: e.target.value })} /></div>
      <div>
        <Label>Columns</Label>
        <Select value={String(block.columns)} onValueChange={(v) => onChange({ ...block, columns: Number(v) as 2 | 3 | 4 })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {block.cards.map((card, i) => (
        <div key={i} className="border border-border rounded-lg p-3 space-y-2 bg-muted/30">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Card {i + 1}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onChange({ ...block, cards: block.cards.filter((_, j) => j !== i) })}><Trash2 className="h-3.5 w-3.5" /></Button>
          </div>
          <Input value={card.icon} onChange={(e) => updateCard(i, 'icon', e.target.value)} placeholder="Icon (emoji or text)" />
          <Input value={card.title} onChange={(e) => updateCard(i, 'title', e.target.value)} placeholder="Title" />
          <Textarea value={card.description} onChange={(e) => updateCard(i, 'description', e.target.value)} placeholder="Description" rows={2} />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange({ ...block, cards: [...block.cards, { icon: '✨', title: 'New Card', description: '' }] })}><Plus className="h-4 w-4 mr-1" />Add Card</Button>
    </div>
  );
}

function ImageGalleryEditor({ block, onChange }: { block: ImageGalleryBlock; onChange: (b: ImageGalleryBlock) => void }) {
  const updateImage = (idx: number, field: string, value: string) => {
    const images = [...block.images];
    images[idx] = { ...images[idx], [field]: value };
    onChange({ ...block, images });
  };
  return (
    <div className="space-y-3">
      <div><Label>Heading</Label><Input value={block.heading} onChange={(e) => onChange({ ...block, heading: e.target.value })} /></div>
      <div>
        <Label>Columns</Label>
        <Select value={String(block.columns)} onValueChange={(v) => onChange({ ...block, columns: Number(v) as 2 | 3 | 4 })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem><SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {block.images.map((img, i) => (
        <div key={i} className="border border-border rounded-lg p-3 space-y-2 bg-muted/30">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Image {i + 1}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onChange({ ...block, images: block.images.filter((_, j) => j !== i) })}><Trash2 className="h-3.5 w-3.5" /></Button>
          </div>
          <Label className="text-xs">Image</Label>
          <MediaPicker value={img.url} onChange={(url) => updateImage(i, 'url', url)} />
          <Input value={img.alt} onChange={(e) => updateImage(i, 'alt', e.target.value)} placeholder="Alt text" />
          <Input value={img.caption} onChange={(e) => updateImage(i, 'caption', e.target.value)} placeholder="Caption (optional)" />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange({ ...block, images: [...block.images, { url: '', alt: '', caption: '' }] })}><Plus className="h-4 w-4 mr-1" />Add Image</Button>
    </div>
  );
}

function TestimonialsEditor({ block, onChange }: { block: TestimonialsBlock; onChange: (b: TestimonialsBlock) => void }) {
  const updateTestimonial = (idx: number, field: string, value: string) => {
    const testimonials = [...block.testimonials];
    testimonials[idx] = { ...testimonials[idx], [field]: value };
    onChange({ ...block, testimonials });
  };
  return (
    <div className="space-y-3">
      <div><Label>Heading</Label><Input value={block.heading} onChange={(e) => onChange({ ...block, heading: e.target.value })} /></div>
      {block.testimonials.map((t, i) => (
        <div key={i} className="border border-border rounded-lg p-3 space-y-2 bg-muted/30">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Testimonial {i + 1}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onChange({ ...block, testimonials: block.testimonials.filter((_, j) => j !== i) })}><Trash2 className="h-3.5 w-3.5" /></Button>
          </div>
          <Textarea value={t.quote} onChange={(e) => updateTestimonial(i, 'quote', e.target.value)} placeholder="Quote" rows={2} />
          <div className="grid grid-cols-2 gap-2">
            <Input value={t.author} onChange={(e) => updateTestimonial(i, 'author', e.target.value)} placeholder="Author name" />
            <Input value={t.role} onChange={(e) => updateTestimonial(i, 'role', e.target.value)} placeholder="Role / Company" />
          </div>
          <Label className="text-xs">Avatar</Label>
          <MediaPicker value={t.avatar} onChange={(avatar) => updateTestimonial(i, 'avatar', avatar)} />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange({ ...block, testimonials: [...block.testimonials, { quote: '', author: '', role: '', avatar: '' }] })}><Plus className="h-4 w-4 mr-1" />Add Testimonial</Button>
    </div>
  );
}

function FAQEditor({ block, onChange }: { block: FAQBlock; onChange: (b: FAQBlock) => void }) {
  const updateItem = (idx: number, field: string, value: string) => {
    const items = [...block.items];
    items[idx] = { ...items[idx], [field]: value };
    onChange({ ...block, items });
  };
  return (
    <div className="space-y-3">
      <div><Label>Heading</Label><Input value={block.heading} onChange={(e) => onChange({ ...block, heading: e.target.value })} /></div>
      <div><Label>Subtitle</Label><Input value={block.subtitle} onChange={(e) => onChange({ ...block, subtitle: e.target.value })} /></div>
      {block.items.map((item, i) => (
        <div key={i} className="border border-border rounded-lg p-3 space-y-2 bg-muted/30">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Q&A {i + 1}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onChange({ ...block, items: block.items.filter((_, j) => j !== i) })}><Trash2 className="h-3.5 w-3.5" /></Button>
          </div>
          <Input value={item.question} onChange={(e) => updateItem(i, 'question', e.target.value)} placeholder="Question" />
          <Textarea value={item.answer} onChange={(e) => updateItem(i, 'answer', e.target.value)} placeholder="Answer" rows={3} />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange({ ...block, items: [...block.items, { question: '', answer: '' }] })}><Plus className="h-4 w-4 mr-1" />Add FAQ</Button>
    </div>
  );
}

function CTAEditor({ block, onChange }: { block: CTABlock; onChange: (b: CTABlock) => void }) {
  return (
    <div className="space-y-3">
      <div><Label>Title</Label><Input value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} /></div>
      <div><Label>Subtitle</Label><Input value={block.subtitle} onChange={(e) => onChange({ ...block, subtitle: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Button Text</Label><Input value={block.buttonText} onChange={(e) => onChange({ ...block, buttonText: e.target.value })} /></div>
        <div><Label>Button Link</Label><Input value={block.buttonLink} onChange={(e) => onChange({ ...block, buttonLink: e.target.value })} /></div>
      </div>
      <div>
        <Label>Style Variant</Label>
        <Select value={block.variant} onValueChange={(v) => onChange({ ...block, variant: v as CTABlock['variant'] })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="accent">Accent</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function BlockEditor({ block, onChange }: BlockEditorProps) {
  switch (block.type) {
    case 'hero': return <HeroEditor block={block} onChange={(b) => onChange(b)} />;
    case 'richtext': return <RichTextBlockEditor block={block} onChange={(b) => onChange(b)} />;
    case 'text_image': return <TextImageEditor block={block} onChange={(b) => onChange(b)} />;
    case 'feature_cards': return <FeatureCardsEditor block={block} onChange={(b) => onChange(b)} />;
    case 'image_gallery': return <ImageGalleryEditor block={block} onChange={(b) => onChange(b)} />;
    case 'testimonials': return <TestimonialsEditor block={block} onChange={(b) => onChange(b)} />;
    case 'faq': return <FAQEditor block={block} onChange={(b) => onChange(b)} />;
    case 'cta': return <CTAEditor block={block} onChange={(b) => onChange(b)} />;
  }
}
