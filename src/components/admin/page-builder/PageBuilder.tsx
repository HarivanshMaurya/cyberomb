import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableBlock } from './SortableBlock';
import { PageBlock, BlockType, BLOCK_LABELS, BLOCK_ICONS, createDefaultBlock } from './types';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PlusCircle, ClipboardPaste, LayoutTemplate } from 'lucide-react';
import { PAGE_TEMPLATES } from './templates';
import { toast } from 'sonner';

interface PageBuilderProps {
  blocks: PageBlock[];
  onChange: (blocks: PageBlock[]) => void;
}

const BLOCK_TYPES: BlockType[] = ['hero', 'richtext', 'text_image', 'feature_cards', 'image_gallery', 'testimonials', 'faq', 'cta'];

export function PageBuilder({ blocks, onChange }: PageBuilderProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [clipboard, setClipboard] = useState<PageBlock | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      onChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const addBlock = (type: BlockType) => {
    const newBlock = createDefaultBlock(type);
    onChange([...blocks, newBlock]);
    setExpandedId(newBlock.id);
    setAddMenuOpen(false);
  };

  const updateBlock = (id: string, updated: PageBlock) => {
    onChange(blocks.map((b) => (b.id === id ? updated : b)));
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const duplicateBlock = (id: string) => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const clone = { ...JSON.parse(JSON.stringify(blocks[idx])), id: crypto.randomUUID() };
    const newBlocks = [...blocks];
    newBlocks.splice(idx + 1, 0, clone);
    onChange(newBlocks);
    setExpandedId(clone.id);
    toast.success('Block duplicated');
  };

  const copyBlock = (id: string) => {
    const block = blocks.find((b) => b.id === id);
    if (block) {
      setClipboard(JSON.parse(JSON.stringify(block)));
      toast.success('Block copied to clipboard');
    }
  };

  const pasteBlock = (afterId?: string) => {
    if (!clipboard) { toast.error('Nothing to paste'); return; }
    const pasted = { ...JSON.parse(JSON.stringify(clipboard)), id: crypto.randomUUID() };
    if (afterId) {
      const idx = blocks.findIndex((b) => b.id === afterId);
      const newBlocks = [...blocks];
      newBlocks.splice(idx + 1, 0, pasted);
      onChange(newBlocks);
    } else {
      onChange([...blocks, pasted]);
    }
    setExpandedId(pasted.id);
    toast.success('Block pasted');
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= blocks.length) return;
    onChange(arrayMove(blocks, idx, newIdx));
  };

  return (
    <div className="space-y-3">
      {blocks.length === 0 && (
        <div className="space-y-6">
          <div className="text-center py-8 border-2 border-dashed border-border rounded-xl bg-muted/20">
            <p className="text-muted-foreground mb-2 text-lg">No blocks added yet</p>
            <p className="text-muted-foreground text-sm">Start from a template or add blocks manually</p>
          </div>
          {/* Template picker */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><LayoutTemplate className="h-4 w-4" />Quick Start Templates</p>
            <div className="grid grid-cols-2 gap-3">
              {PAGE_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.name}
                  type="button"
                  className="text-left border border-border rounded-xl p-4 hover:bg-accent/50 hover:border-primary/30 transition-all group"
                  onClick={() => {
                    // Deep clone to get fresh IDs
                    const fresh = JSON.parse(JSON.stringify(tpl.blocks)).map((b: any) => ({ ...b, id: crypto.randomUUID() }));
                    onChange(fresh);
                    toast.success(`"${tpl.name}" template loaded`);
                  }}
                >
                  <div className="text-2xl mb-2">{tpl.icon}</div>
                  <p className="font-medium text-sm">{tpl.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tpl.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block, index) => (
            <SortableBlock
              key={block.id}
              block={block}
              isExpanded={expandedId === block.id}
              onToggle={() => setExpandedId(expandedId === block.id ? null : block.id)}
              onChange={(updated) => updateBlock(block.id, updated)}
              onDelete={() => deleteBlock(block.id)}
              onDuplicate={() => duplicateBlock(block.id)}
              onCopy={() => copyBlock(block.id)}
              onPaste={() => pasteBlock(block.id)}
              onMoveUp={index > 0 ? () => moveBlock(block.id, 'up') : undefined}
              onMoveDown={index < blocks.length - 1 ? () => moveBlock(block.id, 'down') : undefined}
              hasClipboard={!!clipboard}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="flex justify-center gap-2 pt-2">
        <Popover open={addMenuOpen} onOpenChange={setAddMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 rounded-full px-6">
              <PlusCircle className="h-4 w-4" />
              Add Block
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="center">
            <div className="grid grid-cols-2 gap-1">
              {BLOCK_TYPES.map((type) => (
                <button
                  key={type}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-accent transition-colors"
                  onClick={() => addBlock(type)}
                >
                  <span className="text-lg">{BLOCK_ICONS[type]}</span>
                  <span>{BLOCK_LABELS[type]}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {clipboard && (
          <Button variant="outline" className="gap-2 rounded-full px-6" onClick={() => pasteBlock()}>
            <ClipboardPaste className="h-4 w-4" />
            Paste Block
          </Button>
        )}
      </div>
    </div>
  );
}
