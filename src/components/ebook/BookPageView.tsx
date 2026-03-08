import { BookPage } from "./useBookPagination";
import React from "react";

interface BookPageViewProps {
  page: BookPage | null;
  totalPages: number;
  side?: "left" | "right" | "single";
  darkMode?: boolean;
  fontSize?: number;
  watermark?: string;
  highlightSentenceIndex?: number;
  sentences?: string[];
}

export function BookPageView({
  page, totalPages, side = "single", darkMode = false, fontSize = 16,
  watermark, highlightSentenceIndex = -1, sentences = [],
}: BookPageViewProps) {
  const bg = darkMode ? "hsl(0 0% 14%)" : "hsl(var(--surface-elevated))";
  const fg = darkMode ? "hsl(36 44% 88%)" : "hsl(var(--foreground))";
  const mutedFg = darkMode ? "hsl(0 0% 45%)" : "hsl(var(--muted-foreground))";
  const borderAlpha = darkMode ? "hsl(0 0% 30% / 0.15)" : "hsl(var(--border) / 0.15)";
  const borderAlpha2 = darkMode ? "hsl(0 0% 30% / 0.2)" : "hsl(var(--border) / 0.2)";
  const borderAlpha05 = darkMode ? "hsl(0 0% 30% / 0.05)" : "hsl(var(--border) / 0.05)";
  const shadowSoft = darkMode ? "hsl(0 0% 0% / 0.15)" : "hsl(var(--shadow-soft) / 0.08)";
  const chapterBorder = darkMode ? "hsl(0 0% 25%)" : "hsl(var(--border))";
  const primaryC = darkMode ? "hsl(36 44% 70%)" : "hsl(var(--primary))";

  if (!page) {
    return (
      <div
        className={`flex-1 flex items-center justify-center
          ${side === "left" ? "rounded-l-sm" : side === "right" ? "rounded-r-sm" : "rounded-sm"}`}
        style={{
          background: bg,
          backgroundImage: `linear-gradient(to right, ${borderAlpha} 0%, transparent 3%, transparent 97%, ${borderAlpha} 100%)`,
        }}
      >
        <span className="text-sm italic" style={{ color: mutedFg }}>End of book</span>
      </div>
    );
  }

  // Build highlighted content if TTS is active
  let displayContent = page.content;
  if (highlightSentenceIndex >= 0 && sentences.length > 0 && highlightSentenceIndex < sentences.length) {
    const currentSentence = sentences[highlightSentenceIndex];
    // Try to find and highlight in the clean text
    const escapedSentence = currentSentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // We'll add a highlight class via CSS instead of modifying HTML directly
  }

  return (
    <div
      className={`flex-1 flex flex-col overflow-hidden relative ebook-protected
        ${side === "left" ? "rounded-l-sm" : side === "right" ? "rounded-r-sm" : "rounded-sm"}`}
      style={{
        background: bg,
        backgroundImage: `
          linear-gradient(to right, ${borderAlpha2} 0%, transparent 2%, transparent 98%, ${borderAlpha2} 100%),
          linear-gradient(to bottom, ${borderAlpha05} 0%, transparent 5%)
        `,
        boxShadow:
          side === "left"
            ? `inset -4px 0 8px -4px ${shadowSoft}`
            : side === "right"
              ? `inset 4px 0 8px -4px ${shadowSoft}`
              : "none",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Chapter title at start */}
      {page.isChapterStart && page.chapterTitle && (
        <div className="px-8 pt-8 pb-2 md:px-10 md:pt-10">
          <h2
            className="font-serif text-xl md:text-2xl font-bold leading-tight pb-3 mb-2"
            style={{ color: fg, borderBottom: `1px solid ${chapterBorder}` }}
          >
            {page.chapterTitle}
          </h2>
        </div>
      )}

      {/* Page content */}
      <div
        className={`flex-1 overflow-y-auto px-8 md:px-10 ${page.isChapterStart && page.chapterTitle ? "pt-2" : "pt-8 md:pt-10"} pb-14`}
      >
        <div
          className="prose prose-sm md:prose-base max-w-none leading-[1.85] md:leading-[1.9]"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: `${fontSize * 0.059}rem`,
            color: fg,
            ...(darkMode ? {
              '--tw-prose-headings': fg,
              '--tw-prose-body': fg,
              '--tw-prose-bold': fg,
              '--tw-prose-quotes': mutedFg,
              '--tw-prose-quote-borders': primaryC,
            } as React.CSSProperties : {}),
          }}
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />
      </div>

      {/* Watermark */}
      {watermark && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            transform: "rotate(-30deg)",
            opacity: 0.04,
            fontSize: "3rem",
            fontFamily: "monospace",
            color: fg,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {watermark}
        </div>
      )}

      {/* Page number */}
      <div className="absolute bottom-0 inset-x-0 py-3 text-center">
        <span className="text-xs font-mono tracking-wider" style={{ color: mutedFg }}>
          {page.pageNumber} / {totalPages}
        </span>
      </div>
    </div>
  );
}
