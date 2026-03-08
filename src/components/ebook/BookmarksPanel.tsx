import { BookPage } from "./useBookPagination";
import { Button } from "@/components/ui/button";
import { X, Bookmark, Trash2 } from "lucide-react";

export interface BookmarkEntry {
  pageNumber: number;
  chapterTitle: string;
  timestamp: number;
}

interface BookmarksPanelProps {
  bookmarks: BookmarkEntry[];
  onJumpToPage: (pageNumber: number) => void;
  onRemoveBookmark: (pageNumber: number) => void;
  onClose: () => void;
  darkMode: boolean;
}

export function BookmarksPanel({
  bookmarks,
  onJumpToPage,
  onRemoveBookmark,
  onClose,
  darkMode,
}: BookmarksPanelProps) {
  const bg = darkMode ? "hsl(0 0% 10%)" : "hsl(var(--background))";
  const fg = darkMode ? "hsl(36 44% 90%)" : "hsl(var(--foreground))";
  const mutedFg = darkMode ? "hsl(0 0% 50%)" : "hsl(var(--muted-foreground))";
  const borderC = darkMode ? "hsl(0 0% 22%)" : "hsl(var(--border))";

  const sorted = [...bookmarks].sort((a, b) => a.pageNumber - b.pageNumber);

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        className="relative w-80 max-w-[85vw] h-full overflow-y-auto animate-slide-in-right"
        style={{ background: bg, borderLeft: `1px solid ${borderC}` }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: borderC }}>
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" style={{ color: "hsl(45 90% 55%)" }} />
            <h3 className="font-serif font-bold text-sm" style={{ color: fg }}>
              Bookmarks
            </h3>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="w-4 h-4" style={{ color: mutedFg }} />
          </Button>
        </div>

        <div className="p-2">
          {sorted.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: mutedFg }}>
              No bookmarks yet. Tap the bookmark icon to save your place.
            </p>
          ) : (
            sorted.map((bm) => (
              <div
                key={bm.pageNumber}
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => {
                  onJumpToPage(bm.pageNumber);
                  onClose();
                }}
              >
                <div className="min-w-0">
                  <p className="text-sm font-serif truncate" style={{ color: fg }}>
                    {bm.chapterTitle}
                  </p>
                  <p className="text-xs font-mono" style={{ color: mutedFg }}>
                    Page {bm.pageNumber}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveBookmark(bm.pageNumber);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" style={{ color: "hsl(0 70% 55%)" }} />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
