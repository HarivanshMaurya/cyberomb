import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface BookCoverProps {
  bookTitle: string;
  coverImage?: string | null;
  onOpen: () => void;
}

export function BookCover({ bookTitle, coverImage, onOpen }: BookCoverProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => onOpen(), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "hsl(0 0% 6%)" }}>
      {/* Ambient glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px]"
        style={{ background: "radial-gradient(circle, hsl(36 60% 40% / 0.25), transparent 70%)" }}
      />

      <div style={{ perspective: "1800px" }}>
        {/* Book body */}
        <div
          className="relative w-[260px] h-[380px] md:w-[320px] md:h-[460px]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Back cover */}
          <div
            className="absolute inset-0 rounded-r-md rounded-l-sm"
            style={{
              background: "linear-gradient(135deg, hsl(25 30% 18%), hsl(25 20% 12%))",
              boxShadow: "4px 4px 30px hsl(0 0% 0% / 0.6)",
              transform: "translateZ(-6px)",
            }}
          />

          {/* Pages edge (spine side) */}
          <div
            className="absolute top-2 bottom-2 right-0 w-3"
            style={{
              background: "repeating-linear-gradient(to bottom, hsl(36 30% 85%), hsl(36 20% 78%) 1px, hsl(36 30% 85%) 1px)",
              transform: "translateX(3px) translateZ(-3px)",
              borderRadius: "0 2px 2px 0",
            }}
          />

          {/* Front cover — flips open */}
          <div
            className={`absolute inset-0 rounded-md overflow-hidden cursor-pointer
              ${isOpening ? "book-cover-flip" : "hover:scale-[1.02] transition-transform duration-300"}`}
            style={{
              background: coverImage
                ? `url(${coverImage}) center/cover`
                : "linear-gradient(145deg, hsl(25 40% 28%), hsl(20 35% 18%), hsl(25 30% 12%))",
              boxShadow: isOpening
                ? "none"
                : "0 10px 50px -10px hsl(0 0% 0% / 0.7), inset 0 1px 0 hsl(36 40% 40% / 0.15)",
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
            onClick={!isOpening ? handleOpen : undefined}
          >
            {/* Cover content overlay */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
              style={{
                background: coverImage
                  ? "linear-gradient(to bottom, hsl(0 0% 0% / 0.4), hsl(0 0% 0% / 0.7))"
                  : "transparent",
              }}
            >
              <div className="w-16 h-px mb-6" style={{ background: "hsl(36 60% 60% / 0.5)" }} />

              <BookOpen className="w-9 h-9 mb-4" style={{ color: "hsl(36 60% 70%)" }} />

              <h1
                className="font-serif text-xl md:text-2xl font-bold text-center leading-tight mb-3"
                style={{ color: "hsl(36 44% 92%)", textShadow: "0 2px 8px hsl(0 0% 0% / 0.5)" }}
              >
                {bookTitle}
              </h1>

              <div className="w-12 h-px mt-4 mb-8" style={{ background: "hsl(36 60% 60% / 0.35)" }} />

              {!isOpening && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-6 mt-4 border-[hsl(36_44%_60%/0.4)] text-[hsl(36_44%_85%)] hover:bg-[hsl(36_44%_60%/0.15)]"
                  onClick={(e) => { e.stopPropagation(); handleOpen(); }}
                >
                  Open Book
                </Button>
              )}
            </div>
          </div>

          {/* Inside of front cover (back face) — shown during flip */}
          {isOpening && (
            <div
              className="absolute inset-0 rounded-md book-cover-flip"
              style={{
                background: "linear-gradient(135deg, hsl(36 20% 85%), hsl(36 15% 80%))",
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            />
          )}
        </div>
      </div>

      {/* Fade out entire cover scene */}
      {isOpening && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ animation: "coverSceneFadeOut 1.2s ease-in-out forwards" }}
        />
      )}
    </div>
  );
}
