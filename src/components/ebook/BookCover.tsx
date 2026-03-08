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
    setTimeout(() => onOpen(), 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "hsl(0 0% 8%)" }}>
      {/* Ambient glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, hsl(36 60% 50%), transparent)" }}
      />

      <div
        className={`relative transition-all duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpening ? "book-cover-opening" : ""
        }`}
        style={{ perspective: "2000px" }}
      >
        {/* Book body */}
        <div
          className="relative w-[280px] h-[400px] md:w-[340px] md:h-[480px]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Back cover (visible behind) */}
          <div
            className="absolute inset-0 rounded-r-md rounded-l-sm"
            style={{
              background: "linear-gradient(135deg, hsl(25 30% 20%), hsl(25 20% 15%))",
              boxShadow: "4px 4px 20px hsl(0 0% 0% / 0.5)",
              transform: "translateZ(-4px)",
            }}
          />

          {/* Pages edge */}
          <div
            className="absolute top-2 bottom-2 right-0 w-3"
            style={{
              background: "repeating-linear-gradient(to bottom, hsl(36 30% 85%), hsl(36 20% 80%) 1px, hsl(36 30% 85%) 1px)",
              transform: "translateX(2px) translateZ(-2px)",
              borderRadius: "0 2px 2px 0",
            }}
          />

          {/* Front cover */}
          <div
            className={`absolute inset-0 rounded-md flex flex-col items-center justify-center p-8 cursor-pointer
              ${isOpening ? "book-cover-front-flip" : "hover:scale-[1.02] transition-transform duration-300"}`}
            style={{
              background: coverImage
                ? `url(${coverImage}) center/cover`
                : "linear-gradient(145deg, hsl(25 40% 30%), hsl(20 35% 20%), hsl(25 30% 15%))",
              boxShadow: "0 10px 40px -10px hsl(0 0% 0% / 0.6), inset 0 1px 0 hsl(36 40% 40% / 0.2)",
              transformOrigin: "left center",
              backfaceVisibility: "hidden",
            }}
            onClick={!isOpening ? handleOpen : undefined}
          >
            {/* Cover content overlay */}
            <div
              className="absolute inset-0 rounded-md flex flex-col items-center justify-center p-8"
              style={{
                background: coverImage ? "hsl(0 0% 0% / 0.5)" : "transparent",
              }}
            >
              {/* Decorative line */}
              <div className="w-16 h-0.5 mb-6" style={{ background: "hsl(36 60% 60% / 0.6)" }} />

              <BookOpen className="w-10 h-10 mb-4" style={{ color: "hsl(36 60% 70%)" }} />

              <h1
                className="font-serif text-xl md:text-2xl font-bold text-center leading-tight mb-3"
                style={{ color: "hsl(36 44% 90%)" }}
              >
                {bookTitle}
              </h1>

              {/* Decorative line */}
              <div className="w-12 h-0.5 mt-4 mb-8" style={{ background: "hsl(36 60% 60% / 0.4)" }} />

              {!isOpening && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-6 border-[hsl(36_44%_60%/0.4)] text-[hsl(36_44%_85%)] hover:bg-[hsl(36_44%_60%/0.15)] mt-4"
                  onClick={handleOpen}
                >
                  Open Book
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
