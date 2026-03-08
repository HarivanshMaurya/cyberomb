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
import { PlusCircle } from 'lucide-react';

interface PageBuilderProps {
  blocks: PageBlock[];
  onChange: (blocks: PageBlock[]) => void;
}

const BLOCK_TYPES: BlockType[] = ['hero', 'richtext', 'text_image', 'feature_cards', 'image_gallery', 'testimonials', 'faq', 'cta'];

export function PageBuilder({ blocks, onChange }: PageBuilderProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

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
  };

  return (
    <div className="space-y-3">
      {blocks.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-muted/20">
          <p className="text-muted-foreground mb-4 text-lg">No blocks added yet</p>
          <p className="text-muted-foreground text-sm mb-6">Click the button below to start building your page</p>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              isExpanded={expandedId === block.id}
              onToggle={() => setExpandedId(expandedId === block.id ? null : block.id)}
              onChange={(updated) => updateBlock(block.id, updated)}
              onDelete={() => deleteBlock(block.id)}
              onDuplicate={() => duplicateBlock(block.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="flex justify-center pt-2">
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
      </div>
    </div>
  );
}
