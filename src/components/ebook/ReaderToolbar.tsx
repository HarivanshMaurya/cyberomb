import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  BookOpen,
  X,
  Bookmark,
  BookmarkCheck,
  Moon,
  Sun,
  Minus,
  Plus,
  List,
  Type,
  Maximize,
  Minimize,
} from "lucide-react";

interface ReaderToolbarProps {
  bookTitle: string;
  chapterTitle: string;
  onClose: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onOpenToc: () => void;
}

const FONT_SIZES = [14, 16, 18, 20, 22];

export function ReaderToolbar({
  bookTitle,
  chapterTitle,
  onClose,
  darkMode,
  onToggleDarkMode,
  fontSize,
  onFontSizeChange,
  isBookmarked,
  onToggleBookmark,
  onOpenToc,
}: ReaderToolbarProps) {
  const currentIdx = FONT_SIZES.indexOf(fontSize);
  const canDecrease = currentIdx > 0;
  const canIncrease = currentIdx < FONT_SIZES.length - 1;

  return (
    <div
      className="h-12 md:h-14 flex items-center justify-between px-3 md:px-6 border-b"
      style={{
        borderColor: darkMode ? "hsl(0 0% 25%)" : "hsl(var(--border))",
        background: darkMode ? "hsl(0 0% 12%)" : "hsl(var(--card))",
      }}
    >
      {/* Left: back + title */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 shrink-0"
          style={{ color: darkMode ? "hsl(36 44% 90%)" : undefined }}
        >
          <X className="w-4 h-4" />
        </Button>
        <BookOpen className="w-4 h-4 shrink-0" style={{ color: darkMode ? "hsl(36 44% 70%)" : "hsl(var(--primary))" }} />
        <span
          className="font-serif font-semibold text-sm truncate"
          style={{ color: darkMode ? "hsl(36 44% 90%)" : "hsl(var(--foreground))" }}
        >
          {bookTitle}
        </span>
        <span
          className="text-xs truncate hidden sm:block"
          style={{ color: darkMode ? "hsl(0 0% 55%)" : "hsl(var(--muted-foreground))" }}
        >
          — {chapterTitle}
        </span>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        {/* Chapter TOC */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenToc}
          className="h-8 w-8"
          title="Table of Contents"
          style={{ color: darkMode ? "hsl(36 44% 80%)" : undefined }}
        >
          <List className="w-4 h-4" />
        </Button>

        {/* Bookmark */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleBookmark}
          className="h-8 w-8"
          title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          style={{ color: isBookmarked ? "hsl(45 90% 55%)" : darkMode ? "hsl(36 44% 80%)" : undefined }}
        >
          {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </Button>

        {/* Font size */}
        <div className="hidden sm:flex items-center gap-0.5 px-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => canDecrease && onFontSizeChange(FONT_SIZES[currentIdx - 1])}
            disabled={!canDecrease}
            style={{ color: darkMode ? "hsl(36 44% 80%)" : undefined }}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Type className="w-3.5 h-3.5" style={{ color: darkMode ? "hsl(36 44% 70%)" : "hsl(var(--muted-foreground))" }} />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => canIncrease && onFontSizeChange(FONT_SIZES[currentIdx + 1])}
            disabled={!canIncrease}
            style={{ color: darkMode ? "hsl(36 44% 80%)" : undefined }}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {/* Dark mode */}
        <div className="flex items-center gap-1.5">
          {darkMode ? (
            <Moon className="w-3.5 h-3.5" style={{ color: "hsl(36 44% 70%)" }} />
          ) : (
            <Sun className="w-3.5 h-3.5 text-muted-foreground" />
          )}
          <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} className="scale-75" />
        </div>
      </div>
    </div>
  );
}
