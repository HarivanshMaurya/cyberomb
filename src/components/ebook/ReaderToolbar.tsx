import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TTSControls } from "./TextToSpeech";
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
  Languages,
  Loader2,
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
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  ttsPlaying: boolean;
  ttsPaused: boolean;
  ttsSpeed: number;
  onTtsPlay: () => void;
  onTtsPause: () => void;
  onTtsResume: () => void;
  onTtsStop: () => void;
  onTtsCycleSpeed: () => void;
  isTranslated: boolean;
  isTranslating: boolean;
  onToggleTranslate: () => void;
}

const FONT_SIZES = [14, 16, 18, 20, 22];

const ToolbarButton = ({ 
  onClick, title, darkMode, active, children, className = "" 
}: { 
  onClick: () => void; title?: string; darkMode: boolean; active?: boolean; children: React.ReactNode; className?: string;
}) => (
  <button
    onClick={onClick}
    title={title}
    className={`h-9 w-9 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
    style={{
      color: active
        ? "hsl(45 90% 55%)"
        : darkMode ? "hsl(36 44% 75%)" : "hsl(var(--muted-foreground))",
      background: active
        ? darkMode ? "hsl(45 90% 55% / 0.12)" : "hsl(45 90% 55% / 0.1)"
        : "transparent",
    }}
    onMouseEnter={(e) => {
      if (!active) e.currentTarget.style.background = darkMode ? "hsl(0 0% 20%)" : "hsl(var(--muted) / 0.6)";
    }}
    onMouseLeave={(e) => {
      if (!active) e.currentTarget.style.background = "transparent";
    }}
  >
    {children}
  </button>
);

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
  isFullscreen,
  onToggleFullscreen,
  ttsPlaying,
  ttsPaused,
  ttsSpeed,
  onTtsPlay,
  onTtsPause,
  onTtsResume,
  onTtsStop,
  onTtsCycleSpeed,
  isTranslated,
  isTranslating,
  onToggleTranslate,
}: ReaderToolbarProps) {
  const currentIdx = FONT_SIZES.indexOf(fontSize);
  const canDecrease = currentIdx > 0;
  const canIncrease = currentIdx < FONT_SIZES.length - 1;

  const toolbarBg = darkMode
    ? "hsl(0 0% 8% / 0.95)"
    : "hsl(var(--background) / 0.92)";
  const borderColor = darkMode ? "hsl(0 0% 18%)" : "hsl(var(--border) / 0.5)";

  return (
    <div
      className="h-14 md:h-16 flex items-center justify-between px-3 md:px-5"
      style={{
        borderBottom: `1px solid ${borderColor}`,
        background: toolbarBg,
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
      }}
    >
      {/* Left: close + title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={onClose}
          className="h-9 w-9 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            color: darkMode ? "hsl(36 44% 85%)" : "hsl(var(--foreground))",
            background: darkMode ? "hsl(0 0% 15%)" : "hsl(var(--muted) / 0.5)",
          }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: darkMode ? "hsl(36 44% 70% / 0.1)" : "hsl(var(--primary) / 0.08)",
            }}
          >
            <BookOpen className="w-3.5 h-3.5" style={{ color: darkMode ? "hsl(36 44% 70%)" : "hsl(var(--primary))" }} />
          </div>
          <div className="min-w-0">
            <p
              className="font-serif font-semibold text-sm truncate leading-tight"
              style={{ color: darkMode ? "hsl(36 44% 92%)" : "hsl(var(--foreground))" }}
            >
              {bookTitle}
            </p>
            <p
              className="text-[11px] truncate leading-tight hidden sm:block"
              style={{ color: darkMode ? "hsl(0 0% 50%)" : "hsl(var(--muted-foreground))" }}
            >
              {chapterTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Divider-separated groups */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={onOpenToc} title="Table of Contents" darkMode={darkMode}>
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={onToggleBookmark} title={isBookmarked ? "Remove bookmark" : "Bookmark"} darkMode={darkMode} active={isBookmarked}>
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </ToolbarButton>
          <ToolbarButton
            onClick={onToggleTranslate}
            title={isTranslated ? "Show Original" : "Translate to Hindi"}
            darkMode={darkMode}
            active={isTranslated}
          >
            {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
          </ToolbarButton>
        </div>

        {/* Separator */}
        <div className="w-px h-6 mx-1" style={{ background: borderColor }} />

        {/* TTS */}
        <TTSControls
          isPlaying={ttsPlaying}
          isPaused={ttsPaused}
          speed={ttsSpeed}
          onPlay={onTtsPlay}
          onPause={onTtsPause}
          onResume={onTtsResume}
          onStop={onTtsStop}
          onCycleSpeed={onTtsCycleSpeed}
          darkMode={darkMode}
        />

        {/* Separator */}
        <div className="w-px h-6 mx-1 hidden sm:block" style={{ background: borderColor }} />

        {/* Font size */}
        <div className="hidden sm:flex items-center gap-0">
          <ToolbarButton
            onClick={() => canDecrease && onFontSizeChange(FONT_SIZES[currentIdx - 1])}
            darkMode={darkMode}
          >
            <Minus className="w-3 h-3" />
          </ToolbarButton>
          <Type className="w-3.5 h-3.5 mx-0.5" style={{ color: darkMode ? "hsl(36 44% 60%)" : "hsl(var(--muted-foreground))" }} />
          <ToolbarButton
            onClick={() => canIncrease && onFontSizeChange(FONT_SIZES[currentIdx + 1])}
            darkMode={darkMode}
          >
            <Plus className="w-3 h-3" />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 mx-1 hidden sm:block" style={{ background: borderColor }} />

        {/* Fullscreen */}
        <ToolbarButton onClick={onToggleFullscreen} title={isFullscreen ? "Exit fullscreen" : "Fullscreen"} darkMode={darkMode}>
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </ToolbarButton>

        {/* Dark mode toggle */}
        <div className="flex items-center gap-1.5 ml-1">
          {darkMode ? (
            <Moon className="w-3.5 h-3.5" style={{ color: "hsl(36 44% 65%)" }} />
          ) : (
            <Sun className="w-3.5 h-3.5" style={{ color: "hsl(var(--muted-foreground))" }} />
          )}
          <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} className="scale-75" />
        </div>
      </div>
    </div>
  );
}
