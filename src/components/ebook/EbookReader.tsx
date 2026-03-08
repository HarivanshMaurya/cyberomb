import { useState, useCallback, useEffect, useRef } from "react";
import { BookPage, useBookPagination } from "./useBookPagination";
import { BookPageView } from "./BookPageView";
import { ReaderToolbar } from "./ReaderToolbar";
import { ChapterTocPanel } from "./ChapterTocPanel";
import { BookmarksPanel, BookmarkEntry } from "./BookmarksPanel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, Bookmark } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Chapter {
  title: string;
  content: string;
}

interface EbookReaderProps {
  chapters: Chapter[];
  bookTitle: string;
  bookSlug?: string;
  onClose: () => void;
}

function getStorageKey(slug: string, key: string) {
  return `ebook_${slug}_${key}`;
}

export function EbookReader({ chapters, bookTitle, bookSlug = "default", onClose }: EbookReaderProps) {
  const isMobile = useIsMobile();

  // Persisted preferences
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem(getStorageKey(bookSlug, "dark")) === "true"; } catch { return false; }
  });
  const [fontSize, setFontSize] = useState(() => {
    try { return parseInt(localStorage.getItem(getStorageKey(bookSlug, "fontSize")) || "16") || 16; } catch { return 16; }
  });
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(getStorageKey(bookSlug, "bookmarks")) || "[]"); } catch { return []; }
  });

  const pages = useBookPagination(chapters, fontSize);
  const pagesPerSpread = isMobile ? 1 : 2;
  const totalSpreads = Math.ceil(pages.length / pagesPerSpread);

  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const [showToc, setShowToc] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Sync fullscreen state on external exit (Esc key)
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Persist preferences
  useEffect(() => {
    try { localStorage.setItem(getStorageKey(bookSlug, "dark"), String(darkMode)); } catch {}
  }, [darkMode, bookSlug]);
  useEffect(() => {
    try { localStorage.setItem(getStorageKey(bookSlug, "fontSize"), String(fontSize)); } catch {}
  }, [fontSize, bookSlug]);
  useEffect(() => {
    try { localStorage.setItem(getStorageKey(bookSlug, "bookmarks"), JSON.stringify(bookmarks)); } catch {}
  }, [bookmarks, bookSlug]);

  // Clamp spread when pages change (font size change)
  useEffect(() => {
    if (currentSpread >= totalSpreads && totalSpreads > 0) {
      setCurrentSpread(totalSpreads - 1);
    }
  }, [totalSpreads, currentSpread]);

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
    }, 500);
  }, [currentSpread, totalSpreads, isFlipping]);

  const goPrev = useCallback(() => {
    if (currentSpread <= 0 || isFlipping) return;
    setFlipDirection("prev");
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpread((s) => s - 1);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 500);
  }, [currentSpread, isFlipping]);

  const jumpToPage = useCallback((pageNumber: number) => {
    const spreadIdx = Math.floor((pageNumber - 1) / pagesPerSpread);
    setCurrentSpread(Math.min(spreadIdx, totalSpreads - 1));
  }, [pagesPerSpread, totalSpreads]);

  const jumpToChapter = useCallback((chapterIndex: number) => {
    const page = pages.find((p) => p.chapterIndex === chapterIndex && p.isChapterStart);
    if (page) jumpToPage(page.pageNumber);
  }, [pages, jumpToPage]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose]);

  // Touch
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
  };

  // Bookmarks
  const currentLeftPage = getSpreadPages(currentSpread)[0];
  const currentPageNum = currentLeftPage?.pageNumber ?? 1;
  const isBookmarked = bookmarks.some((b) => b.pageNumber === currentPageNum);

  const toggleBookmark = () => {
    if (isBookmarked) {
      setBookmarks((prev) => prev.filter((b) => b.pageNumber !== currentPageNum));
    } else {
      setBookmarks((prev) => [
        ...prev,
        { pageNumber: currentPageNum, chapterTitle: currentLeftPage?.chapterTitle || "", timestamp: Date.now() },
      ]);
    }
  };

  const [leftPage, rightPage] = getSpreadPages(currentSpread);

  const readerBg = darkMode ? "hsl(0 0% 8%)" : "hsl(var(--background))";
  const navBg = darkMode ? "hsl(0 0% 12%)" : "hsl(var(--card))";
  const navBorder = darkMode ? "hsl(0 0% 22%)" : "hsl(var(--border))";
  const navText = darkMode ? "hsl(0 0% 55%)" : "hsl(var(--muted-foreground))";
  const primaryBar = darkMode ? "hsl(36 44% 70%)" : "hsl(var(--primary))";
  const spineShadow = darkMode ? "hsl(0 0% 0% / 0.25)" : "hsl(var(--shadow-soft) / 0.15)";

  if (pages.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: readerBg }}>
        <div className="text-center space-y-4">
          <BookOpen className="w-16 h-16 mx-auto" style={{ color: navText }} />
          <h2 className="text-xl font-serif font-bold" style={{ color: darkMode ? "hsl(36 44% 90%)" : "hsl(var(--foreground))" }}>
            No content available
          </h2>
          <Button variant="outline" onClick={onClose}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-50" style={{ background: readerBg }}>
      {/* Toolbar */}
      <ReaderToolbar
        bookTitle={bookTitle}
        chapterTitle={leftPage?.chapterTitle || ""}
        onClose={onClose}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        isBookmarked={isBookmarked}
        onToggleBookmark={toggleBookmark}
        onOpenToc={() => setShowToc(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Book container */}
      <div
        className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12"
        style={{ height: "calc(100vh - 3.5rem - 4rem)" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="w-full max-w-5xl h-full max-h-[85vh] flex relative"
          style={{
            perspective: "2500px",
            borderRadius: "4px",
          }}
        >
          {/* Book spine */}
          {!isMobile && (
            <div
              className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 z-10 pointer-events-none"
              style={{
                background: `linear-gradient(to right, ${spineShadow}, ${darkMode ? "hsl(0 0% 0% / 0.35)" : "hsl(var(--shadow-soft) / 0.2)"}, ${spineShadow})`,
              }}
            />
          )}

          {/* Page flip wrapper */}
          <div
            className={`flex w-full h-full ${
              isFlipping && flipDirection === "next"
                ? "ebook-flip-next-3d"
                : isFlipping && flipDirection === "prev"
                  ? "ebook-flip-prev-3d"
                  : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            <BookPageView page={leftPage} totalPages={pages.length} side={isMobile ? "single" : "left"} darkMode={darkMode} fontSize={fontSize} />
            {!isMobile && <BookPageView page={rightPage} totalPages={pages.length} side="right" darkMode={darkMode} fontSize={fontSize} />}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div
        className="fixed bottom-0 inset-x-0 h-16 flex items-center justify-center gap-4 md:gap-6 px-4"
        style={{ background: navBg, borderTop: `1px solid ${navBorder}` }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={goPrev}
          disabled={currentSpread <= 0 || isFlipping}
          className="gap-1.5 rounded-full px-5"
          style={{ borderColor: navBorder, color: darkMode ? "hsl(36 44% 85%)" : undefined }}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Bookmarks quick access (mobile) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:hidden"
          onClick={() => setShowBookmarks(true)}
          style={{ color: bookmarks.length > 0 ? "hsl(45 90% 55%)" : navText }}
        >
          <Bookmark className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-mono" style={{ color: navText }}>
            {currentSpread + 1} / {totalSpreads}
          </span>
          <div
            className="w-24 md:w-40 h-1.5 rounded-full overflow-hidden"
            style={{ background: darkMode ? "hsl(0 0% 20%)" : "hsl(var(--muted))" }}
          >
            <div
              className="h-full rounded-full transition-all duration-400"
              style={{
                width: `${((currentSpread + 1) / totalSpreads) * 100}%`,
                background: primaryBar,
              }}
            />
          </div>
        </div>

        {/* Bookmarks button (desktop) */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:flex gap-1.5"
          onClick={() => setShowBookmarks(true)}
          style={{ color: bookmarks.length > 0 ? "hsl(45 90% 55%)" : navText }}
        >
          <Bookmark className="w-4 h-4" />
          <span className="text-xs">{bookmarks.length}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={goNext}
          disabled={currentSpread >= totalSpreads - 1 || isFlipping}
          className="gap-1.5 rounded-full px-5"
          style={{ borderColor: navBorder, color: darkMode ? "hsl(36 44% 85%)" : undefined }}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* TOC Panel */}
      {showToc && (
        <ChapterTocPanel
          chapters={chapters}
          pages={pages}
          currentPage={currentPageNum}
          onJumpToChapter={jumpToChapter}
          onClose={() => setShowToc(false)}
          darkMode={darkMode}
        />
      )}

      {/* Bookmarks Panel */}
      {showBookmarks && (
        <BookmarksPanel
          bookmarks={bookmarks}
          onJumpToPage={jumpToPage}
          onRemoveBookmark={(pn) => setBookmarks((prev) => prev.filter((b) => b.pageNumber !== pn))}
          onClose={() => setShowBookmarks(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
