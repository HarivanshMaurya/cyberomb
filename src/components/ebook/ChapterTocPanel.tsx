import { BookPage } from "./useBookPagination";
import { Button } from "@/components/ui/button";
import { X, BookOpen } from "lucide-react";

interface ChapterTocPanelProps {
  chapters: { title: string; content: string }[];
  pages: BookPage[];
  currentPage: number;
  onJumpToChapter: (chapterIndex: number) => void;
  onClose: () => void;
  darkMode: boolean;
}

export function ChapterTocPanel({
  chapters,
  pages,
  currentPage,
  onJumpToChapter,
  onClose,
  darkMode,
}: ChapterTocPanelProps) {
  // Find first page of each chapter
  const chapterPages = chapters.map((_, idx) => {
    const page = pages.find((p) => p.chapterIndex === idx && p.isChapterStart);
    return page?.pageNumber ?? 1;
  });

  const bg = darkMode ? "hsl(0 0% 10%)" : "hsl(var(--background))";
  const fg = darkMode ? "hsl(36 44% 90%)" : "hsl(var(--foreground))";
  const mutedFg = darkMode ? "hsl(0 0% 50%)" : "hsl(var(--muted-foreground))";
  const borderC = darkMode ? "hsl(0 0% 22%)" : "hsl(var(--border))";
  const hoverBg = darkMode ? "hsl(0 0% 16%)" : "hsl(var(--muted))";

  return (
    <div className="fixed inset-0 z-[60] flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative w-80 max-w-[85vw] h-full overflow-y-auto animate-slide-in-right"
        style={{ background: bg, borderRight: `1px solid ${borderC}` }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: borderC }}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: mutedFg }} />
            <h3 className="font-serif font-bold text-sm" style={{ color: fg }}>
              Table of Contents
            </h3>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="w-4 h-4" style={{ color: mutedFg }} />
          </Button>
        </div>

        <div className="p-2">
          {chapters.map((chapter, idx) => {
            const pageNum = chapterPages[idx];
            const isActive = currentPage >= pageNum && (idx === chapters.length - 1 || currentPage < chapterPages[idx + 1]);

            return (
              <button
                key={idx}
                onClick={() => {
                  onJumpToChapter(idx);
                  onClose();
                }}
                className="w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors"
                style={{
                  background: isActive ? hoverBg : "transparent",
                  color: isActive ? fg : mutedFg,
                }}
              >
                <span className="font-serif text-sm truncate pr-2">
                  {idx + 1}. {chapter.title}
                </span>
                <span className="text-xs shrink-0 font-mono opacity-60">p.{pageNum}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
