import { BookPage } from "./useBookPagination";

interface BookPageViewProps {
  page: BookPage | null;
  totalPages: number;
  side?: "left" | "right" | "single";
}

export function BookPageView({ page, totalPages, side = "single" }: BookPageViewProps) {
  if (!page) {
    return (
      <div
        className={`flex-1 bg-[hsl(var(--surface-elevated))] flex items-center justify-center
          ${side === "left" ? "rounded-l-sm" : side === "right" ? "rounded-r-sm" : "rounded-sm"}`}
        style={{
          backgroundImage: "linear-gradient(to right, hsl(var(--border) / 0.15) 0%, transparent 3%, transparent 97%, hsl(var(--border) / 0.15) 100%)",
        }}
      >
        <span className="text-muted-foreground text-sm italic">End of book</span>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col bg-[hsl(var(--surface-elevated))] overflow-hidden relative
        ${side === "left" ? "rounded-l-sm" : side === "right" ? "rounded-r-sm" : "rounded-sm"}`}
      style={{
        backgroundImage: `
          linear-gradient(to right, hsl(var(--border) / 0.2) 0%, transparent 2%, transparent 98%, hsl(var(--border) / 0.2) 100%),
          linear-gradient(to bottom, hsl(var(--border) / 0.05) 0%, transparent 5%)
        `,
        boxShadow:
          side === "left"
            ? "inset -4px 0 8px -4px hsl(var(--shadow-soft) / 0.08)"
            : side === "right"
              ? "inset 4px 0 8px -4px hsl(var(--shadow-soft) / 0.08)"
              : "none",
      }}
    >
      {/* Chapter title at start */}
      {page.isChapterStart && page.chapterTitle && (
        <div className="px-8 pt-8 pb-2 md:px-10 md:pt-10">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground leading-tight border-b border-border pb-3 mb-2">
            {page.chapterTitle}
          </h2>
        </div>
      )}

      {/* Page content */}
      <div
        className={`flex-1 overflow-y-auto px-8 md:px-10 ${page.isChapterStart && page.chapterTitle ? "pt-2" : "pt-8 md:pt-10"} pb-14`}
      >
        <div
          className="prose prose-sm md:prose-base max-w-none text-foreground leading-[1.85] md:leading-[1.9]
            prose-headings:font-serif prose-headings:text-foreground
            prose-p:text-foreground prose-p:mb-4
            prose-strong:text-foreground
            prose-em:text-foreground
            prose-li:text-foreground
            prose-blockquote:border-primary prose-blockquote:text-muted-foreground
            prose-img:rounded-lg prose-img:mx-auto"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "0.95rem" }}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>

      {/* Page number */}
      <div className="absolute bottom-0 inset-x-0 py-3 text-center">
        <span className="text-xs text-muted-foreground font-mono tracking-wider">
          {page.pageNumber} / {totalPages}
        </span>
      </div>
    </div>
  );
}
