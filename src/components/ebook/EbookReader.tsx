import { useState, useCallback, useEffect, useRef } from "react";
import { BookPage, useBookPagination } from "./useBookPagination";
import { BookPageView } from "./BookPageView";
import { BookCover } from "./BookCover";
import { ReaderToolbar } from "./ReaderToolbar";
import { ChapterTocPanel } from "./ChapterTocPanel";
import { BookmarksPanel, BookmarkEntry } from "./BookmarksPanel";
import { useTextToSpeech } from "./TextToSpeech";
import { useReadingAnalytics } from "@/hooks/useReadingAnalytics";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, Bookmark } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Chapter {
  title: string;
  content: string;
}

interface EbookReaderProps {
  chapters: Chapter[];
  bookTitle: string;
  bookSlug?: string;
  productId?: string;
  coverImage?: string | null;
  userEmail?: string | null;
  onClose: () => void;
}

function getStorageKey(slug: string, key: string) {
  return `ebook_${slug}_${key}`;
}

// Easing function: cubic ease-in-out
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function EbookReader({ chapters, bookTitle, bookSlug = "default", productId, coverImage, userEmail, onClose }: EbookReaderProps) {
  const isMobile = useIsMobile();
  const [showCover, setShowCover] = useState(true);
  const [isTranslated, setIsTranslated] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedChapters, setTranslatedChapters] = useState<Chapter[] | null>(null);
  const activeChapters = isTranslated && translatedChapters ? translatedChapters : chapters;

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

  const pages = useBookPagination(activeChapters, fontSize);
  const pagesPerSpread = isMobile ? 1 : 2;
  const totalSpreads = Math.ceil(pages.length / pagesPerSpread);

  // Reading analytics
  const { saveProgress, getResumePage } = useReadingAnalytics(bookSlug, productId);

  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const [flipProgress, setFlipProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const [prevSpreadIdx, setPrevSpreadIdx] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasResumed, setHasResumed] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setInterval>>();
  const animFrameRef = useRef<number>(0);

  // TTS
  const tts = useTextToSpeech();

  // Resume reading position
  useEffect(() => {
    if (hasResumed || pages.length === 0) return;
    const resumePage = getResumePage();
    if (resumePage > 1) {
      const spreadIdx = Math.floor((resumePage - 1) / pagesPerSpread);
      setCurrentSpread(Math.min(spreadIdx, totalSpreads - 1));
    }
    setHasResumed(true);
  }, [pages, hasResumed, getResumePage, pagesPerSpread, totalSpreads]);

  // Content protection
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && (e.key === "p" || e.key === "s" || e.key === "c" || e.key === "u")) ||
        (e.metaKey && (e.key === "p" || e.key === "s" || e.key === "c" || e.key === "u"))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, []);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

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

  // Auto-save progress
  useEffect(() => {
    saveTimerRef.current = setInterval(() => {
      const leftPage = getSpreadPages(currentSpread)[0];
      if (leftPage) saveProgress(leftPage.pageNumber, pages.length);
    }, 30000);
    return () => { if (saveTimerRef.current) clearInterval(saveTimerRef.current); };
  }, [currentSpread, pages.length]);

  useEffect(() => {
    const leftPage = getSpreadPages(currentSpread)[0];
    if (leftPage) saveProgress(leftPage.pageNumber, pages.length);
  }, [currentSpread]);

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

  const FLIP_DURATION = 650;

  // Animate flip from a given starting progress to 1
  const animateFlip = useCallback((direction: "next" | "prev", fromProgress = 0) => {
    setFlipDirection(direction);
    setIsFlipping(true);
    const startProgress = fromProgress;
    const start = performance.now();
    const remaining = (1 - startProgress) * FLIP_DURATION;

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / remaining, 1);
      const eased = easeInOutCubic(t);
      const progress = startProgress + (1 - startProgress) * eased;
      setFlipProgress(progress);
      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentSpread((s) => direction === "next" ? s + 1 : s - 1);
        setIsFlipping(false);
        setFlipDirection(null);
        setFlipProgress(0);
        setIsDragging(false);
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);
  }, [FLIP_DURATION]);

  // Animate snap-back (from current progress to 0)
  const animateSnapBack = useCallback(() => {
    const startProgress = flipProgress;
    const start = performance.now();
    const duration = startProgress * 300; // fast snap back

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / Math.max(duration, 50), 1);
      const eased = easeInOutCubic(t);
      setFlipProgress(startProgress * (1 - eased));
      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsFlipping(false);
        setFlipDirection(null);
        setFlipProgress(0);
        setIsDragging(false);
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);
  }, [flipProgress]);

  const goNext = useCallback(() => {
    if (currentSpread >= totalSpreads - 1 || isFlipping) return;
    setPrevSpreadIdx(currentSpread);
    animateFlip("next", 0);
  }, [currentSpread, totalSpreads, isFlipping, animateFlip]);

  const goPrev = useCallback(() => {
    if (currentSpread <= 0 || isFlipping) return;
    setPrevSpreadIdx(currentSpread);
    animateFlip("prev", 0);
  }, [currentSpread, isFlipping, animateFlip]);

  const jumpToPage = useCallback((pageNumber: number) => {
    const spreadIdx = Math.floor((pageNumber - 1) / pagesPerSpread);
    setCurrentSpread(Math.min(spreadIdx, totalSpreads - 1));
  }, [pagesPerSpread, totalSpreads]);

  const jumpToChapter = useCallback((chapterIndex: number) => {
    const page = pages.find((p) => p.chapterIndex === chapterIndex && p.isChapterStart);
    if (page) jumpToPage(page.pageNumber);
  }, [pages, jumpToPage]);

  // Keyboard navigation
  useEffect(() => {
    if (showCover) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose, showCover]);

  // ===== DRAG-TO-FLIP (mouse) =====
  const handleDragStart = useCallback((e: React.MouseEvent, side: "left" | "right") => {
    if (isFlipping && !isDragging) return;
    const rect = bookRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX;
    const relX = x - rect.left;
    const cornerZone = isMobile ? rect.width * 0.25 : rect.width * 0.12;

    // Check if clicking in corner zone
    const isRightCorner = relX > rect.width - cornerZone;
    const isLeftCorner = relX < cornerZone;

    if (isRightCorner && currentSpread < totalSpreads - 1) {
      setPrevSpreadIdx(currentSpread);
      setFlipDirection("next");
      setIsFlipping(true);
      setIsDragging(true);
      setDragStartX(x);
      setDragCurrentX(x);
      setFlipProgress(0);
    } else if (isLeftCorner && currentSpread > 0) {
      setPrevSpreadIdx(currentSpread);
      setFlipDirection("prev");
      setIsFlipping(true);
      setIsDragging(true);
      setDragStartX(x);
      setDragCurrentX(x);
      setFlipProgress(0);
    }
  }, [isFlipping, isDragging, currentSpread, totalSpreads, isMobile]);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !bookRef.current) return;
    e.preventDefault();
    const rect = bookRef.current.getBoundingClientRect();
    const bookWidth = rect.width;
    const halfWidth = isMobile ? bookWidth : bookWidth / 2;
    const dx = e.clientX - dragStartX;

    let progress = 0;
    if (flipDirection === "next") {
      progress = Math.max(0, Math.min(1, -dx / halfWidth));
    } else {
      progress = Math.max(0, Math.min(1, dx / halfWidth));
    }
    setDragCurrentX(e.clientX);
    setFlipProgress(progress);
  }, [isDragging, dragStartX, flipDirection, isMobile]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    // If dragged more than 30%, complete the flip; otherwise snap back
    if (flipProgress > 0.3) {
      animateFlip(flipDirection!, flipProgress);
    } else {
      animateSnapBack();
    }
    setIsDragging(false);
  }, [isDragging, flipProgress, flipDirection, animateFlip, animateSnapBack]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      return () => {
        window.removeEventListener("mousemove", handleDragMove);
        window.removeEventListener("mouseup", handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // ===== TOUCH SWIPE & DRAG =====
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;

    const rect = bookRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = touch.clientX - rect.left;
    const cornerZone = rect.width * 0.25;

    if (relX > rect.width - cornerZone && currentSpread < totalSpreads - 1) {
      setPrevSpreadIdx(currentSpread);
      setFlipDirection("next");
      setIsFlipping(true);
      setIsDragging(true);
      setDragStartX(touch.clientX);
      setFlipProgress(0);
    } else if (relX < cornerZone && currentSpread > 0) {
      setPrevSpreadIdx(currentSpread);
      setFlipDirection("prev");
      setIsFlipping(true);
      setIsDragging(true);
      setDragStartX(touch.clientX);
      setFlipProgress(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !bookRef.current) return;
    const touch = e.touches[0];
    const rect = bookRef.current.getBoundingClientRect();
    const halfWidth = isMobile ? rect.width : rect.width / 2;
    const dx = touch.clientX - dragStartX;

    let progress = 0;
    if (flipDirection === "next") {
      progress = Math.max(0, Math.min(1, -dx / halfWidth));
    } else {
      progress = Math.max(0, Math.min(1, dx / halfWidth));
    }
    setFlipProgress(progress);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isDragging) {
      if (flipProgress > 0.25) {
        animateFlip(flipDirection!, flipProgress);
      } else {
        animateSnapBack();
      }
      setIsDragging(false);
      return;
    }
    // Fallback: simple swipe detection
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
  };

  // Page corner click (non-drag)
  const handlePageClick = (e: React.MouseEvent, side: "left" | "right") => {
    if (isMobile || isDragging) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const cornerZone = rect.width * 0.15;
    if (side === "left" && x < cornerZone) goPrev();
    if (side === "right" && x > rect.width - cornerZone) goNext();
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

  // TTS
  const handleTtsPlay = useCallback(() => {
    const [left, right] = getSpreadPages(currentSpread);
    const text = [left?.content, right?.content].filter(Boolean).join(" ");
    tts.speak(text, () => {
      if (currentSpread < totalSpreads - 1) {
        setCurrentSpread((s) => s + 1);
      }
    });
  }, [currentSpread, getSpreadPages, tts, totalSpreads]);

  const ttsWasPlayingRef = useRef(false);
  useEffect(() => {
    if (tts.isPlaying && !tts.isPaused) {
      ttsWasPlayingRef.current = true;
    }
    if (ttsWasPlayingRef.current && !tts.isPlaying && !tts.isPaused) {
      const timer = setTimeout(() => {
        if (ttsWasPlayingRef.current) {
          const [left, right] = getSpreadPages(currentSpread);
          const text = [left?.content, right?.content].filter(Boolean).join(" ");
          if (text.trim()) {
            tts.speak(text, () => {
              if (currentSpread < totalSpreads - 1) {
                setCurrentSpread((s) => s + 1);
              } else {
                ttsWasPlayingRef.current = false;
              }
            });
          } else {
            ttsWasPlayingRef.current = false;
          }
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentSpread]);

  const handleTtsStop = useCallback(() => {
    ttsWasPlayingRef.current = false;
    tts.stop();
  }, [tts]);

  // Translation handler
  const handleToggleTranslate = useCallback(async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }
    if (translatedChapters) {
      setIsTranslated(true);
      return;
    }
    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-ebook', {
        body: { chapters, targetLang: 'hi' },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setTranslatedChapters(data.chapters);
      setIsTranslated(true);
      toast({ title: 'अनुवाद पूरा हुआ', description: 'पुस्तक हिंदी में अनुवादित हो गई है' });
    } catch (err: any) {
      console.error('Translation error:', err);
      toast({ title: 'Translation Failed', description: err.message || 'Could not translate', variant: 'destructive' });
    } finally {
      setIsTranslating(false);
    }
  }, [isTranslated, translatedChapters, chapters]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, []);

  const [leftPage, rightPage] = getSpreadPages(currentSpread);

  // Pages for flip animation
  const flipFromPages = isFlipping ? getSpreadPages(prevSpreadIdx) : [null, null];
  const flipToPages = isFlipping && flipDirection === "next"
    ? getSpreadPages(prevSpreadIdx + 1)
    : isFlipping && flipDirection === "prev"
      ? getSpreadPages(prevSpreadIdx - 1)
      : [null, null];

  // Reading progress
  const progressPercent = totalSpreads > 1 ? Math.round((currentSpread / (totalSpreads - 1)) * 100) : 100;

  const readerBg = darkMode ? "hsl(0 0% 8%)" : "hsl(var(--background))";
  const navBg = darkMode ? "hsl(0 0% 12%)" : "hsl(var(--card))";
  const navBorder = darkMode ? "hsl(0 0% 22%)" : "hsl(var(--border))";
  const navText = darkMode ? "hsl(0 0% 55%)" : "hsl(var(--muted-foreground))";
  const primaryBar = darkMode ? "hsl(36 44% 70%)" : "hsl(var(--primary))";

  // Book thickness calculations
  const totalBookPages = pages.length;
  const currentPageIndex = currentSpread * pagesPerSpread;
  const leftThickness = Math.max(1, Math.min(8, Math.floor((currentPageIndex / totalBookPages) * 8)));
  const rightThickness = Math.max(1, Math.min(8, Math.floor(((totalBookPages - currentPageIndex) / totalBookPages) * 8)));

  // Page curl amount based on flip progress (peaks at 0.5)
  const curlAmount = Math.sin(flipProgress * Math.PI);
  const shadowIntensity = curlAmount * 0.4;

  if (showCover && pages.length > 0) {
    return <BookCover bookTitle={bookTitle} coverImage={coverImage} onOpen={() => setShowCover(false)} />;
  }

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
    <div ref={containerRef} className="fixed inset-0 z-50 ebook-protected" style={{ background: readerBg }} onContextMenu={(e) => e.preventDefault()}>
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
        ttsPlaying={tts.isPlaying}
        ttsPaused={tts.isPaused}
        ttsSpeed={tts.speed}
        onTtsPlay={handleTtsPlay}
        onTtsPause={tts.pause}
        onTtsResume={tts.resume}
        onTtsStop={handleTtsStop}
        onTtsCycleSpeed={tts.cycleSpeed}
        isTranslated={isTranslated}
        isTranslating={isTranslating}
        onToggleTranslate={handleToggleTranslate}
      />

      {/* Reading progress bar */}
      <div className="h-[2px] w-full" style={{ background: darkMode ? "hsl(0 0% 12%)" : "hsl(var(--muted))" }}>
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progressPercent}%`,
            background: `linear-gradient(90deg, ${primaryBar}, ${darkMode ? "hsl(36 60% 55%)" : "hsl(var(--accent))"})`,
          }}
        />
      </div>

      {/* Book container */}
      <div
        className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12"
        style={{ height: "calc(100vh - 4rem - 5rem)" }}
      >
        <div
          ref={bookRef}
          className="w-full max-w-5xl h-full max-h-[85vh] flex relative select-none"
          style={{
            perspective: "2500px",
            perspectiveOrigin: "50% 50%",
          }}
          onMouseDown={(e) => handleDragStart(e, e.clientX > (bookRef.current?.getBoundingClientRect().left ?? 0) + (bookRef.current?.getBoundingClientRect().width ?? 0) / 2 ? "right" : "left")}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Book body with 3D depth */}
          <div
            className="w-full h-full flex relative"
            style={{
              transformStyle: "preserve-3d",
              borderRadius: "4px",
            }}
          >
            {/* === LEFT PAGE STACK (thickness) === */}
            {!isMobile && (
              <div
                className="absolute top-1 bottom-1 left-0 z-0 pointer-events-none"
                style={{
                  width: `${leftThickness}px`,
                  background: darkMode
                    ? `linear-gradient(to right, hsl(0 0% 18%), hsl(0 0% 22%), hsl(0 0% 16%))`
                    : `linear-gradient(to right, hsl(36 30% 82%), hsl(36 35% 88%), hsl(36 30% 84%))`,
                  borderRadius: "3px 0 0 3px",
                  boxShadow: darkMode
                    ? `-2px 0 6px hsl(0 0% 0% / 0.3)`
                    : `-2px 0 6px hsl(0 0% 0% / 0.1)`,
                }}
              />
            )}

            {/* === RIGHT PAGE STACK (thickness) === */}
            {!isMobile && (
              <div
                className="absolute top-1 bottom-1 right-0 z-0 pointer-events-none"
                style={{
                  width: `${rightThickness}px`,
                  background: darkMode
                    ? `linear-gradient(to left, hsl(0 0% 18%), hsl(0 0% 22%), hsl(0 0% 16%))`
                    : `linear-gradient(to left, hsl(36 30% 82%), hsl(36 35% 88%), hsl(36 30% 84%))`,
                  borderRadius: "0 3px 3px 0",
                  boxShadow: darkMode
                    ? `2px 0 6px hsl(0 0% 0% / 0.3)`
                    : `2px 0 6px hsl(0 0% 0% / 0.1)`,
                }}
              />
            )}

            {/* === BOOK SPINE === */}
            {!isMobile && (
              <div
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                style={{
                  width: "8px",
                  background: darkMode
                    ? `linear-gradient(to right, hsl(0 0% 5%), hsl(0 0% 12%), hsl(0 0% 5%))`
                    : `linear-gradient(to right, hsl(0 0% 0% / 0.12), hsl(0 0% 0% / 0.03), hsl(0 0% 0% / 0.12))`,
                  boxShadow: `0 0 12px 2px hsl(0 0% 0% / ${darkMode ? 0.4 : 0.08})`,
                }}
              />
            )}

            {/* === STATIC BASE PAGES === */}
            <div className="flex w-full h-full absolute inset-0" style={{ marginLeft: !isMobile ? `${leftThickness}px` : 0, marginRight: !isMobile ? `${rightThickness}px` : 0 }}>
              {/* Left page */}
              <div
                className="flex-1 flex cursor-default"
                onClick={(e) => handlePageClick(e, "left")}
              >
                <BookPageView
                  page={isFlipping && flipDirection === "next" ? flipFromPages[0] : isFlipping && flipDirection === "prev" ? flipToPages[0] : leftPage}
                  totalPages={pages.length}
                  side={isMobile ? "single" : "left"}
                  darkMode={darkMode}
                  fontSize={fontSize}
                  watermark={userEmail || undefined}
                  highlightSentenceIndex={!isFlipping ? tts.highlightIndex : -1}
                  sentences={!isFlipping ? tts.sentences : []}
                />
              </div>
              {/* Right page */}
              {!isMobile && (
                <div
                  className="flex-1 flex cursor-default"
                  onClick={(e) => handlePageClick(e, "right")}
                >
                  <BookPageView
                    page={isFlipping && flipDirection === "next" ? flipToPages[1] : isFlipping && flipDirection === "prev" ? flipFromPages[1] : rightPage}
                    totalPages={pages.length}
                    side="right"
                    darkMode={darkMode}
                    fontSize={fontSize}
                    watermark={userEmail || undefined}
                    highlightSentenceIndex={!isFlipping ? tts.highlightIndex : -1}
                    sentences={!isFlipping ? tts.sentences : []}
                  />
                </div>
              )}
            </div>

            {/* === FLIPPING PAGE (3D with curl) — NEXT on Desktop === */}
            {isFlipping && flipDirection === "next" && !isMobile && (
              <>
                <div
                  className="absolute top-0 bottom-0 right-0 z-20 overflow-visible"
                  style={{
                    width: "50%",
                    transformOrigin: "left center",
                    transform: `rotateY(${-180 * flipProgress}deg)`,
                    transformStyle: "preserve-3d",
                    transition: "none",
                    filter: `drop-shadow(${-4 * curlAmount}px ${2 * curlAmount}px ${12 * curlAmount}px hsl(0 0% 0% / ${shadowIntensity}))`,
                    marginRight: `${rightThickness}px`,
                  }}
                >
                  {/* Front face */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      // Page curl via subtle skewY
                      transform: `skewY(${curlAmount * 1.5}deg)`,
                    }}
                  >
                    <BookPageView
                      page={flipFromPages[1]}
                      totalPages={pages.length}
                      side="right"
                      darkMode={darkMode}
                      fontSize={fontSize}
                      watermark={userEmail || undefined}
                    />
                  </div>
                  {/* Back face */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: `rotateY(180deg) skewY(${-curlAmount * 1.5}deg)`,
                    }}
                  >
                    <BookPageView
                      page={flipToPages[0]}
                      totalPages={pages.length}
                      side="left"
                      darkMode={darkMode}
                      fontSize={fontSize}
                      watermark={userEmail || undefined}
                    />
                    {/* Paper texture gradient on back */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(to left, hsl(0 0% 0% / ${0.06 * curlAmount}), transparent 30%)`,
                      }}
                    />
                  </div>
                </div>

                {/* Shadow on right page underneath */}
                <div
                  className="absolute top-0 bottom-0 z-15 pointer-events-none"
                  style={{
                    left: "50%",
                    width: "50%",
                    background: `linear-gradient(to right, hsl(0 0% 0% / ${shadowIntensity * 0.6}), transparent 50%)`,
                    opacity: flipProgress < 0.5 ? 1 : Math.max(0, 1 - (flipProgress - 0.5) * 2.5),
                  }}
                />
                {/* Shadow cast onto left side */}
                <div
                  className="absolute top-0 bottom-0 z-15 pointer-events-none"
                  style={{
                    right: "50%",
                    width: "50%",
                    background: `linear-gradient(to left, hsl(0 0% 0% / ${shadowIntensity * 0.3}), transparent 35%)`,
                    opacity: flipProgress > 0.5 ? (flipProgress - 0.5) * 2 : 0,
                  }}
                />
                {/* Page edge highlight (simulates light on lifting page) */}
                <div
                  className="absolute top-0 bottom-0 z-25 pointer-events-none"
                  style={{
                    left: `calc(50% - ${2 + curlAmount * 4}px)`,
                    width: `${2 + curlAmount * 4}px`,
                    background: darkMode
                      ? `linear-gradient(to right, transparent, hsl(36 20% 30% / ${curlAmount * 0.5}), transparent)`
                      : `linear-gradient(to right, transparent, hsl(36 40% 95% / ${curlAmount * 0.7}), transparent)`,
                  }}
                />
              </>
            )}

            {/* === FLIPPING PAGE — PREV on Desktop === */}
            {isFlipping && flipDirection === "prev" && !isMobile && (
              <>
                <div
                  className="absolute top-0 bottom-0 left-0 z-20 overflow-visible"
                  style={{
                    width: "50%",
                    transformOrigin: "right center",
                    transform: `rotateY(${180 * flipProgress}deg)`,
                    transformStyle: "preserve-3d",
                    transition: "none",
                    filter: `drop-shadow(${4 * curlAmount}px ${2 * curlAmount}px ${12 * curlAmount}px hsl(0 0% 0% / ${shadowIntensity}))`,
                    marginLeft: `${leftThickness}px`,
                  }}
                >
                  {/* Front face */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: `skewY(${-curlAmount * 1.5}deg)`,
                    }}
                  >
                    <BookPageView
                      page={flipFromPages[0]}
                      totalPages={pages.length}
                      side="left"
                      darkMode={darkMode}
                      fontSize={fontSize}
                      watermark={userEmail || undefined}
                    />
                  </div>
                  {/* Back face */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: `rotateY(180deg) skewY(${curlAmount * 1.5}deg)`,
                    }}
                  >
                    <BookPageView
                      page={flipToPages[1]}
                      totalPages={pages.length}
                      side="right"
                      darkMode={darkMode}
                      fontSize={fontSize}
                      watermark={userEmail || undefined}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(to right, hsl(0 0% 0% / ${0.06 * curlAmount}), transparent 30%)`,
                      }}
                    />
                  </div>
                </div>

                {/* Shadow on left page underneath */}
                <div
                  className="absolute top-0 bottom-0 z-15 pointer-events-none"
                  style={{
                    right: "50%",
                    width: "50%",
                    background: `linear-gradient(to left, hsl(0 0% 0% / ${shadowIntensity * 0.6}), transparent 50%)`,
                    opacity: flipProgress < 0.5 ? 1 : Math.max(0, 1 - (flipProgress - 0.5) * 2.5),
                  }}
                />
                {/* Page edge highlight */}
                <div
                  className="absolute top-0 bottom-0 z-25 pointer-events-none"
                  style={{
                    right: `calc(50% - ${2 + curlAmount * 4}px)`,
                    width: `${2 + curlAmount * 4}px`,
                    background: darkMode
                      ? `linear-gradient(to left, transparent, hsl(36 20% 30% / ${curlAmount * 0.5}), transparent)`
                      : `linear-gradient(to left, transparent, hsl(36 40% 95% / ${curlAmount * 0.7}), transparent)`,
                  }}
                />
              </>
            )}

            {/* === MOBILE FLIP === */}
            {isFlipping && isMobile && (
              <>
                <div
                  className="absolute inset-0 z-20"
                  style={{
                    transformOrigin: flipDirection === "next" ? "left center" : "right center",
                    transform: `rotateY(${flipDirection === "next" ? -180 * flipProgress : 180 * flipProgress}deg)`,
                    transformStyle: "preserve-3d",
                    transition: "none",
                    filter: `drop-shadow(0 ${4 * curlAmount}px ${16 * curlAmount}px hsl(0 0% 0% / ${shadowIntensity}))`,
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: `skewY(${(flipDirection === "next" ? 1 : -1) * curlAmount * 1}deg)`,
                    }}
                  >
                    <BookPageView
                      page={flipFromPages[0]}
                      totalPages={pages.length}
                      side="single"
                      darkMode={darkMode}
                      fontSize={fontSize}
                      watermark={userEmail || undefined}
                    />
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: `rotateY(180deg) skewY(${(flipDirection === "next" ? -1 : 1) * curlAmount * 1}deg)`,
                    }}
                  >
                    <BookPageView
                      page={flipToPages[0]}
                      totalPages={pages.length}
                      side="single"
                      darkMode={darkMode}
                      fontSize={fontSize}
                      watermark={userEmail || undefined}
                    />
                  </div>
                </div>
                {/* Shadow overlay */}
                <div
                  className="absolute inset-0 z-15 pointer-events-none"
                  style={{
                    background: `hsl(0 0% 0% / ${shadowIntensity * 0.3})`,
                  }}
                />
              </>
            )}

            {/* Corner fold indicators with paper texture */}
            {!isMobile && !isFlipping && currentSpread < totalSpreads - 1 && (
              <div
                className="absolute bottom-0 right-0 z-20 cursor-grab group"
                style={{ width: "40px", height: "40px", marginRight: `${rightThickness}px` }}
                title="Drag to turn page"
              >
                <div
                  className="w-full h-full transition-all duration-300 group-hover:scale-[1.6] absolute bottom-0 right-0 origin-bottom-right"
                  style={{
                    background: `linear-gradient(135deg, transparent 38%, ${darkMode ? "hsl(36 20% 28%)" : "hsl(36 30% 85%)"} 38%, ${darkMode ? "hsl(36 15% 32%)" : "hsl(36 25% 90%)"})`,
                    borderRadius: "0 0 4px 0",
                    boxShadow: `-3px -3px 8px hsl(0 0% 0% / 0.12), inset 1px 1px 2px hsl(0 0% 100% / 0.15)`,
                  }}
                />
              </div>
            )}
            {!isMobile && !isFlipping && currentSpread > 0 && (
              <div
                className="absolute bottom-0 left-0 z-20 cursor-grab group"
                style={{ width: "40px", height: "40px", marginLeft: `${leftThickness}px` }}
                title="Drag to turn back"
              >
                <div
                  className="w-full h-full transition-all duration-300 group-hover:scale-[1.6] absolute bottom-0 left-0 origin-bottom-left"
                  style={{
                    background: `linear-gradient(-135deg, transparent 38%, ${darkMode ? "hsl(36 20% 28%)" : "hsl(36 30% 85%)"} 38%, ${darkMode ? "hsl(36 15% 32%)" : "hsl(36 25% 90%)"})`,
                    borderRadius: "0 0 0 4px",
                    boxShadow: `3px -3px 8px hsl(0 0% 0% / 0.12), inset -1px 1px 2px hsl(0 0% 100% / 0.15)`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom nav — floating glass bar */}
      <div className="fixed bottom-0 inset-x-0 flex justify-center pb-4 px-4 pointer-events-none">
        <div
          className="flex items-center gap-2 md:gap-4 px-4 md:px-6 py-3 rounded-2xl pointer-events-auto"
          style={{
            background: darkMode ? "hsl(0 0% 10% / 0.92)" : "hsl(var(--background) / 0.88)",
            backdropFilter: "blur(24px) saturate(1.5)",
            WebkitBackdropFilter: "blur(24px) saturate(1.5)",
            border: `1px solid ${darkMode ? "hsl(0 0% 20%)" : "hsl(var(--border) / 0.5)"}`,
            boxShadow: darkMode
              ? "0 8px 32px -8px hsl(0 0% 0% / 0.5)"
              : "0 8px 32px -8px hsl(0 0% 0% / 0.12)",
          }}
        >
          {/* Prev button */}
          <button
            onClick={goPrev}
            disabled={currentSpread <= 0 || isFlipping}
            className="h-9 w-9 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
            style={{
              color: darkMode ? "hsl(36 44% 80%)" : "hsl(var(--foreground))",
              background: darkMode ? "hsl(0 0% 18%)" : "hsl(var(--muted) / 0.5)",
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Bookmarks (mobile) */}
          <button
            className="h-8 w-8 flex items-center justify-center rounded-lg sm:hidden transition-all duration-300"
            onClick={() => setShowBookmarks(true)}
            style={{ color: bookmarks.length > 0 ? "hsl(45 90% 55%)" : navText }}
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Progress section */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono tabular-nums" style={{ color: navText }}>
              {progressPercent}%
            </span>
            <div
              className="w-20 md:w-36 h-1.5 rounded-full overflow-hidden"
              style={{ background: darkMode ? "hsl(0 0% 20%)" : "hsl(var(--muted))" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, ${primaryBar}, ${darkMode ? "hsl(36 60% 55%)" : "hsl(var(--accent))"})`,
                }}
              />
            </div>
            <span className="text-[11px] font-mono tabular-nums hidden sm:block" style={{ color: navText }}>
              {currentSpread + 1}/{totalSpreads}
            </span>
          </div>

          {/* Bookmarks (desktop) */}
          <button
            className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-xl transition-all duration-300 hover:scale-105"
            onClick={() => setShowBookmarks(true)}
            style={{
              color: bookmarks.length > 0 ? "hsl(45 90% 55%)" : navText,
              background: bookmarks.length > 0
                ? darkMode ? "hsl(45 90% 55% / 0.1)" : "hsl(45 90% 55% / 0.08)"
                : "transparent",
            }}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{bookmarks.length}</span>
          </button>

          {/* Next button */}
          <button
            onClick={goNext}
            disabled={currentSpread >= totalSpreads - 1 || isFlipping}
            className="h-9 w-9 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
            style={{
              color: darkMode ? "hsl(36 44% 80%)" : "hsl(var(--foreground))",
              background: darkMode ? "hsl(0 0% 18%)" : "hsl(var(--muted) / 0.5)",
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

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
