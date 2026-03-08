import { PageBlock, HeroBlock, RichTextBlock, TextImageBlock, FeatureCardsBlock, ImageGalleryBlock, TestimonialsBlock, FAQBlock, CTABlock, BlockStyleSettings, BlockAnimation, BlockWidth, BlockBorderStyle, BlockShadow, DEFAULT_STYLE } from './types';
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

const ANIMATION_OPTIONS: { value: BlockAnimation; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'fade-in', label: 'Fade In' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'slide-left', label: 'Slide from Left' },
  { value: 'slide-right', label: 'Slide from Right' },
  { value: 'scale-in', label: 'Scale In' },
  { value: 'zoom-in', label: 'Zoom In' },
];

const BG_PRESETS = [
  { value: '', label: 'Default', color: '' },
  { value: '#ffffff', label: 'White', color: '#ffffff' },
  { value: '#f8f9fa', label: 'Light Gray', color: '#f8f9fa' },
  { value: '#f1f5f9', label: 'Slate 100', color: '#f1f5f9' },
  { value: '#fef3c7', label: 'Warm Yellow', color: '#fef3c7' },
  { value: '#ecfdf5', label: 'Mint', color: '#ecfdf5' },
  { value: '#eff6ff', label: 'Sky Blue', color: '#eff6ff' },
  { value: '#fdf2f8', label: 'Pink', color: '#fdf2f8' },
  { value: '#1e293b', label: 'Dark Slate', color: '#1e293b' },
  { value: '#0f172a', label: 'Dark Navy', color: '#0f172a' },
  { value: '#18181b', label: 'Near Black', color: '#18181b' },
];

function StyleSettingsEditor({ style, onChange }: { style: BlockStyleSettings; onChange: (s: BlockStyleSettings) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-4 border border-border rounded-lg">
      <CollapsibleTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="w-full justify-between gap-2 px-3 py-2">
          <span className="flex items-center gap-2 text-sm font-medium"><Settings2 className="h-4 w-4" />Style Settings</span>
          <span className="text-xs text-muted-foreground">{open ? '▲' : '▼'}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3 space-y-4">
        {/* Background Color */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Background Color</p>
          <div className="flex flex-wrap gap-2">
            {BG_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                className={`w-7 h-7 rounded-full border-2 transition-all ${style.backgroundColor === preset.value ? 'border-primary scale-110 ring-2 ring-primary/30' : 'border-border hover:border-foreground/40'}`}
                style={{ backgroundColor: preset.color || 'transparent', backgroundImage: !preset.color ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)' : undefined, backgroundSize: !preset.color ? '8px 8px' : undefined, backgroundPosition: !preset.color ? '0 0, 4px 4px' : undefined }}
                onClick={() => onChange({ ...style, backgroundColor: preset.value })}
                title={preset.label}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs shrink-0">Custom:</Label>
            <input
              type="color"
              value={style.backgroundColor || '#ffffff'}
              onChange={(e) => onChange({ ...style, backgroundColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border border-border"
            />
            <Input
              value={style.backgroundColor || ''}
              onChange={(e) => onChange({ ...style, backgroundColor: e.target.value })}
              placeholder="e.g. #ff5500"
              className="h-8 text-xs flex-1"
            />
          </div>
        </div>

        {/* Spacing */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Spacing (px)</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Padding Top: {style.spacing.paddingTop}px</Label>
              <Slider min={0} max={120} step={4} value={[style.spacing.paddingTop]} onValueChange={([v]) => onChange({ ...style, spacing: { ...style.spacing, paddingTop: v } })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Padding Bottom: {style.spacing.paddingBottom}px</Label>
              <Slider min={0} max={120} step={4} value={[style.spacing.paddingBottom]} onValueChange={([v]) => onChange({ ...style, spacing: { ...style.spacing, paddingBottom: v } })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Margin Top: {style.spacing.marginTop}px</Label>
              <Slider min={0} max={120} step={4} value={[style.spacing.marginTop]} onValueChange={([v]) => onChange({ ...style, spacing: { ...style.spacing, marginTop: v } })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Margin Bottom: {style.spacing.marginBottom}px</Label>
              <Slider min={0} max={120} step={4} value={[style.spacing.marginBottom]} onValueChange={([v]) => onChange({ ...style, spacing: { ...style.spacing, marginBottom: v } })} />
            </div>
          </div>
        </div>

        {/* Width */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Block Width</p>
          <Select value={style.width || 'full'} onValueChange={(v) => onChange({ ...style, width: v as BlockWidth })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Width</SelectItem>
              <SelectItem value="contained">Contained (max-w-6xl)</SelectItem>
              <SelectItem value="narrow">Narrow (max-w-3xl)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Border */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Border</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Style</Label>
              <Select value={style.borderStyle || 'none'} onValueChange={(v) => onChange({ ...style, borderStyle: v as BlockBorderStyle })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Width: {style.borderWidth || 0}px</Label>
              <Slider min={0} max={8} step={1} value={[style.borderWidth || 0]} onValueChange={([v]) => onChange({ ...style, borderWidth: v })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Label className="text-xs shrink-0">Color:</Label>
              <input type="color" value={style.borderColor || '#e2e8f0'} onChange={(e) => onChange({ ...style, borderColor: e.target.value })} className="w-7 h-7 rounded cursor-pointer border border-border" />
              <Input value={style.borderColor || ''} onChange={(e) => onChange({ ...style, borderColor: e.target.value })} placeholder="#e2e8f0" className="h-8 text-xs flex-1" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Radius: {style.borderRadius || 0}px</Label>
              <Slider min={0} max={32} step={2} value={[style.borderRadius || 0]} onValueChange={([v]) => onChange({ ...style, borderRadius: v })} />
            </div>
          </div>
        </div>

        {/* Shadow */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Shadow</p>
          <Select value={style.shadow || 'none'} onValueChange={(v) => onChange({ ...style, shadow: v as BlockShadow })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Animation */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Animation</p>
          <Select value={style.animation} onValueChange={(v) => onChange({ ...style, animation: v as BlockAnimation })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ANIMATION_OPTIONS.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function BlockEditor({ block, onChange }: BlockEditorProps) {
  const style = block.style || DEFAULT_STYLE;
  const updateStyle = (s: BlockStyleSettings) => onChange({ ...block, style: s } as PageBlock);

  const renderEditor = () => {
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
  };

  return (
    <div>
      {renderEditor()}
      <StyleSettingsEditor style={style} onChange={updateStyle} />
    </div>
  );
}
