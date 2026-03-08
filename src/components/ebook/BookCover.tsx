import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Sparkles } from "lucide-react";

interface BookCoverProps {
  bookTitle: string;
  coverImage?: string | null;
  onOpen: () => void;
}

export function BookCover({ bookTitle, coverImage, onOpen }: BookCoverProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => onOpen(), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden" style={{ background: "hsl(0 0% 4%)" }}>
      {/* Animated ambient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-[800px] h-[800px] rounded-full blur-[200px] opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(36 60% 45%), transparent 70%)",
            top: "20%",
            left: "30%",
            animation: "pulse 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[150px] opacity-10"
          style={{
            background: "radial-gradient(circle, hsl(280 30% 40%), transparent 70%)",
            bottom: "10%",
            right: "20%",
            animation: "pulse 8s ease-in-out infinite 2s",
          }}
        />
        {/* Subtle particle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(36 44% 70%) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Main content */}
      <div
        className={`relative flex flex-col items-center gap-10 md:gap-14 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Badge */}
        <div
          className={`transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.3em]"
            style={{
              background: "hsl(36 60% 45% / 0.1)",
              border: "1px solid hsl(36 60% 45% / 0.2)",
              color: "hsl(36 60% 70%)",
            }}
          >
            <Sparkles className="w-3 h-3" />
            eBook Reader
          </span>
        </div>

        {/* Book with 3D perspective */}
        <div style={{ perspective: "2000px" }}>
          <div
            className={`relative transition-all duration-1000 delay-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Book body */}
            <div
              className="relative w-[240px] h-[360px] md:w-[300px] md:h-[440px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Back cover */}
              <div
                className="absolute inset-0 rounded-r-md rounded-l-sm"
                style={{
                  background: "linear-gradient(145deg, hsl(25 30% 16%), hsl(25 20% 10%))",
                  boxShadow: "4px 4px 40px hsl(0 0% 0% / 0.7)",
                  transform: "translateZ(-8px)",
                }}
              />

              {/* Pages edge */}
              <div
                className="absolute top-2 bottom-2 right-0 w-3"
                style={{
                  background: "repeating-linear-gradient(to bottom, hsl(36 30% 85%), hsl(36 20% 78%) 1px, hsl(36 30% 85%) 1px)",
                  transform: "translateX(3px) translateZ(-4px)",
                  borderRadius: "0 2px 2px 0",
                }}
              />

              {/* Front cover */}
              <div
                className={`absolute inset-0 rounded-md overflow-hidden cursor-pointer
                  ${isOpening ? "book-cover-flip" : "hover:scale-[1.03] transition-all duration-500"}`}
                style={{
                  background: coverImage
                    ? `url(${coverImage}) center/cover`
                    : "linear-gradient(145deg, hsl(25 40% 28%), hsl(20 35% 18%), hsl(25 30% 12%))",
                  boxShadow: isOpening
                    ? "none"
                    : "0 20px 60px -15px hsl(0 0% 0% / 0.8), inset 0 1px 0 hsl(36 40% 40% / 0.15), 0 0 0 1px hsl(36 40% 30% / 0.1)",
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
                      ? "linear-gradient(to bottom, hsl(0 0% 0% / 0.3), hsl(0 0% 0% / 0.75))"
                      : "transparent",
                  }}
                >
                  <div className="w-20 h-[1px] mb-8" style={{ background: "linear-gradient(to right, transparent, hsl(36 60% 60% / 0.6), transparent)" }} />

                  <BookOpen className="w-8 h-8 mb-5" style={{ color: "hsl(36 60% 70%)" }} />

                  <h1
                    className="font-serif text-xl md:text-2xl font-bold text-center leading-tight mb-2"
                    style={{ color: "hsl(36 44% 95%)", textShadow: "0 2px 12px hsl(0 0% 0% / 0.6)" }}
                  >
                    {bookTitle}
                  </h1>

                  <div className="w-14 h-[1px] mt-4 mb-6" style={{ background: "linear-gradient(to right, transparent, hsl(36 60% 60% / 0.4), transparent)" }} />

                  {!isOpening && (
                    <div className="mt-4 flex flex-col items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full px-8 py-5 text-sm font-medium transition-all duration-500 hover:scale-105"
                        style={{
                          borderColor: "hsl(36 44% 60% / 0.3)",
                          color: "hsl(36 44% 90%)",
                          background: "hsl(36 44% 60% / 0.08)",
                          backdropFilter: "blur(8px)",
                        }}
                        onClick={(e) => { e.stopPropagation(); handleOpen(); }}
                      >
                        <span className="flex items-center gap-2">
                          Open Book
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </Button>
                      <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "hsl(36 44% 60% / 0.5)" }}>
                        Click or tap to read
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Inside of front cover (back face) */}
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
        </div>

        {/* Book title below */}
        <div
          className={`text-center max-w-sm transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="font-serif text-lg md:text-xl font-bold mb-2" style={{ color: "hsl(36 44% 90%)" }}>
            {bookTitle}
          </h2>
          <p className="text-xs" style={{ color: "hsl(0 0% 45%)" }}>
            Immersive reading experience
          </p>
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
