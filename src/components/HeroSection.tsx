import { useState, useEffect } from "react";
import { Instagram, Facebook, Linkedin, Twitter, ArrowRight, Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroContent } from "@/hooks/useHeroContent";
import { Skeleton } from "@/components/ui/skeleton";

const HeroSection = () => {
  const { data: hero, isLoading } = useHeroContent();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

  if (isLoading) {
    return (
      <section className="relative rounded-[2.5rem] overflow-hidden bg-muted my-8 md:my-12">
        <div className="min-h-[70vh] md:min-h-[80vh] p-6 md:p-12 lg:p-16">
          <div className="grid md:grid-cols-2 gap-8 h-full">
            <div className="flex flex-col justify-center space-y-6">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-12 w-48 rounded-full" />
            </div>
            <Skeleton className="aspect-[3/4] md:aspect-auto rounded-[2rem]" />
          </div>
        </div>
      </section>
    );
  }

  const title = hero?.title || "Journey Through Life's Spectrum";
  const subtitle = hero?.subtitle || "Welcome to Perspective's Blog: A Realm of Reflection, Inspiration, and Discovery.";
  const backgroundImage = hero?.background_image || "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&q=80";
  const buttonText = hero?.button_text || "Explore";
  const buttonLink = hero?.button_link || "#articles";
  const instagramUrl = hero?.instagram_url || "";
  const facebookUrl = hero?.facebook_url || "";
  const linkedinUrl = hero?.linkedin_url || "";
  const hasSocials = !!(instagramUrl || facebookUrl || linkedinUrl);

  return (
    <section
      className="relative rounded-[2.5rem] overflow-hidden my-8 md:my-12 group/hero"
      onMouseMove={handleMouseMove}
    >
      {/* Full background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover/hero:scale-105"
          style={{
            transform: `scale(1.05) translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
          }}
        />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-accent/[0.05]" />
        
        {/* Animated grain texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }} />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-accent/10 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-32 right-1/3 w-24 h-24 rounded-full bg-primary/5 blur-2xl animate-[pulse_8s_ease-in-out_infinite_2s]" />

      {/* Content */}
      <div className="relative min-h-[70vh] md:min-h-[85vh] flex flex-col">
        <div className="flex-1 grid md:grid-cols-12 gap-6 md:gap-8 p-6 md:p-12 lg:p-16 xl:p-20 items-center">
          
          {/* Left content - 7 columns */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-8 md:space-y-10">
            
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 self-start transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="flex items-center gap-2 bg-card/60 backdrop-blur-md border border-border/30 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Featured Story
              </span>
            </div>

            {/* Title with staggered animation */}
            <div className="space-y-2">
              <h1
                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-serif leading-[0.95] tracking-tight transition-all duration-1000 delay-200 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {title.split(' ').map((word, i) => (
                  <span
                    key={i}
                    className="inline-block mr-[0.25em] hover:text-primary/70 transition-colors duration-300"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </h1>
            </div>

            {/* Subtitle */}
            <p
              className={`text-base sm:text-lg md:text-xl text-muted-foreground/80 leading-relaxed max-w-lg transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {subtitle}
            </p>

            {/* CTA area */}
            <div
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-5 transition-all duration-1000 delay-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <Button
                className="group/btn relative bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 md:px-10 md:py-7 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_-12px_hsl(var(--primary)/0.4)] overflow-hidden"
                asChild
              >
                <a href={buttonLink}>
                  <span className="relative z-10 flex items-center gap-2">
                    {buttonText}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                </a>
              </Button>

              {/* Scroll hint */}
              <a
                href="#articles"
                className="group/play flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="w-12 h-12 rounded-full border-2 border-border/50 hover:border-primary/50 flex items-center justify-center group-hover/play:scale-110 group-hover/play:bg-primary/5 transition-all duration-300">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
                <span className="hidden sm:inline">Browse Articles</span>
              </a>
            </div>

            {/* Social links */}
            {hasSocials && (
              <div
                className={`flex items-center gap-3 pt-4 transition-all duration-1000 delay-[900ms] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40 font-semibold mr-2">
                  Follow
                </span>
                <div className="w-8 h-px bg-border/40" />
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/social w-10 h-10 rounded-full border border-border/30 bg-card/30 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 flex items-center justify-center hover:scale-110 hover:-translate-y-0.5"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4 text-muted-foreground/60 group-hover/social:text-foreground transition-colors" />
                  </a>
                )}
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/social w-10 h-10 rounded-full border border-border/30 bg-card/30 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 flex items-center justify-center hover:scale-110 hover:-translate-y-0.5"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4 text-muted-foreground/60 group-hover/social:text-foreground transition-colors" />
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/social w-10 h-10 rounded-full border border-border/30 bg-card/30 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 flex items-center justify-center hover:scale-110 hover:-translate-y-0.5"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 text-muted-foreground/60 group-hover/social:text-foreground transition-colors" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right side - Floating image card */}
          <div className="md:col-span-5 hidden md:flex items-center justify-center">
            <div
              className={`relative transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-12 rotate-2'
              }`}
              style={{
                transform: isVisible
                  ? `perspective(1000px) rotateY(${mousePos.x * -0.15}deg) rotateX(${mousePos.y * 0.15}deg)`
                  : undefined,
                transition: 'transform 0.3s ease-out',
              }}
            >
              {/* Decorative frame behind */}
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rotate-3 scale-95 blur-sm" />
              <div className="absolute -inset-3 rounded-[2.5rem] border border-border/20 rotate-2 scale-[0.97]" />
              
              {/* Main image card */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-20px_hsl(var(--primary)/0.15)] border border-border/20">
                <img
                  src={backgroundImage}
                  alt="Hero"
                  className="w-full aspect-[3/4] object-cover"
                />
                {/* Overlay gradient on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                
                {/* Floating stats badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/20 p-4 flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground">5K+ Readers</p>
                      <p className="text-[10px] text-muted-foreground">Join our community</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div
          className={`flex justify-center pb-6 md:pb-8 transition-all duration-1000 delay-[1100ms] ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <a
            href="#articles"
            className="flex flex-col items-center gap-1 text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors group/scroll"
          >
            <span className="text-[9px] uppercase tracking-[0.3em] font-semibold">Scroll</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
