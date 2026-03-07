import { useState, useCallback, useEffect, useRef } from "react";
import { BookPage, useBookPagination } from "./useBookPagination";
import { BookPageView } from "./BookPageView";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, BookOpen } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Chapter {
  title: string;
  content: string;
}

interface EbookReaderProps {
  chapters: Chapter[];
  bookTitle: string;
  onClose: () => void;
}

export function EbookReader({ chapters, bookTitle, onClose }: EbookReaderProps) {
  const pages = useBookPagination(chapters);
  const isMobile = useIsMobile();
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  // Desktop: 2 pages per spread, Mobile: 1 page
  const pagesPerSpread = isMobile ? 1 : 2;
  const totalSpreads = Math.ceil(pages.length / pagesPerSpread);

  const getSpreadPages = useCallback(
    (spreadIndex: number): [BookPage | null, BookPage | null] => {
      const startIdx = spreadIndex * pagesPerSpread;
      const left = pages[startIdx] || null;
      const right = pagesPerSpread === 2 ? pages[startIdx + 1] || null : null;
      return [left, right];
    },
    [pages, pagesPerSpread]
  );

  const goNext = useCallback(() => {
    if (currentSpread >= totalSpreads - 1 || isFlipping) return;
    setFlipDirection("next");
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpread((s) => s + 1);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 400);
  }, [currentSpread, totalSpreads, isFlipping]);

  const goPrev = useCallback(() => {
    if (currentSpread <= 0 || isFlipping) return;
    setFlipDirection("prev");
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpread((s) => s - 1);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 400);
  }, [currentSpread, isFlipping]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose]);

  // Touch/swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const [leftPage, rightPage] = getSpreadPages(currentSpread);

  if (pages.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-serif font-bold text-foreground">No content available</h2>
          <p className="text-muted-foreground">This book doesn't have any chapters yet.</p>
          <Button variant="outline" onClick={onClose}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[hsl(var(--background))]">
      {/* Header bar */}
      <div className="h-12 md:h-14 flex items-center justify-between px-4 md:px-8 border-b border-border bg-[hsl(var(--card))]">
        <div className="flex items-center gap-3 min-w-0">
          <BookOpen className="w-4 h-4 text-primary shrink-0" />
          <span className="font-serif font-semibold text-sm md:text-base text-foreground truncate">{bookTitle}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">
            {leftPage?.chapterTitle || ""}
          </span>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Book container */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12"
        style={{ height: "calc(100vh - 3.5rem)" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="w-full max-w-5xl h-full max-h-[85vh] flex relative"
          style={{
            perspective: "2000px",
            boxShadow: "0 25px 60px -15px hsl(var(--shadow-soft) / 0.25), 0 10px 20px -10px hsl(var(--shadow-soft) / 0.15)",
            borderRadius: "4px",
          }}
        >
          {/* Book spine shadow */}
          {!isMobile && (
            <div
              className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 z-10 pointer-events-none"
              style={{
                background: "linear-gradient(to right, hsl(var(--shadow-soft) / 0.08), hsl(var(--shadow-soft) / 0.15), hsl(var(--shadow-soft) / 0.08))",
              }}
            />
          )}

          {/* Page flip animation wrapper */}
          <div
            className={`flex w-full h-full transition-transform duration-400 ease-in-out ${
              isFlipping && flipDirection === "next"
                ? "ebook-flip-next"
                : isFlipping && flipDirection === "prev"
                  ? "ebook-flip-prev"
                  : ""
            }`}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Left / Single page */}
            <BookPageView
              page={leftPage}
              totalPages={pages.length}
              side={isMobile ? "single" : "left"}
            />

            {/* Right page (desktop only) */}
            {!isMobile && (
              <BookPageView
                page={rightPage}
                totalPages={pages.length}
                side="right"
              />
            )}
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="fixed bottom-0 inset-x-0 h-16 md:h-18 flex items-center justify-center gap-6 bg-[hsl(var(--card))] border-t border-border px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goPrev}
          disabled={currentSpread <= 0 || isFlipping}
          className="gap-1.5 rounded-full px-5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-muted-foreground">
            {currentSpread + 1} / {totalSpreads}
          </span>
          {/* Progress bar */}
          <div className="w-24 md:w-40 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-400"
              style={{ width: `${((currentSpread + 1) / totalSpreads) * 100}%` }}
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={goNext}
          disabled={currentSpread >= totalSpreads - 1 || isFlipping}
          className="gap-1.5 rounded-full px-5"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
