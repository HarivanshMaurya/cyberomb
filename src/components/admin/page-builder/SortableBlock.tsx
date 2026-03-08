import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PageBlock, BLOCK_LABELS, BLOCK_ICONS } from './types';
import { BlockEditor } from './BlockEditor';
import { Button } from '@/components/ui/button';
import { GripVertical, ChevronDown, ChevronRight, Trash2, Copy, ClipboardPaste, Clipboard, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableBlockProps {
  block: PageBlock;
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (block: PageBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  hasClipboard: boolean;
}

export function SortableBlock({ block, isExpanded, onToggle, onChange, onDelete, onDuplicate, onCopy, onPaste, onMoveUp, onMoveDown, hasClipboard }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'border border-border rounded-xl bg-card overflow-hidden transition-shadow',
        isDragging && 'shadow-lg ring-2 ring-primary/20',
        isExpanded && 'ring-1 ring-primary/30'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-muted/40 cursor-pointer" onClick={onToggle}>
        <button
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground touch-none"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <span className="text-lg">{BLOCK_ICONS[block.type]}</span>
        <span className="font-medium text-sm flex-1">{BLOCK_LABELS[block.type]}</span>

        {/* Move buttons */}
        {onMoveUp && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onMoveUp(); }} title="Move Up">
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
        )}
        {onMoveDown && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onMoveDown(); }} title="Move Down">
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
        )}

        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onCopy(); }} title="Copy">
          <Clipboard className="h-3.5 w-3.5" />
        </Button>
        {hasClipboard && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onPaste(); }} title="Paste After">
            <ClipboardPaste className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onDuplicate(); }} title="Duplicate">
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }} title="Delete">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>

        {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 border-t border-border">
          <BlockEditor block={block} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
